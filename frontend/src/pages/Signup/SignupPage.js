import "./SignupPage.css";
import { Box, TextField } from "@mui/material";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../logo.png";

function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { signUpUser } = useAuth();

  const handleSignup = async () => {
    const isSuccess = await signUpUser(
      username,
      password,
      confirmPassword,
      setUsernameError,
      setPasswordError,
      setConfirmPasswordError
    );

    if (isSuccess) {
      navigate("/dashboard");
    }
  };

  const onLoginButtonClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <Box className="page">
      <Box className="background-image">
        <img className="login-logo" src={logo} alt="logo"></img>
      </Box>
      <Box
        className="container-box"
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"40px"}>
          <strong className="signup-heading">Sign Up</strong>
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
                if (event.key === "Enter") handleSignup();
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
                if (event.key === "Enter") handleSignup();
              }}
            />
            <TextField
              className="input"
              fullWidth
              variant="outlined"
              type="password"
              label="Confirm Password"
              placeholder="Enter password here"
              size="medium"
              margin="none"
              error={confirmPasswordError !== ""}
              helperText={confirmPasswordError}
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyUp={event => {
                if (event.key === "Enter") handleSignup();
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"20px"}>
            <button className="signup-button" onClick={handleSignup}>
              <div className="signup-text">Sign Up</div>
            </button>
            <button className="login-button" onClick={onLoginButtonClick}>
              <div className="login-text">
                <u>Login</u>
              </div>
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SignupPage;
