const WebSocketServer = require("ws");
players = []
readied = 0
const wss = new WebSocketServer.Server({port:process.env.PORT || 3000})

console.log({port:process.env.PORT || 3000})

wss.on("connection",ws => {
    console.log("Connected bitch")

    //add player
    //console.log("Adding new player")
    var player = {
        id:players.length+1,
        name:"",
        socketId:ws,
        team:"none",
        ready:false
    }
    players.push(player)
    ws.send(JSON.stringify({
        eventName:"Num",
        Number:players.length
    }))

    ws.on("message",data => {
        //console.log("Received:" + data)
        var realData = JSON.parse(data)
        //console.log(realData)
        handleData(realData,ws)
        /*ws.send(
            JSON.stringify({eventName:"response"})
        )*/
    })

    ws.on("close", ()=> {//handle disconnect
        console.log("Disconnected")
        i = 0;
        index = -1
        while(i < players.length) {
            if(players[i].socketId == ws) {
                index = i
            }
            i++;
        }
        if(index == -1) {
            console.log("Unable to find player socket")
        }
        else {
            players.splice(index,1)
            console.log("Player socket removed")
        }
    })

    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred");
    }
})

console.log("Bitch")

function handleData(realData,ws) {
    console.log(realData)
    var eventName = realData.eventName
    switch(eventName) {
        case "Player Create":
            id = realData.Num-1
            console.log(players[id])
            players[id].name = realData.Name
            players[id].team = realData.Team
            console.log(players[id])
        break;
        case "Send Thing":
            broadcast(JSON.stringify({
                eventName:"response"
            }))
        break;
        case "Ready":
            console.log(realData.Ready)
            id = realData.Num-1
            players[id].ready = realData.Ready //set player ready status
            if(realData.Ready) {
                readied += 1
            }
            else {
                readied -= 1
            }
            console.log(readied)
            if(readied > players.length/2) {
                shooterStart()
            }
            broadcast(JSON.stringify(realData))
        break;
        case "Refresh":
            location.reload();
        break;
        case "Player Update":
        case "Bullet":
        case "Player Health":
        case "Bolt":
        case "Ammo":
        case "Bolt dir":
        case "Ball Move":
        case "Status":
        case "Ball Pos":
        case "Loadout":
        case "Damage Dealt":
        case "Targeted Status":
        case "Thrown":
        case "Airborne":
        case "Tower Damage":
        case "Swap":
        case "Death":
            broadcast(JSON.stringify(realData))
        break
    }
}

function broadcast(datum) {
    
    for(let i in players) {
        players[i].socketId.send(datum)
        //console.log("Sending response")
    }
    console.log("broadcasted")
}

function shooterStart() {
    console.log("Starting!!!")
    for(let i in players) {
        players[i].socketId.send(JSON.stringify({
            eventName:"Start Game",
            Players:players.length,
            Random:30,
            Num:players[i].id
        }))
        //console.log("Sending response")
    }
    for(let i in players) {
        console.log(players[i].id)
        console.log(players[i].name)
        broadcast(JSON.stringify({
            eventName:"Team Name",
            Num:players[i].id,
            Name:players[i].name,
            Team:players[i].team
        }))
    }
}