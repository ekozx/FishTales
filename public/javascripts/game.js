/* global z */
  var container;
  var container_rocks;
  var container_food;
  var generation;
  //length of fish sensor
  var w;
  var h;
  var bestFitness = 0;
  var food_count = 50;
  var food_radius = 10;
  var population_size = 14;
  var fish_radius = 20;
  var fish_speed = 5;
  var generationTime = 1000;

  var counter;
  var pop = [];
  var dead = [];

function init() {
  generation = 0;
  // create a new stage and point it at our canvas:
  canvas = document.getElementById("demoCanvas");
  stage = new createjs.Stage(canvas);
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight - 42; // temporary fix

  w = canvas.width;
  h = canvas.height;
  counter = 0;

  container = new createjs.Container();
  stage.addChild(container);

  for (var i = 0; i < population_size; i++) {
    var fish = new Fish();
    fish.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, fish_radius);

    fish.circle.x = Math.random() * w;
    fish.circle.y = Math.random() * h;
    fish.circle.velY = fish_speed;
    fish.circle.velX = 0;

    var turn = (Math.random() * 360);
    var rad = (turn*Math.PI)/180;
    var cs = Math.cos(rad);
    var sn = Math.sin(rad);

    var px = fish.circle.velX * cs - fish.circle.velY * sn;
    var py = fish.circle.velX * sn + fish.circle.velY * cs;

    fish.circle.velX = px;
    fish.circle.velY = py;

    pop.push(fish);
    container.addChild(fish.circle);
  }

  container_rocks = new createjs.Container();
  //stage.addChild(container_rocks);
  for (var i = 0; i < 21; i++) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = Math.random() * w;
    circle.y = Math.random() * h;

    circle.velY = .4;
    circle.velX = 0;

    var turn = (Math.random() * 360);
    var rad = (turn*Math.PI)/180;
    var cs = Math.cos(rad);
    var sn = Math.sin(rad);

    var px = circle.velX * cs - circle.velY * sn;
    var py = circle.velX * sn + circle.velY * cs;

    circle.velX = px;
    circle.velY = py;

    container_rocks.addChild(circle);
  }
  container_food = new createjs.Container();
  stage.addChild(container_food);

  for (var i = 0; i < food_count; i++) {

    var circle = new createjs.Shape();
    circle.graphics.beginFill("green").drawCircle(0, 0, food_radius);
    circle.x = (Math.random() * (w-200))+100;
    circle.y = (Math.random() * (h-100))+50;
    container_food.addChild(circle);

  }

  createjs.Ticker.addEventListener("tick", handleTick);
}


function handleTick(event) {
  if(!event.paused) {
    actOnTick(event);
  }
}

