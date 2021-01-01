import React, { Component } from 'react'
import { GameManager } from '../../logic/GameManager'
import PlayerList from '../testing/PlayerList'
import TestTaskDisplay from '../testing/TestTaskDisplay'

interface IProps {
    gameManager: GameManager
}

interface IState {
    tasks: Record<string, boolean>
}

export class Gameplay extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    
        this.state = {
            tasks: props.gameManager.tasks
        }
    }
    
    componentDidMount() {
        this.props.gameManager.onUpdateTasks((tasks) => {
            this.setState({ tasks: tasks })
        })
    }

    handleTaskClicked = (taskID: string) => {
        this.props.gameManager.requestTask(taskID);
    }

    render() {
        return (
            <div>
                <h1>Gameplay Screen</h1>
                <PlayerList players={this.props.gameManager.players} />
                <TestTaskDisplay tasks={this.state.tasks} onTaskClicked={this.handleTaskClicked} />
            </div>
        )
    }
}

export default Gameplay
