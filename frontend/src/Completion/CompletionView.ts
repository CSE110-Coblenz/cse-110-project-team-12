import Konva from 'konva';

export class CompletionView {
    private layer: Konva.Layer;
    private stage: Konva.Stage;
    private group: Konva.Group;

    constructor(layer: Konva.Layer, stage: Konva.Stage) {
        this.layer = layer;
        this.stage = stage;
        this.group = new Konva.Group({
            x: 0,
            y: 0,
            visible: false,
        });
    }

    private getBadgeInfo(days: number): { rank: string; color: string; message: string } {
        if (days <= 10) {
            return { rank: 'A', color: '#3498db', message: 'Faster than Grandma!' };
        } else if (days <= 15) {
            return { rank: 'B', color: '#2ecc71', message: '!' };
        } else if (days <= 20) {
            return { rank: 'C', color: '#e67e22', message: 'Good Effort!' };
        } else {
            return { rank: 'D', color: '#95a5a6', message: 'Journey Complete!' };
        }
    }

    render(
        daysTravelled: number,
        onPlayAgain: () => void
    ): void {
        this.group.destroyChildren();

        const width = this.stage.width();
        const height = this.stage.height();
        const badge = this.getBadgeInfo(daysTravelled);

        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: '#f8f9fa',
        });
        this.group.add(background);

        // Title
        const title = new Konva.Text({
            x: 0,
            y: height * 0.15,
            width: width,
            text: 'You Completed Mei Mei\'s Journey!',
            fontSize: 56,
            fontFamily: 'Arial',
            fill: '#2c3e50',
            align: 'center',
            fontStyle: 'bold',
        });
        this.group.add(title);

        // Days travelled display
        const daysLabel = new Konva.Text({
            x: 0,
            y: height * 0.25,
            width: width,
            text: 'Days Travelled',
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#7f8c8d',
            align: 'center',
        });
        this.group.add(daysLabel);

        const daysValue = new Konva.Text({
            x: 0,
            y: height * 0.25 + 40,
            width: width,
            text: `${daysTravelled}`,
            fontSize: 72,
            fontFamily: 'Arial',
            fill: '#667eea',
            align: 'center',
            fontStyle: 'bold',
        });
        this.group.add(daysValue);

        const badgeY = height * 0.5;
        const badgeRadius = 80;

        const badgeCircle = new Konva.Circle({
            x: width / 2,
            y: badgeY,
            radius: badgeRadius,
            fill: badge.color,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 20,
            shadowOffset: { x: 0, y: 5 },
        });
        this.group.add(badgeCircle);

        const badgeRank = new Konva.Text({
            x: width / 2 - badgeRadius,
            y: badgeY - 35,
            width: badgeRadius * 2,
            text: badge.rank,
            fontSize: 72,
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center',
            fontStyle: 'bold',
        });
        this.group.add(badgeRank);

        const badgeMessage = new Konva.Text({
            x: 0,
            y: badgeY + badgeRadius + 20,
            width: width,
            text: badge.message,
            fontSize: 28,
            fontFamily: 'Arial',
            fill: badge.color,
            align: 'center',
            fontStyle: 'bold',
        });
        this.group.add(badgeMessage);

        // Play Again button
        const buttonWidth = 300;
        const buttonHeight = 70;
        const buttonX = (width - buttonWidth) / 2;
        const buttonY = height * 0.78;

        const playAgainBtn = new Konva.Rect({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            fill: '#667eea',
            cornerRadius: 35,
            shadowColor: 'rgba(102, 126, 234, 0.4)',
            shadowBlur: 15,
            shadowOffset: { x: 0, y: 5 },
        });

        const playAgainText = new Konva.Text({
            x: buttonX,
            y: buttonY + 20,
            width: buttonWidth,
            text: 'Play Again',
            fontSize: 28,
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center',
            fontStyle: 'bold',
        });

        playAgainBtn.on('mouseenter', () => {
            document.body.style.cursor = 'pointer';
            playAgainBtn.fill('#764ba2');
            this.layer.draw();
        });

        playAgainBtn.on('mouseleave', () => {
            document.body.style.cursor = 'default';
            playAgainBtn.fill('#667eea');
            this.layer.draw();
        });

        playAgainBtn.on('click tap', () => {
            onPlayAgain();
        });

        this.group.add(playAgainBtn);
        this.group.add(playAgainText);
    }

    show(): void {
        this.group.visible(true);
        this.layer.add(this.group);
        this.layer.draw();
    }

    hide(): void {
        this.group.visible(false);
        this.layer.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
}