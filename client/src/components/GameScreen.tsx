import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import Gameplay from './gameplay/Gameplay'
import { GameManager } from '../logic/GameManager'
import TaskWindow from './gameplay/TaskWindow'
import { ISabotageFix, ITask } from '../../../common/IMapFile'
import QRCodeScanner from './util/QRCodeScanner'

import 'reactjs-popup/dist/index.css'
import Meeting from './gameplay/meeting/Meeting'
import { SabotageFixWindow } from './gameplay/SabotageFixWindow'
import SabotageFix from './gameplay/sabotageFixes/SabotageFix'

interface IProps {
    gameManager: GameManager;
    onGameFinished?: (impostersWin: boolean) => void;
};
interface IState {
    gameState: GameState,
    taskID: string,
    scannerOpen: boolean,
    scannerMode: ScannerMode,
    sabotageFixID: string
};

export enum GameState {
    GAMEPLAY,
    MEETING,
    TASK,
    SABOTAGE_FIX
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
            scannerMode: ScannerMode.SCAN_TASK,
            sabotageFixID: ''
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

    private handleDoSabotageFix = (id: string) => {
        this.setState({ gameState: GameState.SABOTAGE_FIX, sabotageFixID: id });
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

    private handleReportBody = () => {
        this.props.gameManager.meetingManager.reportBody();
    }

    private handleBeginMeeting = () => {
        if (this.state.gameState === GameState.TASK) {
            this.handleTaskFinish(true);
        }
        this.setState({ gameState: GameState.MEETING });
    }

    private handleResumePlay = () => {
        this.setState({ gameState: GameState.GAMEPLAY });
    }

    private handleGameEnd = (impostersWin: boolean) => {
        if (this.props.onGameFinished) {
            this.props.onGameFinished(impostersWin);
        }
    }
    

    private initListeners() {
        const gameManager = this.props.gameManager;
        gameManager.onDoTask(this.handleBeginTask);
        gameManager.meetingManager.onMeetingCalled(this.handleBeginMeeting);
        gameManager.meetingManager.onResumePlay(this.handleResumePlay);
        gameManager.sabotageManager.onDoSabotageFix(this.handleDoSabotageFix);
        gameManager.onEndGame(this.handleGameEnd);
    }

    private getTaskWindow() {
        const { taskID } = this.state;
        const gameManager = this.props.gameManager;
        const taskWindow = <TaskWindow gameManager={gameManager} task={gameManager.getTaskSafe(taskID)} onFinish={this.handleTaskFinish} />
        return <Popup modal defaultOpen closeOnDocumentClick={false} closeOnEscape={false} contentStyle={{width: 'max-content'}}>{taskWindow}</Popup>;
    }

    private getSabotageFixWindow() {
        const { sabotageFixID } = this.state;
        const { gameManager } = this.props;
        const sabotageFixWindow = <SabotageFixWindow gameManager={gameManager} sabotageFix={gameManager.sabotageManager.getSabotageFixSafe(sabotageFixID)} onFinish={() => {
            this.setState({ gameState: GameState.GAMEPLAY });
        }} />

        return <Popup modal defaultOpen closeOnDocumentClick={false} closeOnEscape={false} contentStyle={{width: 'max-content'}}>{sabotageFixWindow}</Popup>
    }

    private getScanWindow() {
        function getScanDisplayText(mode: ScannerMode) {
            if (mode === ScannerMode.SCAN_TASK) return "Please scan task QR code."
            else if (mode === ScannerMode.VERIFY_TASK) return "Please re-scan task QR code."
        }

        return (
            <Popup modal defaultOpen closeOnDocumentClick={false} closeOnEscape={false}>
                <QRCodeScanner onScan={this.handleScan} displayText={getScanDisplayText(this.state.scannerMode)} />
            </Popup>
        )
    }

    private getMeetingWindow() {
        const meetingWindow = <Meeting gameManager={this.props.gameManager} />;
        return <Popup modal defaultOpen closeOnDocumentClick={false} closeOnEscape={false} contentStyle={{width: 'max-content'}}>{meetingWindow}</Popup>
    }

    render() {
        const { gameState, taskID, scannerOpen } = this.state;
        const gameManager = this.props.gameManager;
        return (
            <div>
                <Gameplay gameManager={this.props.gameManager} onRequestTask={this.handleRequestTask} onReportBody={this.handleReportBody}/>
                {/* Render tasks */}
                {gameState === GameState.TASK ? this.getTaskWindow() : null}
                {gameState === GameState.MEETING ? this.getMeetingWindow() : null}
                {gameState === GameState.SABOTAGE_FIX ? this.getSabotageFixWindow() : null}
                {scannerOpen ? this.getScanWindow() : null}
            </div>
        )
    }
}

export default GameScreen
