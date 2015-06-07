/* global z */
	var container;
	var container_rocks;
	var container_food;
	var generation;
	//length of fish sensor
	var w;
	var h;
	
	var food_count = 50;
	var food_radius = 10;
	
	
	var population_size = 14;
	var fish_radius = 20;
	var fish_speed = 5;
	
	var counter;
	
	

	var pop = [];
	var dead = [];

	function init() {
		
		generation = 0;
		// create a new stage and point it at our canvas:
		canvas = document.getElementById("demoCanvas");
		stage = new createjs.Stage(canvas);

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
		

		//createjs.Ticker.setFPS(1);
		createjs.Ticker.addEventListener("tick", handleTick);


	}

	
	
	function handleTick(event) {
		
		//var r = container_rocks.getNumChildren();

		//console.log("FISH LEFT: " + pop.length);
		counter++;
		//console.log(counter);
		
		for (var i = 0; i < pop.length; i++) {
			
//			
//			if(pop[i].hunger<0){
//				pop[i].dead=1;
//			}
//			if(pop[i].dead==1){
//				continue;
//				dead.push(pop[i]);
//			}
//			
//			pop[i].tick ++;
//			pop[i].hunger--;
//			
			
			
			var circle = pop[i].circle;

//
//			circle.y += circle.velY;
//			if(circle.y<0 || circle.y>h){
//				var turn = 180;
//				var rad = (turn*Math.PI)/180;
//				var cs = Math.cos(rad);
//				var sn = Math.sin(rad);
//
//				var px = circle.velX * cs - circle.velY * sn;
//				var py = circle.velX * sn + circle.velY * cs;
//
//				circle.velX = px;
//
//				container.removeChildAt(i);
//				dead.push(pop[i]);
//				pop.splice(i,1);
//				i--;
//				continue;
//			}
//			circle.x += circle.velX;
//			if(circle.x<0 || circle.x>w){
//				var turn = 180;
//				var rad = (turn*Math.PI)/180;
//				var cs = Math.cos(rad);
//				var sn = Math.sin(rad);
//
//				var px = circle.velX * cs - circle.velY * sn;
//				var py = circle.velX * sn + circle.velY * cs;
//				
//				container.removeChildAt(i);
//				dead.push(pop[i]);
//				pop.splice(i,1);
//				i--;
//				continue;
//			}


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
//		var inputs = [(w-circle.x),
//						0,
//					 circle.y,
//					 0,
//					 circle.x,
//						0,
//					 (h-circle.y),
//					 0];
//			
//			inputs[1]=circle.y*Math.sqrt(2);
//			if((w-circle.x)<circle.y)
//				inputs[1]=(w-circle.x)*Math.sqrt(2);
//				
//				
//			inputs[3]=circle.y*Math.sqrt(2);
//			if(circle.x<circle.y)
//				inputs[3]=circle.x*Math.sqrt(2);
//				
//				
//				
//			inputs[5]=circle.x*Math.sqrt(2);
//			if((h-circle.y)<circle.x)
//				inputs[5]=(h-circle.y)*Math.sqrt(2);
//				
//				
//				
//			inputs[7]=(h-circle.y)*Math.sqrt(2);
//			if((w-circle.x)<(h-circle.y))
//				inputs[7]=(w-circle.x)*Math.sqrt(2);
//
//					   
//			var flag = 0;
//
//			for(var j = 0; j < r; j++){
//				var rock = container_rocks.getChildAt(j);
//				var xDist = rock.x - circle.x;
//				var yDist = rock.y - circle.y;
//				var distance = Math.sqrt(xDist*xDist + yDist*yDist);
//
//				if (distance < 10 + 50) {
//					//fish i had a collision with rock j remove it from the screen and continue
//					container.removeChildAt(i);
//					dead.push(pop[i]);
//					pop.splice(i,1);
//					flag = 1;
//					i--;
//					break;
//				}
//				// vector(rx,ry) is the vector from the center of the fish to the center of the rock
//				var rx = xDist/distance;
//				var ry = yDist/distance;
//
////				console.log("ROCK VECTOR: ");
////				console.log("Rx: " + rx);
////				console.log("Ry: " + ry);
////				console.log("");
////
////				console.log("VELOCITY VECTOR: ");
////				console.log("Vx: " + circle.velX);
////				console.log("Vy: " + circle.velY);
////				console.log("");
//
//				var tx =1.0;
//				var ty=0;
//				var dot = (rx*tx) + (ry*ty);
//				updateInput(inputs,0, dot,distance);
//
//
//
//				var rad = (45*pi())/180;
//				var cs = Math.cos(rad);
//				var sn = Math.sin(rad);
//
//				var px = tx * cs - ty * sn;
//				var py = tx * sn + ty * cs;
//
//
//				dot = (rx*px) + (ry*py);
//				updateInput(inputs,1, dot,distance);
//
//
//				rad = (90*pi())/180;
//				cs = Math.cos(rad);
//				sn = Math.sin(rad);
//
//				px = tx * cs - ty * sn;
//				py = tx * sn + ty * cs;
//
//
//				dot = (rx*px) + (ry*py);
//				updateInput(inputs,2, dot,distance);
//				
//				
//				
//				rad = (135*pi())/180;
//				cs = Math.cos(rad);
//				sn = Math.sin(rad);
//				px = tx * cs - ty * sn;
//				py = tx * sn + ty * cs;
//				dot = (rx*px) + (ry*py);
//				updateInput(inputs,3, dot,distance);
//				
//				
//				rad = (180*pi())/180;
//				cs = Math.cos(rad);
//				sn = Math.sin(rad);
//				px = tx * cs - ty * sn;
//				py = tx * sn + ty * cs;
//				dot = (rx*px) + (ry*py);
//				updateInput(inputs,4, dot,distance);
//				
//				rad = (225*pi())/180;
//				cs = Math.cos(rad);
//				sn = Math.sin(rad);
//				px = tx * cs - ty * sn;
//				py = tx * sn + ty * cs;
//				dot = (rx*px) + (ry*py);
//				updateInput(inputs,5, dot,distance);
//				
//				
//				rad = (270*pi())/180;
//				cs = Math.cos(rad);
//				sn = Math.sin(rad);
//				px = tx * cs - ty * sn;
//				py = tx * sn + ty * cs;
//				dot = (rx*px) + (ry*py);
//				updateInput(inputs,6, dot,distance);
//				
//				
//				rad = (315*pi())/180;
//				cs = Math.cos(rad);
//				sn = Math.sin(rad);
//				px = tx * cs - ty * sn;
//				py = tx * sn + ty * cs;
//				dot = (rx*px) + (ry*py);
//				updateInput(inputs,7, dot,distance);
//				
//				
//
//			}
//			if(flag==1){
//				continue;
//			}
			
			//console.log(inputs);

			//console.log(inputs);

			//normalize inputs what range to we actually care about
			//how far can the fish see infinite ???
			
			
			//console.log(inputs);
			
			//vector for closest food
			var foodx = 0;
			var foody = 0;
			var minDist=100000;
			
			
			for(var j = 0; j < container_food.getNumChildren(); j++){
				var food = container_food.getChildAt(j);
				var xDist = food.x - circle.x;
				var yDist = circle.y - food.y;
				var distance = Math.sqrt(xDist*xDist + yDist*yDist);

				if (distance < fish_radius + food_radius) {
					//currunt fish hit food
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
			
			
			
//			var netInputs = [(inputs[0]/((w)*Math.sqrt(2))),
//							 (inputs[1]/((w)*Math.sqrt(2))),
//							 (inputs[2]/((w)*Math.sqrt(2))),
//							 (inputs[3]/((w)*Math.sqrt(2))),
//							 (inputs[4]/((w)*Math.sqrt(2))),
//							 (inputs[5]/((w)*Math.sqrt(2))),
//							 (inputs[6]/((w)*Math.sqrt(2))),
//							 (inputs[7]/((w)*Math.sqrt(2)))];



			var netInputs = [foodx,foody,circle.velX/fish_speed,circle.velY/fish_speed];
							 
			//console.log(netInputs);
			
			
			pop[i].net.feedForward(netInputs);
			//feed into net for the correct fish
			//fish.net.feed(inputs)

			//get turn output
			//vector math to turn each fish, currently random
			
			var out1 = pop[i].net.getResults()[0];
			//var out2 = pop[i].net.getResults()[1];
			//console.log(turn_net);
			
			//console.log(out1);
			
//			var speed = Math.sqrt((out1*out1)+(out2*out2));
//			
//			if(speed<.07){
//				container.removeChildAt(i);
//				dead.push(pop[i]);
//				pop.splice(i,1);
//				i--;
//				continue;
//			}
////			
			var turn = out1*45;
			var rad = (turn*pi())/180;
			var cs = Math.cos(rad);
			var sn = Math.sin(rad);

			var px = circle.velX * cs - circle.velY * sn;
			var py = circle.velX * sn + circle.velY * cs;
			
		
			circle.velX = px;
			circle.velY = py;

			
			//circle.velX = out1*5;
			//circle.velY = out2*5;

		}
		
		//moveRocks();
		
		
				
		stage.update();
		
//	if(pop.length==0){
//		generation ++;
//		console.log("New generation: "+generation);
//		console.log("BEST INDIVIDUAL: "+dead[dead.length-1].tick);
//		//console.log("Number of dead fish: " + dead.length);
//		//move to next generation of fish
//		dead.splice(2500,dead.length);
//		
//		
//		
//		for(var i=0;i<1000;i++){
//			var fish3 = dead[dead.length-i-1];
//			var coor = placefish();
//			fish3.circle.x=coor[0];
//			fish3.circle.y=coor[1];
//			fish3.tick=0;
//			pop.push(fish3);
//			container.addChild(fish3.circle);
//		}
//		
//		for(var i=0;i<3500;i++){
//			//console.log(Math.round(Math.random()*dead.length));
//			var fish2 = dead[Math.round(Math.random()*(dead.length-1))].makeChild(dead[Math.floor(Math.random()*(dead.length-150))+149]);
//			//var fish = dead[1].makeChild(dead[0]);
//			var coor2 = placefish();
//			fish2.circle.x=coor2[0];
//			fish2.circle.y=coor2[1];
//			fish2.tick=0;
//			pop.push(fish2);
//			container.addChild(fish2.circle);
//		}
//		
//		
//		for(var i=0;i<500;i++){
//			//random fish added to the population as well
//			var fish = new Fish();
//			fish.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
//			
//			var coor3 = placefish();
//			fish.circle.x=coor3[0];
//			fish.circle.y=coor3[1];
//			
//			fish.circle.velY = 1.0;
//			fish.circle.velX = 0;
//
//			var turn2 = (Math.random() * 360);
//			var rad2 = (turn2*Math.PI)/180;
//			var cs2 = Math.cos(rad2);
//			var sn2 = Math.sin(rad2);
//
//			var px2 = fish.circle.velX * cs2 - fish.circle.velY * sn2;
//			var py2 = fish.circle.velX * sn2 + fish.circle.velY * cs2;
//
//			fish.circle.velX = px2;
//			fish.circle.velY = py2;
//			fish.tick=0;
//
//			pop.push(fish);
//			container.addChild(fish.circle);
//		}
//		
//		stage.update();
//		dead = [];
//	}	
		
		if(counter>1000){
			
					counter = 0;
					
					generation ++;
					console.log("New generation: "+generation);
					pop.sort(compare);
					console.log("Best Fitness: "+pop[population_size-1].fitness);
					
					container.removeAllChildren();
					
					
					
					
					
					var fish = new Fish();
					fish.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, fish_radius);
					
					var coor = placefish();
					fish.circle.x=coor[0];
					fish.circle.y=coor[1];
					
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
	* 	The array of inputs to the net
	*/	
	function updateInput(inputs,inputnumber, dot, distance) {

			var theta = Math.acos(dot);
			//console.log("ANGLE Between them:"+theta*180/Math.PI);

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
				//console.log("What causes this????? and is it ok to just ignore");
				return;
			}
			if(d<inputs[inputnumber]){
				inputs[inputnumber]=d;
			}
			//console.log(inputs[0]);
	}


	/**
	 * @param z
	 * 		The distance from the fish to the center of the rock
	 * @param r
	 * 		Radius of the rock.
	 * @param t
	 * 		Angle (theta) between z and l
	 * @returns
	 * 		Distance between fish and rock, say l.
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
//		var r = container_rocks.getNumChildren();
//
//		
//		while(1){	
//			var collision = 0;
//			
//			for(var j = 0; j < r; j++){
//				var rock = container_rocks.getChildAt(j);
//				var xDist = rock.x - output[0];
//				var yDist = rock.y - output[1];
//				var distance = Math.sqrt(xDist*xDist + yDist*yDist);
//				
//				
//				if (distance < 10 + 70) {
//					collision = 1;
//				}
//				
//			}
//			
//			if(collision==0){
//				break;
//			}
//			output = [Math.random() * w, Math.random() * h]
//			
//		}
//		
		
		return output;
		
	}
	
	
	
