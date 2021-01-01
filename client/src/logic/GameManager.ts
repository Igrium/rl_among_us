import { EventEmitter } from "events"
import ConnectionHandler from "./ConnectionHandler";
import ILightPlayer from "../../../common/ILightPlayer";
import { IMapFile, ITask } from "../../../common/IMapFile";

export enum GameState {
    Gameplay,
    Meeting
}

export class GameManager {
    private em = new EventEmitter();
    private connectionHandler: ConnectionHandler;

    players: ILightPlayer[] = [];
    gameConfig: any = {};
    mapInfo: IMapFile = {
        mapImage: '',
        tasks: []
    };

    /**
     * All of this player's tasks
     * {taskID, isDone?}
     */
    tasks: Record<string, boolean> = {};

    constructor(connectionHandler: ConnectionHandler) {
        this.connectionHandler = connectionHandler;
        this.initializeSocket()
    }

    getTask(taskID: string) {
        return this.mapInfo.tasks.find(task => task.id === taskID);
    }

    getTaskSafe(taskID: string): ITask {
        const task = this.getTask(taskID);
        if (task === undefined) throw `No task of ID ${taskID}`;
        return task;
    }

    /**
     * Request that the server assign the client a task.
     * @param taskID Task ID
     */
    requestTask(taskID: string) {
        console.log(`Requesting task ${taskID}...`);
        this.connectionHandler.io.emit('requestTask', taskID);
    }

    /**
     * Tell the server that a task is finished.
     * @param taskID Task ID?
     * @param aborted Was the task aborted?
     */
    finishTask(taskID: string, aborted: boolean) {
        this.connectionHandler.io.emit('taskFinished', {'aborted': aborted});

        // TEMPORARY: remove once QR-code scanning is implemented.
        if (!aborted) {
            setTimeout(() => {this.completeTask(false)}, 1000);
        }
    }

    /**
     * Let the server know that a task has been confirmed complete, or QR-code verified.
     * @param canceled Whether QR-code verification failed.
     */
    completeTask(canceled: boolean) {
        this.connectionHandler.io.emit('taskComplete', {'canceled': canceled})
    }

    protected startGame = (data: {roster: ILightPlayer[], gameConfig: any, mapInfo: IMapFile}) => {
        console.log('Starting game...')
        const { roster, gameConfig, mapInfo } = data;
        this.players = roster;
        this.gameConfig = gameConfig;
        this.mapInfo = mapInfo;
        this.em.emit('startGame');
    }

    protected doTask = (id: string) => {
        // locate task
        const task = this.getTask(id);
        if (task === undefined) {
            console.error(`The server has requested client to do task ${id}, but it is not in the map file.`);
            return;
        }
        this.em.emit('doTask', task)
    }

    protected updateTasks = (tasks: Record<string, boolean>) => {
        this.tasks = tasks;
        this.em.emit('updateTasks', this.tasks);
    }

    protected initializeSocket() {
        this.connectionHandler.io.on('startGame', this.startGame);
        this.connectionHandler.io.on('updateTasks', this.updateTasks);
        this.connectionHandler.io.on('doTask', this.doTask);
    }

    // EVENTS
    /**
     * Called when the game starts.
     * @param listener Event listener.
     */
    onGameStart(listener: () => void) {
        this.em.on('startGame', listener);
    }

    /**
     * Called when the client is to do a task.
     * @param listener Event listener.
     */
    onDoTask(listener: (task: ITask) => void) {
        this.em.on('doTask', listener);
    }

    /**
     * Called when the client receives an update to it's task list from the server.
     * @param listener Event listener. (key: taskID, value: isDone)
     */
    onUpdateTasks(listener: (tasks: Record<string, boolean>) => void) {
        this.em.on('updateTasks', listener);
    }
}