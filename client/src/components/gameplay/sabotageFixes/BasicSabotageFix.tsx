import React, { Component } from 'react'
import SabotageFix from './SabotageFix';

export class BasicSabotageFix extends SabotageFix {
    handleFixSabotage = () => {
        this.finish();
    }

    render() {
        return (
            <div>
                <h2>Basic Sabotage Fix</h2>
                <button onClick={this.handleFixSabotage}>Fix Sabotage</button>
            </div>
        )
    }
}