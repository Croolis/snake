var iter_counter = 0, in_duel = false;
// количество клеток по вертикали, горизонтали, размер клетки, толщина границы
var h_amount = 20, w_amount = 40, size = 20, border = 1;
// размеры поля
var canvas_width = border + (border + size) * w_amount, canvas_height = border + (border + size) * h_amount;

// спрайты змейки
var snake_sprites = new Image();
//snake_sprites.src = "snake2.png";
snake_sprites.src= "data:image/png;base64,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";
// спрайты еды
var food_sprites = new Image();
food_sprites.src = "apple.png";
// спрайты стрелочек для дуэли
var arrow_sprite = {"Left": new Image(), "Right": new Image(), "Up": new Image(), "Down": new Image()};
arrow_sprite.Left.src = "left.png"; arrow_sprite.Right.src = "right.png";
arrow_sprite.Up.src = "up.png"; arrow_sprite.Down.src = "down.png";

// data
var snakes, foods, duel_data, players, winner;

var canvas = document.getElementById("playground"),
    context = canvas.getContext('2d');
context.textBaseline = "middle";
context.textAlign = "center";

// обработчик нажатий
document.onkeydown = key_handler;
function key_handler(event) {
    if (event.type == "keydown")
        switch (event.keyCode) {
            case (37): send("Left"); break;
            case (38): send("Up"); break;
            case (39): send("Right"); break;
            case (40): send("Down"); break; 
        }
}

function cmp(a, b) {
    return ((a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2]) && (a[3] === b[3]))
}

function keys(arr) {
    if (cmp(arr, [-1, 0, 0, 0])) return 22;
    if (cmp(arr, [1, 0, 0, 0])) return 18;
    if (cmp(arr, [0, -1, 0, 0])) return 16;
    if (cmp(arr, [0, 1, 0, 0])) return 20;

    if (cmp(arr, [-1, 0, -1, 0])) return 14;
    if (cmp(arr, [1, 0, 1, 0])) return 14;
    if (cmp(arr, [0, -1, 0, -1])) return 12;
    if (cmp(arr, [0, 1, 0, 1])) return 12;

    if (cmp(arr, [0, 0, -1, 0])) return 2;
    if (cmp(arr, [0, 0, 1, 0])) return 6;
    if (cmp(arr, [0, 0, 0, -1])) return 4;
    if (cmp(arr, [0, 0, 0, 1])) return 0;

    if (cmp(arr, [-1, 0, 0, -1])) return 26;
    if (cmp(arr, [-1, 0, 0, 1])) return 30;
    if (cmp(arr, [1, 0, 0, -1])) return 24;
    if (cmp(arr, [1, 0, 0, 1])) return 28;  
    if (cmp(arr, [0, -1, -1, 0])) return 28;
    if (cmp(arr, [0, -1, 1, 0])) return 30; 
    if (cmp(arr, [0, 1, -1, 0])) return 24;
    if (cmp(arr, [0, 1, 1, 0])) return 26;  
};

// служит для перекрашивания набора спрайтов
function recolor_image(sprite, red, green, blue) {
    var temp_canvas = document.createElement('canvas');
    temp_canvas.height = sprite.height;
    var temp_context = temp_canvas.getContext('2d');
    temp_context.drawImage(sprite, 0, 0);
    var imageData = temp_context.getImageData(0, 0, sprite.width, sprite.height);
    var color_barrier = 50; // все цвета от 0 до color_barrier будут перекрашиваться

    for(var i = 0; i < sprite.width * sprite.height * 4; i += 4) {
        if(imageData.data[i] <= color_barrier && imageData.data[i+1] <= color_barrier && imageData.data[i+2] <= color_barrier) {
            imageData.data[i] = red;
            imageData.data[i+1] = green;
            imageData.data[i+2] = blue;
            // imageData.data[i+3] - альфа-канал
        }
    }

    temp_canvas = document.createElement('canvas');
    temp_canvas.height = sprite.height;
    temp_context = temp_canvas.getContext('2d');
    temp_context.putImageData(imageData, 0, 0);
    delete temp_context;
    return temp_canvas;
}

// отображает в квадрате с координатами x, y
// картинку с кодом type
function fill_square(x, y, type, player_number) {
    if (type != -25)
        context.drawImage(snakes[player_number].img, size * (type % 4), size * Math.floor(type / 4), size, size, x * (border + size) + border, y * (border + size) + border, size, size);
    else 
        context.drawImage(food_sprites, x * (border + size) + border, y * (border + size) + border, size, size);
}

function clear_snakes() {
    for (var i = 0; i < snakes.length; i++)
        if (snakes[i] != null)
            for (var j = 0; j < snakes[i].length; j++)
                clear_square(snakes[i][j][0], snakes[i][j][1]);
}

function clear_square(x, y) {
    context.clearRect(x * (border + size) + border, y * (border + size) + border, size, size);            
}

