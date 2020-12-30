import { gameServer } from "./gameServer";
import { Player } from "./game/player";

export module waitingRoom {

    /**
     * Send the current list of players to all clients.
     */
    export function updateRoster() {
        const players = Object.keys(gameServer.players);
        players.forEach(name => {
            gameServer.players[name].client.emit('updateRoster', players);
        });
    }
}