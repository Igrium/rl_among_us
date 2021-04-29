import React, { Component } from 'react'
import { ISabotageFix } from '../../../../../common/IMapFile';
import { GameManager } from '../../../logic/GameManager';

export interface IProps {
    gameManager: GameManager,
    sabotageFix: ISabotageFix,
    onFinish: () => void
}

abstract class SabotageFix<State = {}> extends Component<IProps, State> {
    /**
     * Called when the task is finished.
     */
    finish() {
        this.props.onFinish();
    }

}

export default SabotageFix;
 