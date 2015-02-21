(function () {
    // Variable definitions
    // ====================

    // API namespace `draw`
    this.canvas_controller = {};


    // Class for drawing field
    canvas_controller.FieldDrawer = function (canvas, h_amount, w_amount, size, border, onload_callback) {
        var self = this;

        // Variable definitions
        // --------------------

        var context = canvas.getContext('2d');
        context.textBaseline = "middle";
        context.textAlign = "center";

        var canvas_width = canvas.width = border + (border + size) * w_amount,
            canvas_height = canvas.height = border + (border + size) * h_amount;

        // Coordinates of the particular sprites in picture
        var sprite_mappings = {
            "food": {
                "mushroom":          [2,  8],
                "apple1":            [5,  8],
                "apple2":            [5,  9],
                "apple3":            [5, 10]
            },

            0: {
                "error":             [5, 12],

                "head_up_0":         [0,  0],
                "head_up_1":         [0,  1],
                "head_down_0":       [0,  2],
                "head_down_1":       [0,  3],
                "head_left_0":       [0,  4],
                "head_left_1":       [0,  5],
                "head_right_0":      [0,  6],
                "head_right_1":      [0,  7],

                "body_down_0":       [1,  0],
                "body_down_1":       [1,  1],
                "body_up_0":         [1,  2],
                "body_up_1":         [1,  3],
                "body_right_0":      [1,  4],
                "body_right_1":      [1,  5],
                "body_left_0":       [1,  6],
                "body_left_1":       [1,  7],

                "tail_up_0":         [2,  0],
                "tail_up_1":         [2,  1],
                "tail_down_0":       [2,  2],
                "tail_down_1":       [2,  3],
                "tail_left_0":       [2,  4],
                "tail_left_1":       [2,  5],
                "tail_right_0":      [2,  6],
                "tail_right_1":      [2,  7],

                "body_left_up_1":    [0,  8],
                "body_left_up_0":    [0,  9],
                "body_left_down_1":  [0, 10],
                "body_left_down_0":  [0, 11],
                "body_right_up_1":   [0, 12],
                "body_right_up_0":   [0, 13],
                "body_right_down_1": [0, 14],
                "body_right_down_0": [0, 15],

                "body_up_left_1":    [1,  8],
                "body_up_left_0":    [1,  9],
                "body_up_right_1":   [1, 10],
                "body_up_right_0":   [1, 11],
                "body_down_left_1":  [1, 12],
                "body_down_left_0":  [1, 13],
                "body_down_right_1": [1, 14],
                "body_down_right_0": [1, 15]
            },

            1: {
                "error":             [5, 12],

                "head_up_0":         [3,  0],
                "head_up_1":         [3,  1],
                "head_down_0":       [3,  2],
                "head_down_1":       [3,  3],
                "head_left_0":       [3,  4],
                "head_left_1":       [3,  5],
                "head_right_0":      [3,  6],
                "head_right_1":      [3,  7],

                "body_down_0":       [4,  0],
                "body_down_1":       [4,  1],
                "body_up_0":         [4,  2],
                "body_up_1":         [4,  3],
                "body_right_0":      [4,  4],
                "body_right_1":      [4,  5],
                "body_left_0":       [4,  6],
                "body_left_1":       [4,  7],

                "tail_up_0":         [5,  0],
                "tail_up_1":         [5,  1],
                "tail_down_0":       [5,  2],
                "tail_down_1":       [5,  3],
                "tail_left_0":       [5,  4],
                "tail_left_1":       [5,  5],
                "tail_right_0":      [5,  6],
                "tail_right_1":      [5,  7],

                "body_left_up_1":    [3,  8],
                "body_left_up_0":    [3,  9],
                "body_left_down_1":  [3, 10],
                "body_left_down_0":  [3, 11],
                "body_right_up_1":   [3, 12],
                "body_right_up_0":   [3, 13],
                "body_right_down_1": [3, 14],
                "body_right_down_0": [3, 15],

                "body_up_left_1":    [4,  8],
                "body_up_left_0":    [4,  9],
                "body_up_right_1":   [4, 10],
                "body_up_right_0":   [4, 11],
                "body_down_left_1":  [4, 12],
                "body_down_left_0":  [4, 13],
                "body_down_right_1": [4, 14],
                "body_down_right_0": [4, 15]
            },

            2: {
                "error":             [5, 12],

                "head_up_0":         [6,  0],
                "head_up_1":         [6,  1],
                "head_down_0":       [6,  2],
                "head_down_1":       [6,  3],
                "head_left_0":       [6,  4],
                "head_left_1":       [6,  5],
                "head_right_0":      [6,  6],
                "head_right_1":      [6,  7],

                "body_down_0":       [7,  0],
                "body_down_1":       [7,  1],
                "body_up_0":         [7,  2],
                "body_up_1":         [7,  3],
                "body_right_0":      [7,  4],
                "body_right_1":      [7,  5],
                "body_left_0":       [7,  6],
                "body_left_1":       [7,  7],

                "tail_up_0":         [8,  0],
                "tail_up_1":         [8,  1],
                "tail_down_0":       [8,  2],
                "tail_down_1":       [8,  3],
                "tail_left_0":       [8,  4],
                "tail_left_1":       [8,  5],
                "tail_right_0":      [8,  6],
                "tail_right_1":      [8,  7],

                "body_left_up_1":    [6,  8],
                "body_left_up_0":    [6,  9],
                "body_left_down_1":  [6, 10],
                "body_left_down_0":  [6, 11],
                "body_right_up_1":   [6, 12],
                "body_right_up_0":   [6, 13],
                "body_right_down_1": [6, 14],
                "body_right_down_0": [6, 15],

                "body_up_left_1":    [7,  8],
                "body_up_left_0":    [7,  9],
                "body_up_right_1":   [7, 10],
                "body_up_right_0":   [7, 11],
                "body_down_left_1":  [7, 12],
                "body_down_left_0":  [7, 13],
                "body_down_right_1": [7, 14],
                "body_down_right_0": [7, 15]
            }
        };

        // Sprites size
        var sprite_element_size = 4 * 20,
            sprite_element_border = 4 * 2,
            padding_x = 20,
            padding_y = 1;

        // Sprites
        // Src data is bound in the init sequence (see bottom of this class)
        var snake_sprite = new Image();
        var arrow_sprite = {
            "Left": new Image(),
            "Right": new Image(),
            "Up": new Image(),
            "Down": new Image()
        };
        
        // The colored images are stored here
        var cached_colored_snake_sprites = {};


        // Methods
        // -------

        // Caching colored images

//        self.cache_new_color = function (color) {
//            if (typeof cached_colored_snake_sprites[String(color)] !== "undefined")
//                cached_colored_snake_sprites[String(color)] = canvas_controller.recolor_image(snake_sprite, color);
//        };
//
//        self.uncache_new_color = function (color) {
//            if (typeof cached_colored_snake_sprites[String(color)] !== "undefined")
//                delete cached_colored_snake_sprites[String(color)];
//        };

        // Returns recolored and resized sprite.
        self.get_or_create_color = function(color) {
            if (typeof cached_colored_snake_sprites[String(color)] !== "undefined")
                return cached_colored_snake_sprites[String(color)];
            else
                return cached_colored_snake_sprites[String(color)] =
                    canvas_controller.antialiasing(canvas_controller.recolor_image(snake_sprite, color));
        };
        
        // Drawing sprites

        // Ease everything from square at passed coordinates
        self.clear_square = function (coordinates) {
            context.clearRect(coordinates[0] * (border + size) + border, coordinates[1] * (border + size) + border, size, size);
        };

        // Draws an image from sprite of a passed type and color
        // Note that recolored sprite will be cached!
        self.fill_square_from_sprite = function (coordinates, color, phase, type) {
            var colored_sprite = self.get_or_create_color(color);
            var element_coordinates = sprite_mappings[phase][type];

            context.drawImage(colored_sprite,
                                   element_coordinates[0] * (sprite_element_size + sprite_element_border) + padding_x,
                                   element_coordinates[1] * (sprite_element_size + sprite_element_border) + padding_y,
                                   sprite_element_size,
                                   sprite_element_size,
                                   coordinates[0] * (border + size) + border,
                                   coordinates[1] * (border + size) + border,
                                   size,
                                   size);
        };

        // Ease a snake
        self.clear_snake = function (snake, phase, color) {
            for (var i = 0; i < snake.length; i++)
                clear_square([snake[i][0], snake[i][1]]);
        };

        // Util function compares two arrays
        var arr_cmp = function (a, b) {
            if (a.length != b.length)
                return false;
            for (var i = 0; i < a.length; i++)
                if (a[i] != b[i])
                    return false;
            return true
        };

        // Returns type of a sprite to use (e.g. `right_up` means turn from right to up direction)
        // Gets relative coordinates of previous and next segment of snake
        var resolve_direction = function (pos_arr) {
            if (arr_cmp(pos_arr, [0, 1, 0, -1])) return "up";
            if (arr_cmp(pos_arr, [0, -1, 0, 1])) return "down";
            if (arr_cmp(pos_arr, [1, 0, -1, 0])) return "left";
            if (arr_cmp(pos_arr, [-1, 0, 1, 0])) return "right";

            if (arr_cmp(pos_arr, [-1, 0, 0, -1])) return "left_up";
            if (arr_cmp(pos_arr, [-1, 0, 0, 1])) return "left_down";
            if (arr_cmp(pos_arr, [1, 0, 0, -1])) return "right_up";
            if (arr_cmp(pos_arr, [1, 0, 0, 1])) return "right_down";

            if (arr_cmp(pos_arr, [0, -1, -1, 0])) return "up_left";
            if (arr_cmp(pos_arr, [0, -1, 1, 0])) return "up_right";
            if (arr_cmp(pos_arr, [0, 1, -1, 0])) return "down_left";
            if (arr_cmp(pos_arr, [0, 1, 1, 0])) return "down_right";

            return "error"
        };

        // Draws snake of a passed color at a passed phase
        self.draw_snake = function (snake, phase, color) {
            var number, position, type;
            for (var i = 0; i < snake.length; i++) {
                number = (snake[i][0] + snake[i][1]) % 2;
                if (i === 0) {
                    position = [snake[i + 1][0] - snake[i][0],
                                snake[i + 1][1] - snake[i][1],
                                -snake[i + 1][0] + snake[i][0],
                                -snake[i + 1][1] + snake[i][1]
                    ];
                    type = 'head_' + resolve_direction(position) + '_' + number;
                    self.fill_square_from_sprite(snake[i], color, phase, type);
                } else if (i < snake.length - 2) {
                    position = [snake[i - 1][0] - snake[i][0],
                                snake[i - 1][1] - snake[i][1],
                                snake[i + 1][0] - snake[i][0],
                                snake[i + 1][1] - snake[i][1]
                    ];
                    type = 'body_' + resolve_direction(position) + '_' + number;
                    self.fill_square_from_sprite(snake[i], color, 0, type);
                } else if (i == snake.length - 1) {
                    position = [-snake[i - 1][0] + snake[i][0],
                                -snake[i - 1][1] + snake[i][1],
                                snake[i - 1][0] - snake[i][0],
                                snake[i - 1][1] - snake[i][1]
                    ];
                    type = 'tail_' + resolve_direction(position) + '_' + number;
                    self.fill_square_from_sprite(snake[i], color, phase, type);
                } else {
                    position = [snake[i - 1][0] - snake[i][0],
                                snake[i - 1][1] - snake[i][1],
                                snake[i + 1][0] - snake[i][0],
                                snake[i + 1][1] - snake[i][1]
                    ];
                    type = 'body_' + resolve_direction(position) + '_' + number;
                    self.fill_square_from_sprite(snake[i], color, phase, type);
                }
            }
        };

        // Clears canvas and draws field
        self.reset_field = function () {
            context.clearRect(0, 0, canvas_width, canvas_height);

            for (var i = 0; i < canvas_height; i += border + size)
                context.fillRect(0, i, canvas_width, border);

            for (i = 0; i < canvas_width; i += border + size)
                context.fillRect(i, 0, border, canvas_height);
        };

        self.draw_loading_screen = function (text, percentage) {
            context.clearRect(0, 0, canvas_width, canvas_height);

            context.fillText(text, 0.5 * canvas_width, 0.5 * canvas_height - 50);
            context.fillRect(0, 0.5 * canvas_height - 25, percentage * canvas_width, 10);
        };


        // Init sequence
        // -------------

        // Waiting for images to load, than running callback
        var images_loaded = 0;
        snake_sprite.onload =
            arrow_sprite.Left.onload =
                arrow_sprite.Right.onload =
                    arrow_sprite.Up.onload =
                        arrow_sprite.Down.onload = function () {
                            images_loaded++;
                            self.draw_loading_screen('Loading...', images_loaded / 5);
                            if (images_loaded >= 5) {
                                onload_callback();
                            }
                        };

        // Sprites data
        snake_sprite.src = "static/snake2x.png";
        arrow_sprite.Left.src = "static/arrow_left.png";
        arrow_sprite.Right.src = "static/arrow_right.png";
        arrow_sprite.Up.src = "static/arrow_up.png";
        arrow_sprite.Down.src = "static/arrow_down.png";

    };


    // Static functions definitions
    // ============================

    // Changes color of an image
    canvas_controller.recolor_image = function (sprite, color, static_mappings, color_barrier) {
        static_mappings = typeof static_mappings === "undefined" ? {} : color_barrier;
        color_barrier = typeof color_barrier === "undefined" ? 50 : color_barrier;

        var temp_canvas = document.createElement('canvas');
        temp_canvas.height = sprite.height;
        temp_canvas.width = sprite.width;

        var temp_context = temp_canvas.getContext('2d');
        temp_context.drawImage(sprite, 0, 0);

        var imageData = temp_context.getImageData(0, 0, sprite.width, sprite.height);

        for (var i = 0; i < sprite.width * sprite.height * 4; i += 4) {
            var static_map = static_mappings[imageData.data[i] + "," +
                imageData.data[i + 1] + "," +
                imageData.data[i + 2]];
            if (typeof static_map !== 'undefined') {
                imageData.data[i] = static_map[0];
                imageData.data[i + 1] = static_map[1];
                imageData.data[i + 2] = static_map[2];
            } else if (imageData.data[i] <= color_barrier &&
                imageData.data[i + 1] <= color_barrier &&
                imageData.data[i + 2] <= color_barrier) {
                imageData.data[i] = color[0];
                imageData.data[i + 1] = color[1];
                imageData.data[i + 2] = color[2];

                if (color.length > 3)
                    imageData.data[i + 3] = color[3];
            }
        }

        temp_context.putImageData(imageData, 0, 0);
        return temp_canvas;
    };

    // Applies antialiasing
    canvas_controller.antialiasing = function (sprite, hardness) {
        hardness = typeof hardness === "undefined" ? 0.65 : hardness;
        if (hardness > 1) hardness = 1;
        if (hardness < 0) hardness = 0;
        var temp_canvas = document.createElement('canvas'),
            temp_context = temp_canvas.getContext('2d');

        temp_canvas.width = sprite.width * hardness;
        temp_canvas.height = sprite.height * hardness;

        temp_context.drawImage(sprite, 0, 0, temp_canvas.width, temp_canvas.height);
        temp_context.drawImage(temp_canvas, 0, 0, temp_canvas.width * hardness, temp_canvas.height * hardness);

        var return_canvas = document.createElement('canvas'),
            return_context = return_canvas.getContext('2d');

        return_canvas.width = sprite.width;
        return_canvas.height = sprite.height;

        return_context.drawImage(temp_canvas, 0, 0, temp_canvas.width * hardness, temp_canvas.height * hardness, 0, 0, return_canvas.width, return_canvas.height);

        return return_canvas;
    }

})();
