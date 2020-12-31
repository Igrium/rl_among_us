import socketIOClient from 'socket.io-client';
import events from 'events';

export interface IConnectionInfo {
    url: string,
    playerName: string
}

class ConnectionHandler {

    private _connectionInfo: IConnectionInfo = { url: '', playerName: '' };
    private _io: SocketIOClient.Socket

    constructor(connectionInfo: IConnectionInfo, callback?: () => void) {
        this._connectionInfo = connectionInfo;
        const { url, playerName } = connectionInfo;
        const connectionHeader = { connectionType: 'player', name: playerName }
        this._io = socketIOClient(url,
            { transports: ['websocket'], query: `connectionInfo=${JSON.stringify(connectionHeader)}` }
        )
        if (callback != undefined) {
            this.io.on('connect', callback);
        }
    }

    public get connectionInfo(): IConnectionInfo {
        return this._connectionInfo;
    }

    public get io(): SocketIOClient.Socket {
        return this._io;
    }

    // EVENTS
    private emitter = new events.EventEmitter();

    /**
     * Called when the server tells the client that it's going to be disconnected.
     * @param listener Event listener.
     */
    public onDisconnectWarning(listener: (reason: string) => void): void {
        this.emitter.on('disconnectWarning', listener)
    }

    public static activeConnection: ConnectionHandler
}

export default ConnectionHandler;
