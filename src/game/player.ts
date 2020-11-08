import { Socket } from "socket.io";

export class Player {
    /**The username of the player. */
    readonly name: string;

    /**The socket connection this player is connected with. */
    readonly client: SocketIO.Socket;
    
    isImposter: boolean = false;
    isAlive: boolean = true;

    constructor(name: string, client: SocketIO.Socket) {
        this.name = name;
        this.client = client;
    }

    /**
     * Called when the game begins.
     * @param isImposter Whether the player is an imposter.
     */
    startGame(isImposter: boolean) {
        this.isImposter = isImposter,
        this.isAlive = true;
    }
}