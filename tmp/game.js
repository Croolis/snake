// количество клеток по вертикали, горизонтали, размер клетки, толщина границы
var h_amount = 20, w_amount = 40, size = 20, border = 1;
// размеры поля
var canvas_width = border + (border + size) * w_amount, canvas_height = border + (border + size) * h_amount;

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

    if (cmp(arr, [-1, 0, 0, -1])) return 26; // 26
    if (cmp(arr, [-1, 0, 0, 1])) return 30;
    if (cmp(arr, [1, 0, 0, -1])) return 30;
    if (cmp(arr, [1, 0, 0, 1])) return 30;    
    if (cmp(arr, [0, -1, -1, 0])) return 28; // 28
    if (cmp(arr, [0, -1, 1, 0])) return 30; // с
    if (cmp(arr, [0, 1, -1, 0])) return 24; // 24
    if (cmp(arr, [0, 1, 1, 0])) return 30; //   
};
// спрайты змейки
var snake_sprites = new Image();
snake_sprites.src = "snake2.png";
//body.src = "data:image/png;base64,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";

var snakes = [
                [[2, 0],[1, 0], [0, 0]],
                [[0, 1],[1, 1], [2, 1]],
                [[3,3],[2, 3],[1, 3], [0, 3]],
                [[0, 4],[1, 4], [2, 4], [3, 4]],
                [[5, 0], [5, 1], [5,2]],
                [[6, 2], [6, 1], [6,0]],
                [[7, 0], [7, 1], [7,2], [7,3]],
                [[8, 3], [8, 2], [8,1], [8,0]],
                [[5, 10],[5, 11], [5, 12], [5, 13], [6, 13], [6, 14], [7, 14]],
                [[0, 5], [1, 5], [1, 6], [1, 7], [1, 8], [2, 8], [3, 8], [4, 8], [4, 7], [4, 6], [5, 6], [6, 6], [6, 7], [6, 8], [7, 8], [8, 8], [8, 7], [8, 6], [9, 6], [10, 6], [11, 6], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10], [12, 11], [12, 12], [13, 12], [13, 13], [14, 13], [15, 13], [16, 13], [16, 14], [16, 15], [16, 16], [15, 16], [14, 16], [13, 16], [12, 16]]
            ];

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
    if (type <= 111)
        context.drawImage(snake_sprites, size * (type % 4), size * Math.floor(type / 4), size, size, x * (border + size) + border, y * (border + size) + border, size, size);
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
function timer(time, next_func) {
    var i = time;
    context.clearRect(0, 0, canvas_width, canvas_height);
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = 'bold 50px sans-serif';
    var timerId = setTimeout(function go() {
        if (i > 0) {
            context.clearRect(0, 0, canvas_width, canvas_height);
            context.fillText(i, canvas_width / 2, canvas_height / 2);
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

    display_field()

    for (var i = 0; i < snakes.length; i++)
        for (var j = 0; j < snakes[i].length; j++)
            clear_square(snakes[i][j][0], snakes[i][j][1]);
    console.log(snakes);
    //TODO: обновить snakes пришедшими данными
    for (var i = 0; i < snakes.length; i++) {
        var t_snake = snakes[i];
        //console.log(t_snake);
        for (var j = 0; j < snakes[i].length; j++) {
            var hx = 0, hy = 0, tx = 0, ty = 0;
            if (j != 0) {
                tx = snakes[i][j - 1][0] - snakes[i][j][0];
                ty = snakes[i][j - 1][1] - snakes[i][j][1];
            }
             if (j + 1 != t_snake.length) {
                hx = snakes[i][j][0] - snakes[i][j + 1][0];
                hy = snakes[i][j][1] - snakes[i][j + 1][1];
            }
            var a = new Array(tx, ty, hx, hy);
            console.log(a);
            console.log(keys(a));
            var type = keys(a) + (j % 2);
            fill_square(snakes[i][j][0], snakes[i][j][1], type);
        }
    }

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

timer(3, battleground);