import "./TopNavBar.css";
import ChangePwPopup from "../../components/ChangePwPopup/ChangePwPopup";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"

const TopNavBar = () => {
  const navigate = useNavigate();
  const [isChangePwPopupOpen, setChangePwPopupOpen] = useState(false);
  const { logOutUser } = useAuth();

  const openChangePwPopup = useCallback(() => {
    setChangePwPopupOpen(true)
  }, []);

  const closeChangePwPopup = useCallback(() => {
    setChangePwPopupOpen(false);
  }, []);

  const handleLogout = async () => {
    const isSuccess = await logOutUser();
    if (isSuccess) {
      navigate("/login");
    }
  }

  return (
    <>
      <header className="header">
        <div className="peerprep-div">PeerPrep</div>
        <div className="menu-div">
          <button className="change-password-button" onClick={openChangePwPopup}>Change password</button>
          <button className="log-out-button" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {isChangePwPopupOpen && (
          <ChangePwPopup onClose={closeChangePwPopup} />
      )}
    </>
  );
};

export default TopNavBar;
