import { EmergencyButtonInterface } from "./emergencyButton";
import { FieldComputerInterface } from "./fieldComputerInterface";

export module fieldComputerManifest {

    /**
     * Create a game field computer interface from a class name.
     * @param client Socket connection to game field computer.
     * @param id Game field computer ID.
     * @param className Class name to load.
     */
    export function createFieldComputerInterface(client: SocketIO.Socket, id: string, className?: string): FieldComputerInterface {
        if (className === 'emergencyButton') return new EmergencyButtonInterface(client, id);
        
        return new FieldComputerInterface(client, id);
    }
}