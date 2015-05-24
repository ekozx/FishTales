	var container;
	var container_rocks;
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

		for (var i = 0; i < 1000; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			circle.velY = (Math.random() * 20) - 10;
			circle.velX = (Math.random() * 20) - 10;

			container.addChild(circle);
		}
		
		
		for (var i = 0; i < 10; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red").drawCircle(0, 0, 50);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			container_rocks.addChild(circle);
		}

	createjs.Ticker.addEventListener("tick", handleTick);

		
	}

	function handleTick(event) {
		var l = container.getNumChildren();
		var r = container_rocks.getNumChildren();


		for (var i = 0; i < l; i++) {
			var circle = container.getChildAt(i);

			
			circle.y += circle.velY;
			if(circle.y<0 || circle.y>h){
				circle.velY = -circle.velY;
			}
			circle.x += circle.velX;
			if(circle.x<0 || circle.x>w){
				circle.velX = -circle.velX;
			}
			
			for(var j = 0;j < r; j++){
				var rock = container_rocks.getChildAt(j);
				var xDist = rock.x - circle.x;
				var yDist = rock.y - circle.y;
				var distance = Math.sqrt(xDist*xDist + yDist*yDist);
				
				if (distance < 10 + 50) {
    				circle.velY = 0;
					circle.velX = 0;
				}
			}

		}
		
		stage.update();
	}