import { Socket } from "socket.io";
import { IConnectionInfo } from "./io/connectionInfo";
import { Player } from "./game/player";
import { IPlayerConnectionInfo } from "./io/playerConnectionInfo";
import { app } from "./app";
import { allowedNodeEnvironmentFlags } from "process";
import { constants } from "./constants";


export module gameServer {
    /**All the players connected to the server. <Name, Player> */
    export const players: Record<string, Player> = {};

    /**
     * Called when a player connects to the server.
     * @param client Player's socket connection.
     * @param connectionInfo Player's connection info.
     * @return New player object.
     */
    export function connectPlayer(client: SocketIO.Socket, connectionInfo: IPlayerConnectionInfo): Player | null {
        let name = connectionInfo.name;
        if (name in players) {
            app.disconnect(client, constants.disconnectReasons.NAME_EXISTS);
            return null;
        }
        let player: Player = new Player(name, client);
        players[name] = player;

        console.log(`Player connected: ${name}`);
        return player;
    }

}

