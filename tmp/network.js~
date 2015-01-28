
    var socket = new WebSocket("ws:172.19.32.247:9000/test");

    socket.onopen = function() {

    };

    send = function(data) {
        socket.send(JSON.stringify(data));
    }

    socket.onmessage = function(event) {
        console.log(event);
        var data = JSON.parse(event.data);
        players = data.players;
        winner = data.winner;
        duel_data = data.battle;
        if (duel_data != null)
        	clear_snakes();       
        snakes = data.snakes;
        foods = data.food;
        game();
    };