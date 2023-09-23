//import fullDeck from './deck.json';
const fullDeck = require('./deck.json');

const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



io.on('connection', (socket)=> {
    console.log(socket.id);
    socket.emit("test", "testmsg");

    socket.on('playCard', (_obj) => {
        //ask for other client card
        const currentRoom = Array.from(socket.rooms)[1];
        socket.to(currentRoom).emit("getCard", (_obj));  
    });

    socket.on("compareCards", (_obj) => {
        const currentRoom = Array.from(socket.rooms)[1];

        const _type = _obj.opponent.type;
        const _ownIndex = _obj.own;
        const _opponentIndex = _obj.opponent.index;

        if(fullDeck[_ownIndex][_type] > fullDeck[_opponentIndex][_type]){
            let givingPile = [];
            if(Rooms.filter(e => e.name == currentRoom)[0].pile.length > 0){
                givingPile = Rooms.filter(e => e.name == currentRoom)[0].pile;
                givingPile.push(_opponentIndex);
                socket.emit("wonCard", givingPile);
            } else {
                socket.emit("wonCard", [_opponentIndex]);
            }
            
            socket.to(currentRoom).emit("lostCard");
        } else if(fullDeck[_ownIndex][_type] == fullDeck[_opponentIndex][_type]){
            Rooms.filter(e => e.name == currentRoom)[0].pile.push(_ownIndex, _opponentIndex);
            socket.to(currentRoom).emit("drawCard", true);
            socket.emit("drawCard", false);
        } else {
            if(Rooms.filter(e => e.name == currentRoom)[0].pile.length > 0){
                givingPile = Rooms.filter(e => e.name == currentRoom)[0].pile;
                givingPile.push(_opponentIndex);
                socket.to(currentRoom).emit("wonCard", givingPile);
            } else {
                socket.to(currentRoom).emit("wonCard", [_opponentIndex]);
            }
            
            socket.emit("lostCard");
        }
    });



    socket.on("gameLost", () => {
        const currentRoom = Array.from(socket.rooms)[1];
        socket.to(currentRoom).emit("gameWon");  

        let _deck = shuffle([...deck]);
        const deck1 = _deck.splice(0, 16);
        const deck2 = _deck;

        socket.to(currentRoom).emit("deck", deck1);
        socket.emit("deck", deck2);

    });


    socket.on("host", () =>{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let _room = '';

        do{
            for(let i = 0; i < 6; i++){
                _room += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (Rooms.filter(e => e.name == _room).length != 0); // rooms.includes(_room)

        
        Rooms.push({name: _room, users: [socket.id], pile: []});
        socket.join(_room);
        console.log(socket.id + " created: " + _room);


        socket.emit("createdRoom", _room);
    })

    socket.on("joinGame", id =>{ 
        if(Rooms.filter(e => e.name == id).length > 0){
            if(Rooms.filter(e => e.name == id)[0].users.length > 1){
                socket.emit("cantJoinFull");
                return;
            } 

            socket.join(id);
            console.log(socket.id + " joined: " + id);

            let _deck = shuffle([...deck]);
            const deck1 = _deck.splice(0, 16);
            const deck2 = _deck;
            console.log(deck1);
            console.log(deck2);
            socket.to(id).emit("userJoined");
            socket.to(id).emit("deck", deck1);

            socket.emit("joined");
            socket.emit("deck", deck2);

            Rooms.filter(e => e.name == id)[0].users.push(socket.id);
        } else {
            socket.emit("cantJoinNotFound");
        }
    });

    socket.on("disconnecting", () => {
        const currentRoom = Array.from(socket.rooms)[1];
        if(currentRoom == undefined) return;


        io.to(Rooms.filter(e => e.name == currentRoom)[0].users.filter(f => f != socket.id)).emit("opponentLeft");
        
        Rooms.filter(e => e.name == currentRoom)[0].users = Rooms.filter(e => e.name == currentRoom)[0].users.filter(f => f == socket.id);
    });

});




let Rooms = [];
let deck = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

const shuffle = (array) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  };    

server.listen(3008);