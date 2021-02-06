import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import { GameManager } from '../../logic/GameManager'
import PlayerList from '../testing/PlayerList'
import TaskList from './tasks/TaskList'

interface IProps {
    gameManager: GameManager,
    onRequestTask: () => void
    onReportBody: () => void
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
    
    handleReportBody = () => {
        this.props.onReportBody();
    }

    render() {
        return (
            <div>
                <h1>Gameplay Screen</h1>
                <PlayerList players={this.props.gameManager.players} />
                <p>Task completion: {this.state.taskBar * 100}%</p>
                <TaskList tasks={this.state.tasks} />
                <button onClick={this.handleRequestTask}>Scan Task</button>

                {/* Report button */}
                <Popup trigger={<button>Report Body</button>} modal>
                    {(close: () => void) => (
                        <div>
                            <p>Are you sure you want to report a body? Only report if you can directly see the body.</p>
                            <button onClick={() => {this.handleReportBody(); close()}}>Report</button>
                            <button onClick={close}>Cancel</button>
                        </div>
                    )}
                </Popup>
            </div>
        )
    }
}

export default Gameplay
