import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./pages/Signup/SignupPage"
import LoginPage from "./pages/Login/LoginPage";
import RoomPage from "./pages/Room/RoomPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import AttemptHistoryPage from "./pages/AttemptHistory/AttemptHistoryPage";
import { Box } from "@mui/material";

import { SocketProvider } from "./contexts/SocketContext";
import { AuthProvider } from "./contexts/AuthContext";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <div className="App">
      <Box display={"flex"} flexDirection={"column"}>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={<Navigate replace to="/signup" />}></Route>

                <Route path="/signup"
                  element={
                    <PublicRoute>
                      <SignupPage />
                    </PublicRoute>} />

                <Route path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>} />


                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>} />

                <Route
                  path="/room/:roomId"
                  element={
                    <PrivateRoute>
                      <RoomPage />
                    </PrivateRoute>} />
                
                <Route
                  path="/attempt-history"
                  element={
                    <PrivateRoute>
                      <AttemptHistoryPage />
                    </PrivateRoute>} />

                <Route path="*" element={<h1>404 Error</h1>} />

              </Routes>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </Box>
    </div>
  );
}

export default App;
