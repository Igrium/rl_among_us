import { gameServer } from "../../gameServer";
import { FieldComputerInterface } from "./fieldComputerInterface";

export class EmergencyButtonInterface extends FieldComputerInterface {

    emergencyCooldownDate: number;
    emergencyCooldown: number = gameServer.gameConfig.emergencyCooldown

    constructor(client: SocketIO.Socket, id: string) {
        super(client, id);
        client.on('buttonPressed', this.onButtonPressed)

        // Called when a meeting is over
        gameServer.onEndMeeting(() => {
            this.emergencyCooldownDate = Date.now() + this.emergencyCooldown * 1000;
            client.emit('setCooldown', this.emergencyCooldown);
        })

        this.onButtonPressed.bind(this);
        this.emergencyCooldownDate = Date.now();
    }
    
    onButtonPressed = () => {
        if (gameServer.isInGame()) {
            if (Date.now() > this.emergencyCooldownDate) {
                gameServer.beginMeeting(true);
            }
        } else {
            gameServer.startGame();
        }
    }
}