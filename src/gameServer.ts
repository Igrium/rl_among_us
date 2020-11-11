import { Socket } from "socket.io";
import { IConnectionInfo } from "./io/connectionInfo";
import { Player } from "./game/player";
import { IPlayerConnectionInfo } from "./io/playerConnectionInfo";
import { app } from "./app";
import { allowedNodeEnvironmentFlags } from "process";
import { constants } from "./constants";
import { BaseTask } from "./game/tasks/base_task";
import { gameUtils } from "./game/gameUtils";


export module gameServer {
    /** All the players connected to the server. <Name, Player> */
    export const players: Record<string, Player> = {};

    /** All the field computers connected to the server. <Name, Field Computer Interface> */
    export const fieldComputers: Record<string, FieldComputerInterface> = {};
    
    /** A library of all the tasks in the map. <ID, Task object> */
    export const tasks: Record<string, BaseTask> = {};

    let inGame: boolean = false;
    const startGameListeners: Array<() => void> = [];

    /**
     * Called to start the game.
     */
    export function startGame() {
        if (inGame) {
            return;
        }
        console.log('Starting game...');
        inGame = true;
        
        // Choose imposter.
        let imposters = gameUtils.chooseImposters(Object.keys(players));

        for (let key in players) {
            let player = players[key];
            player.startGame(imposters.includes(player.name), []); // TODO: choose tasks.
        }
        // TODO Implement other game start code.
        
        startGameListeners.forEach((listener) => listener());
    }

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

    /**
     * Connect a game field computer.
     * @param socket Socket connection to field computer.
     * @param id Field computer ID.
     * @param interfaceClass The class of the field computer interface to use.
     */
    export function connectFieldComputer(socket: SocketIO.Socket, id: string, interfaceClass?: string): void {
        // TODO: implement use of multiple classes.
        gameServer.fieldComputers[id] = new FieldComputerInterface(socket, id);
        console.log(`Game field computer connected: ${id}`);
    }

    /**
     * Notifies the server that someone has completed a task and the task bar must be recalculated.
     */
    export function recaculateTaskBar(): void {
        // TODO: Implement this
    }
    
    /**
     * Check whether we're currently in a game.
     */
    export function isInGame(): boolean {
        return inGame;
    }

    /**
     * Register a listener for the game start event.
     * @param listener Listener function.
     */
    export function onGameStart(listener: () => void): void {
        startGameListeners.push(listener);
    }

}

