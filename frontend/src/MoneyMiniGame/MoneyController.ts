import Konva from "konva";


export class MoneyController {
	private group: Konva.Group;
	private boxMeiMei: Konva.Image | Konva.Circle | null = null;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
    private stage : Konva.Stage;
    private layer: Konva.Layer;
    private gameTimer: number | null = null;
    private moneyGroup : Array<Konva.Circle>;
    private boxGroup : Array<Konva.Rect>;


	constructor(stage: Konva.Stage, layer: Konva.Layer, width: number = 800, height: number = 600) {
		this.group = new Konva.Group({ visible: false });
        this.stage = stage;
        this.layer = layer;
        this.moneyGroup = [];
        this.boxGroup = [];
		// Background
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: width,
			height: height,
			fill: "#87CEEB", // Sky blue
		});
		//this.group.add(bg);

		// Score display (top-left)
		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "black",
		});
		this.group.add(this.scoreText);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: width - 150,
			y: 20,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "red",
		});
		this.group.add(this.timerText);

		// TODO: Task 2 - Load and display lemon image using Konva.Image.fromURL()
		// Placeholder circle (remove this when implementing the image)
		Konva.Image.fromURL("./src/MoneyMiniGame/Data/BoxMeiMei.png", (image) => {
			image.x(width / 2);
			image.y(width / 2);
			image.offsetX( image.width() / 2);
			image.offsetY( image.height() / 2);
            image.draggable(true);
            image.height(image.height()/2);
            image.width(image.width()/2);
			//image.on("click", onLemonClick);
            image.on("dragmove", (e) =>{
                // var target = e.target;
                // var r2 = e.target.getClientRect();
                var r1 = image;
                for(let i = 0; i < this.boxGroup.length; i++){
                    let r2 = this.boxGroup[i];               // if(this.haveIntersection(this, targetRect)){
                    if(r2.x() > r1.x() + r1.width() ||
                        r2.x() + r2.width() < r1.x() ||
                        r2.y() > r1.y() + r1.height() ||
                        r2.y() + r2.height() < r1.y()){
                            console.log("Collision")
                    }
                 }
            });
			
            // image.on('dragmove', function (e) {
            //     var target = e.target;
            //     var targetRect = e.target.getClientRect();
            //     layer.children.forEach(function (group) {
            //         // do not check intersection with itself
            //         if (group === target) {
            //         return;
            //         }
            //         if (haveIntersection(group.getClientRect(), targetRect)) {
            //         group.findOne('.fillShape').fill('red');
            //         } else {
            //         group.findOne('.fillShape').fill('grey');
            //         }
            //     });
            // });

            this.boxMeiMei = image;
			this.group.add(this.boxMeiMei);
            console.log("Image exists");
		});
        console.log("constructor");
        this.startTimer();

        const anim = new Konva.Animation((frame)=>{
        const time = frame.time;
        const timeDiff = frame.timeDiff;
        const frameRate = frame.frameRate;

        if(time % 4 == 0){
            this.addMoneyImg();
        }

       
       this.updateY();

        
        }, layer);

        anim.start();


        // this.layer.on('dragmove',  (e) => {
        //     var target = e.target;
        //     var targetRect = e.target.getClientRect();
        //     this.layer.children.forEach( (group) => {
        //         // do not check intersection with itself
        //         if (group === target) {
        //         return;
        //         }
        //         if (this.haveIntersection(group.getClientRect(), targetRect)) {
        //             //group.findOne('.fillShape').fill('red');
        //             console.log("Collision");
        //         } else {
        //             //group.findOne('.fillShape').fill('grey');
        //         }
        //     });
        // });
	
	}
    haveIntersection(r1: Konva.Image, r2:Konva.Rect): boolean {
    return !(
        r2.x() > r1.x() + r1.width() ||
        r2.x() + r2.width() < r1.x() ||
        r2.y() > r1.y() + r1.height() ||
        r2.y() + r2.height() < r1.y()
    );
    }
    updateY():void{
        for(let i = 0; i < this.moneyGroup.length; i++){
            this.moneyGroup[i].y(this.moneyGroup[i].y() + 4);
            this.boxGroup[i].y(this.boxGroup[i].y() + 4);
        }
        // this.moneyGroup.forEach((circle) =>{
        //     circle.y(circle.y() + 4);
        // });
    }

	/**
	 * Update score display
	 */
	updateScore(score: number): void {
		this.scoreText.text(`Score: ${score}`);
		this.group.getLayer()?.draw();
	}
    addMoneyImg() : void{
        var circle = new Konva.Circle({
          x: Math.random() * (this.stage.width() - 10) + 10,
          //y: this.stage.height(),
          y:0,
          radius: 10,
          fill: "yellow",
          stroke: "black",
          strokeWidth: 4,
        });
        this.moneyGroup.push(circle);
        this.group.add(circle);

        var boundingBox = circle.getClientRect({ relativeTo: this.group });
        var box = new Konva.Rect({
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height,
            stroke: 'red',
            strokeWidth: 1,
        });
        this.group.add(box);
        this.boxGroup.push(box);
       
    }


	/**
	 * Update timer display
	 */
	updateTimer(timeRemaining: number): void {
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
	}
    updateMoney():void{
       // this.moneyGroup
    }

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
    private stopTimer(): void {
		// TODO: Task 3 - Stop the timer using clearInterval
		if(this.gameTimer){
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}
    private startTimer(): void {
		// TODO: Task 3 - Implement countdown timer using setInterval
		let timeRemaining : number =  30;
		const timerId = setInterval(() => {
			//console.log("This runs every 1000ms");
            //this.addMoneyImg();
			timeRemaining--;
			this.updateTimer(timeRemaining);
			if(timeRemaining < 0){
				this.endGame();
			}
			}, 1000);
		this.gameTimer = timerId;

	}
    private endGame(): void {
		this.stopTimer();

		// Switch to results screen with final score
		// this.screenSwitcher.switchToScreen({
		// 	type: "result",
		// 	score: this.model.getScore(),
		// });
	}
}