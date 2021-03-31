import * as socketio from 'socket.io';import { type } from 'os';
import { constants } from './constants';
import { connect } from 'http2';
import { IConnectionInfo } from './io/connectionInfo';
import { gameServer } from './gameServer';
import { IPlayerConnectionInfo } from './io/playerConnectionInfo';
import { Server } from 'http';
''
const disconnectReasons = constants.disconnectReasons
const port = 5000;
const express = require('express');
const http = require('http').createServer(express);
const io: SocketIO.Server = require('socket.io')(http);

/**
 * Handles initial client connection to server.
 */
io.on('connect', (socket: SocketIO.Socket) => {
    console.log('Client connecting...');

    if (gameServer.isInGame()) {
        return app.disconnect(socket, constants.disconnectReasons.GAME_IN_SESSION);
    }

    const query = socket.handshake.query;
    const connectionInfoString = query['connectionInfo'];
    if (connectionInfoString == undefined || connectionInfoString == null) {
        return app.disconnect(socket, constants.disconnectReasons.ILLEGAL_ARGS);
    }

    const connectionInfo = JSON.parse(connectionInfoString);
    
    if (typeof connectionInfo['connectionType'] === 'string') {
        let connectionType: String = connectionInfo['connectionType'];

        if (connectionType === 'player') {
            // Connect as player
            if (typeof connectionInfo.name === 'string') {
                return gameServer.connectPlayer(socket, connectionInfo as IPlayerConnectionInfo);
            }
        } else if (connectionType === 'gameField') {
            // Connect as game field computer.
            if (typeof connectionInfo.id === 'string') {
                return gameServer.connectFieldComputer(socket, connectionInfo.id, connectionInfo.interfaceClass);
            }
    }
    return app.disconnect(socket, disconnectReasons.ILLEGAL_ARGS);
}})

http.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

export module app {
    /**
     * Disconnect a client from the server.
     * @param socket Socket connection to disconnect.
     * @param reason Reason for disconnection (found in constants.disconnectReasons)
     */
    export function disconnect(socket: SocketIO.Socket, reason: String) {
        socket.emit('disconnectWarning', {reason: reason});
        console.log(`Client ${socket.id} disconnected for reason: ${reason}`)
        socket.disconnect();
    }
}
