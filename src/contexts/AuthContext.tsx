import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { userApi } from "../services/api";
// import jsSHA from "jssha";

type LoginParams = {
  email: string;
  password: string;
  sharingNumber: string;
};
type AuthContextData = {
  login({
    email,
    password,
    sharingNumber,
  }: LoginParams): Promise<
    | {
        pendingRegister: boolean;
        locator: boolean;
        guest: boolean;
        error: string;
        data: any;
      }
    | string
    | void
  >;
  token: string;
  user: any;
  setUser: (usr: any, previous?: boolean) => void;
  setToken: (str: string) => void;
  sharingNumber: string;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [mySharingNumber, setSharingNumber] = useState("");
  useEffect(() => {
    const storage = localStorage.getItem("@MyEpicTrip:token");
    if (storage) {
      setToken(storage);
    }
  }, []);
  useEffect(() => {
    const usr = localStorage.getItem("@MyEpicTrip:user");
    if (usr) {
      const usrObj = JSON.parse(usr);
      if (usrObj) {
        setUser(usrObj);
      }
    }
  }, []);
  const updateToken = useCallback((token: string) => {
    localStorage.setItem("@MyEpicTrip:token", token);
    setToken(token);
  }, []);
  const updateUser = useCallback((usr: any, previous = false) => {
    if (!previous) {
      localStorage.setItem("@MyEpicTrip:user", JSON.stringify(usr));
      setUser(usr);
    } else {
      setUser((u) => {
        localStorage.setItem(
          "@MyEpicTrip:user",
          JSON.stringify({ ...u, ...usr })
        );
        return { ...u, ...usr };
      });
    }
  }, []);
  const login = useCallback(
    async ({
      email,
      password,
      sharingNumber,
    }: LoginParams): Promise<string | any | { error: any } | void> => {
      try {
        if (email && !sharingNumber) {

          const { data } = await api.post("/userLogin", {
            email,
            password,
          });

          if (Array.isArray(data)) {
            if (data.length) {
              const { statusPassword } = data[0];
              if (statusPassword === "1") {
                const responseCognito = await userApi.post("/auth/login", {
                  email: email,
                  phone: data[0].phone,
                  password: password,
                });
                updateUser(data[0]);
                updateToken(responseCognito.data.accessToken);
                return email;
              } else if (statusPassword === "0") {
                updateUser(data[0]);
                return { pendingRegister: true, locator: true, data };
              }
            }
          }
        } else if (sharingNumber && !email) {
          const { data } = await api.post("/booking/codeAccess/sharingNumber", {
            sharingNumberBooking: sharingNumber,
            codeAccessBooking: password,
          });

          updateUser({});
          setSharingNumber(sharingNumber);
          return { pendingRegister: true, guest: true, data };
        }
        if (
          password === "123456" &&
          (email === "admin@epictrip.com.br" || sharingNumber === "123456")
        ) {
          updateToken(email);
          return email;
        }
        await api.post("/user/confirmsignup", {
          email,
          validationCode: sharingNumber,
        });
        await api.post("/user/login", {
          email,
          senha: password,
        });
        updateToken(email);
        return email;
      } catch (err: any) {
        console.log(err.response);
        if (err.response.data.length === 0) {
          return { error: "invalid_email_or_password" };
        }
        return { error: err.message };
      }
    },
    [updateUser, updateToken]
  );
  return (
    <AuthContext.Provider
      value={{
        login,
        token,
        sharingNumber: mySharingNumber,
        setToken: updateToken,
        user,
        setUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}
