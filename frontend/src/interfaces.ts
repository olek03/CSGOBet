import { Types } from 'mongoose'

export default interface teamProps {
    teamId: Types.ObjectId
    name: string
    wins: number
    loses: number
    active: boolean
    winrate: number
}

export default interface battleProps {
    battleId: Types.ObjectId
    team1: teamProps
    team2: teamProps
    winner: string
    matchDate: number
}