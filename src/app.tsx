import React, { Suspense, useEffect } from "react";
import {
  Route,
  Switch,
  useLocation,
  Redirect,
  useHistory,
} from "react-router-dom";
import {
  LOGIN,
  HOME,
  REGISTER,
  TRANSFER,
  HOME_LOGGED,
  NEW_ACCOUNT,
  BOOKING,
  SPORTS,
  CONFIRMATION_PASSWORD,
  CATEGORIES_DETAIL,
  REQUEST,
  SCHEDULE,
  CREATE_SCHEDULE,
  EXTEND_BOOKING,
  REQUESTS_STATUS,
  CREATE_REQUEST,
  FEEDBACK,
  REQUEST_COUPON,
  COUPON_CODE
} from "./routes";
import Home from "./pages/login/home";
import Login from "./pages/login/login";
import Register from "./pages/login/register";
import Transfer from "./pages/transfer";
import HomeLogged from "./pages/home-logged/home-logged";
import { useTransition, animated } from "react-spring";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useAuth } from "./contexts/AuthContext";
import NewAccount from "./pages/login/new-account";
import Booking from "./pages/booking/booking";
import Sports from "./pages/sports";
import ConfirmationCode from "./pages/login/confirmation_code";
import CategoriesDetail from "./pages/categories-detail/category-detail";
import Request from "./pages/request2/request";
import Schedule from "./pages/schedule2/schedule";
import CreateSchedule from "./pages/create-schedule/create-schedule";
import ExtendBooking from "./pages/extend-booking/extend-booking";
import CreateRequest from "./pages/create-request/create-request";
import RequestsStatus from "./pages/requests-status/requests-status";
import es from "date-fns/locale/es";
import pt from "date-fns/locale/pt-BR";
import en from "date-fns/locale/en-US";
import { registerLocale } from "react-datepicker";
import Home2 from "./pages/login/home2";
import Feedback from "./pages/feedback/feedback";
import RequestCoupon from "./pages/coupon/request-coupon";
import CouponCode from "./pages/coupon/coupon-code";

export default function App() {
  const location = useLocation();
  const { token, user } = useAuth();
  const history = useHistory();

  registerLocale("es", es);
  registerLocale("pt-BR", pt);
  registerLocale("en-US", en);
  registerLocale("en", en);

  // useEffect(() => {
  //   if (token) {
  //     if (typeof token === "string") {
  //       if (
  //         token.includes("{") ||
  //         token.includes("[") ||
  //         token.includes("true") ||
  //         token.includes("false")
  //       ) {
  //         const user = JSON.parse(token);
  //         if (typeof user == "object") {
  //           if (location.pathname === BOOKING) {
  //             if (user.idUserType == 3) {
  //               history.push(HOME_LOGGED);
  //             }
  //           }
  //         }
  //       }
  //     }
  //     if (typeof user === "object") {
  //       if (location.pathname === BOOKING) {
  //         if (user.idUserType == 3) {
  //           history.push(HOME_LOGGED);
  //         }
  //       }
  //     }
  //   }
  // }, [token, location, history]);
  // const transitions = useTransition(location, (location) => location.pathname, {
  //   from: { opacity: 0, transform: "translate(100%, 0)" },
  //   enter: { opacity: 1, transform: "translate(0%, 0)" },
  //   leave: { opacity: 0, transform: "translate(-50%, 0)" },
  // });
  if (!!token && !!user && location.pathname === LOGIN) {
    return <Redirect to={HOME_LOGGED} />;
  }
  if (!token && !!user && location.pathname === HOME_LOGGED) {
    return <Redirect to={LOGIN} />;
  }
  if (
    !token &&
    !user &&
    (location.pathname === CONFIRMATION_PASSWORD ||
      location.pathname === BOOKING)
  ) {
    return <Redirect to={LOGIN} />;
  }
  if (!user && location.pathname === BOOKING) {
    return <Redirect to={LOGIN} />;
  }
  return (
    <Suspense fallback={"...is loading"}>
      <Route render={({location}) => (
        <TransitionGroup component={null}>
        <CSSTransition key={location.key} timeout={300} classNames="fade" unmountOnExit>
          <Switch location={location}>
            <Route exact path={HOME} component={Home2} />
            <Route exact path={LOGIN} component={Login} />
            <Route exact path={NEW_ACCOUNT} component={NewAccount} />
            <Route exact path={REGISTER} component={Register} />
            <Route
              exact
              path={CONFIRMATION_PASSWORD}
              component={ConfirmationCode}
            />
            <Route exact path={TRANSFER} component={Transfer} />
            <Route exact path={HOME_LOGGED} component={HomeLogged} />
            <Route exact path={BOOKING} component={Booking} />
            <Route exact path={SPORTS} component={Sports} />
            <Route
              exact
              path={CATEGORIES_DETAIL}
              component={CategoriesDetail}
            />
            <Route exact path={REQUEST} component={Request} />
            <Route exact path={SCHEDULE} component={Schedule} />
            <Route exact path={CREATE_SCHEDULE} component={CreateSchedule} />
            <Route exact path={EXTEND_BOOKING} component={ExtendBooking} />
            <Route exact path={CREATE_REQUEST} component={CreateRequest} />
            <Route exact path={REQUESTS_STATUS} component={RequestsStatus} />
            <Route exact path={FEEDBACK} component={Feedback} />
            <Route exact path={REQUEST_COUPON} component={RequestCoupon} />
            <Route exact path={COUPON_CODE} component={CouponCode} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
      )} />
      
    </Suspense>
  );
}