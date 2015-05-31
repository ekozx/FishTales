/* global z */
	var container;
	var container_rocks;
	//length of fish sensor
	var sensor_length = 10;
	var w;
	var h;



	function init() {
		// create a new stage and point it at our canvas:
		canvas = document.getElementById("demoCanvas");
		stage = new createjs.Stage(canvas);

		w = canvas.width;
		h = canvas.height;
		


		container = new createjs.Container();
		container_rocks = new createjs.Container();
		stage.addChild(container);
		stage.addChild(container_rocks);
		
		var net = new Net([4, 3, 2]);
		var results = net.getResults();
//		console.log(results);

		for (var i = 0; i < 1; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			circle.velY = 1.0;
			circle.velX = 0;

			var turn = (Math.random() * 360);
			var rad = (turn*Math.PI)/180;
			var cs = Math.cos(rad);
			var sn = Math.sin(rad);

			var px = circle.velX * cs - circle.velY * sn; 
			var py = circle.velX * sn + circle.velY * cs;
			
			circle.velX = px;
			circle.velY = py;
			
			container.addChild(circle);
		}
		
		
		for (var i = 0; i < 10; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red").drawCircle(0, 0, 50);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			container_rocks.addChild(circle);
		}
		//createjs.Ticker.setFPS(30000);
		createjs.Ticker.addEventListener("tick", handleTick);

		
	}

	function handleTick(event) {
		var r = container_rocks.getNumChildren();


		for (var i = 0; i < container.getNumChildren(); i++) {
			var circle = container.getChildAt(i);

			
			circle.y += circle.velY;
			if(circle.y<0 || circle.y>h){
				var turn = 180;
				var rad = (turn*Math.PI)/180;
				var cs = Math.cos(rad);
				var sn = Math.sin(rad);
	
				var px = circle.velX * cs - circle.velY * sn; 
				var py = circle.velX * sn + circle.velY * cs;
				
				circle.velX = px;
				circle.velY = py;
				continue;
			}
			circle.x += circle.velX;
			if(circle.x<0 || circle.x>w){
				var turn = 180;
				var rad = (turn*Math.PI)/180;
				var cs = Math.cos(rad);
				var sn = Math.sin(rad);
	
				var px = circle.velX * cs - circle.velY * sn; 
				var py = circle.velX * sn + circle.velY * cs;
				
				circle.velX = px;
				circle.velY = py;
				continue;
			}
			
			/*
				caluculate net inputs for 3 different eyes on all fish start with large number will be replaced
				by smaller distances as the fish checks distance from all rocks
				A lot of optimization can be done here
			*/
			var inputs = [Math.sqrt((w*w)+(h*h)),Math.sqrt((w*w)+(h*h)),Math.sqrt((w*w)+(h*h))];
			
			
			for(var j = 0; j < r; j++){
				var rock = container_rocks.getChildAt(j);
				var xDist = rock.x - circle.x;
				var yDist = rock.y - circle.y;
				var distance = Math.sqrt(xDist*xDist + yDist*yDist);
				
				if (distance < 10 + 50) {
					//fish i had a collision with rock j remove it from the screen and continue
					container.removeChildAt(i);
					continue;
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
				
				
				var dot = (rx*circle.velX) + (ry*circle.velY);
				updateInput(inputs,0, dot,distance);
				
				
			
				var rad = (10*pi())/180;
				var cs = Math.cos(rad);
				var sn = Math.sin(rad);
	
				var px = circle.velX * cs - circle.velY * sn; 
				var py = circle.velX * sn + circle.velY * cs;


				dot = (rx*px) + (ry*py);
				updateInput(inputs,1, dot,distance);
				
							
				rad = (350*pi())/180;
				cs = Math.cos(rad);
				sn = Math.sin(rad);
	
				px = circle.velX * cs - circle.velY * sn; 
				py = circle.velX * sn + circle.velY * cs;


				dot = (rx*px) + (ry*py);
				updateInput(inputs,2, dot,distance);

			}
			
			
			
			//normalize inputs what range to we actually care about
			//how far can the fish see infinite ???
			
			var netInputs = [inputs[0]/Math.sqrt((w*w)+(h*h)),inputs[1]/Math.sqrt((w*w)+(h*h)),inputs[2]/Math.sqrt((w*w)+(h*h))];
			
			//feed into net for the correct fish
			//fish.net.feed(inputs)
		
			//get turn output	
			//vector math to turn each fish, currently random
			
			var turn = (Math.random() * 20) - 10;
			var rad = (turn*pi())/180;
			var cs = Math.cos(rad);
			var sn = Math.sin(rad);

			var px = circle.velX * cs - circle.velY * sn; 
			var py = circle.velX * sn + circle.velY * cs;
			
			circle.velX = px;
			circle.velY = py;
					
		}
		
		stage.update();
	}
	
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
	