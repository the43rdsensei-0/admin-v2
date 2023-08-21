import { connect } from "socket.io-client";

export default connect("http://localhost:3100/api/v1", {
  withCredentials: true,
  timeout: 20000,
  transports: ["websocket"],
});
