import React, { FormEventHandler, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { HOME_LOGGED, REGISTER } from "../../routes";

import styled from "@emotion/styled";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.svg";
import bkgLogin from "../../assets/bkg-login.jpg";
import { useToast } from "../../contexts/ToastContext";
import { keyframes } from "@emotion/react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
const Container = styled.div`
  background: url(${bkgLogin});
  min-height: 100%;
  padding: 0 2rem;
  position: relative;
`;
const PrimaryButton = styled.button`
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
  background: #509bbb;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: -1px 2px 1px #777;
  padding: 5px;
`;
const DisabledButton = styled(PrimaryButton)`
  background: #777;
`;
const Span = styled.span`
  position: relative;
  left: 0;
  text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
  font-size: 1rem;
  top: 0.7rem;
  font-weight: 700;
`;
const Title = styled.h2`
  margin-top: 6rem;
  text-align: left;
  color: #777;
  text-shadow: -1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff;
`;
const Input = styled.input`
  border-radius: 15px;
  border: 2px solid #808181;
  color: #808181;
  width: 20em;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  z-index: -1;
  &:focus {
    outline: 0;
    border: 3px solid #808181;
  }
  ::placeholder {
    color: #808181;
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: #808181;
  }

  ::-ms-input-placeholder {
    color: #808181;
  }
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
const Button = styled.button`
  width: 30px;
  height: 30px;
  background: #509bbb;
  text-shadow: 0px 1px 1px #777;
  border: none;
  cursor: pointer;
  border-radius: 30px;
  text-align: center;
  line-height: 25px;
  font-size: 2rem;
  color: #fff;
  position: absolute;
  top: 1.5rem;
`;

const Logo = styled.div`
  width: 100%;
  z-index: 10;
  position: relative;
  top: 65px;
  cursor: pointer;
  text-align: center;
`;
const Img = styled.img`
  width: 220px;
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
    border: 2px solid #777;
  }
`;
const Label = styled.label`
  position: relative;
  left: 1.5rem;
  text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
  font-size: 1rem;
  top: 0.6rem;
  font-weight: 700;
`;
const FormControl = styled.input`
  min-height: calc(1.5em + 1rem + 2px);
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
const schema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().when("name", (fieldName, continueSchema) => {
    return !!fieldName
      ? continueSchema.email().required()
      : continueSchema.email();
  }),
  mobile_phone_number: Yup.string(),
  password: Yup.string().required(),
  confirmation_password: Yup.string().oneOf(["", Yup.ref("password")]),
  sharing_number: Yup.string().required(),
  guest: Yup.string(),
});
export default function NewAccount() {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { t } = useTranslation();
  const onSubmit = useCallback((data) => {
    console.log(data);
  }, []);
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleGoToNewAccount = useCallback(() => {
    history.push(REGISTER);
  }, [history]);
  return (
    <Container>
      <Button onClick={handleGoBack}>{"<"}</Button>
      <Logo>
        <Img src={logo} />
      </Logo>
      <Title>{t("booking_or_sharing_number")}</Title>
      <Row>
        <Col>
          <FormGroup>
            <Label htmlFor="booking_number">{t("booking_number")}</Label>
            <FormControl {...register("booking_number")} id="booking_number" />
          </FormGroup>

          <FormGroup>
            <Span>{t("or")}</Span>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="sharing_number">{t("sharing_number")}</Label>
            <FormControl {...register("sharing_number")} id="sharing_number" />
          </FormGroup>

          <FormGroup style={{ marginTop: "1.5rem" }}>
            <Label htmlFor="password">{t("password")}</Label>
            <FormControl
              {...register("password")}
              id="password"
              type="password"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            style={{
              textAlign: "center",
              marginTop: "5rem",
            }}
          >
            <DisabledButton onClick={handleSubmit(onSubmit)}>
              {t("done")}
            </DisabledButton>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
