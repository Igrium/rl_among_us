import React, { Component } from 'react'
import Gameplay from './gameplay/Gameplay'
import { GameManager } from '../logic/GameManager'
import TaskWindow from './gameplay/TaskWindow'
import { ITask } from '../../../common/IMapFile'

interface IProps {
    gameManager: GameManager;
};
interface IState {
    gameState: GameState,
    taskID: string
};

export enum GameState {
    GAMEPLAY,
    MEETING,
    TASK
}

class GameScreen extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    
        this.state = {
            gameState: GameState.GAMEPLAY,
            taskID: 'basic'
        }
    }

    componentDidMount() {
        this.initListeners();
    }

    private handleBeginTask = (task: ITask) => {
        this.setState({ gameState: GameState.TASK, taskID: task.id });
    }

    private handleTaskFinish = (aborted: boolean) => {
        this.setState({ gameState: GameState.GAMEPLAY });
        this.props.gameManager.finishTask(this.state.taskID, aborted);
    }

    private initListeners() {
        const gameManager = this.props.gameManager;
        gameManager.onDoTask(this.handleBeginTask);
    }

    render() {
        const { gameState, taskID } = this.state;
        const gameManager = this.props.gameManager;
        return (
            <div>
                <Gameplay gameManager={this.props.gameManager}/>
                {/* Render tasks */}
                {gameState === GameState.TASK ? <TaskWindow gameManager={gameManager} task={gameManager.getTaskSafe(taskID)} onFinish={this.handleTaskFinish} /> : null}
            </div>
        )
    }
}

export default GameScreen
