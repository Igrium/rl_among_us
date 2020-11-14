/**
 * Interface class for game field computers.
 * May be extended to provide non task-related functionallity.
 */
export class FieldComputerInterface {
    /**
     * Socket connection to game field computer.
     */
    readonly client: SocketIO.Socket
    /**
     * Game field computer ID.
     */
    readonly id: string;

    /**
     * Create a Field Computer Interface.
     * @param client Socket connection to game field computer.
     * @param id Game field computer ID.
     */
    constructor(client: SocketIO.Socket, id: string) {
        this.client = client;
        this.id = id;
    }
}