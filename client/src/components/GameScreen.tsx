import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import Gameplay from './gameplay/Gameplay'
import { GameManager } from '../logic/GameManager'
import TaskWindow from './gameplay/TaskWindow'
import { ITask } from '../../../common/IMapFile'
import QRCodeScanner from './util/QRCodeScanner'

import 'reactjs-popup/dist/index.css'

interface IProps {
    gameManager: GameManager;
};
interface IState {
    gameState: GameState,
    taskID: string,
    scannerOpen: boolean,
    scannerMode: ScannerMode
};

export enum GameState {
    GAMEPLAY,
    MEETING,
    TASK
}

enum ScannerMode {
    SCAN_TASK,
    VERIFY_TASK
}

class GameScreen extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    
        this.state = {
            gameState: GameState.GAMEPLAY,
            taskID: '',
            scannerOpen: false,
            scannerMode: ScannerMode.SCAN_TASK
        }
    }

    componentDidMount() {
        this.initListeners();
    }

    private handleBeginTask = (task: ITask) => {
        this.setState({ gameState: GameState.TASK, taskID: task.id });
    }

    private handleTaskFinish = (aborted: boolean) => {
        const task = this.props.gameManager.getTaskSafe(this.state.taskID);

        this.setState({ gameState: GameState.GAMEPLAY });
        this.props.gameManager.finishTask(this.state.taskID, aborted);

        if (!aborted && task.requireConfirmationScan) {
            this.setState({ scannerMode: ScannerMode.VERIFY_TASK, scannerOpen: true })
        }
    }

    private handleScan = (value?: string) => {
        if (this.state.scannerMode === ScannerMode.VERIFY_TASK) {
            this.props.gameManager.completeTask(!(value === this.state.taskID));
            this.setState({ scannerMode: ScannerMode.SCAN_TASK });
        } else if (this.state.scannerMode === ScannerMode.SCAN_TASK) {
            if (value) this.props.gameManager.requestTask(value);
        }

        this.setState({ scannerOpen: false });

    }
    
    private handleRequestTask = () => {
        this.setState({ scannerMode: ScannerMode.SCAN_TASK, scannerOpen: true });
    }

    private initListeners() {
        const gameManager = this.props.gameManager;
        gameManager.onDoTask(this.handleBeginTask);
    }

    private getTaskWindow() {
        const { taskID } = this.state;
        const gameManager = this.props.gameManager;
        const taskWindow = <TaskWindow gameManager={gameManager} task={gameManager.getTaskSafe(taskID)} onFinish={this.handleTaskFinish} />
        return <Popup modal defaultOpen closeOnDocumentClick={false} closeOnEscape={false}>{taskWindow}</Popup>;
    }

    private getScanWindow() {
        function getScanDisplayText(mode: ScannerMode) {
            if (mode === ScannerMode.SCAN_TASK) return "Please scan task QR code."
            else if (mode === ScannerMode.VERIFY_TASK) return "Please re-scan task QR code."
        }

        return <QRCodeScanner onScan={this.handleScan} displayText={getScanDisplayText(this.state.scannerMode)} />
    }

    render() {
        const { gameState, taskID, scannerOpen } = this.state;
        const gameManager = this.props.gameManager;
        return (
            <div>
                <Gameplay gameManager={this.props.gameManager} onRequestTask={this.handleRequestTask}/>
                {/* Render tasks */}
                {gameState === GameState.TASK ? this.getTaskWindow() : null}
                {scannerOpen ? this.getScanWindow() : null}
            </div>
        )
    }
}

export default GameScreen
