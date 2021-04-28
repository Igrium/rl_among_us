import { EventEmitter } from "events";
import ILightSabotage from "../../../common/ILightSabotage";
import { ISabotage } from "../../../common/IMapFile";
import { gameUtils } from "../gameUtils";

/**
 * Base server-side implementation of a sabotage. Contains only the bare minimum code and must be inherited from.
 * 
 * Even though a sabotage and a task are rendered similarly on the client, they are implemented very differently on the server.
 * With tasks, the server essentially hand-holds the client through the entire process,
 * but follows the client's lead when it comes to events like when to complete the task. As sabotages are not instanced per-player,
 * the server has the sole authority on these events. It is up to the subclass to decide how to communicate with clients and trigger these events.
 */
export abstract class BaseSabotage {
    /** The ID of the sabotage on the map. */
    public readonly id: string

    /** The sabotage's definition in the map file. */
    public readonly definition: ISabotage;

    private emitter = new EventEmitter();

    constructor(definition: ISabotage) {
        this.id = definition.id;
        this.definition = definition;
    }

    /**
     * Called to begin the sabotage
     */
    beginSabatoge() {
        this.emitter.emit('begin');
        gameUtils.announce('sabotage', this.getLightSabotage());
        console.log(`Starting sabotage: ${this.id}`);
    }

    endSabotage() {
        gameUtils.announce('endSabotage', this.id);
        this.emitter.emit('end');
        console.log(`Sabotage complete!`);
    }

    onBegin(listener: () => void) {
        this.emitter.on('begin', listener);
    }

    onEnd(listenner: () => void) {
        this.emitter.on('end', listenner);
    }

    /** Whether this sabotage should set off the alarm. */
    abstract isCritical(): boolean;

    /**
     * Get an ILightSabotage representation of this sabotage.
     */
    getLightSabotage(): ILightSabotage {
        return {
            id: this.id,
            fixLocations: this.definition.fixLocations,
            isCritical: this.isCritical()
        }
    }
}