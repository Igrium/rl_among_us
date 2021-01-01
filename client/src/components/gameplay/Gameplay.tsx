import React, { Component } from 'react'
import { GameManager } from '../../logic/GameManager'
import PlayerList from '../testing/PlayerList'
import TestTaskDisplay from '../testing/TestTaskDisplay'
import TaskList from './tasks/TaskList'

interface IProps {
    gameManager: GameManager,
    onRequestTask: () => void
}

interface IState {
    tasks: Record<string, boolean>,
    taskBar: number
}

export class Gameplay extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    
        this.state = {
            tasks: props.gameManager.tasks,
            taskBar: 0
        }
    }
    
    componentDidMount() {
        this.props.gameManager.onUpdateTasks((tasks) => {
            this.setState({ tasks: tasks })
        })

        this.props.gameManager.onUpdateTaskBar((value) => {
            this.setState({ taskBar: value });
        })
    }

    handleRequestTask = () => {
        this.props.onRequestTask();
    }

    render() {
        return (
            <div>
                <h1>Gameplay Screen</h1>
                <PlayerList players={this.props.gameManager.players} />
                <p>Task completion: {this.state.taskBar * 100}%</p>
                <TaskList tasks={this.state.tasks} />
                <button onClick={this.handleRequestTask}>Scan Task</button>
            </div>
        )
    }
}

export default Gameplay
