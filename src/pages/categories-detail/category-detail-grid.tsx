import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { Category } from "../types/category.type";
import { groupCategoriesByGroupName } from "../utils/category.utils";
import { useTranslation } from "react-i18next";
import "./category-detail-grid.css";

export default function CategoryDetailGrid(props: any) {
  const { categories = [], selectedCategory } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const groupedCategories = groupCategoriesByGroupName(categories);
  const {
    user: { idUser },
  } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  const handleCategoryClick = useCallback((category: Category) => {
    return () => {
      if (category.hasChild == "true" || category.hasChild == "1") {
        history.push({ pathname: "/categories_detail", state: { category } });
      } else if (category.categoryType == "COUPON") {
        history.push({ pathname: "/request_coupon", state: { category } });
      } else {
        history.push({ pathname: "/create_request", state: { category } });
      }
    };
  }, []);

  return (
    <div className="categories-detail-container page">
      <Header backgroundTopImage={selectedCategory.image}></Header>
      <main className="main-with-header">
        <div className="white-background" />
        <section>
          {groupedCategories.map((group, groupIndex) => {
            return (
              <Fragment key={groupIndex}>
                <hr />
                <h1>{t(`${group.groupName}`)}</h1>
                <div className="dynamic-cards">
                  {group.items.map((category: Category) => {
                    return (
                      <div
                        key={category.idCategory}
                        className="cards"
                        onClick={handleCategoryClick(category)}
                      >
                        <img src={category.icon} />
                        <p>{category.title}</p>
                      </div>
                    );
                  })}
                </div>
              </Fragment>
            );
          })}
        </section>
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
