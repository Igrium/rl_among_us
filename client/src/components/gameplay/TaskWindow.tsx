import React, { Component } from 'react'
import Task from './tasks/Task'
import { GameManager } from '../../logic/GameManager';
import { ITask } from '../../../../common/IMapFile';

interface IProps {
    gameManager: GameManager;
    task: ITask;
    onFinish?: (aborted: boolean) => void;
}

export class TaskWindow extends Component<IProps> {
    manifest: any;

    onFinish = () => {
        if (this.props.onFinish) this.props.onFinish(false);
    }

    getTask(id: string) {
        const { gameManager, task } = this.props;
        if (id === 'task') return <Task gameManager={gameManager} task={task} onFinish={this.onFinish}/>
    }

    render() {
        return (
            <div>
                <h1>Task Window</h1>
                {this.getTask(this.props.task.id)}
            </div>
        )
    }
    
}

export default TaskWindow
