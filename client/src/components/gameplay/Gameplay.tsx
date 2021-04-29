import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import ILightPlayer from '../../../../common/ILightPlayer'
import { ISabotage } from '../../../../common/IMapFile'
import { GameManager } from '../../logic/GameManager'
import PlayerList from '../testing/PlayerList'
import { PopoutList } from '../util/PopoutList'
import TaskList from './tasks/TaskList'

interface IProps {
    gameManager: GameManager,
    onRequestTask: () => void
    onReportBody: () => void
}

interface IState {
    tasks: Record<string, boolean>,
    taskBar: number,
    players: ILightPlayer[],
    criticalSabotage: boolean
}

export class Gameplay extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    
        this.state = {
            tasks: props.gameManager.tasks,
            taskBar: 0,
            players: props.gameManager.players,
            criticalSabotage: false
        }
    }
    
    componentDidMount() {
        this.props.gameManager.onUpdateTasks((tasks) => {
            this.setState({ tasks: tasks })
        })

        this.props.gameManager.onUpdateTaskBar((value) => {
            this.setState({ taskBar: value });
        })

        this.props.gameManager.onUpdateGameRoster((players) => {
            this.setState({ players: players });
        })
        
        this.props.gameManager.sabotageManager.onSabotage((sabotage) => {
            if (sabotage.isCritical) {
                this.setState({ criticalSabotage: true });
            }
        })

        this.props.gameManager.sabotageManager.onEndSabotage((sabotage) => {
            if (sabotage.isCritical) {
                this.setState({ criticalSabotage: false });
            }
        })
    }

    handleRequestTask = () => {
        this.props.onRequestTask();
    }
    
    handleReportBody = () => {
        this.props.onReportBody();
    }  

    render() {

        const { localPlayer } = this.props.gameManager;

        return (
            <div style={{backgroundColor: this.state.criticalSabotage ? 'red': 'white'}}>
                <h1>Gameplay Screen</h1>
                <PlayerList players={this.state.players} />
                <p>Task completion: {this.state.taskBar * 100}%</p>
                <TaskList tasks={this.state.tasks} />
                <button onClick={this.handleRequestTask}>Scan Task</button>

                {/* Report button */}
                {localPlayer.isAlive ? this.reportButton() : null}

                {localPlayer.isImposter ? this.sabotageButton() : null}

                {(!localPlayer.isImposter && localPlayer.isAlive) ? this.killedButton() : null}
                
                
            </div>
        )
    }

    reportButton() {
        return (
            <Popup trigger={<button>Report Body</button>} modal>
                {(close: () => void) => (
                    <div>
                        <p>Are you sure you want to report a body? Only report if you can directly see the body.</p>
                        <button onClick={() => { this.handleReportBody(); close() }}>Report</button>
                        <button onClick={close}>Cancel</button>
                    </div>
                )}
            </Popup>
        )
    }

    sabotageButton() {
        const sabotages = this.props.gameManager.mapInfo.sabotages
        const names = sabotages.map((sabotage) => {return sabotage.prettyName === undefined ? sabotage.id : sabotage.prettyName});

        const onSelect = (selected: string) => {

            for (let i = 0; i < sabotages.length; i++) {
                const sabotage = sabotages[i];
                if (sabotage.prettyName === selected || sabotage.id === selected) {
                    this.callSabotage(sabotage);
                    return;
                }
            }
        }

        return (
            <Popup trigger={<button>Sabotage</button>} modal>
                {(close: () => void) => (
                    <PopoutList entries={names} onSelected={value => { onSelect(value); close(); }}/>
                )} 
            </Popup>
        )
    }
    
    callSabotage = (sabotage: ISabotage) => {
        this.props.gameManager.callSabotage(sabotage.id);
    }

    killedButton() {
        return (
            <Popup trigger={<button>I'm Dead</button>} modal>
            {(close: () => void) => (
                <div>
                    <p>Are you sure you want to report yourself as dead?</p>
                    <button onClick={() => { this.handleReportKilled(); close() }}>Yes</button>
                    <button onClick={close}>No</button>
                </div>
            )}
            </Popup>
        )
    }

    handleReportKilled = () => {
        this.props.gameManager.reportKilled();
    }
}

export default Gameplay
