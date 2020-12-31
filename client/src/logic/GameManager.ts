import { EventEmitter } from "events"
import ConnectionHandler from "./ConnectionHandler";
import ILightPlayer from "../../../common/ILightPlayer";
import { IMapFile } from "../../../common/IMapFile";

export enum GameState {
    Gameplay,
    Meeting
}

export class GameManager {
    private em = new EventEmitter();
    private connectionHandler: ConnectionHandler;

    players: ILightPlayer[] = [];
    gameConfig: any = {};
    mapInfo: IMapFile = {
        mapImage: '',
        tasks: []
    };

    constructor(connectionHandler: ConnectionHandler) {
        this.connectionHandler = connectionHandler;
        this.initializeSocket()
    }

    protected startGame = (data: {roster: ILightPlayer[], gameConfig: any, mapInfo: IMapFile}) => {
        console.log('Starting game...')
        const { roster, gameConfig, mapInfo } = data;
        this.players = roster;
        this.gameConfig = gameConfig;
        this.mapInfo = mapInfo;
        this.em.emit('startGame');
    }

    protected initializeSocket() {
        this.connectionHandler.io.on('startGame', this.startGame);
    }

    // EVENTS
    /**
     * Called when the game starts.
     * @param listener Event listener
     */
    onGameStart(listener: () => void) {
        this.em.on('startGame', listener);
    }
}