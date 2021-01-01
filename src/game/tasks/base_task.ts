import { Player } from "../player";

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

        // Callback is called once client confirms it has started the task.
        player.client.emit('doTask', this.id, (data: {started: boolean}) => {
            if (data.started) {
                this.doTask(player);
            }
        });

        player.client.once('taskFinished', (data: {aborted: boolean}) => {
            console.log(`${player.name} finished task "${this.id}"`);
            this.onTaskFinished(player, data.aborted);
            if (!data.aborted) {
                if (!this.requireConfirmationScan) {
                    this.onTaskComplete(player, true);
                } else {
                    // Listen for verification scan.
                    player.client.once('taskComplete', (data: {canceled: boolean}) => {
                        this.onTaskComplete(player, !data.canceled);
                    })
                }
            }      
        })
    }

    /**
     * Called when a player begins to perform the task.
     * 
     * This function is only called once the client has confirmed that it has started the task,
     * meaning that you can expect to be able to communicate with the task's client counterpart.
     * @param player Player who's performing the task.
     */
    abstract doTask(player: Player): void;

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