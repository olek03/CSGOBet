import { ReactElement, RefObject, useRef } from 'react'

interface teamProps {
  name: string
  wins: number
  loses: number
  active: boolean
  winrate: number
}

const Team: React.FC<{ team: teamProps, profit: RefObject<HTMLSpanElement> }> = ({ team, profit }): ReactElement => {

  const inputRef = useRef<HTMLInputElement>(null)

  let multiplier: string = team.winrate + 2 / team.winrate - 1 + ""
  
  if (multiplier.length > 4) multiplier = multiplier.substring(0, 3)
  if (multiplier.length === 3) multiplier += "0"
  if (multiplier.length === 1) multiplier += ".00"

  if (inputRef.current != null) inputRef.current.addEventListener("keyup", (): void => {
    const bet: number | null = inputRef.current && parseFloat(inputRef.current.value)
    const multiplierNumber: number = parseFloat(multiplier)
    if (profit.current != null && bet != null) profit.current.innerText = bet * multiplierNumber + "$"
  })

  let winrate: string = team.winrate + ""

  if (winrate.length === 3) winrate += "0"
  if (winrate.length === 1) winrate += ".00"

  return (
    <div className="team_window">
      <div className="team">
        {team.name}
      </div>
      <div className="info">
        <span> winrate {winrate}</span><br></br>
        <span> multiplier {multiplier}</span>
      </div>
      <div className="bet_section">
        <input className="bet_input" type="number" ref={inputRef} />
        <button className="bet_button">PLACE BET</button>
      </div>
    </div>
  )
}

export default Team