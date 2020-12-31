import React from 'react'
import ILightPlayer from '../../../../common/ILightPlayer'

interface IProps {
    players: ILightPlayer[]
}

const PlayerList: React.FunctionComponent<IProps> = ({ players }: IProps) => {
    const list = players.map((player: ILightPlayer) => {
        let style = {color: player.color};
        if (player.isImposter) {
            return <li key={player.name} style={style}><b>{player.name}</b></li>
        } else {
            return <li key={player.name} style={style}>{player.name}</li>
        }
    })
    return (
        <ul>
            {list}
        </ul>
    )
}

export default PlayerList
