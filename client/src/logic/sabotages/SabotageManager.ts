import ConnectionHandler from "../ConnectionHandler";
import { GameManager } from "../GameManager";
import { Sabotage } from "./Sabotage";
import { sabotageManifest } from "./sabotageManifest";

export class SabatogeManager {
    private gm: GameManager;
    private cm: ConnectionHandler;

    /**
     * All the currently active sabotages. DO NOT EDIT MANUALLY.
     */
    public readonly activeSabotages: string[] = [];

    public readonly sabotages: Record<string, Sabotage>;

    constructor(gm: GameManager, cm: ConnectionHandler) {
        this.gm = gm;
        this.cm = cm;
        this.sabotages = sabotageManifest.loadSabotages(gm.mapInfo.sabotages);

        this.sabatoge.bind(this);
        this.endSabotage.bind(this);
    }

    protected initializeSocket() {
        const io = this.cm.io;

        io.on('sabotage', this.sabatoge);
        io.on('sabotage', this.endSabotage);
    }

    private sabatoge(id: string) {
        
    }

    private endSabotage(id: string) {

    }
}