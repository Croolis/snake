var processingInstance;
var tabl = [[20, 30], [30, 30], [30, 40], [30, 50], [40, 50], [50, 50], [60, 50], [60, 60], [60, 70], [60, 80]];
setTimeout( function() {
    processingInstance = Processing.getInstanceById('cc');
}, 1000);

function aa(xx, yy) {
    for(var i = 0; i<tabl.length-1; i++) {
        tabl[i][0] = tabl[i+1][0];
        tabl[i][1] = tabl[i+1][1];
    }
    tabl[tabl.length-1][0]+=xx;
    tabl[tabl.length-1][1]+=yy;
}

function addBlock() {
    tabl.push([0,0]);
}

function delBlock() {
    tabl.pop();
}

document.onkeydown = key_handler;
function key_handler(event) {
    if (event.type == "keydown")
        console.log(event.keyCode);
        switch (event.keyCode) {
            case (37): send("Left"); break;
            case (38): send("Up"); break;
            case (39): send("Right"); break;
            case (40): send("Down"); break; 
        }
}

var snakes = [], players = [], food = [];

function init(data) {
    var arrayOfColor = new Array();
    for(var i = 0; i < data.length; i++) {
        arrayOfColor.push(data[i].color);
    }
    //console.log(data.length, arrayOfColor);
    processingInstance.init(data.length, arrayOfColor);
}

function update() {
    processingInstance.setCoords(snakes);
    processingInstance.setFood(food);
}
