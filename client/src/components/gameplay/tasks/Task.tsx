import React, { Component } from 'react'
import { GameManager } from '../../../logic/GameManager'
import { ITask } from '../../../../../common/IMapFile'

export interface IProps {
    gameManager: GameManager,
    task: ITask,
    onFinish: () => void
}

abstract class Task<State = {}> extends Component<IProps, State> {
    /**
     * Called when the task is finished.
     */
    finish() {
        this.props.onFinish();
    }

}

export default Task
