const URI_USER_SVC = process.env.REACT_APP_ENV  === "PROD" 
  ? "https://peerprep-cs3219-userservice.herokuapp.com"
  : "http://localhost:8000"

const URI_MATCHING_SVC_LINK = process.env.REACT_APP_ENV  === "PROD"
  ? "https://peerprep-cs3219-matchservice.herokuapp.com"
  : "http://localhost:8001"

const URI_QUESTION_SVC = process.env.REACT_APP_ENV  === "PROD"
  ? "https://peerprep-cs3219-qnservice.herokuapp.com"
  : "http://localhost:8002"

  
const URI_HISTORY_SVC = process.env.REACT_APP_ENV  === "PROD"
  ? "https://peerprep-cs3219-historyservice.herokuapp.com"
  : "http://localhost:8003"


 const URI_SESSION_SVC = process.env.REACT_APP_ENV  === "PROD"
  ? "https://peerprep-cs3219-sessionservice.herokuapp.com"
  : "http://localhost:8004"

const PREFIX_USER_SVC = "/api/user";
const PREFIX_USER_SIGNUP = "/signup";
const PREFIX_USER_LOGIN = "/login";
const PREFIX_USER_LOGOUT = "/logout";
const PREFIX_USER_DELETE = "/delete";
const PREFIX_QUESTION_TYPE = "/questions/";
const PREFIX_QUESTION_ID = "/question/";
const PREFIX_USER_CHANGE_PW = "/change-password/";
const PREFIX_JWT_VALIDATE = "/validate-jwt";
const PREFIX_HISTORY = "/history";
const PREFIX_CREATE_HISTORY = "/create";
const PREFIX_CREATE_SESSION = "/session/";
const PREFIX_UPDATE_USER_STATUS = "/session/status/";
const PREFIX_UPDATE_USER_ATTEMPT = "/session/attempt/";

const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
const RAPID_API_HOST = "judge0-ce.p.rapidapi.com";
const RAPID_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";

export const URL_USER_SIGNUP = URL_USER_SVC + PREFIX_USER_SIGNUP;
export const URL_USER_LOGIN = URL_USER_SVC + PREFIX_USER_LOGIN;
export const URL_USER_DELETE = URL_USER_SVC + PREFIX_USER_DELETE;
export const URL_USER_LOGOUT = URL_USER_SVC + PREFIX_USER_LOGOUT;
export const GET_QUESTION_BY_TYPE = URI_QUESTION_SVC + PREFIX_QUESTION_TYPE;
export const GET_QUESTION_BY_ID = URI_QUESTION_SVC + PREFIX_QUESTION_ID;
export const URL_USER_CHANGE_PW = URL_USER_SVC + PREFIX_USER_CHANGE_PW;
export const URL_JWT_VALIDATE = URL_USER_SVC + PREFIX_JWT_VALIDATE;
export const GET_USER_HISTORY = URI_HISTORY_SVC + PREFIX_HISTORY;
export const URL_CREATE_HISTORY = GET_USER_HISTORY + PREFIX_CREATE_HISTORY;
export const URL_CREATE_SESSION = URI_SESSION_SVC + PREFIX_CREATE_SESSION;
export const URL_UPDATE_USER_STATUS =
  URI_SESSION_SVC + PREFIX_UPDATE_USER_STATUS;
export const URL_UPDATE_USER_ATTEMPT =
  URI_SESSION_SVC + PREFIX_UPDATE_USER_ATTEMPT;

export const URI_MATCHING_SVC = URI_MATCHING_SVC_LINK;
export const REACT_APP_RAPID_API_HOST = RAPID_API_HOST
export const REACT_APP_RAPID_API_URL = RAPID_API_URL
