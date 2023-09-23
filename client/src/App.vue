<script>
// TODOs:
// Deck View Menu
// Animations
// Reset Game
// Insert Waschmaschienen

import {io} from 'socket.io-client'
const socket = io('localhost:3008');

import Gdata from "./assets/deck.json";

export default {

    data(){
        return {
            view: 'home',
            deck: [],
            secondaryDeck: [],
            data: Gdata,

            currentCard: {},
            currentCardIndex: 0,

            turn: false,

            lobbyfull: false,
            room: "",

            showOpponentCard: false,

            lobbyfull: false,
        }
    },
    components: {
        
    },
    props: {
        
    },
    methods: {
        goHome(){
            this.view = 'home';
        },
        CopyRoom(){
            navigator.clipboard.writeText(this.room);
        },
        HostRoom(){
            socket.emit("host");
            this.view = 'game';
        },

        JoinRoom(){
            socket.emit("joinGame", this.room);
            this.lobbyfull = true;
            this.turn = true;
        },

        ResetGame(){
           //reset board;
        },

        nextTurn(){
            if(this.deck.length == 0){
                if(this.secondaryDeck.length > 0) {
                    //shuffle deck
                    this.deck = [... this.secondaryDeck].sort((a,b) => 0.5 - Math.random());
                    this.deck;
                    this.secondaryDeck = [];
                } else {
                    socket.emit("gameLost");
                    alert("gameLost");
                    this.ResetGame();
                    return
                }
            }

            this.currentCard = Gdata[this.deck[0]];
            this.currentCardIndex = this.deck[0];
        },

        //game functions

        PlayCard(_type){
            console.log("played: " + _type)
            socket.emit("playCard", {type: _type, index: this.currentCardIndex});
            this.turn = false;
        },

        GetCardID(_index){
            return String.fromCharCode(65 + Math.floor(_index/4)) + String((_index % 4) + 1)
        },

        getImg(_index){
            const _id = String.fromCharCode(97 + Math.floor(_index/4)) + String((_index % 4) + 1);
            const url = "/imgs/" + _id + ".webp";           
            return url;
        },

    },
    created() {

        socket.on("deck", (_deck) => {
            this.deck = _deck;
            this.currentCard = Gdata[_deck[0]];
            this.currentCardIndex = _deck[0];

            this.secondaryDeck = [];
        });

        socket.on("getCard", (opponentCard) => {
            socket.emit("compareCards", {own: this.currentCardIndex, opponent: opponentCard});
        });


        socket.on("wonCard", (_cards) => {
            //puts frontCard to secondary deck
            this.secondaryDeck.push(this.deck[0]);
            this.deck.shift();

            _cards.forEach((e) => {
                this.secondaryDeck.push(e);
            });

            this.turn = true;
            this.nextTurn();
        });


        socket.on("lostCard", () => {
            this.deck.shift();
            this.nextTurn();
            this.turn = false;
        });


        socket.on("drawCard", (_turn) => {
            this.deck.shift();

            this.nextTurn();
            this.turn = _turn;
        });



        socket.on("gameWon", () => {
            alert("game Won");
            this.ResetGame;
        });


        socket.on("cantJoinFull", () => {
            alert("cant join Room (Room full)");
        });

        socket.on("cantJoinNotFound", () => {
            alert("cant join Room (Room not Found)");
        });

        socket.on('joined', () => {
            this.view = 'game';
        });

        socket.on('createdRoom', (_room) => {
        this.room = _room;
        });

        socket.on('userJoined', () => {
            //this.resetBoard();
            this.lobbyfull = true;
        });

        socket.on('opponentLeft', () => {
            this.ResetGame();
            this.lobbyfull = false;
        });

    },
    mounted(){
        console.log(this.data);
    },
    watch: {
        
    },

}
</script>

