## Motivation
Me and some friends use to play a lot custom games in League of Legends, wich a unranked type of game among us. But we would like to estabilish some rank system just for us, without thinking about the in-game elo rank. So I've creating this ranked custom game system that allows us to create our own ranking system.

## Folder structure
/game # all game logic

/party # server socket files

/src # NextJs files

## Technologies
- **NexJs**: Web framework to build the UI
- **PartyKit**: WebSocket lib that runs on the edge and allows deploy on vercel
- **Shadcn**: Modern web components lib that allows to create interfaces quickly

## Run the app
Install dependencies
```bash
npm install
```

Run the NextJs server
```bash
npm run dev
```

Run the PartyKit server
```bash
npx partykit dev
```

## Functionalities
This project has:
- Real time interactions
- Ranking system
- Auto-balance teams based in players MMRs
- Preferred Roles support for players who want to play a certain role
- Multiple custom matches at the same time
