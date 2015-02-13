float[][] coord = new float[0][0];
float[][] realCor;
float segLength = 10;
PImage a;

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

    void drawSnake() {
        noFill();
        stroke( c );
        strokeWeight(10);
        strokeJoin(ROUND);
        beginShape();
        for(int i = 0; i < realCor.length()-1; i++) {
            vertex(realCor[i][0], realCor[i][1]);
            vertex(realCor[i+1][0], realCor[i+1][1]);
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
//            println(coords.length());
//            println(realCor.length());
        }
        for(int i = 0; i < coords.length(); i++) {
            realCor[i][0] += (coords[i][0]-realCor[i][0])/delay;
            realCor[i][1] += (coords[i][1]-realCor[i][1])/delay;
        }
    }
}

snake sn1;

void setup() {
    size(500, 500);
    smooth();
    sn1 = new snake(10);
  
}

void draw() {
    background(226);
    //X+=(nX-X)/delay;
    //Y+=(nY-Y)/delay;
    //realCor = new float[coord.length()][2];
    //for(int i = 0; i < coord.length(); i++) {
    //    realCor[i][0] += (coord[i][0]-realCor[i][0])/delay;
    //    realCor[i][1] += (coord[i][1]-realCor[i][1])/delay;
    //}
    sn1.correct(coord);
    sn1.drawSnake();
}

/*
void drawSnake(float[][] snake) {
    noFill();
    color c = color(255, 255, 0, 255);
    stroke( c );
    strokeWeight(10);
    strokeJoin(ROUND);
    beginShape();
    for(int i = 0; i < snake.length()-1; i++) {
        //line(snake[i][0], snake[i][1], snake[i+1][0], snake[i+1][1]);
        vertex(snake[i][0], snake[i][1]);
        vertex(snake[i+1][0], snake[i+1][1]);
    }
    endShape();
}*/

/*

void dragSegment(int i, float xin, float yin) {
  float dx = xin - realx[i];
  float dy = yin - realy[i];
  float angle = atan2(dy, dx);  
  realx[i] = xin - cos(angle) * segLength;
  realy[i] = yin - sin(angle) * segLength;
  //stroke(23, 79, 4, 220);
  
  pushMatrix();
  translate(realx[i], realy[i]);
  rotate(angle);
  
  color c;
  
  if ( i % 3 == 1 )
    c = color(0, 0, 0, 255);
  else if ( i % 3 == 2 )
    c = color(255, 255, 0, 255);
  else
    c = color(255, 0, 0, 255);

  stroke( c );
  strokeWeight(10);
  line(0, 0, segLength, 0);
  
  if ( i == realx.length - 1 )
  {
    fill( c );
    noStroke();
    beginShape(TRIANGLES);
    vertex(0, 5);
    vertex(-2 * segLength, 0);
    vertex(0, -5);
    endShape();
  }
  
  if ( i == 0 )
  {
   // stroke(0, 255);
   noStroke();
   fill(0, 255);
   ellipse(segLength, -2, 3, 3);
   ellipse(segLength, 2, 3, 3);
    //point(segLength, -2);
    //point(segLength, 2);
  }
  
  popMatrix();
}


void mouseMoved(){
  nX = mouseX;
  nY = mouseY;  
}*/

void ini(int size) {
    realCor = new float[size][2];
    for(int i = 0; i < size; i++) {
        realCor[i][0] = 0;
        realCor[i][1] = 0;
    }
    
}

void setCoords(int size, float[][] data) {
    coord = new float[size][2];
    for(int i = 0; i < size; i++) {
        coord[i][0] = data[i][0];
        coord[i][1] = data[i][1];
    }
}

