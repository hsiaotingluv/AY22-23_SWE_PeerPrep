import parse from "html-react-parser";
import { Box } from "@mui/material";

function QuestionPanel(props) {
  const { description, title, difficulty } = props;
  const transformer = {
    1: "EASY",
    2: "MEDIUM",
    3: "HARD",
  };

  return (
    <div className="panel">
      <Box flexDirection={"row"}>
        <h4 style={{ fontSize: "18px", lineHeight: "20px" }}>
          <b>{title}</b>{" "}
          <button disabled>
            {difficulty ? transformer[difficulty] : "EASY"}
          </button>
        </h4>
      </Box>
      <div>{parse(description)}</div>
    </div>
  );
}

export default QuestionPanel;
