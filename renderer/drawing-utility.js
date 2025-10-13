import { LINE_FIVE_COLOR, LINE_FOUR_COLOR, LINE_ONE_COLOR, LINE_THREE_COLOR, LINE_TWO_COLOR } from "./constants";

export class DrawingUtility {

    canvasContext

    constructor(canvasContext) {
        this.canvasContext = canvasContext;
    }

    clearLines() {
        this.canvasContext.clearRect(0, 0, 780, 460);
    }

    drawLine(lineNumber) {
        switch (lineNumber) {
            case 0: return this.drawLineOne();
            case 1: return this.drawLineTwo();
            case 2: return this.drawLineThree();
            case 3: return this.drawLineFour();
            case 4: return this.drawLineFive();
        }
    }

    drawLineOne() {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 460 / 6);
        this.canvasContext.lineTo(780, 460 / 6);
        this.canvasContext.strokeStyle = LINE_ONE_COLOR;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.stroke();
    }
    
    drawLineTwo() {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 230);
        this.canvasContext.lineTo(780, 230);
        this.canvasContext.strokeStyle = LINE_TWO_COLOR;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.stroke();
    }

    drawLineThree() {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 460 / 2 + (460 / 6) * 2);
        this.canvasContext.lineTo(780, 460 / 2 + (460 / 6) * 2);
        this.canvasContext.strokeStyle = LINE_THREE_COLOR;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.stroke();
    }

    drawLineFour() {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 460 / 6);
        this.canvasContext.lineTo(75, 460 / 6);
        this.canvasContext.lineTo(390, 460 / 2 + (460 / 6) * 2);
        this.canvasContext.lineTo(705, 460 / 6);
        this.canvasContext.lineTo(780, 460 / 6);
        this.canvasContext.strokeStyle = LINE_FOUR_COLOR;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.stroke();
    }

    drawLineFive() {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, 460 / 2 + (460 / 6) * 2);
        this.canvasContext.lineTo(75, 460 / 2 + (460 / 6) * 2);
        this.canvasContext.lineTo(390, 460 / 6);
        this.canvasContext.lineTo(705, 460 / 2 + (460 / 6) * 2);
        this.canvasContext.lineTo(780, 460 / 2 + (460 / 6) * 2);
        this.canvasContext.strokeStyle = LINE_FIVE_COLOR;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.stroke();
    }
}
