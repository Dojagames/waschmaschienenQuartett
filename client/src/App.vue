<script>
import Gdata from "./assets/deck.json";

export default {

    data(){
        return {
            view: 'home',

            deck: [],
            secondaryDeck: [],
            data: Gdata,

            currentCard: {name: "name", cost: "400", efficiecy: 'A', u: 1300, modes: 15, rating: 4.9, noise: 80},
        }
    },
    components: {
        
    },
    props: {
        
    },
    methods: {
        
    },
    created() {
        
    },
    mounted(){
        console.log(this.data);
    },
    watch: {
        
    },

}
</script>

<template>
  <div id="home" v-if="view != 'home'">
    <button>Host Game</button><br>
    <input type="text" placeholder="gameCode here"><br>
    <button>Join Game</button>
  </div>

  <div id="ingame" v-else >
    <div id="ui">
        <button>Home</button>
    </div>
    <div id="game" >
        <div id="player1" class="playerClass unmarkable">
            <h1>You</h1>
            <div class="middleDeck">
                <h3>32 Cards </h3>
                <div class="card">
                    <h2>{{ currentCard.name }}</h2>
                    <img>
                    <div class="stats">
                        <div class="statpair">
                            <h3>Preis:</h3> <p>{{ currentCard.cost }}$</p>
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
            </div>
        </div>
        <div id="playerDivider"></div>
        <div id="player2" class="playerClass unmarkable">
            <h1>Opponent</h1>
            <div class="middleDeck">
                <h3>32 Cards </h3>
                <div class="card">
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
    #ui{
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #ui button{
        background-color: transparent;
        border: 1px solid white;
        border-radius: 4px;

        margin: 15px;

        font-size: larger;
    }

    #ui button:hover{
        cursor: pointer;
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

        background-color: rgba(102, 51, 153, 0.356);
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
        height: 600px;

        border: 2px solid maroon;
        border-radius: 8px;
    }

    .card h2{
        text-align: center;
        margin: 0;
        padding: 10px;
    }

    .card img{
        width: 80%;
        height: 40%;
        position: relative;
        left: 10%;
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