(function () {

    // Variable definitions
    // ====================

    // API namespace `network_controller`
    this.network_controller = {};

    network_controller.SocketConnection = function (destination) {
        var self = this;

        destination = typeof destination === "undefined" ? "ws:localhost:9000/test" : destination;
        var socket = new WebSocket(destination);

        // Wrapper for sending data
        var send = self.send = function (data) {
            socket.send(JSON.stringify(data));
        };

        self.on_message = function () {};
        self.on_open = function () {};
        self.on_error = function () {};
        self.on_close = function () {};

        socket.onmessage = function (e) {self.on_message(e, JSON.parse(e.data))};
        socket.onopen = function (e) {self.on_open(e)};
        socket.onerror = function (e) {self.on_error(e)};
        socket.onclose = function (e) {self.on_close(e)};
    };
})();
