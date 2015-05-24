	var container;
	var w;
	var h;


	function init() {
		// create a new stage and point it at our canvas:
		canvas = document.getElementById("demoCanvas");
		stage = new createjs.Stage(canvas);

		w = canvas.width;
		h = canvas.height;

		container = new createjs.Container();
		stage.addChild(container);

		for (var i = 0; i < 100; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
			circle.x = Math.random() * w;
			circle.y = Math.random() * h;
			circle.velY = (Math.random() * 20) - 10;
			circle.velX = (Math.random() * 20) - 10;

			container.addChild(circle);
		}

	createjs.Ticker.addEventListener("tick", handleTick);

		
	}

	function handleTick(event) {
		var l = container.getNumChildren();


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

		}


		stage.update();
	}