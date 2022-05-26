import React, { ReactElement, useEffect, useState } from 'react'
import battleProps from '../interfaces'
import Team from '../components/Team'
import { Types } from 'mongoose'

const Battle: React.FC<{ battle: battleProps, timerMap: Map<Types.ObjectId, any> }> = ({ battle, timerMap }): ReactElement => {

  const [timeString, setTimeString] = useState<string>()

  let timeLeft: number = Math.floor((battle.matchDate - Date.now()) / 1000)

  const updateTime = (): void => {
    timeLeft = Math.floor((battle.matchDate - Date.now()) / 1000)
    updateTimeString()
  }

  useEffect(() => {
    clearInterval(timerMap.get(battle.battleId))
    timerMap.set(battle.battleId, setInterval((): void => void updateTime(), 1000))
    updateTime()
  }, [])

  const updateTimeString = (): void => {
    if (timeLeft <= 0) setTimeString("")
    if (timeLeft > 60 && timeLeft < 3600) {
      const seconds = timeLeft % 60
      const minutes = Math.floor(timeLeft / 60)
      setTimeString(`${minutes}m ${seconds}s`)
    }
    if (timeLeft >= 3600 && timeLeft <= 3600 * 24) {
      const seconds = timeLeft % 60
      const minutes = Math.floor(timeLeft / 60)
      const hours = Math.floor(minutes / 60)
      const newMinutes = minutes - 60 * hours
      setTimeString(`${hours}h ${newMinutes}m ${seconds}s`)
    }
    if (timeLeft >= 3600 * 24) {
      const seconds = timeLeft % 60
      const minutes = Math.floor(timeLeft / 60)
      const hours = Math.floor(minutes / 60)
      const newMinutes = minutes - 60 * hours
      const days = Math.floor(hours / 24)
      const newHours = hours - 24 * days
      setTimeString(`${days}d ${newHours}h ${newMinutes}m ${seconds}s`)
    }
  }

  return (
    <div className="battle_window">
      <Team team={battle.team1} />
      <Team team={battle.team2} />
      <div className="details">
        <p className="countdown">Match date: {timeString}</p>
        <div className="outcome">
          outcome<br/>
          <span className="money">0.00$</span>
        </div>
      </div>
    </div>
  )
}

export default Battle