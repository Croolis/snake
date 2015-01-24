timer(4, function() {
    var socket = new WebSocket("ws:localhost:9000/test");

    socket.onopen = function() {

    };

    send = function(data) {
        socket.send(JSON.stringify(data));
    }

    socket.onmessage = function(event) {
        console.log(event)
        snakes = JSON.parse(event.data).snakes;
        battleground();
    };
}, false);