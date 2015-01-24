var iter_counter = 0;
// количество клеток по вертикали, горизонтали, размер клетки, толщина границы
var h_amount = 20, w_amount = 40, size = 20, border = 1;
// размеры поля
var canvas_width = border + (border + size) * w_amount, canvas_height = border + (border + size) * h_amount;
// обработчик нажатий
document.onkeydown = key_handler;
function key_handler(event) {
    if (event.type == "keydown")
        var dir;
        switch (event.keyCode) {
            case (37): dir = "Left"; break;
            case (38): dir = "Up"; break;
            case (39): dir = "Right"; break;
            case (40): dir = "Down"; break; 
        }
        send(dir);
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
// спрайты змейки
var snake_sprites = new Image();
snake_sprites.src = "snake2.png";
// спрайты еды
var food_sprites = new Image();
food_sprites.src = "apple.png";

var snakes, foods, duel_data;

var canvas = document.getElementById("playground"),
    context = canvas.getContext('2d');

// служит для перекрашивания набора спрайтов
function recolor_image(snake_sprites, red, green, blue) {
    var temp_canvas = document.createElement('canvas');
    var temp_context = temp_canvas.getContext('2d');
    temp_context.drawImage(snake_sprites, 0, 0);
    var imageData = temp_context.getImageData(0, 0, snake_sprites.width, snake_sprites.height);
    var color_barrier = 50; // все цвета от 0 до color_barrier будут перекрашиваться

    for(var i = 0; i < snake_sprites.width * snake_sprites.height * 4; i += 4) {
        if(imageData.data[i] <= color_barrier && imageData.data[i+1] <= color_barrier && imageData.data[i+2] <= color_barrier) {
            imageData.data[i] += red;
            imageData.data[i+1] += green;
            imageData.data[i+2] += blue;
            // imageData.data[i+3] - альфа-канал
        }
    }

    temp_canvas = document.createElement('canvas');
    temp_context = temp_canvas.getContext('2d');
    temp_context.putImageData(imageData, 0, 0);
    delete temp_context;
    return temp_canvas;
}

// отображает в квадрате с координатами x, y
// картинку с кодом type
function fill_square(x, y, type) {
    if (type <= 31)
        context.drawImage(snake_sprites, size * (type % 4), size * Math.floor(type / 4), size, size, x * (border + size) + border, y * (border + size) + border, size, size);
    else 
       context.drawImage(food_sprites, x * (border + size) + border, y * (border + size) + border, size, size);
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
    context.textBaseline = "middle";
    context.textAlign = "center";
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

function battleground() {
    context.clearRect(0, 0, canvas_width, canvas_height);

    display_field();

    if (duel_data != null) {
        duel();
    }

    for (var i = 0; i < snakes.length; i++)
        for (var j = 0; j < snakes[i].length; j++)
            clear_square(snakes[i][j][0], snakes[i][j][1]);
    for (var i = 0; i < snakes.length; i++) {
        for (var j = 0; j < snakes[i].length; j++) {
            var hx = 0, hy = 0, tx = 0, ty = 0;
            if (j != 0) {
                tx = snakes[i][j - 1][0] - snakes[i][j][0];
                ty = snakes[i][j - 1][1] - snakes[i][j][1];
            }
             if (j + 1 != snakes[i].length) {
                hx = snakes[i][j][0] - snakes[i][j + 1][0];
                hy = snakes[i][j][1] - snakes[i][j + 1][1];
            }
            var temp_arr = new Array(tx, ty, hx, hy);
            var type = keys(temp_arr) + ((j + iter_counter) % 2);
            fill_square(snakes[i][j][0], snakes[i][j][1], type);
        }
    }

    iter_counter = (iter_counter + 1) % 2;
}

function duel() {
    context.clearRect(0, 0, canvas_width, canvas_height);
    // расстояние между bar'ами, отступ между bar'ом и краем, ширина bar'a                
    var separator = 50, margin = 10, bar_width = (canvas_width - separator - 2 * margin) / 2;
    // эти значения каким-то образом получаются через websocket
    var left_progress, right_progress;
    // левый progress bar                
    context.strokeRect(margin, margin, bar_width, 50);
    // правый progress bar
    context.strokeRect(canvas_width - bar_width - margin, margin, bar_width, 50);

    // тестирование progress bar'ов
    left_progress = 1/2;
    right_progress = 2/3;
    fill_progress_bar(margin, margin, bar_width, 50, left_progress, "red", true);
    fill_progress_bar(canvas_width - bar_width - margin, margin, bar_width, 50, right_progress, "blue", false);
}