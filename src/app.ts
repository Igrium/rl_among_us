import * as socketio from 'socket.io';import { type } from 'os';
import { constants } from './constants';
import { connect } from 'http2';
import { IConnectionInfo } from './io/connectionInfo';
import { gameServer } from './gameServer';
import { IPlayerConnectionInfo } from './io/playerConnectionInfo';
''
const disconnectReasons = constants.disconnectReasons
const port = 5000;
const io: SocketIO.Server = require('socket.io')(port)

io.on('connect', (socket: SocketIO.Socket) => {
    let connectinonInfo = JSON.parse(socket.handshake.headers['connectionInfo']);
    if (typeof connectinonInfo === 'undefined' || connectinonInfo == null) {
        return app.disconnect(socket, disconnectReasons.ILLEGAL_ARGS);
    }
    
    if (typeof connectinonInfo['connectionType'] === 'string') {
        let connectionType: String = connectinonInfo['connectionType'];

        if (connectionType === 'player') {
            if (typeof connectinonInfo.name === 'string') {
                return gameServer.connectPlayer(socket, connectinonInfo as IPlayerConnectionInfo);
            }
        } else if (connectionType === 'gameField') {
            // Connect as game field computer.
        } else {
            return app.disconnect(socket, disconnectReasons.ILLEGAL_ARGS);
        }
    }
    return app.disconnect(socket, disconnectReasons.ILLEGAL_ARGS);
})

export module app {
    export function disconnect(socket: SocketIO.Socket, reason: String) {
        socket.send('disconnect', {reason: reason});
        socket.disconnect();
    }
}
