import { EventEmitter } from "events";
import { gameServer } from "../../gameServer";
import { FieldComputerInterface } from "./fieldComputerInterface";

export class EmergencyButtonInterface extends FieldComputerInterface {

    emergencyCooldownDate: number;
    emergencyCooldown: number = gameServer.gameConfig.emergencyCooldown
    private readonly em = new EventEmitter();

    constructor(client: SocketIO.Socket, id: string) {
        super(client, id);
        client.on('buttonPressed', this.buttonPressed)

        // Called when a meeting is over
        gameServer.onEndMeeting(() => {
            this.emergencyCooldownDate = Date.now() + this.emergencyCooldown * 1000;
            client.emit('setCooldown', this.emergencyCooldown);
        })

        this.buttonPressed.bind(this);
        this.emergencyCooldownDate = Date.now();
    }
    
    private buttonPressed = () => {
        if (gameServer.isInGame()) {
            if (Date.now() > this.emergencyCooldownDate && gameServer.activeSabotages.length === 0) {
                gameServer.beginMeeting(true);
            }
            this.em.emit('buttonPressed');

        } else {
            gameServer.startGame();
        }
    }

    /**
     * Called when the emergency button is pressed, regardless if there is a sabotage.
     * Only called if currently in game.
     * @param listener Event listener
     */
    public onButtonPressed(listener: () => void) {
        this.em.on('buttonPressed', listener);
    }
    
}