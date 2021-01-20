import React, { Component } from 'react'
import Task, { IProps } from './Task'

interface IState {
    stage: number,
    index: number,
    pattern: number[],
}

interface IPlayerState {
    pattern: number[]
    stage: number
}

export class SimonSays extends Task<IState> {
    constructor(props: IProps) {
        super(props)
    
        this.state = {
            stage: 0,
            index: 0,
            pattern: [0, 0, 0, 0, 0]
        }
    }

    componentDidMount() {
        this.props.gameManager.connectionHandler.io.on('task.simonSays.setState', (playerState: IPlayerState) => {
            this.setState({ stage: playerState.stage, pattern: playerState.pattern });
        })
    }
    

    handlePushButton(id: number) {
        const { stage, index, pattern } = this.state;
        if (pattern[index] === id) {
            if (index === stage) {
                if (stage + 1 === pattern.length) {
                    this.finish();
                    return;
                }
                this.setState({ index: 0, stage: stage+1 });
                this.props.gameManager.connectionHandler.io.emit('task.simonSays.updateStage', stage+1)
            } else {
                this.setState({ index: index+1 });
            }
        } else {
            this.setState({ index: 0 });
        }
    }

    tempPatternHeader = () => this.state.pattern.slice(0, this.state.stage + 1);

    render() {
        return (
            <div>
                <h2>Start Reactor</h2>
                <h3>{this.tempPatternHeader()}</h3>
                <button onClick={() => this.handlePushButton(0)}>0</button>
                <button onClick={() => this.handlePushButton(1)}>1</button>
                <button onClick={() => this.handlePushButton(2)}>2</button>
                <br />
                <button onClick={() => this.handlePushButton(3)}>3</button>
                <button onClick={() => this.handlePushButton(4)}>4</button>
                <button onClick={() => this.handlePushButton(5)}>5</button>
                <br />
                <button onClick={() => this.handlePushButton(6)}>6</button>
                <button onClick={() => this.handlePushButton(7)}>7</button>
                <button onClick={() => this.handlePushButton(8)}>8</button>
            </div>
        )
    }
}

export default SimonSays
