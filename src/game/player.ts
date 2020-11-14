import { Socket } from "socket.io";
import { gameServer } from "../gameServer";

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
    
    /**
     * This player's task list <Task ID, Is Completed?>
     */
    tasks: Record<string, boolean> = {};

    constructor(name: string, client: SocketIO.Socket) {
        this.name = name;
        this.client = client;
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
        for (let task in tasks) {
            this.tasks[task] = false;
        }
    }

    /**
     * Called when the game ends.
     * @param impostersWin Did the imposters win?
     */
    endGame(impostersWin: boolean) {
        
    }

    /**
     * Called when this player completes a task.
     * @param id ID of the task that's been completed.
     */
    completeTask(id: string) {
        if (!(this.isImposter || this.tasks[id])) {
            this.tasks.id = true;
            gameServer.recaculateTaskBar();
            console.log(`${this.name} completed task: ${id}`);
            this.updateTasks();
        }
    }

    /**
     * Count the number of tasks that this player has completed.
     */
    countTasks(): number {
        let completed = 0;
        for (let key in this.tasks) {
            if (this.tasks[key]) {
                completed++;
            }
        }
        return completed;
    }

    /**
     * Called when the client requests to start a task.
     * @param id Task that's been requested.
     */
    requestTask(id: string) {
        if (gameServer.tasks[id]) {
            let task = gameServer.tasks[id];
            task.beginTask(this);
        }
    }

    /**
     * Send the current version of the task list to the client.
     */
    updateTasks() {
        this.client.emit('updateTasks', this.tasks);
    }

    
    /**
     * Initialize the player's socket connection.
     */
    protected initializeSocket() {
        // Called when the client wants to do a task.
        this.client.on('requestTask', (id) => {
            let task = gameServer.tasks[id];
            task.beginTask(this);
        }) 
    }


}