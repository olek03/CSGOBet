import { ReactElement } from 'react'

interface teamProps {
  name: string
  wins: number
  loses: number
  active: boolean
  winrate: number
}

const Team: React.FC<{ team: teamProps }> = ({ team }): ReactElement => {
  let multiplier: string = team.winrate + 2 / team.winrate - 1 + ""

  if (multiplier.length > 4) multiplier = multiplier.substring(0, 3)
  if (multiplier.length === 3) multiplier += "0"
  if (multiplier.length === 1) multiplier += ".00"

  return (
    <div className="team_window">
      <div className="team">
        {team.name}
      </div>
      <div className="info">
        <span> winrate {team.winrate}</span><br></br>
        <span> multiplier {multiplier}</span>
      </div>
      <div className="bet_section">
        <input className="bet_input" />
        <button className="bet_button">PLACE BET</button>
      </div>
    </div>
  )
}

export default Team