import React, { ReactElement, useEffect, useRef, useState } from 'react'
import battleProps from '../interfaces'
import Team from '../components/Team'
import { Types } from 'mongoose'

const Battle: React.FC<{ battle: battleProps, timerMap: Map<Types.ObjectId, any> }> = ({ battle, timerMap }): ReactElement => {

  const pRef = useRef<HTMLParagraphElement>(null)
  const updateTime = (): void => {
    const timeLeft: number = Math.floor((battle.matchDate - Date.now()) / 1000)
    if(pRef.current != null) pRef.current.innerText = `Match date: ${timeLeft >= 0 ? timeLeft : 0}s`
  }

  useEffect(() => {
    clearInterval(timerMap.get(battle.battleId))
    timerMap.set(battle.battleId, setInterval((): void => void updateTime(), 1000))
    updateTime()
  }, [])

  return (
    <div className="battleWindow">
      <Team team={battle.team1} />
      <Team team={battle.team2} />
      <p ref={pRef} className="countdown">Match date:</p>
    </div>
  )
}

export default Battle