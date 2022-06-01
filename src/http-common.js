import axios from "axios";

export default axios.create({
  baseURL: "https://72si3r1i43.execute-api.us-east-2.amazonaws.com/test",
  headers: {
    "Content-type": "application/json"
  }
});