function actOnTick(event ) {
  counter++;
  for (var i = 0; i < pop.length; i++) {
    var circle = pop[i].circle;

    circle.y = circle.y - circle.velY;
    circle.x = circle.x + circle.velX;

    if(circle.y>h){
      circle.y-=h;
    }
    if(circle.y<0){
      circle.y+=h;
    }

    if(circle.x>w){
      circle.x-=w;
    }
    if(circle.x<0){
      circle.x+=w;
    }
    /*
      caluculate net inputs for 3 different eyes on all fish start with large number will be replaced
      by smaller distances as the fish checks distance from all rocks
      A lot of optimization can be done here
    */
    //normalize inputs what range to we actually care about
    //how far can the fish see infinite ???

    //vector for closest food
    var foodx = 0;
    var foody = 0;
    var minDist=100000;

    for(var j = 0; j < container_food.getNumChildren(); j++){
      var food = container_food.getChildAt(j);
      var xDist = food.x - circle.x;
      var yDist = circle.y - food.y;
      var distance = Math.sqrt(xDist*xDist + yDist*yDist);

      if (distance < fish_radius + food_radius) { //currunt fish hit food
        pop[i].fitness ++;
        container_food.removeChildAt(j);

        //spawn new food if one is eaten
        var food_circle = new createjs.Shape();
        food_circle.graphics.beginFill("green").drawCircle(0, 0, food_radius);
        food_circle.x = (Math.random() * (w-200))+100;
        food_circle.y = (Math.random() * (h-100))+50;
        container_food.addChild(food_circle);
        break;
      }

      if(distance<minDist){
        minDist=distance;
        foodx=xDist/distance;
        foody=yDist/distance;
      }

    }

    var netInputs = [foodx,foody,circle.velX/fish_speed,circle.velY/fish_speed];

    pop[i].net.feedForward(netInputs);
    //feed into net for the correct fish
    //fish.net.feed(inputs)

    //get turn output
    //vector math to turn each fish, currently random

    var out1 = pop[i].net.getResults()[0];

    var turn = out1*45;
    var rad = (turn*pi())/180;
    var cs = Math.cos(rad);
    var sn = Math.sin(rad);

    var px = circle.velX * cs - circle.velY * sn;
    var py = circle.velX * sn + circle.velY * cs;


    circle.velX = px;
    circle.velY = py;
  }

  stage.update();
  if(counter> generationTime){
    counter = 0;

    generation ++;
    console.log("New generation: "+generation);
    pop.sort(compare);
    var latestBestFitness = pop[population_size-1].fitness;
    console.log("Best Fitness: " + latestBestFitness);

    container.removeAllChildren();

    var fish = new Fish();
    fish.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, fish_radius);

    var coor = placefish();
    fish.circle.x=coor[0];
    fish.circle.y=coor[1];

    updateUserInterface(latestBestFitness, generation);

    fish.circle.velY = fish_speed;
    fish.circle.velX = 0;

    var turn2 = (Math.random() * 360);
    var rad2 = (turn2*Math.PI)/180;
    var cs2 = Math.cos(rad2);
    var sn2 = Math.sin(rad2);

    var px2 = fish.circle.velX * cs2 - fish.circle.velY * sn2;
    var py2 = fish.circle.velX * sn2 + fish.circle.velY * cs2;

    fish.circle.velX = px2;
    fish.circle.velY = py2;
    fish.tick=0;
    fish.fitness=0;

    pop[0]=fish;
    container.addChild(fish.circle);

    for(var i=1;i<population_size/2;i++){
      fish = pop[population_size-1].makeChild(pop[population_size-i-1]);
      coor = placefish();
      fish.circle.x=coor[0];
      fish.circle.y=coor[1];
      fish.tick=0;
      fish.fitness=0;
      pop[i]=fish;
      container.addChild(fish.circle);
    }
    for(var i=population_size/2;i<population_size;i++){
      fish = pop[i];
      coor = placefish();
      fish.circle.x=coor[0];
      fish.circle.y=coor[1];
      fish.tick=0;
      fish.fitness=0;
      container.addChild(fish.circle);
    }
  }
}

function compare(a,b){
  return a.fitness - b.fitness;
}


/**
* updates the location of the rocks
*/
function  moveRocks() {
  var r = container_rocks.getNumChildren();

  for(var j = 0; j < r; j++){
    var rock = container_rocks.getChildAt(j);
    rock.y += rock.velY;
    if(rock.y<0 || rock.y>h){

      rock.velY = -rock.velY;
    }
    rock.x += rock.velX;
    if(rock.x<0 || rock.x>w){
      rock.velX = -rock.velX;

    }

  }
}

/**
* @param inputs
*   The array of inputs to the net
*/
function updateInput(inputs,inputnumber, dot, distance) {
  var theta = Math.acos(dot);

  if(theta>Math.pi/2){
    //angle to large ingore
    return;
  }
  var a = (distance * sin(theta))/50;
  if(a>1 || a<-1){
    return;
  }
  var d = distanceFromRock(distance, 50, theta);
  if(d<0){
    return;
  }
  if(d<inputs[inputnumber]){
    inputs[inputnumber]=d;
  }
}

/**
 * @param z
 *     The distance from the fish to the center of the rock
 * @param r
 *     Radius of the rock.
 * @param t
 *     Angle (theta) between z and l
 * @returns
 *     Distance between fish and rock, say l.
 */
function distanceFromRock(z, r, t) {
  return  ( r/sin(t) ) * sin ( pi()-t-( pi()-asin(( z * sin(t))/r) ));
}
function sin(x) {
  return Math.sin(x);
}
function asin(x) {
  return Math.asin(x);
}
function pi() {
  return Math.PI;
}
function placefish() {
  var output = [Math.random() * w,Math.random() * h];
  return output;
}
function updateUserInterface(latestBestFitness) {
  var displayGeneration = generation + 1;
  $("#generation").text("Generation:" + displayGeneration);
  generationTime = $('#time-slider').val();
  fish_speed = $('#speed-slider').val();
  if(latestBestFitness > bestFitness) {
    bestFitness = latestBestFitness;
  }
  $('#best-fitness').text("Best fitness: " + bestFitness);
}
