import React, { Component } from 'react'
import Task, { IProps } from './Task'

interface IState {
    isDownloading: boolean,
    startTime: number,
    percentage: number
}

const TOTAL_TIME = 8700 
const INTERVAL = 100;

export class DownloadTask extends Task<IState> {
    
    timer?: NodeJS.Timeout;

    constructor(props: IProps) {
        super(props)
    
        this.state = {
            isDownloading: false,
            startTime: 0,
            percentage: 0
        }

        this.handleBeginDownload = this.handleBeginDownload.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.timeDownloading = this.timeDownloading.bind(this);
        this.handleFinishDownload = this.handleFinishDownload.bind(this);
    }

    
    handleBeginDownload() {
        this.setState({
            isDownloading: true,
            startTime: Date.now(),
            percentage: 0
        })

        this.timer = setInterval(this.handleUpdate, INTERVAL);
    }
    
    /**
     * The amount of time we have spent in this download task.
     */
    timeDownloading() {
        const { startTime } = this.state;
        return (Date.now() - startTime);
    }

    handleUpdate() {
        this.setState({ percentage: (this.timeDownloading() / TOTAL_TIME) });
        if (this.state.percentage >= 1) this.handleFinishDownload();
    }

    handleFinishDownload() {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.setState({ isDownloading: false });
        this.finish();
    }


    button = () => <button onClick={this.handleBeginDownload}>{this.props.task.params.mode === 'upload' ? 'Upload': 'Download'}</button>

    headerText = () => {
        const { isDownloading } = this.state;
        const { mode } = this.props.task.params;

        if (!isDownloading) {
            return mode === 'upload' ? "Begin Upload" : "Begin Download";
        } else {
            return mode === 'upload' ? "Uploading..." : "Downloading...";
        }
    }

    render() {
        const { isDownloading, percentage } = this.state;
        return (
            <div>
                <h2>{this.headerText()}</h2>
                <progress id="progress" value={percentage} max='1' ></progress>
                {Math.floor(percentage * 100)}%
                <br />
                {isDownloading ? null : this.button()}
            </div>
        )
    }
}

export default DownloadTask
