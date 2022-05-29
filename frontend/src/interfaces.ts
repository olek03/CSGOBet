import { Types } from 'mongoose'

export interface teamProps {
    teamId: Types.ObjectId
    name: string
    wins: number
    loses: number
    active: boolean
    winrate: number
}

export interface battleProps {
    battleId: Types.ObjectId
    team1: teamProps
    team2: teamProps
    winner: string
    matchDate: number
}