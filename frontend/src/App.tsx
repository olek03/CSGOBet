import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import Battle from './components/Battle'
import battleProps from './interfaces'
import { ObjectId, Types } from 'mongoose'

const App: React.FC = (): ReactElement => {

  const [battles, setBattles] = useState<battleProps[]>([])

  let timers: any[] = []
  let timersMap: Map<Types.ObjectId, any> = new Map<Types.ObjectId, any>()

  useEffect(() => {
    fetchData()
    setInterval(() => void fetchData(), 10000)
  }, [])

  const fetchData = async (): Promise<void> => {
    const request: AxiosResponse = await axios.get("/battles")
    const battlesArray: battleProps[] = request.data
    const sorted = battlesArray.sort((a, b) => a.matchDate - b.matchDate)
    setBattles(sorted)
    console.log("fetching battles")
  }

  return (
    <div className="App">
      <h1>Welcome to CSGOBet</h1>
      <div className="matches">
        <h2>Upcoming Matches</h2>
        <div className="all_teams">
          {battles.map((battle: battleProps, index: number) => (
            <Battle key={new Types.ObjectId() + ""} battle={battle} timerMap={timersMap} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
