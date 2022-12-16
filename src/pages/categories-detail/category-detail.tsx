import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCategory } from "../../services/category.service";
import { Category } from "../types/category.type";
import CategoryDetailGrid from "./category-detail-grid";
import './category-detail-grid.css';
import CategoryDetailList from "./category-detail-list";


export default function CategoryDetail() {
  const { state } = useLocation<any>();
  const category = state.category as Category;

  const [categories, setCategories] = useState([] as Category[]);

  // useEffect(() => {
  //   api.get('/category/' + category.idCategory + '?language=' + getCurrentLanguageForBackend())
  //     .then(res => setCategories(res.data))
  //     .catch(console.log);
  // }, [])

  useEffect(() => {
    getCategory(category.idCategory).then(setCategories);
  }, []);

  if (category.exibitionType == "G") {
    return <CategoryDetailGrid categories={categories} selectedCategory={category}></CategoryDetailGrid>
  } else {
    return <CategoryDetailList categories={categories} selectedCategory={category}></CategoryDetailList>
  }

}
