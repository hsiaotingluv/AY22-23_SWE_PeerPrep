import { useState, useEffect, useCallback, useContext } from "react";
import MatchingPopup from "../../components/MatchingPopup/MatchingPopup";
import PortalPopup from "../../components/MatchingPopup/PortalPopup";
import { PieChart } from "react-minimal-pie-chart";
import TopNavBar from "../../components/TopNavBar/TopNavBar";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import "./Dashboard.css";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { GET_USER_HISTORY } from "../../configs";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMatchingPopupOpen, setMatchingPopupOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState(null);
  const { user } = useAuth();

  const transformer = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };

  const width = window.innerWidth - 10;
  const numOfColumn = 6;
  const GridRowsProp = [];
  const GridColDef = [
    { field: "col1", headerName: "Match ID", width: 2 * (width / numOfColumn) },
    { field: "col2", headerName: "Username", width: width / numOfColumn },
    {
      field: "col3",
      headerName: "Difficulty Level",
      width: width / numOfColumn,
    },
    {
      field: "col4",
      headerName: "Date Time",
      width: width / numOfColumn,
    },
    {
      field: "col5",
      headerName: "View Attempt",
      width: width / numOfColumn,
      renderCell: params => {
        const onClick = async e => {
          // don't select this row after clicking
          e.stopPropagation();
          // get roomId from selected row
          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .forEach(
              c => (thisRow[c.field] = params.getValue(params.id, c.field))
            );

          const roomId = thisRow.col1;
          console.log(`roomId ${roomId}`);

          // get questionId and attempt from database using roomId
          const res = await axios.get(`${GET_USER_HISTORY}/${user}/${roomId}`);
          const questionId = res.data.body.questionId;
          const attempt = res.data.body.attempt;

          return navigate("/attempt-history", {replace: true, state:{questionId, attempt}});
          // <AttemptHistoryPage questionId={questionId} attempt={attempt} type={"ATTEMPT HISTORY"}></AttemptHistoryPage>
          // alert(JSON.stringify(thisRow, null, 4));
        };

        return <Button onClick={onClick}>View</Button>;
      },
    },
  ];

  let numOfEasyAttempt = 0;
  let numOfMediumAttempt = 0;
  let numOfHardAttempt = 0;

  const openMatchingPopup = useCallback(() => {
    setMatchingPopupOpen(true);
  }, []);

  const closeMatchingPopup = useCallback(() => {
    setMatchingPopupOpen(false);
  }, []);

  // Set or reset the selected size
  const setSelectedDifficulty = difficulty => {
    if (difficulty === selected) return;
    setSelected(difficulty);
    console.log(`selected difficulty: ${difficulty}`);
  };

  useEffect(() => {
    async function fetchHistory() {
      const res = await axios.get(`${GET_USER_HISTORY}/${user}`).catch(err => {
        console.log(err);
      });
      setHistory(res.data.body);
      console.log(res);
    }
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (history != null) {
    for (let i = 0; i < history.length; i++) {
      const row = {
        id: history[i]._id,
        col1: history[i].roomId.toString(),
        col2: history[i].matchname,
        col3: transformer[history[i].difficulty],
        col4: history[i].dateTime,
        // col5: history[i].attempt,
      };
      GridRowsProp.push(row);

      if (history[i].difficulty === 1) {
        numOfEasyAttempt += 1;
      } else if (history[i].difficulty === 2) {
        numOfMediumAttempt += 1;
      } else {
        numOfHardAttempt += 1;
      }
    }
  }

  return (
    <>
      <div className="dashboard-div">
        <TopNavBar></TopNavBar>
        <main className="hero-main">
          <div className="container-div">
            <div className="matching-container-div">
              <div className="message-div">
                <div className="greeting-div">Welcome back 🚀</div>
                <b className="user-name-b">{user}</b>
              </div>
              <div className="buttons-div">
                <div className="difficulty-buttons-div">
                  <button
                    className={
                      selected === 1 ? "selected-easy-button" : "easy-button"
                    }
                    onClick={() => setSelectedDifficulty(1)}>
                    <strong className="easy-strong">EASY</strong>
                  </button>
                  <button
                    className={
                      selected === 2
                        ? "selected-medium-button"
                        : "medium-button"
                    }
                    onClick={() => setSelectedDifficulty(2)}>
                    <strong className="medium-strong">MEDIUM</strong>
                  </button>
                  <button
                    className={
                      selected === 3 ? "selected-hard-button" : "hard-button"
                    }
                    onClick={() => setSelectedDifficulty(3)}>
                    <strong className="medium-strong">HARD</strong>
                  </button>
                </div>
                <button
                  className={
                    selected ? "start-button" : "start-button disabled"
                  }
                  onClick={selected ? openMatchingPopup : null}>
                  <div className="start-div">START</div>
                </button>
              </div>
            </div>
          </div>
          <div className="attempts-div">
            <div className="attempt-data-div">
              <div className="title-div">Attempts</div>
              <div className="pie-chart-and-details">
                <PieChart
                  data={[
                    { title: "Easy", value: 10, color: "#5be0e6" },
                    { title: "Medium", value: 15, color: "#2bb4d3" },
                    { title: "Hard", value: 20, color: "#1587b9" },
                  ]}
                  label={({ dataEntry }) => dataEntry.title}
                  labelStyle={{
                    fontSize: "5px",
                    fontFamily: "sans-serif",
                    fontColor: "#FFFFFF",
                    fontWeight: "500",
                  }}
                  lineWidth={50}
                  labelPosition={75}
                  className="pie-chart"
                />
                <div className="table-div">
                  <div className="easy-attempt-div">
                    <div className="greeting-div">Easy</div>
                    <div className="count-div">{numOfEasyAttempt}</div>
                  </div>
                  <img className="divider-icon" alt="" src="../divider.svg" />
                  <div className="easy-attempt-div">
                    <div className="greeting-div">Medium</div>
                    <div className="count-div">{numOfMediumAttempt}</div>
                  </div>
                  <img className="divider-icon" alt="" src="../divider.svg" />
                  <div className="easy-attempt-div">
                    <div className="greeting-div">Hard</div>
                    <div className="count-div">{numOfHardAttempt}</div>
                  </div>
                  <img className="divider-icon" alt="" src="../divider.svg" />
                  <div className="easy-attempt-div">
                    <div className="greeting-div">Total</div>
                    <div className="count-div">
                      {numOfEasyAttempt + numOfMediumAttempt + numOfHardAttempt}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <header className="history-table-header">
          <div className="history-title-div">
            <div className="peerprep-div">History</div>
          </div>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid rows={GridRowsProp} columns={GridColDef} pageSize={5} />
          </div>
        </header>
      </div>
      {isMatchingPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered">
          <MatchingPopup difficulty={selected} onClose={closeMatchingPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default Dashboard;
