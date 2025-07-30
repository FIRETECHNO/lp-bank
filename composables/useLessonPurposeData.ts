export function useLessonPurposeData() {
  const selectionOptions = ref({
    subjects: [
      { display: "Математика 📐", value: "Математика" },
      { display: "Русский язык ✍️", value: "Русский язык" },
      { display: "Физика ⚛️", value: "Физика" },
      { display: "Химия 🧪", value: "Химия" },
      { display: "Информатика 💻", value: "Информатика" },
      { display: "История 🏛️", value: "История" },
      { display: "Обществознание 🌍", value: "Обществознание" },
    ],
    grades: Array.from({ length: 11 }, (_, i) => ({
      display: `${i + 1} класс`,
      value: i + 1,
    })),
    goals: [
      { display: "Повышение успеваемости 📈", value: "Повышение успеваемости" },
      { display: "Подготовка к ОГЭ 🎓", value: "ОГЭ" },
      { display: "Подготовка к ЕГЭ 🏅", value: "ЕГЭ" },
      { display: "Подготовка к ВПР 📝", value: "ВПР" },
      { display: "Подготовка к ДВИ 🏛️", value: "ДВИ" },
      { display: "Подготовка к олимпиадам 🏆", value: "Олимпиады" },
    ],
  });

  const formatArrayAsList = (items: string[]): string => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    const allButLast = items.slice(0, -1).join(', ');
    const last = items[items.length - 1];
    return `${allButLast} и ${last}`;
  };

  // Функция для форматирования предметов
  const getSubjectsText = (subjects: string[]): string => {
    if (!subjects || subjects.length === 0) return 'Предметы не выбраны';
    const displayTexts = subjects.map(val =>
      selectionOptions.value.subjects.find(o => o.value === val)?.display || val
    );
    return formatArrayAsList(displayTexts);
  };

  // Функция для форматирования классов
  const getGradesText = (grades: number[]): string => {
    if (!grades || grades.length === 0) return 'Классы не выбраны';
    const sortedGrades = [...grades].sort((a, b) => a - b);
    const displayTexts = sortedGrades.map(val =>
      selectionOptions.value.grades.find(o => o.value === val)?.display || `${val} класс`
    );
    return formatArrayAsList(displayTexts);
  };

  // Функция для форматирования целей
  const getGoalsText = (goals: string[]): string => {
    if (!goals || goals.length === 0) return 'Цели не выбраны';
    const displayTexts = goals.map(val =>
      selectionOptions.value.goals.find(o => o.value === val)?.display || val
    );
    return formatArrayAsList(displayTexts);
  };

  return {
    selectionOptions,
    getSubjectsText,
    getGradesText,
    getGoalsText,
  };
}