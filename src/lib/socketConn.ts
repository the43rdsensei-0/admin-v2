import {connect} from "socket.io-client";

export default connect(process.env.REACT_APP_SOCKET_URL!, {
    withCredentials:true,
    timeout:20000,
});