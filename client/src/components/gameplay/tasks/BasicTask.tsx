import React, { Component } from 'react'
import Task from './Task'

export class BasicTask extends Task {
    
    handleCompleteTask = () => {
        this.finish();
    }

    render() {
        return (
            <div>
                <h2>Basic Task</h2>
                <button onClick={this.handleCompleteTask}>Complete</button>
            </div>
        )
    }
}

export default BasicTask
