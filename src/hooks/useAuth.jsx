import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
// import { useSessionStorage } from "./useSessionStorage";
import axios from "axios";
import { Spin, message } from "antd";
import LoginPage from "../pages/login-page/LoginPage";

//Original
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useLocalStorage("user", null);
//   const navigate = useNavigate();

//   // call this function when you want to authenticate the user
//   const login = async (data) => {
//     setUser(data);
//     navigate("/");
//   };

//   // call this function to sign out logged in user
//   const logout = () => {
//     setUser(null);
//     navigate("/login", { replace: true });
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       login,
//       logout,
//     }),
//     [user]
//   );
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

//Update
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  // const [user, setUser] = useSessionStorage('user', null);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(user); // This will log the updated user value after it changes.
  }, [user]);

  const login = async ({ username, password }) => {
    setLoading(true); // Start loading before the request
    try {
      const response = await axios.post(
        "https://jssatsapi20240629152002.azurewebsites.net/api/Accounts/login",
        { username, password }
      );
      const { token, account, exexpiresIn } = response.data;
      console.log("account ne: " + JSON.stringify(account));
      if (account.role === "Staff") {
        message.error("Staff cannot access this site");
        setLoading(false); // Stop loading on error
      } else {
        setUser({ ...account, token, exexpiresIn });
        navigate("/");
        setLoading(false); // Stop loading on error
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show message)\
      message.error(`Failed to login : ${error.response.data}`);
      setLoading(false); // Stop loading on error
    }
  };

  const logout = () => {
    // localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Spin size="large" tip="Logging in..." >
        <LoginPage/>
      </Spin> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
