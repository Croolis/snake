(function () {
    // Private variable definitions
    // ============================

    var socket_connection_init = false;


    // Variable definitions
    // ====================

    // API namespace `network`
    var network = this.network = {};


    // Static functions definitions
    // ============================

    // Init new connection
    network.init = function (destination) {
        destination = typeof destination === "undefined" ? "ws:localhost:9000/test" : destination;
        if (!socket_connection_init) {
            var socket = new WebSocket(destination);
            socket.onopen = network.onopen;
            socket.onmessage = function (event) {
                console.log(event);
                network.onmessage(event, JSON.parse(event.data));
            };
        } else {
            console.log('Connection is already established! `init()` call is not allowed!')
        }
    };

    // Wrapper for sending data
    network.send = function (data) {
        socket.send(JSON.stringify(data));
    };

    // Network API functions
    network.onmessage = function () {};
    network.onopen = function () {};

})();
