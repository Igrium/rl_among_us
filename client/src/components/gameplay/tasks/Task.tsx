import React, { Component } from 'react'
import { GameManager } from '../../../logic/GameManager'
import { ITask } from '../../../../../common/IMapFile'

interface IProps {
    gameManager: GameManager,
    task: ITask,
    onFinish: () => void
}

abstract class Task extends Component<IProps> {
    /**
     * Called when the task is finished.
     */
    finish() {
        this.props.onFinish();
    }

}

export default Task
