import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { Category } from "../types/category.type";
import { useTranslation } from "react-i18next";
import "./category-detail-list.css";

export default function CategoryDetailList(props: any) {
  const history = useHistory();
  const { t } = useTranslation();
  const { categories = [], selectedCategory } = props;
  const {
    user: { idUser },
  } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  const handleCategoryClick = useCallback((category: Category) => {
    return () => {
      if (category.hasChild == "true") {
        history.push({ pathname: "/categories_detail", state: { category } });
      } else if (category.categoryType == "COUPON") {
        history.push({ pathname: "/request_coupon", state: { category } });
      } else {
        history.push({ pathname: "/create_request", state: { category } });
      }
    };
  }, []);

  return (
    <div className="request-container page">
      <Header backgroundTopImage={selectedCategory.image}></Header>
      <main className="main-with-header">
        <h1 className="h1-title">
          {selectedCategory.title}
          {/* {selectedCategory.internalTitle} */}
        </h1>
        <div className="requests">
          {categories.map((category: Category) => {
            return (
              <div
                key={category.idCategory}
                className="requests-cards"
                onClick={handleCategoryClick(category)}
              >
                <img src={category.icon} alt={category.title} />
                <div className="text">
                  <h2>{category.title}</h2>
                  <p>{category.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
