import { Socket } from "socket.io";
import { IConnectionInfo } from "./io/connectionInfo";
import { Player } from "./game/player";
import { IPlayerConnectionInfo } from "./io/playerConnectionInfo";
import { app } from "./app";
import { allowedNodeEnvironmentFlags, mainModule } from "process";
import { constants } from "./constants";
import { BaseTask } from "./game/tasks/baseTask";
import { gameUtils } from "./game/gameUtils";
import { taskManifest } from "./game/tasks/taskManifest";
import { FieldComputerInterface } from "./game/gameField/fieldComputerInterface";
import { waitingRoom } from "./waitingRoom";
import ILightPlayer from "../common/ILightPlayer";
import { Meeting } from "./game/meeting";

const config = require('config');


export module gameServer {

    /** All the players connected to the server. <Name, Player> */
    export const players: Record<string, Player> = {};

    /** All the field computers connected to the server. <Name, Field Computer Interface> */
    export const fieldComputers: Record<string, FieldComputerInterface> = {};
    
    export const gameConfig = config.get('game');
    export const mapFile = gameUtils.loadMapFile(gameConfig.map);
    /** A library of all the tasks in the map. <ID, Task object> */
    export const tasks: Record<string, BaseTask> = taskManifest.loadTasks(mapFile.tasks);
    
    /** The object for the current meeting; undefined if we're not in a meeting. */
    export let currentMeeting: Meeting | undefined;

    let inGame: boolean = false;

    /**
     * A value from 0-1 denoting the percent of the tasks which have been completed.
     */
    let taskBar: number = 0;

    // Listeners
    const startGameListeners: Array<() => void> = [];
    const updateTaskBarListeners: Array<(taskBar: number) => void> = [];


    /**
     * Called to start the game.
     */
    export function startGame() {
        if (inGame) {
            return;
        }
        console.log('Starting game...');
        inGame = true;
        taskBar = 0;
                
        // Choose imposter.
        let imposters = gameUtils.chooseImposters(Object.keys(players));

        // Generate roster object.
        let roster: Record<string, ILightPlayer> = {};
        for (let key in players) {
            let player = players[key];
            roster[player.name] = {
                name: player.name,
                color: player.color,
                isImposter: imposters.includes(player.name),
                isAlive: true
            }        
        }

        // Initialize players and tell clients to start.
        for (let key in players) {
            let player = players[key];
            let tasks = gameUtils.assignTasks(mapFile.tasks, 5);
            player.startGame(roster[player.name].isImposter, tasks); // TODO: choose tasks.
            player.client.emit('startGame', {
                roster: Object.values(roster),
                gameConfig: gameConfig,
                mapInfo: mapFile
            }) // TODO: implement gameInfo and mapInfo.
            player.updateTasks();
        }
        updateTaskBar();

        // TODO Implement other game start code.
        
        startGameListeners.forEach((listener) => listener());
    }

    /**
     * Called when the game ends.
     * @param impostersWin Did the imposters win?
     */
    export function endGame(impostersWin: boolean) {
        for (let key in players) {
            let player = players[key];
            player.endGame(impostersWin);
            player.client.emit('endGame', {impostersWin: impostersWin});
        }
        
    }

    /**
     * Called when a player connects to the server.
     * @param client Player's socket connection.
     * @param connectionInfo Player's connection info.
     * @return New player object.
     */
    export function connectPlayer(client: SocketIO.Socket, connectionInfo: IPlayerConnectionInfo): Player | null {
        let name = connectionInfo.name;
        if (name in players || name in constants.bannedNames) {
            app.disconnect(client, constants.disconnectReasons.NAME_EXISTS);
            return null;
        }
        let player: Player = new Player(name, client);
        players[name] = player;
        console.log(`Player connected: ${name}`);

        waitingRoom.updateRoster();
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
        // The task bar should be the number of tasks players have done devided by the total number of tasks.
        let oldValue = taskBar;
        let num = 0;
        let denom = 0;

        for (let key in players) {
            let player = players[key];
            if (!player.isImposter) {
                num += player.countTasks();
                denom += Object.keys(player.tasks).length;
            }
        }
        taskBar = num / denom;
        
        console.log(`Task completion is now at ${taskBar * 100}%`)

        if (oldValue != taskBar) {
            updateTaskBar();
        }
    }

    /**
     * Update the task bar on the clients.
     */
    function updateTaskBar() {
        for (let key in players) {
            let player = players[key];
            player.client.emit('updateTaskBar', taskBar);
        }

        updateTaskBarListeners.forEach((listener) => listener(taskBar));
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
    
    /**
     * Register a listener for the update task bar event.
     * 
     * This event fires at the beginning of the game, when a client completes a task,
     * and when updateTaskBar() is called.
     * @param listener Listener function.
     */
    export function onUpdateTaskBar(listener: (taskBar: number) => void): void {
        updateTaskBarListeners.push(listener);
    }

    /**
     * Call a meeting.
     * @param emergency True if this meeting comes from the emergency button.
     */
    export function beginMeeting(emergency: boolean) {
        if (currentMeeting === undefined) {
            currentMeeting = new Meeting();
            currentMeeting.call(emergency);
            currentMeeting.onEndMeeting(() => {
                currentMeeting = undefined;
            })
        }
    }

    /**
     * Kill a player.
     * @param playerName Player to kill.
     * @param ejected If this player was ejected in a meeting. 
     * If false, assumed to be killed by imposter.
     */
    export function killPlayer(playerName: string, ejected: boolean) {
        let player = players[playerName];
        if (player.isAlive) {
            player.isAlive = false;

            gameUtils.announce('updateGameRoster', Object.values(gameUtils.generateLightRoster(players)));
        }
    }
}

