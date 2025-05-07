// ~/types/component-list.ts (например)
import type { Component } from 'vue';

export type ComponentEventHandlers = Record<string, (...args: any[]) => void>;

export interface ComponentListItem {
  id: string; // Уникальный идентификатор для ключа и поиска
  component: Component; // Сам компонент Vue
  props?: Record<string, any>; // Опциональные пропсы для компонента
  eventHandlers?: ComponentEventHandlers; // чтобы обрабатывать emit
}

export interface ComponentListNode {
  item: ComponentListItem;
  prev: ComponentListNode | null;
  next: ComponentListNode | null;
}