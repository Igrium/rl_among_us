import e from "express";
import { Socket } from "socket.io";
import { gameServer } from "../gameServer";
import { waitingRoom } from "../waitingRoom";
import { BaseTask } from "./tasks/baseTask";


/**
 * The server representation of a player.
 * While not in a game, functionallity further than reading the name and client may NOT be used.
 */
export class Player {
    /**The username of the player. */
    readonly name: string;

    /**The socket connection this player is connected with. */
    readonly client: SocketIO.Socket;
    
    isImposter: boolean = false;
    isAlive: boolean = true;
    color: string = '#000000'

    currentTask?: BaseTask;
    
    /**
     * This player's task list <Task ID, Is Completed?>
     */
    tasks: Record<string, boolean> = {};

    constructor(name: string, client: SocketIO.Socket) {
        this.name = name;
        this.client = client;
        this.initializeSocket();
    }

    /**
     * Called when the game begins.
     * @param isImposter Whether the player is an imposter.
     * @param tasks The player's tasks for the game.
     */
    startGame(isImposter: boolean, tasks: string[]) {
        this.isImposter = isImposter;
        this.isAlive = true;
        // Setup tasks
        this.tasks = {};
        tasks.forEach((task) => {
            this.tasks[task] = false;
        })
    }

    /**
     * Called when the game ends.
     * @param impostersWin Did the imposters win?
     */
    endGame(impostersWin: boolean) {
        
    }

    /**
     * Called when a player is killed.
     * Should not notify the client directly. That is done in a mass roster update.
     * @param ejected Was the player ejected in a meeting?
     */
    kill(ejected: boolean) {
        this.isAlive = false;
    }

    /**
     * Called when this player completes their current task.
     * @param verified Whether the task was verified complete.
     */
    completeTask(verified: boolean) {
        if (!this.currentTask) return;
        const id = this.currentTask.id;

        if (verified && !(this.isImposter || this.tasks[id])) {
            console.log(`${this.name} completed task: ${id}`);
            this.tasks[id] = true;
            gameServer.recaculateTaskBar();
            this.updateTasks();
        }
        this.currentTask = undefined;
    }

    /**
     * Count the number of tasks that this player has completed.
     */
    countTasks(): number {
        let completed = 0;
        Object.keys(this.tasks).forEach((key) => {
            if (this.tasks[key]) {
                completed++;
            }
        })
        return completed;
    }

    /**
     * Called when the client requests to start a task.
     * @param id Task that's been requested.
     */
    beginTask(id: string) {
        if (this.currentTask === undefined && gameServer.tasks[id]) {
            let task = gameServer.tasks[id];
            this.currentTask = task;
            task.beginTask(this);
        }
    }

    /**
     * Send the current version of the task list to the client.
     */
    updateTasks() {
        this.client.emit('updateTasks', this.tasks);
    }

    setColor(color: string) {
        if (!gameServer.isInGame()) {
            this.color = color;
            waitingRoom.updateRoster();
        }
    }

    /**
     * Finish performing a sabotage fix.
     * @param id Sabotage fix ID.
     */
    sabotageFix(id: string) {
        const activeSabotages = gameServer.activeSabotages;
        for (let sabotageID of activeSabotages) {
            const sabotage = gameServer.sabotages[sabotageID]
            // Find sabotage that has sabotage fix.
            if (sabotage.definition.fixLocations.find(sabotageFix => sabotageFix.id === id) !== undefined) {
                sabotage.sabotageFix(id);
            }
        }
    }
    
    /**
     * Initialize the player's socket connection.
     */
    protected initializeSocket() {
        // Called when the client wants to do a task.
        
        this.client.on('requestTask', (id) => {
            if (gameServer.isInGame()) {
                console.log(`${this.name} requested task: ${id}.`)

                if (gameServer.tasks[id]) this.beginTask(id);
                // Sabotage fix
                else {
                    gameServer.activeSabotages.forEach((sabotageID) => {
                        const sabotage = gameServer.sabotages[sabotageID];
                        if (sabotage.definition.fixLocations.find(sabotageFix => sabotageFix.id === id) !== undefined) {
                            this.client.emit('doSabotageFix', id);
                        }
                    })
                }
            }
        }) 
        
        

        this.client.on('setColor', (color: string) => {
            if (!gameServer.isInGame()) {
                console.log(`Set ${this.name}'s color to ${color}.`);
                this.setColor(color);
            }
        })

        this.client.on('startGame', () => {
            if (!gameServer.isInGame()) {
                gameServer.startGame();
            }
        })

        this.client.on('reportBody', () => {
            if (gameServer.isInGame()) {
                gameServer.beginMeeting(false);
            }
        })

        this.client.on('callSabotage', (id: string) => {
            if (gameServer.isInGame() && this.isImposter) {
                gameServer.sabotage(id);
            }
        })

        this.client.on('sabotageFix', (id: string) => {
            if (gameServer.isInGame() && gameServer.activeSabotages.length > 0) {
                this.sabotageFix(id);
            }
        })
    }
}