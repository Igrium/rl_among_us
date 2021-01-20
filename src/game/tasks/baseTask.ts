import { Player } from "../player";
import { EventEmitter } from "events"


/**
 * The server implementation of a task. Each instance of a task type is to be it's own object.
 */
export abstract class BaseTask {
    /** The ID of this task on the map. */
    readonly id: string;

    /** Whether we require the player to scan the QR code once more when complete. */
    readonly requireConfirmationScan: boolean;

    /** Additional parameters supplied to the task in map.json. */
    readonly params: any;


    /**
     * Construct a task object.
     * @param id The ID of this task on the map.
     * @param requireConfirmationScan Whether we require the player to scan the QR code once more when complete.
     * @param params Additional parameters supplied to the task in map.json.
     */
    constructor(id: string, requireConfirmationScan: boolean, params: any) {
        this.id = id;
        this.requireConfirmationScan = requireConfirmationScan;
        this.params = params;
    }

    /**
     * Get the unique ID of this task type.
     * Used to synchronize task type between the server and client, as well as identify the task type in map.json.
     */
    abstract getClassID(): string;

    /**
     * Called when a player requests to start the task.
     * 
     * This is called BEFORE the client is sent information about the task.
     * Only use to setup animations.
     * @param player Player who's performing the task.
     */
    beginTask(player: Player): void {
        // This context is valid throughout the entire time a player is doing a task.
        let taskInstance = new TaskInstanceObject(player);
        
        // Callback is called once client confirms it has started the task.
        player.client.emit('doTask', this.id, (data: {started: boolean}) => {      
            if (data.started) {
                // Only register taskFinished once the client has confirmed the task is started to prevent memory leak.
                player.client.once('taskFinished', (data: {aborted: boolean}) => {
                    // Task completion code
                    console.log(`${player.name} finished task "${this.id}"`);
                    taskInstance.emitter.emit('taskFinished', data.aborted)
                    this.onTaskFinished(player, data.aborted);
                    if (!data.aborted) {
                        if (!this.requireConfirmationScan) {
                            taskInstance.emitter.emit('taskComplete', true)
                            this.onTaskComplete(player, true);
                        } else {
                            // Listen for verification scan.
                            player.client.once('taskComplete', (data: {canceled: boolean}) => {
                                taskInstance.emitter.emit('taskComplete', !data.canceled)
                                this.onTaskComplete(player, !data.canceled);
                            })
                        }
                    } else {
                        this.onTaskComplete(player, false);
                    }
                })

                this.doTask(player, taskInstance);
            }
        });
    }

    /**
     * Called when a player begins to perform the task.
     * 
     * This function is only called once the client has confirmed that it has started the task,
     * meaning that you can expect to be able to communicate with the task's client counterpart.
     * @param player Player who's performing the task.
     * @param taskInstance The task instance object we're using.
     */
    abstract doTask(player: Player, taskInstance: TaskInstanceObject): void;

    /**
     * Called when a player finishes a task but hasn't QR-Code verified yet.
     * @param player Player who aborted the task.
     * @param aborted If the player aborted the task.
     */
    onTaskFinished(player: Player, aborted: boolean): void {};

    /**
     * Called when a player completes a task and QR-Code verifies.
     * @param player Player who completed the task.
     * @param verified Whether the task was properly QR-Code verified.
     */
    onTaskComplete(player: Player, verified: boolean): void {
        player.completeTask(verified);
    }

    /**
     * Called when the game begins (or begins again).
     */
    onBeginGame(): void {}
}

/**
 * Represents a single instance of a task running on one client.
 */
export class TaskInstanceObject {
    /**
     * The player executing the task.
     */
    readonly player: Player

    readonly emitter = new EventEmitter();

    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Called when a player finishes a task but hasn't QR-Code verified yet.
     * @param listener Event listener.
     */
    onTaskFinished(listener: (aborted: boolean) => void) {
        this.emitter.on('taskFinished', listener)
    }

    /**
     * Called when a player completes a task and QR-Code verifies.
     * @param listener Event listener.
     */
    onTaskComplete(listener: (verified: boolean) => void) {
        this.emitter.on('taskComplete', listener)
    }

    /**
     * Register an event listener on the client's socket connection that closes when the task is complete.
     * @param event Event name.
     * @param listener Event listener.`
     */
    socketOn(event: string, listener: (...args: any[]) => void) {
        this.player.client.on(event, listener);
        this.onTaskFinished(() => {
            this.player.client.off(event, listener);
        })
    }
    
}