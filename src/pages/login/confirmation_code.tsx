import styled from "@emotion/styled";
import React, { useCallback, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { HOME_LOGGED } from "../../routes";
import api, { userApi } from "../../services/api";
import * as Yup from "yup";
import logo from "../../assets/logo.svg";
import bkgLogin from "../../assets/bkg-login.jpg";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../components/loader";
import { useToast } from "../../contexts/ToastContext";

const Container = styled.div`
  background: url(${bkgLogin});
  height: 100%;
  padding: 0 2rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
const PrimaryButton = styled.button`
  color: #fff;
  background: #509bbb;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: -1px 2px 1px #7c7a7b;
  padding: 5px;
  height: 43px;
  font-size: 1.4rem;
  width: 40%;
`;
const DisabledButton = styled(PrimaryButton)`
  background: #afb1b0;
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
  margin: 6rem 0 0.5rem 1rem;
  font-size: 1.4rem;
  text-align: left;
  color: #7c7a7b;
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

const schema = Yup.object().shape({
  confirmation_code: Yup.string().required(),
});

type RegisterData = {
  password: string;
  name_booking_travel: string;
  oldPassword: string;
};

type CreateGuestData = {
  email: string;
  phone: string;
  name: string;
  password: string;
  sharingNumberBooking: string;
  codeAccessBooking: string;
};

export default function ConfirmationCode() {
  const { t } = useTranslation();
  const { addToast } = useToast();

  interface stateType {
    from: { pathname: string };
    registerData: RegisterData;
    createGuestData: CreateGuestData;
  }
  const { state } = useLocation<stateType>();
  const registerData = state.registerData as RegisterData;
  const createGuestData = state.createGuestData as CreateGuestData;

  const { setUser, setToken } = useAuth();
  let { user } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (data: any) => {
      setLoading(true);
      let confirmSignUpBody = {};
      if (user.idUser) {
        confirmSignUpBody = {
          email: user.email,
          phone: user.phone,
          validationCode: data.confirmation_code,
        };
      } else {
        confirmSignUpBody = {
          email: createGuestData.email,
          phone: createGuestData.phone,
          validationCode: data.confirmation_code,
        };
      }
      try {
        await userApi.post("/auth/confirmsignup", confirmSignUpBody);
      } catch (error: any) {
        if (error.response.status == 404) {
          addToast({ type: "error", title: t("invalid_code") });
          return setLoading(false);
        }
      }
      if (user.idUser) {
        const response = await api.put(`/user/password/${user.idUser}`, {
          newPassword: user.password,
          oldPassword: registerData.oldPassword,
          tripName: registerData.name_booking_travel,
        });
        // setUser(response.data);
      } else {
        const response = await api.post("/user/guest", createGuestData);
        setUser(response.data);
        user = { ...response.data };
      }

      const responseCognito = await userApi.post("/auth/login", {
        email: user.email,
        phone: user.phone,
        password: user.password,
      });

      setToken(responseCognito.data.accessToken);
      history.push(HOME_LOGGED);
      setLoading(false);
    },
    [setUser, setToken, history]
  );
  const { handleSubmit, register } = useForm({ resolver: yupResolver(schema) });

  const [confirmation, setConfirmation] = useState("");

  const handleChangeConfirmation = useCallback(
    (e: any) => {
      let confirmation = e.target.value;
      setConfirmation(confirmation);
    },
    [confirmation]
  );

  return (
    <Container>
      <Logo>
        <Img src={logo} />
      </Logo>
      <Title>{t("confirmation_code")}</Title>
      <Row>
        <Col>
          <FormGroup style={{ marginTop: "12px" }}>
            <Label htmlFor="confirmation_code">{t("confirmation_code")}</Label>
            <FormControl
              {...register("confirmation_code")}
              id="confirmation_code"
              onChange={handleChangeConfirmation}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              marginBottom: "5rem",
            }}
          >
            {confirmation ? (
              <PrimaryButton onClick={handleSubmit(onSubmit)}>
                {loading ? <Loader /> : t("done")}
              </PrimaryButton>
            ) : (
              <DisabledButton>{t("done")}</DisabledButton>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
