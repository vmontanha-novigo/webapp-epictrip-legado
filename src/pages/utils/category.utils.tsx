import { Category } from "../types/category.type";

export const groupCategoriesByGroupName = (categories: Array<Category>) => {
  const sorted = categories.sort((firstEl: Category, secondEl: Category) => firstEl.viewOrder - secondEl.viewOrder);
  const groupedJson = sorted.reduce(function (grouper: any, el: Category) {
    (grouper[el.groupName] = grouper[el.groupName] || []).push(el);
    return grouper;
  }, []);

  const groupedList = Object.keys(groupedJson).map(groupName => {
    const items = groupedJson[groupName];
    return { groupName, items };
  });
  return groupedList;
}
