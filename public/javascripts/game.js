/* global z */
	var container;
	var container_rocks;
	//length of fish sensor
	var sensor_length = 10;
	var w;
	var h;
	
	

	var pop = [];

	function init() {
		// create a new stage and point it at our canvas:
		canvas = document.getElementById("demoCanvas");
		stage = new createjs.Stage(canvas);

		w = canvas.width;
		h = canvas.height;

		var mother = new Fish();
		var father = new Fish();
		
		var child  = mother.makeChild(father);
		console.log(mother.net.getChromosome());
		console.log(father.net.getChromosome());
		console.log(child.net.getChromosome());
		
//		var net = new Net([8,2]);
//		net.feedForward([.5,.4,.3,.2,.5,.4,.3,.2]);
//		var net = new Net([4, 1000, 2]);
//		net.feedForward([.5,.4,.3,.2]);

//		var results = net.getResults();
//		console.log(results);

		for (var i = 0; i < 1000; i++) {
			var fish = new Fish();
			fish.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
			
			fish.circle.x = Math.random() * w;
			fish.circle.y = Math.random() * h;
			
			
			fish.circle.velY = 1.0;
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
			stage.addChild(fish.circle);
		}
	
	
		container_rocks = new createjs.Container();
		stage.addChild(container_rocks);


		for (var i = 0; i < 15; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red").drawCircle(0, 0, 50);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			
			
			
			circle.velY = .5;
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
		//createjs.Ticker.setFPS(1);
		createjs.Ticker.addEventListener("tick", handleTick);


	}

	function handleTick(event) {
		var r = container_rocks.getNumChildren();

		//console.log("FISH LEFT: " + pop.length);


		for (var i = 0; i < pop.length; i++) {
			var circle = pop[i].circle;


			circle.y += circle.velY;
			if(circle.y<0 || circle.y>h){
//				var turn = 180;
//				var rad = (turn*Math.PI)/180;
//				var cs = Math.cos(rad);
//				var sn = Math.sin(rad);
//
//				var px = circle.velX * cs - circle.velY * sn;
//				var py = circle.velX * sn + circle.velY * cs;
//
//				circle.velX = px;

					stage.removeChildAt(i);
					
					pop.splice(i,1);
					flag = 1;
					i--;
				circle.velY = -circle.velY;
				continue;
			}
			circle.x += circle.velX;
			if(circle.x<0 || circle.x>w){
//				var turn = 180;
//				var rad = (turn*Math.PI)/180;
//				var cs = Math.cos(rad);
//				var sn = Math.sin(rad);
//
//				var px = circle.velX * cs - circle.velY * sn;
//				var py = circle.velX * sn + circle.velY * cs;
//				
					stage.removeChildAt(i);
					
					pop.splice(i,1);
					flag = 1;
					i--;
				circle.velX = - circle.velX;
//				circle.velY = py;
				continue;
			}

			/*
				caluculate net inputs for 3 different eyes on all fish start with large number will be replaced
				by smaller distances as the fish checks distance from all rocks
				A lot of optimization can be done here
			*/
		var inputs = [(w-circle.x),
						0,
					 circle.y,
					 0,
					 circle.x,
						0,
					 (h-circle.y),
					 0]
			
			inputs[1]=circle.y*Math.sqrt(2);
			if((w-circle.x)<circle.y)
				inputs[1]=(w-circle.x)*Math.sqrt(2);
				
				
			inputs[3]=circle.y*Math.sqrt(2);
			if(circle.x<circle.y)
				inputs[3]=circle.x*Math.sqrt(2);
				
				
				
			inputs[5]=circle.x*Math.sqrt(2);
			if((h-circle.y)<circle.x)
				inputs[5]=(h-circle.y)*Math.sqrt(2);
				
				
				
			inputs[7]=(h-circle.y)*Math.sqrt(2);
			if((w-circle.x)<(h-circle.y))
				inputs[7]=(w-circle.x)*Math.sqrt(2);

					   
			var flag = 0;

			for(var j = 0; j < r; j++){
				var rock = container_rocks.getChildAt(j);
				var xDist = rock.x - circle.x;
				var yDist = rock.y - circle.y;
				var distance = Math.sqrt(xDist*xDist + yDist*yDist);

				if (distance < 10 + 50) {
					//fish i had a collision with rock j remove it from the screen and continue
					stage.removeChildAt(i);
					
					pop.splice(i,1);
					flag = 1;
					i--;
					break;
				}
				// vector(rx,ry) is the vector from the center of the fish to the center of the rock
				var rx = xDist/distance;
				var ry = yDist/distance;

//				console.log("ROCK VECTOR: ");
//				console.log("Rx: " + rx);
//				console.log("Ry: " + ry);
//				console.log("");
//
//				console.log("VELOCITY VECTOR: ");
//				console.log("Vx: " + circle.velX);
//				console.log("Vy: " + circle.velY);
//				console.log("");

				var tx =1.0;
				var ty=0;
				var dot = (rx*tx) + (ry*ty);
				updateInput(inputs,0, dot,distance);



				var rad = (45*pi())/180;
				var cs = Math.cos(rad);
				var sn = Math.sin(rad);

				var px = tx * cs - ty * sn;
				var py = tx * sn + ty * cs;


				dot = (rx*px) + (ry*py);
				updateInput(inputs,1, dot,distance);


				rad = (90*pi())/180;
				cs = Math.cos(rad);
				sn = Math.sin(rad);

				px = tx * cs - ty * sn;
				py = tx * sn + ty * cs;


				dot = (rx*px) + (ry*py);
				updateInput(inputs,2, dot,distance);
				
				
				
				rad = (135*pi())/180;
				cs = Math.cos(rad);
				sn = Math.sin(rad);
				px = tx * cs - ty * sn;
				py = tx * sn + ty * cs;
				dot = (rx*px) + (ry*py);
				updateInput(inputs,3, dot,distance);
				
				
				rad = (180*pi())/180;
				cs = Math.cos(rad);
				sn = Math.sin(rad);
				px = tx * cs - ty * sn;
				py = tx * sn + ty * cs;
				dot = (rx*px) + (ry*py);
				updateInput(inputs,4, dot,distance);
				
				rad = (225*pi())/180;
				cs = Math.cos(rad);
				sn = Math.sin(rad);
				px = tx * cs - ty * sn;
				py = tx * sn + ty * cs;
				dot = (rx*px) + (ry*py);
				updateInput(inputs,5, dot,distance);
				
				
				rad = (270*pi())/180;
				cs = Math.cos(rad);
				sn = Math.sin(rad);
				px = tx * cs - ty * sn;
				py = tx * sn + ty * cs;
				dot = (rx*px) + (ry*py);
				updateInput(inputs,6, dot,distance);
				
				
				rad = (315*pi())/180;
				cs = Math.cos(rad);
				sn = Math.sin(rad);
				px = tx * cs - ty * sn;
				py = tx * sn + ty * cs;
				dot = (rx*px) + (ry*py);
				updateInput(inputs,7, dot,distance);
				
				

			}
			
			//console.log(inputs);

			//console.log(inputs);

			//normalize inputs what range to we actually care about
			//how far can the fish see infinite ???

			var netInputs = [inputs[0]/((w/2)*Math.sqrt(2)),
							 inputs[1]/((w/2)*Math.sqrt(2)),
							 inputs[2]/((w/2)*Math.sqrt(2)),
							 inputs[3]/((w/2)*Math.sqrt(2)),
							 inputs[4]/((w/2)*Math.sqrt(2)),
							 inputs[5]/((w/2)*Math.sqrt(2)),
							 inputs[6]/((w/2)*Math.sqrt(2)),
							 inputs[7]/((w/2)*Math.sqrt(2))];
			
			pop[i].net.feedForward(netInputs);
			//feed into net for the correct fish
			//fish.net.feed(inputs)

			//get turn output
			//vector math to turn each fish, currently random
			var out1 = pop[i].net.getResults()[0];
			var out2 = pop[i].net.getResults()[1];
			
//			var turn = out*180;
//			var rad = (turn*pi())/180;
//			var cs = Math.cos(rad);
//			var sn = Math.sin(rad);
//
//			var px = circle.velX * cs - circle.velY * sn;
//			var py = circle.velX * sn + circle.velY * cs;

			circle.velX = out1*2;
			circle.velY = out2*2;

		}
		
		moveRocks();
		stage.update();
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
	
	
	
	
	
