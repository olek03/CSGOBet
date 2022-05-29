import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import Battle from './components/Battle'
import battleProps from './interfaces'
import { Types } from 'mongoose'

const App: React.FC = (): ReactElement => {

  const [battles, setBattles] = useState<battleProps[]>([])

  let timersMap: Map<Types.ObjectId, any> = new Map<Types.ObjectId, any>()

  const second: number = 1000
  const minute: number = second * 60

  const matchesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
    setInterval(() => void fetchData(), minute * 2)
  }, [])

  const fetchData = async (): Promise<void> => {
    const request: AxiosResponse = await axios.get("/battles")
    const battlesArray: battleProps[] = request.data
    const sorted: battleProps[] = battlesArray.sort((a, b) => a.matchDate - b.matchDate)
    setBattles(sorted)
    console.log("battles updated")
  }

  return (
    <div className="App">
      <h1>Welcome to CSGOBet</h1>
      <div className="matches" ref={matchesRef}>
        <h2>Upcoming Matches</h2>
        <div className="all_battles">
            {battles.map((battle: battleProps) => (
              <Battle key={new Types.ObjectId() + ""} battle={battle} timerMap={timersMap} />
            ))}
          </div>
      </div>
    </div>
  )
}

export default App
