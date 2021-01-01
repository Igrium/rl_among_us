import React, { Component } from 'react'
import Task from './tasks/Task'
import { GameManager } from '../../logic/GameManager';
import { ITask } from '../../../../common/IMapFile';
import BasicTask from './tasks/BasicTask';

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

    // UPDATE THIS METHOD WITH NEW TASKS
    getTask(classID: string) {
        const { gameManager, task } = this.props;
        if (classID === 'basic') return <BasicTask gameManager={gameManager} task={task} onFinish={this.onFinish}/>
    }

    render() {
        return (
            <div>
                <h1>Task Window</h1>
                {this.getTask(this.props.task.classID)}
            </div>
        )
    }
    
}

export default TaskWindow
