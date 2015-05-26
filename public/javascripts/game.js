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
		
		var net = new Net([1, 1, 1, 1]);
		var results = net.getResults();
//		console.log(results);

		for (var i = 0; i < 50; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			circle.velY = 1.0;
			circle.velX = 1.0;

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
		createjs.Ticker.setFPS(6000);
		createjs.Ticker.addEventListener("tick", handleTick);

		
	}

	function handleTick(event) {
		var l = container.getNumChildren();
		var r = container_rocks.getNumChildren();


		for (var i = 0; i < l; i++) {
			var circle = container.getChildAt(i);

			
			circle.y += circle.velY;
			if(circle.y<0 || circle.y>h){
				circle.velY = -circle.velX;
				continue;
			}
			circle.x += circle.velX;
			if(circle.x<0 || circle.x>w){
				circle.velX = -circle.velX;
				continue;
			}
			//caluculate net inputs
			var inputs = [-1,-1,-1,-1];
			
			
			for(var j = 0;j < r; j++){
				var rock = container_rocks.getChildAt(j);
				var xDist = rock.x - circle.x;
				var yDist = rock.y - circle.y;
				var distance = Math.sqrt(xDist*xDist + yDist*yDist);
				
				if (distance < 10 + 50) {
					container.removeChildAt(i);
					continue;
				}
				
				
			}
			
			//feed int net for the correct fish
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
	