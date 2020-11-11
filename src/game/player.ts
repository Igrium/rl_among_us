import { Socket } from "socket.io";
import { gameServer } from "../gameServer";

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
     * Called when this player completes a task.
     * @param id ID of the task that's been completed.
     */
    completeTask(id: string) {
        if (!(this.isImposter || this.tasks[id])) {
            this.tasks.id = true;
            gameServer.recaculateTaskBar();
            console.log(`${this.name} completed task: ${id}`);
        }
    }
}