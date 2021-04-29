import React, { Component } from 'react'
import { ISabotageFix } from '../../../../common/IMapFile';
import { GameManager } from '../../logic/GameManager';
import { BasicSabotageFix } from './sabotageFixes/BasicSabotageFix';
import SabotageFix from './sabotageFixes/SabotageFix';

interface IProps {
    gameManager: GameManager;
    sabotageFix: ISabotageFix;
    onFinish?: (aborted: boolean) => void;
}

export class SabotageFixWindow extends Component<IProps> {

    // UPDATE THIS METHOD WITH NEW SABOTAGE FIX CLASSES
    getSabotageFix(classID: string) {
        const { gameManager, sabotageFix } = this.props;
        if (classID === 'basic') {
            return <BasicSabotageFix gameManager={gameManager} sabotageFix={sabotageFix} onFinish={this.onFinish} />
        }
    }

    onFinish = () => {
        this.props.gameManager.sabotageManager.sabotageFix(this.props.sabotageFix.id);
        if (this.props.onFinish) {
            this.props.onFinish(false);
        }
    }

    handleCloseButton = () => {
        if (this.props.onFinish) this.props.onFinish(true);
    }

    render() {
        return (
            <div style={{display: 'inline-block'}}>
                <div className='TaskDiv'>{this.getSabotageFix(this.props.sabotageFix.classID)}</div>
                <button className='CloseButton' onClick={this.handleCloseButton}>X</button>
            </div>
        )
    }
}