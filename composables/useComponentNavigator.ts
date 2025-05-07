import type { ComponentListItem, ComponentListNode, ComponentEventHandlers } from '~/types/component-list';
import type { ShallowRef } from 'vue';


export function useComponentNavigator(initialItems: ComponentListItem[] = [], globalEventHandlers?: ComponentEventHandlers) {
  const head: ShallowRef<ComponentListNode | null> = shallowRef(null);
  const tail: ShallowRef<ComponentListNode | null> = shallowRef(null);
  const currentNode: ShallowRef<ComponentListNode | null> = shallowRef(null);
  const _size = ref(0);

  // --- Инициализация списка ---
  const initializeList = (items: ComponentListItem[]) => {
    head.value = null;
    tail.value = null;
    currentNode.value = null;
    _size.value = 0;

    if (items.length === 0) {
      return;
    }

    let prevNodeInLoop: ComponentListNode | null = null;
    items.forEach(item => {
      const newNode: ComponentListNode = {
        item,
        prev: null,
        next: null,
      };
      _size.value++;

      if (prevNodeInLoop) {
        newNode.prev = prevNodeInLoop;
        prevNodeInLoop.next = newNode;
      } else {
        head.value = newNode;
        currentNode.value = newNode; // По умолчанию курсор на первом элементе
      }
      prevNodeInLoop = newNode;
    });
    tail.value = prevNodeInLoop;
  };

  // Инициализируем при создании composable
  initializeList(initialItems);


  // --- Геттеры и вычисляемые свойства ---
  const currentComponentItem = computed<ComponentListItem | null>(() => {
    return currentNode.value ? currentNode.value.item : null;
  });

  const currentActualComponent = computed<Component | null>(() => {
    return currentComponentItem.value ? currentComponentItem.value.component : null;
  });

  const currentId = computed<string | undefined>(() => {
    return currentComponentItem.value ? currentComponentItem.value.id : undefined;
  })

  const currentProps = computed<Record<string, any> | undefined>(() => {
    return currentComponentItem.value ? currentComponentItem.value.props : undefined;
  });

  // --- Состояние ---
  const size = computed(() => _size.value);
  const isEmpty = computed(() => _size.value === 0);

  const canGoNext = computed(() => !!(currentNode.value && currentNode.value.next));
  const canGoPrev = computed(() => !!(currentNode.value && currentNode.value.prev));

  // --- Навигация ---
  function next(): ComponentListItem | null {
    if (canGoNext.value && currentNode.value) {
      currentNode.value = currentNode.value.next;
      return currentNode.value!.item;
    }
    return null;
  }

  function prev(): ComponentListItem | null {
    if (canGoPrev.value && currentNode.value) {
      currentNode.value = currentNode.value.prev;
      return currentNode.value!.item;
    }
    return null;
  }

  // пересоздание списка
  function setItems(newItems: ComponentListItem[]) {
    initializeList(newItems);
  }

  // for emit
  const eventHandlers = computed<ComponentEventHandlers>(() => {
    const baseHandlers: ComponentEventHandlers = {
      ...(globalEventHandlers || {}),
    };

    // Получаем специфичные обработчики для ТЕКУЩЕГО компонента
    const specificHandlers = currentComponentItem.value?.eventHandlers || {};

    // Специфичные обработчики могут переопределить базовые или глобальные
    return {
      ...baseHandlers,
      ...specificHandlers, // Применяем специфичные обработчики поверх
    };
  });

  return {
    // Состояние
    currentComponentItem,
    currentActualComponent,
    currentProps,
    currentId,
    size,
    isEmpty,
    canGoNext,
    canGoPrev,

    // Методы
    next,
    prev,
    setItems, // Для обновления всего списка
    eventHandlers,
  };
}