<template>
  <div id="home" v-if="view == 'home'">
    <button @click="HostRoom()">Host Game</button><br>
    <input type="text" placeholder="gameCode here" v-model="room"><br>
    <button @click="JoinRoom()">Join Game</button>
  </div>

  <div id="ingame" v-else >
    <div id="game" >
        <h4 id='waitingLabel' v-if="!turn">waiting for opponent</h4>
        <button id='homeBtn' @click="goHome()">Home</button>
        <h3 style="position: absolute; right: 15px; top: 15px; margin: 0;" @click="CopyRoom();" class="clickable">room: {{ room }}</h3>
        
        <div id="player1" class="playerClass unmarkable">
            <h1>You</h1>
            <div class="middleDeck">
                <h3>{{deck.length + secondaryDeck.length}} cards</h3>
                <div class="card">
                    <div class="cardId">{{ GetCardID(currentCardIndex) }}</div>
                    <h2>{{ currentCard.name }}</h2>
                    <img :src="getImg(currentCardIndex)" style="object-fit: cover;">
                    <div class="stats">
                        <div class="statpair" @click="PlayCard('cost')">
                            <h3>Preis:</h3> <p>{{ currentCard.cost }}$</p>
                        </div>
                        <div class="statpair" @click="PlayCard('efficiecy')">
                            <h3>Energieeffizienz:</h3> <p>{{ currentCard.efficiecy }}</p>
                        </div>
                        <div class="statpair" @click="PlayCard('water')">
                            <h3>Wasser pro Zyklus:</h3> <p>{{ currentCard.water }} l</p>
                        </div>
                        <div class="statpair" @click="PlayCard('modes')">
                            <h3>Programme:</h3> <p>{{ currentCard.modes }}</p>
                        </div>
                        <div class="statpair" @click="PlayCard('weightload')">
                            <h3>Maximalbelastung:</h3> <p>{{ currentCard.weightload }} kg</p>
                        </div>
                        <div class="statpair" @click="PlayCard('noise')">
                            <h3>Lautstaerke:</h3> <p>{{ currentCard.noise }} dB</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="playerDivider"></div>
        <div id="player2" class="playerClass unmarkable">
            <h1>Opponent</h1>
            <div class="middleDeck">
                <h3>{{ 32 - (deck.length + secondaryDeck.length)}} cards</h3>
                <div class="card" v-if="showOpponentCard">
                    <h2>Name</h2>
                    <img>
                    <div class="stats">
                        <div class="statpair">
                            <h3>Preis:</h3> <p>400$</p>
                        </div>
                        <div class="statpair">
                            <h3>Energieeffizienz:</h3> <p>A++</p>
                        </div>
                        <div class="statpair">
                            <h3>U/min</h3> <p>1300</p>
                        </div>
                        <div class="statpair">
                            <h3>Programme</h3> <p>15</p>
                        </div>
                        <div class="statpair">
                            <h3>Bewertung</h3> <p>4.9</p>
                        </div>
                        <div class="statpair">
                            <h3>Lautstaerke</h3> <p>71Db</p>
                        </div>
                    </div>
                </div>
                <div class="card" v-else>
                    <h1 style="transform: rotate(-45deg) translate(-50%, -50%); position: relative; left: 40%;top: 15%;">Deck</h1>
                </div>
                
            </div>
            
        </div>
    </div>
  </div>
</template>

<style scoped>
    /* home */
    #home{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }

    #home button{
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 20px;

        font-size: larger;

        border: 1px solid white;
        border-radius: 4px;

        background-color: transparent;

        margin-bottom: 20px;
    }

    #home input{
        position: relative;
        border: none;
        border-bottom: 1px solid white;
        background-color: transparent;

        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 5px;
    }




    /* game */


    #homeBtn{
        background-color: transparent;
        border: 1px solid white;
        border-radius: 4px;

        position: absolute;
        left: 15px;
        bottom: 15px;

        font-size: larger;
    }

    #homeBtn:hover{
        cursor: pointer;
    }

    #waitingLabel{
        position: absolute;
        left: 15px;
        top: 15px;
        margin: 0;
    }














    #game{
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .playerClass{
        position: absolute;
        width: 40%;
        height: 80%;
        top: 10%;

        /* background-color: rgba(102, 51, 153, 0.356); */
    }

    #player1{
        left: 8%;
    }

    #player2{
        right: 8%;
    }

    #playerDivider{
        position: absolute;
        left: 50%;
        top: 7.5%;
        transform: translateX(-50%);

        width: 2px;
        height: 85%;

        background-color: white;
    }

    .playerClass h1{
        text-align: center;
        transform: translateY(-150%);
    }

    .middleDeck{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);


        width: 500px;
        height: 640px;
        /* background-color: rgba(255, 0, 0, 0.548); */
    }

    .middleDeck h3{
        margin: 0;
        margin-bottom: 5px;
        text-align: center;
    }

    .card{
        position: relative;
        left: 50%;
        transform: translateX(-50%);

        width: 480px;
        height: 630px;

        border: 2px solid maroon;
        border-radius: 8px;
    }

    .card h2{
        text-align: center;
        margin: 0;
        padding: 10px;
    }

    .cardId {
        margin-left: 15px;
        margin-top: 5px;
    }

    .card img{
        width: 60%;
        height: 50%;
        position: relative;
        left: 20%;

        object-fit: cover;
    }

    .stats{
        display: flex;
        flex-wrap: wrap;
        padding-top: 50px;
    }

    .statpair{
        width: 50%;
        height: 60px;

        margin: 0px;

        white-space: nowrap;

        text-align: center;
    }

    .statpair h3, .statpair p{
        margin: 0;
        display: inline;
        font-weight: bold;
    }

    .statpair p {
        text-decoration: underline;
    }

    .statpair p:hover{
        cursor: pointer;
    }

</style>