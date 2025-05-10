interface LangLevel {
  name: string;
  description: string;
  filterKey: string;
}
/* пока есть такие уровни владения языком (используются в AboutMe/PartnerFilters,Personal)
  { name: 'Начальный', description: 'Могу говорить на бытовые темы', filterKey: "beginner" },
  { name: 'Средний', description: 'Могу говорить на бытовые и профессиональные темы', filterKey: "intermediate" },
  { name: 'Высокий', description: 'Могу говорить практически на любые темы', filterKey: "high" },
 */