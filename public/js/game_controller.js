(function () {

    // Variable definitions
    // ====================

    // game_session_settings:
    // canvas: canvas DOM element
    // h_amount, w_amount: how many tiles in field (int)
    // size: size of each tile (int, px)
    // border: width of border between tiles (int, px)
    // socket_url: url to connect
    this.GameController = function (game_session_settings) {
        var self = this;

        // Variable definitions
        // --------------------

        var canvas = game_session_settings.canvas,
            h_amount = game_session_settings.h_amount,
            w_amount = game_session_settings.w_amount,
            size = game_session_settings.size,
            border = game_session_settings.border,
            socket_url = game_session_settings.socket_url,
            socket;


        // game status
        var game_status = 0;
        // -1 = error
        // 0 = initializing
        // 1 = normal game mode
        // 2 = duel
        // 3 = game over

        var self_name;
        var players = {};

        var last_move_message;
        var animation_frame_1,
            animation_frame_2;

        var DEBUG = false;


        var drawer = new CanvasController(canvas, h_amount, w_amount, size, border, function () {
            drawer.draw_loading_screen('Connecting...', 1);

            socket = new NetworkController(socket_url);

            socket.on_message = function(e, d) {
                if (DEBUG) console.log('message:', e);
                message_handler(e, d);
            };
            socket.on_open = function (e) {
                last_move_message = Date.now();
                if (DEBUG) console.log('open:', e);
                drawer.draw_loading_screen('Waiting for other players...', 1);
            };
            socket.on_error = function (e) {
                if (DEBUG) console.log('error:', e);
                drawer.draw_loading_screen('Connection error!', 0); game_status = -1;
            };
            socket.on_close = function (e) {
                if (DEBUG) console.log('connection closed:', e);
                if (game_status != 3) {
                    drawer.draw_loading_screen('Connection error!', 0);
                    game_status = -1
                }
            };
        });

        var message_handler = function (e, d) {
            switch (d.message) {
                case ("your name"): your_name(e, d); break;
                case ("game start"): game_start(e, d); break;
                case ("move"): move(e, d); break;
                case ("cut"): cut(e, d); break;
                case ("apple eaten"): apple_eaten(e, d); break;
                case ("mouse eaten"): mouse_eaten(e, d); break;
                case ("died"): died(e, d); break;
                case ("game over"): game_over(e, d); break;
                case ("duel"): duel(e, d); break;
                case ("duel ended"): duel_ended(e, d); break;
            }
        };

        var your_name = function (e, d) {
            self_name = d.data;
        };
        var game_start = function (e, d) {
            drawer.reset_field();
            for (var i = 0; i < d.data.length; i++) {
                var user = d.data[i];
                var player = players[user.username] = {};
                // player['color'] = user.color;
                player.color = [Math.random() * 200, Math.random() * 200, Math.random() * 200];
                drawer.cache_color(player.color);
                player.snake = [];
                player.last_snake = [];
                player.rainbow = 0;
            }
        };
        var move = function (e, d) {
            game_status = 1;
            var dt = Date.now() - last_move_message;
            last_move_message = Date.now();

            for (var i = 0; i < d.data.length; i++) {
                if (d.data[i].player && players[d.data[i].player.name]) {
                    var player = players[d.data[i].player.name];
                    player.last_snake = player.snake;
                    player.snake = d.data[i].player.snake;
                    if (player.rainbow)
                        player.rainbow -= 1;
                }
            }

            draw_main_frame(e, d, 0);

            clearTimeout(animation_frame_1);
            clearTimeout(animation_frame_2);
            animation_frame_1 = window.setTimeout(function () {draw_main_frame(e, d, 1);}, dt / 3);
            animation_frame_2 = window.setTimeout(function () {draw_main_frame(e, d, 2);}, 2 * dt / 3);
        };
        var cut = function (e, d) {};
        var apple_eaten = function (e, d) {};
        var mouse_eaten = function (e, d) {
            if (players[d.data])
                players[d.data].rainbow = 15;
        };
        var died = function (e, d) {};
        var game_over = function (e, d) {};
        var duel = function (e, d) {};
        var duel_ended = function (e, d) {};

        document.onkeydown = function (event) {
            if (event.type == "keydown")
                switch (event.keyCode) {
                    case (37): socket.send("Left"); break;
                    case (38): socket.send("Up"); break;
                    case (39): socket.send("Right"); break;
                    case (40): socket.send("Down"); break;
                }
        };

        var draw_main_frame = function (e, d, phase) {
            drawer.reset_field();
            for (var i = 0; i < d.data.length; i++) {
                if (d.data[i].player && players[d.data[i].player.name]) {
                    var player = players[d.data[i].player.name];
                    if (player.snake.length > player.last_snake.length)
                        //noinspection JSDuplicatedDeclaration
                        var actual_phase = [phase, 2];

                    else
                        //noinspection JSDuplicatedDeclaration
                        var actual_phase = phase;

                    if (player['rainbow'])
                        drawer.draw_snake(player.snake, actual_phase, 'rainbow');
                    else
                        drawer.draw_snake(player.snake, actual_phase, player.color);
                } else if (d.data[i].apple) {
                    var apple_sprite = 'apple_' + ((d.data[i].apple[0] + d.data[i].apple[1]) % 3);
                    drawer.fill_square_from_sprite(d.data[i].apple, [0, 0, 0], 'food', apple_sprite);
                } else if (d.data[i].mouse) {
                    drawer.fill_square_from_sprite(d.data[i].mouse, [0, 0, 0], 'food', 'mushroom');
                }
            }
        };

    };

})();
