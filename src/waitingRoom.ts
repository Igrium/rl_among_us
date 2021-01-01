import { gameServer } from "./gameServer";
import { Player } from "./game/player";

export module waitingRoom {

    /**
     * Send the current list of players to all clients.
     */
    export function updateRoster() {
        const players = Object.keys(gameServer.players).map((name) => {
            return {name: name, color: gameServer.players[name].color}
        });
        players.forEach(player => {
            gameServer.players[player.name].client.emit('updateRoster', players);
        });
    }
}