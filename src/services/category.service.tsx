import { Category } from "../pages/types/category.type";
import { getCurrentLanguageForBackend } from "../pages/utils/language.utils";
import api from "./api";

let categoryCache = [] as any;

export async function getCategory(parentId?: any, forceUpdate?: boolean): Promise<Category[]> {
  const lang = getCurrentLanguageForBackend();

  if (!forceUpdate && categoryCache[lang]) {
    return filterCategoryById(categoryCache[lang], parentId);
  }

  const data = await api.get('/category/allCategory?language=' + lang).then((res) => {
    const sorted = res.data.sort(
      (firstEl: Category, secondEl: Category) =>
        firstEl.viewOrder - secondEl.viewOrder
    );
    return sorted;
  });
  categoryCache[lang] = data;
  
  return filterCategoryById(categoryCache[lang], parentId);
}

export async function getAllCategories(): Promise<Category[]> {
  const lang = getCurrentLanguageForBackend();

  const data = await api.get('/category/allCategory?language=' + lang).then((res) => {
    const sorted = res.data.sort(
      (firstEl: Category, secondEl: Category) =>
        firstEl.viewOrder - secondEl.viewOrder
    );
    return sorted;
  });
  categoryCache[lang] = data;
  return data;
}

function filterCategoryById(categoryList: any, parentId: any) {
  if (!parentId) {
    parentId = null;
  }
  let categoryFiltered = categoryList.filter((item: any) => {
    return item.parentId == parentId;
  })
  return categoryFiltered;
}