// закрашивает левый или правый progress bar поединка в цвет color
// на процент, равный progress
function fill_progress_bar(x, y, width, height, progress, color, left) {
    var current_style = context.fillStyle, border = 2;
    context.fillStyle = color;
    if (left == false)
        context.fillRect(x + border + (width - 2 * border) * (1 - progress), 
            y + border, (width - 2 * border) * progress, height - 2 * border);
    else
        context.fillRect(x + border, 
            y + border, (width - 2 * border) * progress, height - 2 * border);
    context.fillStyle = current_style;
}

// отсчитывает time секунд с выводом на экран, после чего вызывает next_func
function timer(time, next_func, countdown) {
    var i = time;
    context.clearRect(0, 0, canvas_width, canvas_height);
    context.font = 'bold 50px sans-serif';
    var timerId = setTimeout(function go() {
        if (i > 0) {
            if (countdown) {
                context.clearRect(0, 0, canvas_width, canvas_height);
                context.fillText(i, canvas_width / 2, canvas_height / 2);
            }
            setTimeout(go, 1000);
        }
        else {
            clearTimeout(timerId);
            next_func();
        }
        i--;
    }, 1000);
}

// разделяет поле на клетки
function display_field() {
    for (var i = 0; i < canvas_height; i += border + size) {
        context.fillRect(0, i, canvas_width, border);
    }
    for (var i = 0; i < canvas_width; i += border + size) {
        context.fillRect(i, 0, border, canvas_height);
    }
}

function game() {
    if (winner != -1) {
        show_winner(winner);
    } else {
        if (duel_data != null) {
            duel();
        } else {
            if (in_duel) {
                context.clearRect(0, 0, canvas_width, canvas_height);
                display_field();
                in_duel = false;
            }
            field();
        }
    }
}


function field() {
    context.clearRect(0, 0, canvas_width, canvas_height);
    display_field();
    for (var i = 0; i < snakes.length; i++) {
        if (snakes[i] != null) {
            if (snakes[i].img == null)
                snakes[i].img = recolor_image(snake_sprites, 0, 200 , 0);
            for (var j = 0; j < snakes[i].length; j++) {
                var hx = 0, hy = 0, tx = 0, ty = 0;
                if (j != 0) {
                    tx = snakes[i][j - 1][0] - snakes[i][j][0];
                    if (tx > 1)
                        tx = -1;
                    if (tx < -1)
                        tx = 1;
                    ty = snakes[i][j - 1][1] - snakes[i][j][1];
                    if (ty > 1)
                        ty = -1;
                    if (ty < -1)
                        ty = 1;
                }
                 if (j + 1 != snakes[i].length) {
                    hx = snakes[i][j][0] - snakes[i][j + 1][0];
                    if (hx > 1)
                        hx = -1;
                    if (hx < -1)
                        hx = 1;
                    hy = snakes[i][j][1] - snakes[i][j + 1][1];
                    if (hy > 1)
                        hy = -1;
                    if (hy < -1)
                        hy = 1;
                }
                var temp_arr = new Array(tx, ty, hx, hy);
                var type = keys(temp_arr) + ((j + iter_counter) % 2);
                fill_square(snakes[i][j][0], snakes[i][j][1], type, i);
            }
        }
    }
    for (var i = 0; i < foods.length; i++) {
        fill_square(foods[i][0], foods[i][1], -25);
    }
    iter_counter = (iter_counter + 1) % 2;
}

function duel() {
    context.clearRect(0, 0, canvas_width, canvas_height);
    // расстояние между bar'ами, отступ между bar'ом и краем, ширина bar'a                
    var separator = 50, margin = 10, bar_width = (canvas_width - separator - 2 * margin) / 2;
    var left_progress = duel_data.pow1/100, right_progress = duel_data.pow2/100;
    var arrow_size = 60;
    // progress bar и стрелка левого игрока
    context.strokeRect(margin, margin, bar_width, 50);
    context.drawImage(arrow_sprite[duel_data.orient1], margin + bar_width/2 - arrow_size/2, margin + 50 + separator);
    // progress bar и стрелка правого игрока
    context.strokeRect(canvas_width - bar_width - margin, margin, bar_width, 50);
    context.drawImage(arrow_sprite[duel_data.orient2], canvas_width - margin - bar_width/2 - arrow_size/2, margin + 50 + separator);

    fill_progress_bar(margin, margin, bar_width, 50, Math.min(left_progress, 1), "red", true);
    fill_progress_bar(canvas_width - bar_width - margin, margin, bar_width, 50, Math.min(right_progress, 1), "blue", false);
}

function show_winner(winner) {
    context.font = 'bold 80px sans-serif';
    context.clearRect(0, 0, canvas_width, canvas_height);
    context.fillText(players[winner].username + " won!", canvas_width / 2, canvas_height / 2);
}
