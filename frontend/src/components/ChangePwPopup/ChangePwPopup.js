import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { TextField } from "@mui/material";
import PortalPopup from "../MatchingPopup/PortalPopup";
import "./ChangePwPopup.css";

const ChangePwPopup = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const { changePasswordUser } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    const isSuccess = await changePasswordUser(
      newPassword,
      confirmNewPassword,
      setNewPasswordError,
      setConfirmNewPasswordError
    );

    if (isSuccess) {
      onClose();
    }
  };

  return (
    <PortalPopup overlayColor="rgba(113, 113, 113, 0.3)">
      <div className="change-password-popup">
        <div className="container-div">
          <div className="box-div">
            <div className="sign-up-div">
              <div className="text-div">Change Password</div>
            </div>
            <div className="signup-form-div">
              <TextField
                className="password-textfield"
                fullWidth
                color="primary"
                variant="outlined"
                type="password"
                label="Password"
                placeholder="Enter password here"
                helperText={newPasswordError}
                size="medium"
                margin="none"
                required
                error={newPasswordError !== ""}
                onChange={e => setNewPassword(e.target.value)}
              />
              <TextField
                className="password-textfield"
                fullWidth
                color="primary"
                variant="outlined"
                type="password"
                label="Confirm Password"
                placeholder="Enter password here"
                helperText={confirmNewPasswordError}
                size="medium"
                margin="none"
                required
                error={confirmNewPasswordError !== ""}
                onChange={e => setConfirmNewPassword(e.target.value)}
                onKeyUp={event => {
                  if (event.key === "Enter") handleSubmit();
                }}
              />
            </div>
          </div>
          <div className="change-password-buttons-div">
            <button className="change-button" onClick={handleSubmit}>
              <div className="change-div">CHANGE</div>
            </button>
            <button className="exit-button" onClick={onClose}>
              <div className="exit-div">EXIT</div>
            </button>
          </div>
        </div>
      </div>
    </PortalPopup>
  );
};

export default ChangePwPopup;