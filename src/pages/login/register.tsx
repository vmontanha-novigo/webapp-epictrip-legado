import { useToast } from "../../contexts/ToastContext";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import bkgLogin from "../../assets/bkg-login.jpg";
import logo from "../../assets/logo.svg";
import Loader from "../../components/loader";
import { useAuth } from "../../contexts/AuthContext";
import { CONFIRMATION_PASSWORD } from "../../routes";
import { userApi } from "../../services/api";
import backButton from "../../assets/back-button-blue.png";
import eyeIcon from "../../assets/eye.png";
import eyeClosedIcon from "../../assets/eye-closed.png";
import getHash from "../../services/hash.service";
import PhoneInput from "react-phone-number-input";
import "../../global.css";
import "react-phone-number-input/style.css";

const Container = styled.div`
  background: url(${bkgLogin});
  min-height: 100%;
  padding: 0 2rem;
  position: relative;
`;
const PrimaryButton = styled.button`
  color: #fff;
  background: #509bbb;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: -1px 2px 1px #7c7a7b;
  padding: 5px;
  height: 43x;
  font-size: 1.4rem;
  width: 40%;
`;
const DisabledButton = styled(PrimaryButton)`
  background: #afb1b0;
`;
const Title = styled.h2`
  margin: 6rem 0 0.5rem 1rem;
  font-size: 1.4rem;
  text-align: left;
  color: #7c7a7b;
  text-shadow: -1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff;
`;
const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 15px }
  100% { margin-bottom: 0 }
`;
const Dot = styled.div<{ delay: string }>`
  background-color: #fff;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 3px;
  /* Animation */
  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${(props) => props.delay};
`;

const DotWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Button = styled.img`
  width: 10%;
  position: absolute;
  top: 2.5rem;
  left: 1rem;
`;

const Logo = styled.div`
  width: 100%;
  position: relative;
  top: 73px;
  cursor: pointer;
  text-align: center;
`;
const Img = styled.img`
  width: 250px;
  height: auto;
  vertical-align: middle;
`;
const Row = styled.div`
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(var(--bs-gutter-y) * -1);
  margin-right: calc(var(--bs-gutter-x) * -0.5);
  margin-left: calc(var(--bs-gutter-x) * -0.5);
  > * {
    flex-shrink: 0;
    width: 100%;
    max-width: 100%;
    padding-right: calc(var(--bs-gutter-x) * 0.5);
    padding-left: calc(var(--bs-gutter-x) * 0.5);
    margin-top: var(--bs-gutter-y);
  }
`;
const FormGroup = styled.div`
  input {
    border-radius: 15px;
    border: 2px solid #75797c;
    width: 98%;
    margin: auto;
  }
`;
const Label = styled.label`
  position: relative;
  left: 2rem;
  text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
  font-size: 0.9rem;
  top: 0.5rem;
  font-weight: 700;
  z-index: 10;
`;
const FormControl = styled.input`
  min-height: calc(1.5em + 1rem + 7px);
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  border-radius: 0.3rem;
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;
const Col = styled.div`
  flex: 1 0 0%;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: 500;
  padding: 5px 10px 0 10px;
  text-align: justify;
`;

const PasswordButton = styled.img`
  width: 30px;
  position: absolute;
  top: 25px;
  right: 10px;
`;

const PasswordButtonClosed = styled.img`
  width: 30px;
  position: absolute;
  top: 25px;
  right: 10px;
`;

const PasswordWrapper = styled.div`
  width: 100%;
  position: relative;
`;

