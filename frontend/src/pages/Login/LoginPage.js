import "./LoginPage.css";
import { Box, TextField } from "@mui/material";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../logo.png";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { logInUser } = useAuth();

  const handleLogin = async () => {
    const isSuccess = await logInUser(
      username,
      password,
      setUsernameError,
      setPasswordError
    );

    if (isSuccess) {
      navigate("/dashboard");
    }
  };

  const onSignupButtonClick = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  return (
    <Box className="page">
      <Box className="background-image">
        <img className="login-logo" src={logo} alt="logo"></img>
      </Box>
      <Box className="container-box">
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"40px"}>
          <strong className="login-heading">Login</strong>
          <Box
            width={"442px"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"24px"}>
            <TextField
              className="input"
              fullWidth
              variant="outlined"
              type="text"
              label="Username"
              placeholder="Enter your username"
              size="medium"
              margin="none"
              error={usernameError !== ""}
              helperText={usernameError}
              onChange={e => setUsername(e.target.value)}
              onKeyUp={event => {
                if (event.key === "Enter") handleLogin();
              }}
            />
            <TextField
              className="input"
              fullWidth
              variant="outlined"
              type="password"
              label="Password"
              placeholder="Enter password here"
              size="medium"
              margin="none"
              error={passwordError !== ""}
              helperText={passwordError}
              onChange={e => setPassword(e.target.value)}
              onKeyUp={event => {
                if (event.key === "Enter") handleLogin();
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"20px"}>
            
            <button className="login-button-alt" onClick={handleLogin}>
              <div className="login-text-alt">Login</div>
            </button>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={"40px"}>
              {/* <button className="forget-password-button">
                  <div className="forget-password-text">Forget Password</div>
                </button> */}
              <button
                className="signup-button-alt"
                onClick={onSignupButtonClick}>
                <div className="signup-text-alt">
                  <u>Signup</u>
                </div>
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
