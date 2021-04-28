import { EventEmitter } from "events";
import ILightSabotage from "../../../../common/ILightSabotage";
import ConnectionHandler from "../ConnectionHandler";
import { GameManager } from "../GameManager";

/**
 * Manages sabotages on the client.
 * 
 * Although the sabotage list *is* provided in the map file, the client doesn't
 * know how to read it without the sabotage class. Therefore, the server provides
 * all the info the client needs on the sabotage in `ILightSabotage`.
 */
export class SabatogeManager {
    private gm: GameManager;
    private cm: ConnectionHandler;

    protected readonly em: EventEmitter = new EventEmitter;

    /**
     * All the currently active sabotages. DO NOT EDIT MANUALLY.
     */
    public readonly activeSabotages: Record<string, ILightSabotage> = {};


    constructor(gm: GameManager, cm: ConnectionHandler) {
        this.gm = gm;
        this.cm = cm;

        this.initializeSocket();
    }

    protected initializeSocket() {
        const io = this.cm.io;

        io.on('sabotage', this.sabotage);
        io.on('endSabotage', this.endSabotage);
    }

    private sabotage = (sabotage: ILightSabotage) => {
        const id = sabotage.id;
        if (id in this.activeSabotages) {
            console.warn(`Sabotage ${id} is already active!`);
            return;
        }

        console.log(`Starting sabotage ${id}`);
        this.activeSabotages[id] = sabotage;
        this.em.emit('sabotage', sabotage);
    }

    private endSabotage = (id: string) => {
        if (id in this.activeSabotages) {
            console.log(`Ending sabotage ${id}`);
            const sabotage = this.activeSabotages[id];

            delete this.activeSabotages[id];
            this.em.emit('endSabotage', sabotage);
        } else {
            console.warn(`Sabotage ${id} is not currently active!`)
        }
    }

    /**
     * Called when a sabotage begins.
     * @param listener Event listener.
     */
    public onSabotage(listener: (sabotage: ILightSabotage) => void) {
        this.em.on('sabotage', listener);
    }

    /**
     * Called when a sabotage ends.
     * @param listener Event listener.
     */
    public onEndSabotage(listener: (sabotage: ILightSabotage) => void) {
        this.em.on('endSabotage', listener);
    }
}