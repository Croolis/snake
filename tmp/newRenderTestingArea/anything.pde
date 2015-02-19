float[][][] coord = new float[0][0][0];

float segLength = 10; // длина
float mapSize = 20;
float areaSize = 30;

int X, Y;
int nX, nY;
int delay = 10;
int NN=200;

class snake {
    float[][] realCor;
    color c;
    snake(int size) {
        realCor = new float[size][2];
        for(int i = 0; i < size; i++) {
            realCor[i][0] = 0;
            realCor[i][1] = 0;
        }
        c = color(255, 255, 0, 255);
    }

    void setColor(int R, int G, int B) {
        c = color(R, G, B, 255);
    }

    void drawSnake() {
        noFill();
        stroke( c );
        strokeWeight(10);
        strokeJoin(ROUND);
        beginShape();
        for(int i = 0; i < realCor.length()-1; i++) {
            vertex((realCor[i][0]-1)*mapSize, (realCor[i][1]-1)*mapSize);
            vertex((realCor[i+1][0]-1)*mapSize, (realCor[i+1][1]-1)*mapSize);
        }
        endShape();
    }

    void correct(float[][] coords) {
        if(coords.length()>realCor.length()) {
            float tx = realCor[realCor.length()-1][0];
            float ty = realCor[realCor.length()-1][1];
            float[] tar = new float[2];
            tar[0] = tx;
            tar[1] = ty;
    
            while(coords.length()>realCor.length()) {
                append(realCor, tar);
            }
        }
        if(coords.length()<realCor.length() && coords.length()!=0) {
            while(coords.length()<realCor.length()) {
                realCor = subset(realCor, 1);

            }
        }
        for(int i = 0; i < coords.length(); i++) {
            realCor[i][0] += (coords[i][0]-realCor[i][0])/delay;
            realCor[i][1] += (coords[i][1]-realCor[i][1])/delay;
        }
    }
}

class food {
    float[][] coords;
    PImage sprite;
    food() {
        coords = new float[0][0];
        sprite = loadImage("apple.png");
    }
    void setCoords(float[][] c) {
        coords = c;
    }
    void draw() {
        for(int i = 0; i < coords.length(); i++) {
            image(sprite, coords[i][0]*mapSize-3*mapSize/2, coords[i][1]*mapSize-3*mapSize/2);
        }
    }
}

void drawField() {
    stroke( color(130, 130, 130) );
    strokeWeight(1);
    for(int i = 0; i < areaSize; i++) {
        line(i*mapSize, 0, i*mapSize, areaSize*mapSize);
    }
    for(int i = 0; i < areaSize; i++) {
        line(0, i*mapSize, areaSize*mapSize, i*mapSize);
    }
}

snake[] snakes = new snake[0];
food foods;

void setup() {
    size(mapSize*areaSize, mapSize*areaSize);
    foods = new food();
    smooth();
}

void draw() {
    background(238, 209, 105);
    drawField();
    foods.draw();
    for(int i = 0; i < snakes.length(); i++) {
        if(coord.length()>0) {
            snakes[i].correct(coord[i]);
            snakes[i].drawSnake();  
        }
    }
}

void setCoords(float[][][] data) {
    coord = data;
}

void setFood(float[][] data) {
    foods.setCoords(data);
}

void init(int sizeOfSnakes, int[][] colors) {
    snakes = new snake[sizeOfSnakes];
    for(int i = 0; i < sizeOfSnakes; i++) {
        snakes[i] = new snake(2);
        snakes[i].setColor(colors[i][0], colors[i][1], colors[i][2]);
    }
}
