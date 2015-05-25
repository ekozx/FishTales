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

		for (var i = 0; i < 50; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			circle.velY = (Math.random() * 2.0) - 1.0;
			circle.velX = (Math.random() * 2.0) - 1.0;

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
			var rad = (turn*Math.PI)/180;
			var cs = Math.cos(rad);
			var sn = Math.sin(rad);

			var px = circle.velX * cs - circle.velY * sn; 
			var py = circle.velX * sn + circle.velY * cs;
			
			circle.velX = px;
			circle.velY = py;
					
		}
		
		stage.update();
	}
	