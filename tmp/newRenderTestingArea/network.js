
    var socket = new WebSocket("ws:localhost:9000/test");

    socket.onopen = function() {
    };

    send = function(data) {
        socket.send(JSON.stringify(data));
    }

    socket.onmessage = function(event) {
        console.log(event);
        var data = JSON.parse(event.data);
        if(data.message == "game start") {
            init(data.data);
        } else if(data.message == "move"){
            snakes = []
            food = [];
            for(var i = 0; i < data.data.length; i++) {
                if(data.data[i].player) {
                    snakes.push(data.data[i].player.snake);
                }
                if(data.data[i].apple) {
                    food.push(data.data[i].apple);
                }
            }
            update();
        }
    };


//        players = data.players;
//        winner = data.winner;
//        duel_data = data.battle;
//        if (duel_data != null)
//        	clear_snakes();       
//        snakes = data.snakes;
//        foods = data.food;
