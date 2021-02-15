import { clear } from 'console';
import React, { Component } from 'react'

interface IProps {
    endTime: number,
    updateInterval?: number,
    className?: string,
    style?: React.CSSProperties
}

interface IState {
    currentNumber: number
}

export class Timer extends Component<IProps, IState> {

    interval?: NodeJS.Timeout;

    constructor(props: IProps) {
        super(props)
    
        this.state = {
            currentNumber: this.currentNumber
        }
    }
    
    get currentNumber() {
        return Math.floor((this.props.endTime - Date.now()) / 1000);
    }

    componentDidMount() {
        const { updateInterval } = this.props;
        this.interval = setInterval(this.update, updateInterval? updateInterval : 10);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    update = () => {
        this.setState({ currentNumber: this.currentNumber });
    }

    render() {
        return <span className={this.props.className} style={this.props.style}>{this.state.currentNumber}</span>
    }
}

export default Timer
