export const getExpensesGroup = (expenses, type) => expenses[type] || [];

export const getSummarisedExpensesGroup = (expenses, type, title) => {
  const expensesGroup = getExpensesGroup(expenses, type);
  const totalSum = expensesGroup.reduce((sum, expense) => sum + Number(expense[1].sum), 0);
  const totalSumInEoyForm = expensesGroup.reduce((sum, expense) => sum + Number(expense[1].sumAddedInEoyForm), 0);

  return [[type, { sum: totalSum, title, sumAddedInEoyForm: totalSumInEoyForm }]];
};
