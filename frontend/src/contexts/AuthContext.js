import React, { useContext, useState, createContext } from 'react';
import axios from "axios";
import {
  STATUS_CODE_SUCCESS,
  STATUS_CODE_CONFLICT,
  STATUS_CODE_CREATED,
  STATUS_CODE_CONFLICT_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_MISMATCH_ERROR,
  USER_DOES_NOT_EXIST,
  USER_INCORRECT_PASSWORD
} from "../constants";
import {
  URL_JWT_VALIDATE,
  URL_USER_SIGNUP,
  URL_USER_LOGIN,
  URL_USER_LOGOUT,
  URL_USER_CHANGE_PW
} from "../configs";
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");

  async function checkToken() {
    const token = Cookies.get('token');
    if (!token) {
      return false;
    }
    const res = await axios
      .post(URL_JWT_VALIDATE)
      .catch(err => {
        console.log(err.response.data.message);
        return false;
      });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setUser(res.data.username);
      console.log(user);
      return true;
    }
    return false;
  }

  async function signUpUser(username, password, confirmPassword, setUsernameError, setPasswordError, setConfirmPasswordError) {
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    if (password.length < 8) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
      setConfirmPasswordError(PASSWORD_LENGTH_ERROR);
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError();
      setConfirmPasswordError(PASSWORD_MISMATCH_ERROR);
      return false;
    }
    const res = await axios
      .post(URL_USER_SIGNUP, { username, password })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setUsernameError(STATUS_CODE_CONFLICT_MESSAGE);
        } else if (err.response.data.message === USER_DOES_NOT_EXIST) {
          setUsernameError(USER_DOES_NOT_EXIST);
        } else if (err.response.data.message === USER_INCORRECT_PASSWORD) {
          setPasswordError(DEFAULT_ERROR_MESSAGE);
          setConfirmPasswordError(DEFAULT_ERROR_MESSAGE);
        }
        
        
        else {
          setUsernameError(DEFAULT_ERROR_MESSAGE);
          setPasswordError(DEFAULT_ERROR_MESSAGE);
          setConfirmPasswordError(DEFAULT_ERROR_MESSAGE);
        }
      });
    if (res && res.status === STATUS_CODE_CREATED) {
      setUser(username);
      return true;
    }
    return false;
  }

  async function logInUser(username, password, setUsernameError, setPasswordError) {
    setUsernameError("");
    setPasswordError("");
    if (password.length < 8) {
      setPasswordError(PASSWORD_LENGTH_ERROR);
      return false;
    }
    const res = await axios
      .post(URL_USER_LOGIN, { username, password })
      .catch(err => {
        console.log(err.response.data.message);
        if (err.response.data.message === USER_DOES_NOT_EXIST) {
          setUsernameError(USER_DOES_NOT_EXIST);
        } else if (err.response.data.message === USER_INCORRECT_PASSWORD) {
          setPasswordError(USER_INCORRECT_PASSWORD);
        } else {
          setUsernameError(DEFAULT_ERROR_MESSAGE);
          setPasswordError(DEFAULT_ERROR_MESSAGE);
        }
        return false;
      });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setUser(username);
      return true;
    }
    return false;
  }

  async function logOutUser() {
    const res = await axios
      .delete(URL_USER_LOGOUT)
      .catch(err => {
        console.log(err.response.data.message);
        return false;
      });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setUser("");
      Cookies.remove('token');
      return true;
    }
    return false;
  }

  async function changePasswordUser(newPassword, confirmNewPassword, setNewPasswordError, setConfirmNewPasswordError) {
    setNewPasswordError("");
    setConfirmNewPasswordError("");
    if (newPassword.length < 8) {
      setNewPasswordError(PASSWORD_LENGTH_ERROR);
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setNewPasswordError(PASSWORD_MISMATCH_ERROR);
      setConfirmNewPasswordError(PASSWORD_MISMATCH_ERROR);
      return false;
    }
    const res = await axios
      .post(URL_USER_CHANGE_PW, { newPassword })
      .catch((err) => {
        console.log(err.response.data.message);
        setNewPasswordError(DEFAULT_ERROR_MESSAGE);
        setConfirmNewPasswordError(DEFAULT_ERROR_MESSAGE);
      });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      return true;
    }
    return false;
  }

  const value = {
    user,
    signUpUser,
    logInUser,
    logOutUser,
    checkToken,
    changePasswordUser
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };