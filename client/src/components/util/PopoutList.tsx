import React, { Component } from "react";
import Popup from 'reactjs-popup'

interface IProps {
    entries: string[]
    onSelected: (value: string) => void
}

/**
 * A list of values where the user can click on each value to trigger something.
 * Not actually a popout, but is useful in a modal.
 */
export class PopoutList extends Component<IProps> {
    constructor(props: IProps) {
        super(props)
    
        this.state = {
            
        }
    }

    listEntry(value: string) {
        return (
            <button onClick={() => this.props.onSelected(value)}>{value}</button>
        )
    }

    render() {
        return (
            <div>
                {
                    this.props.entries.map((value) => {
                        return this.listEntry(value);
                    })
                }
            </div>
        )
    }
    
}