type LoginData = {
  sharingNumber: string;
  passwordHash: string;
  data: any;
};
export default function Login() {
  const [loading, setLoading] = useState(false);
  const { sharingNumber, setToken, setUser, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const history = useHistory();
  const { state } = useLocation();
  const loginData = state as LoginData;
  const tripOwner = !loginData.sharingNumber;
  const tripGuest = !tripOwner;
  const { t } = useTranslation();

  const inputPassword = document.getElementById("password");
  const inputConfirmationPassword = document.getElementById(
    "confirmation_password"
  );

  const eyeImgPassword = document.getElementById("eyePassword");
  const eyeClosedPassword = document.getElementById("eyeclosedPassword");

  const eyeImgConfirmation = document.getElementById("eyeConfirmation");
  const eyeClosedConfirmation = document.getElementById(
    "eyeclosedConfirmation"
  );

  let visiblePassword = false;
  let visibleConfirmation = false;

  eyeImgPassword?.addEventListener("click", () => {
    if (!visiblePassword) {
      inputPassword?.setAttribute("type", "text");
      eyeImgPassword.style.display = "none";
      eyeClosedPassword!.style.display = "inline";
      visiblePassword = true;
    }
  });

  eyeClosedPassword?.addEventListener("click", () => {
    if (visiblePassword) {
      inputPassword?.setAttribute("type", "password");
      eyeClosedPassword.style.display = "none";
      eyeImgPassword!.style.display = "inline";
      visiblePassword = false;
    }
  });

  eyeImgConfirmation?.addEventListener("click", () => {
    if (!visibleConfirmation) {
      inputConfirmationPassword?.setAttribute("type", "text");
      eyeImgConfirmation.style.display = "none";
      eyeClosedConfirmation!.style.display = "inline";
      visibleConfirmation = true;
    }
  });

  eyeClosedConfirmation?.addEventListener("click", () => {
    if (visibleConfirmation) {
      inputConfirmationPassword?.setAttribute("type", "password");
      eyeClosedConfirmation.style.display = "none";
      eyeImgConfirmation!.style.display = "inline";
      visibleConfirmation = false;
    }
  });

  let formFields: any = {
    password: Yup.string()
      .min(8, t("password_must_be"))
      .required()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/,
        t("password_requirement")
      ),
    confirmation_password: Yup.string()
      .required(t("password_must_be"))
      .oneOf(["", Yup.ref("password")], t("password_do_not_match")),
  };
  let disableRegisterData = true;
  if (tripOwner) {
    formFields["name_booking_travel"] = Yup.string().required();
  } else if (tripGuest) {
    const newFields = {
      name: Yup.string().required(t("name_required")),
      email: Yup.string()
        .email(t("invalid_email"))
        .required(t("email_required")),
      sharing_number: Yup.string().required(t("sharing_required")),
    };
    formFields = { ...formFields, ...newFields };
    disableRegisterData = false;
  }
  const schema = Yup.object().shape(formFields);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const { addToast } = useToast();

  useEffect(() => {
    setValue("sharing_number", sharingNumber);
  }, [sharingNumber]);


  const onSubmit = useCallback(
    async (data: any) => {
      setLoading(true);
      const dataTemp = { ...data };
      dataTemp.password = getHash(dataTemp.password);
      dataTemp.confirmation_password = dataTemp.password;
      dataTemp.mobile_phone_number = phoneNumber;

      try {
        if (tripGuest) {
          await userApi.post("/auth/signup", {
            email: dataTemp.email,
            password: dataTemp.password,
            phone: dataTemp.mobile_phone_number,
          });
          const createGuestData = {
            email: dataTemp.email,
            phone: dataTemp.mobile_phone_number,
            name: dataTemp.name,
            password: dataTemp.password,
            sharingNumber: sharingNumber,
            sharingNumberPassword: loginData.passwordHash,
          };
          setLoading(false);
          history.push({
            pathname: CONFIRMATION_PASSWORD,
            state: { createGuestData },
          });
        } else {
          await userApi.post("/auth/signup", {
            email: dataTemp.email,
            password: dataTemp.password,
            phone: dataTemp.mobile_phone_number,
          });
          setUser(dataTemp, true);
          history.push({
            pathname: CONFIRMATION_PASSWORD,
            state: {
              registerData: {
                ...dataTemp,
                oldPassword: loginData.passwordHash,
              },
            },
          });
          setLoading(false);
        }
      } catch (error: any) {
        setLoading(false);
        if (error.response.status == 404) {
          addToast({ type: "error", title: t("wrong") });
        } else {
          alert(t("wrong"));
        }
      }
    },
    [setToken, setUser, user, history, phoneNumber]
  );

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("mobile_phone_number", user.phone);
      setPhoneNumber(user.phone);
      if (loginData?.data?.nameBookingTravel) {
        setValue("name_booking_travel", loginData.data.nameBookingTravel);
      } else {
        if (user && user.name) {
          let bookingTravel = user.name.split(" ")[0] + "s Group";
          setValue("name_booking_travel", bookingTravel);
        }
      }
    }
  }, [user, setValue]);

  const errorHTML = document.querySelector(".phone")
  const submitButton = document.querySelector("button")  

  const isPhoneValid = () => {
    if(!phoneNumber) {
      errorHTML?.classList.add("error")
    }
  }

  submitButton?.addEventListener('click', isPhoneValid);

  `${phoneNumber}`.length > 4 ? errorHTML?.classList.remove("error") : "";


  useEffect(() => {
    setPhoneNumber(phoneNumber)
  }, [phoneNumber])  

  return (
    <Container>
      <Button onClick={handleGoBack} src={backButton} />
      <Logo>
        <Img src={logo} />
      </Logo>
      <Title>{t("register")}</Title>
      <Row>
        <Col>
          <FormGroup>
            <Label htmlFor="name">{t("name")}</Label>
            <FormControl
              {...register("name")}
              id="name"
              disabled={disableRegisterData}
            />
            {errors?.name?.message && (
              <ErrorMessage>{errors?.name?.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup style={{ marginTop: "12px" }}>
            <Label htmlFor="email">{t("email")}</Label>
            <FormControl
              {...register("email")}
              id="email"
              type="email"
              disabled={disableRegisterData}
            />
            {errors?.email?.message && (
              <ErrorMessage>{errors?.email?.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup style={{ marginTop: "12px" }}>
            <Label htmlFor="mobile-phone-number">
              {t("mobile_phone_number")}
            </Label>
          
            <PhoneInput
            // @ts-ignore
              onChange={setPhoneNumber}
              value={phoneNumber}
              type="tel"
              id="mobile-phone-number"
              disabled={disableRegisterData}
            />
            <p className="phone ">{t("phone_required")}</p>
            
          </FormGroup>
          <PasswordWrapper>
            <FormGroup style={{ marginTop: "12px" }}>
              <Label htmlFor="password">{t("password")}</Label>
              <FormControl
                {...register("password")}
                id="password"
                type="password"
              />

              <PasswordButton src={eyeIcon} id="eyePassword" />
              <PasswordButtonClosed
                src={eyeClosedIcon}
                id="eyeclosedPassword"
                style={{ display: "none" }}
              />

              {errors?.password?.message && (
                <ErrorMessage>{errors?.password?.message}</ErrorMessage>
              )}
            </FormGroup>
          </PasswordWrapper>

          <PasswordWrapper>
            <FormGroup style={{ marginTop: "12px" }}>
              <Label htmlFor="confirmation_password">
                {t("confirmation_password")}
              </Label>
              <FormControl
                {...register("confirmation_password")}
                id="confirmation_password"
                type="password"
              />

              <PasswordButton src={eyeIcon} id="eyeConfirmation" />
              <PasswordButtonClosed
                src={eyeClosedIcon}
                id="eyeclosedConfirmation"
                style={{ display: "none" }}
              />

              {errors?.confirmation_password?.message && (
                <ErrorMessage>
                  {errors?.confirmation_password?.message}
                </ErrorMessage>
              )}
            </FormGroup>
          </PasswordWrapper>
          {tripGuest && (
            <FormGroup style={{ marginTop: "12px" }}>
              <Label htmlFor="sharing_number">{t("sharing_number")}</Label>
              <FormControl
                {...register("sharing_number")}
                id="sharing_number"
                disabled={true}
              />
              {errors?.sharing_number?.message && (
                <ErrorMessage>{errors?.sharing_number?.message}</ErrorMessage>
              )}
            </FormGroup>
          )}

          <FormGroup style={{ marginTop: "12px" }}>
            <Label htmlFor="name">{t("name_booking_travel")}</Label>
            <FormControl
              {...register("name_booking_travel")}
              id="name_booking_travel"
              disabled={tripGuest == true}
            />
            {errors?.name_booking_travel?.message && (
              <ErrorMessage>{t("sharing_required")}</ErrorMessage>
            )}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            style={{
              textAlign: "center",
              marginTop: "1.8rem",
              marginBottom: "2rem",
            }}
          >
            {isValid ? (
              <PrimaryButton onClick={handleSubmit(onSubmit)}>
                {loading ? <Loader /> : t("done")}
              </PrimaryButton>
            ) : (
              <DisabledButton onClick={handleSubmit(onSubmit)}>
                {loading ? <Loader /> : t("done")}
              </DisabledButton>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
