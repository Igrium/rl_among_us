import React, { Component } from "react";
import socketIOClient from 'socket.io-client';
import { stringify } from "querystring";

const URL = `http://localhost:5000`
class ClientTestComponent extends Component {


    render() {
        console.log(`Connecting to ${URL}...`)
        var connectionInfo = {connectionType: "player", name: "Igrium"};
        const io = socketIOClient.io(URL, {transports: ['websocket'], query: `connectionInfo=${JSON.stringify(connectionInfo)}`});
        return <h1>Check console for client test output.</h1>
    }
}

export default ClientTestComponent