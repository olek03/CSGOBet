import express, { Request, Response, Application } from "express"
import mongoose, { Types } from "mongoose"

const app: Application = express()
const PORT: number = 5000

const MILI_SECONDS: number = 1000
const SECONDS: number = MILI_SECONDS / 100
const MINUTES: number = SECONDS * 60
const HOURS: number = MINUTES * 60
const DAYS: number = HOURS * 24

const BATTLES_AMOUT = 20

const minMatchAwait: number = HOURS * 0.5 * 60
const maxMatchAwait: number = HOURS * 2 * 60

interface teamProps {
    teamId: Types.ObjectId
    name: string
    wins: number
    loses: number
    active: boolean
    winrate: number
}

interface battleProps {
    battleId: Types.ObjectId
    team1: Team
    team2: Team
    winner: string
    matchDate: number
}

class Team implements teamProps {
    public teamId: Types.ObjectId
    public name: string
    public wins: number
    public loses: number
    public active: boolean
    public winrate: number

    constructor(name: string) {
        this.teamId = new Types.ObjectId()
        this.name = name
        this.wins = 0
        this.loses = 0
        this.active = true
        this.winrate = 1
    }
}

// teams database
const teams: Team[] = []

const teamNames: string[] = ["iBuyPower", "Titan", "NaVi", "Ninjas", "Volcano", "Blackhand", "Rogues", "Ultimax", "Tacticals", "RainbowSquad", "EnbyUs", "GsBhop", "Jormungandrs", "SailorNation"]

teamNames.forEach((name: string): void => void teams.push(new Team(name)))

const upcomingBattles: battleProps[] = []
const battlesHistory: battleProps[] = []

const drawBattles = (): void => {
    // drawing the opponents
    const team1: Team = teams[Math.floor(Math.random() * teams.length)]
    const team2: Team = teams[Math.floor(Math.random() * teams.length)]
    const opponents = [team1, team2]

    // who won the match
    const fixedResult = Math.random() * (team1.winrate + team2.winrate)
    let winnerIndex: number
    if (fixedResult < team1.winrate) {
        winnerIndex = teams.indexOf(opponents[opponents.indexOf(team1)])
    } else winnerIndex = teams.indexOf(opponents[opponents.indexOf(team2)])

    // updating the count of wins
    teams[winnerIndex].wins++
    
    // updating team winrate
    let winRate: string = teams[winnerIndex].wins / teams[winnerIndex].loses + ""
    if (winRate === "Infinity") winRate = "1"
    if (winRate.length > 4) winRate = winRate.substring(0, 3)
    teams[winnerIndex].winrate = parseFloat(winRate)

    const matchDate = Date.now() + Math.floor(Math.random() * (maxMatchAwait - minMatchAwait) + minMatchAwait)

    const battle: battleProps = {
        battleId: new Types.ObjectId(),
        team1: team1,
        team2: team2,
        winner: teams[winnerIndex].name,
        matchDate: matchDate
    }

    // updating the count of loses
    opponents.splice(opponents.indexOf(opponents[opponents.indexOf(team1)]), 1)
    teams[teams.indexOf(opponents[0])].loses++

    // updating upcoming battles
    upcomingBattles.push(battle)
    battlesHistory.push(battle)
}

const updateMatches = (): void => {
    while (upcomingBattles.length < BATTLES_AMOUT) drawBattles()
    
    upcomingBattles.forEach((battle: battleProps): void => {
        while (!battle.team1.active) battle.team1 = teams[Math.floor(Math.random() * teams.length)]
        while (!battle.team2.active) battle.team2 = teams[Math.floor(Math.random() * teams.length)]

        while (battle.team1 === battle.team2) battle.team2 = teams[Math.floor(Math.random() * teams.length)]

        if (battle.matchDate < Date.now()) {
            upcomingBattles.splice(upcomingBattles.indexOf(battle), 1)
            drawBattles()
        }
    })

}
updateMatches()
setInterval(updateMatches, 2000)

// general teams information
app.get("/teams", (req: Request, res: Response): void => void res.send(teams))

// upcoming battles
app.get("/battles", (req: Request, res: Response): void => void res.send(upcomingBattles))

// find specific battle
app.get("/getbattle", (req: Request, res: Response): void => {
    if (req.body == null) res.send("Specify the match")
    res.send(battlesHistory.find((battle: battleProps) => battle.battleId === req.body.battleId))
})

// matches history
app.get("/history", (req: Request, res: Response): void => void res.send((battlesHistory)))

app.listen(process.env.PORT || PORT)