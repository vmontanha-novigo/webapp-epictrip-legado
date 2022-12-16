import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import backgroundTopImage from "../../assets/request-top.jpg";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { getCurrentLanguageForBackend } from "../utils/language.utils";
import WaitingIcon from "../../assets/waiting.png";
import DoneIcon from "../../assets/done.png";
import InProgressIcon from "../../assets/in-progress.png";
import UnrealizedIcon from "../../assets/unrealized.png";
import PageLoader from "../../components/PageLoader/pageloader";

import "./requests-status.css";

type RequestType = {
  request: string;
  attendentResponse: string;
  operatorName: string;
  amount: string;
  categoryDetail: string;
  category: string;

  createDate: string;
  description: string;
  icon: string;
  parentTitle: string;
  status: number;
  title: string;
};

export default function RequestsStatus() {
  const {
    user: { idUser },
  } = useAuth();
  const [requests, setRequests] = useState([]);
  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const FROM_TO_STATUS = [
    "",
    "Open",
    "In Progress",
    "Waiting for Delivery",
    "Released for pick-up",
    "Delivered at House",
    "Done",
    "Unrealized",
  ];
  const FROM_TO_ICON = [
    "",
    WaitingIcon,
    InProgressIcon,
    WaitingIcon,
    DoneIcon,
    DoneIcon,
    DoneIcon,
    UnrealizedIcon,
  ];

  useEffect(() => {
    if (booking?.idBooking) {
      getBooking(idUser)
      .then(setBooking)
      .then(() => {
        const getRequestsUrl = `/request?language=${getCurrentLanguageForBackend()}&idBooking=${
          booking.idBooking
        }`;
        api
        .get(getRequestsUrl)
        .then((res) => {
          setRequests(res.data);
          
        }).finally(() => setLoading(false))
        
      });
    }
  }, [idUser, booking]);

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  return (
    <div className="requests-status-container page">
      <Header backgroundTopImage={backgroundTopImage} />
      <main className="main-with-header">
        <h1 className="h1-requests">{t("requests_status")}</h1>

        {loading ? (
          <>
            <PageLoader/>
          </>
        ) : (
          <>
            {requests.map((request: RequestType) => {
              let bottomText = "";
              let dot: JSX.Element = <div className="dot" />;
              const m = moment(request.createDate);
              let week = m.format("ddd");
              let month = m.format("MMM");
              let dayAndHour = m.format(" D - hh:mma");
              let weekTranslate = t(`${week}`);
              let monthTranslate = t(`${month}`);

              if (request.operatorName) {
                bottomText = `Operator: ${request.operatorName}`;
              } else if (request.amount) {
                bottomText = `Amount: ${request.amount}`;
              }

              if (request.parentTitle) {
                dot = <FaCircle size="6" color="#898989" />;
              }

              const status = FROM_TO_STATUS[request.status];
              const icon = FROM_TO_ICON[request.status];

              return (
                <>
                <div className="requests-cards">
                  <div className="requests-icon">
                    <img src={request.icon} alt="" />
                  </div>
                  <div className="requests-description">
                    <h2>
                      <span>{request.parentTitle}</span> {dot}
                      {}{" "}
                      {!request.parentTitle ? (
                        <span>{request.title}</span>
                      ) : (
                        request.title
                      )}{" "}
                      <FaCircle size="6" color="#898989" />{" "}
                      {`${weekTranslate}  ${monthTranslate}`}
                      {dayAndHour}
                    </h2>
                    <p>{request.description}</p>
                    <p>
                      {" "}
                      {bottomText} Status: {status}
                    </p>
                  </div>
                  <div className="requests-icon-status">
                    <img src={icon} alt="" />
                  </div>
                </div>
                <hr />
                </>
              );
            })}

            {requests.length == 0 ? (
              <div className="no-requests">
                <h1>{t("no_request")}</h1>
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
      {/* {loader} */}
    </div>
  );
}
