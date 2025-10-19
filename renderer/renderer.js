import { combineLatest, fromEventPattern, map } from "rxjs";
import { SlotsBinding } from "./slots-binding";
import { initObservable } from "./utils";
import { DrawingUtility } from "./drawing-utility";
import { generateAceImageFileName, generateAmountWonDisplay, generateRandomSlotKeyframe, generateRustyBackgroundFileName } from "./generators";
import {
    NO_ROWS,
    NO_COLUMNS,
    SLOT_KEYFRAMES,
    WINNING_SLOT_KEYFRAME_CLASS,
    CLICK_EVENT,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    SPIN_STATE_NOT_SPINNING,
    BET_SELECTED_CLASS,
    SPIN_STATE_SPINNING,
    SPIN_STATE_DOUBLING,
    SPIN_STATE_WAITING_FOR_DOUBLING_RESULT,
    SPIN_STATE_DOUBLING_END,
    SPIN_STATE_SHOWING_DOUBLING_RESULT
} from "./constants";

class Renderer {
    static instance = undefined;

    #amountWonObservable = initObservable(window.electron.amountWonObservable);
    #spinStateObservable = initObservable(window.electron.spinStateObservable);
    #rustLevelObservable = initObservable(window.electron.rustLevelObservable);
    #spinResultObservable = initObservable(
        window.electron.spinResultObservable
    );
    #amountLostObservable = initObservable(
        window.electron.amountLostObservable
    );
    #selectedBetObservable = initObservable(
        window.electron.selectedBetObservable
    );
    #currentWinObservable = initObservable(
        window.electron.currentWinObservable
    );
    #randomChosenColorObservable = initObservable(
        window.electron.randomChosenColorObservable
    );

    binding;
    drawingUtility;

    constructor() {
        this.binding = new SlotsBinding(document);
        this.drawingUtility = new DrawingUtility(this.binding.canvasContext)
        this.initSubscriptions();
        this.initEventListeners();
        this.initScreen();
    }

    initSubscriptions() {
        combineLatest([
            this.#spinResultObservable,
            this.#spinStateObservable
        ]).subscribe(this.onSpinResult.bind(this));

        this.#selectedBetObservable
            .pipe(map(this.mapSelectedBetToCells.bind(this)))
            .subscribe(this.onSelectBet.bind(this));

        this.#spinStateObservable.subscribe(this.onSpinStateChanged.bind(this));
        this.#amountWonObservable.subscribe(this.onAmountWon.bind(this));
        this.#amountLostObservable.subscribe(this.onAmountLost.bind(this));
        this.#currentWinObservable.subscribe(this.onCurrentWin.bind(this));
        this.#rustLevelObservable.subscribe(this.onRustLevel.bind(this));
        this.#randomChosenColorObservable.subscribe(
            this.onRandomChosenColor.bind(this)
        );
    }

    initEventListeners() {
        this.binding.spinButton.addEventListener(
            CLICK_EVENT,
            window.electron.spin
        );
        this.binding.doubleButton.addEventListener(
            CLICK_EVENT,
            window.electron.clickDoubleButton
        );
        this.binding.doubleRedButton.addEventListener(
            CLICK_EVENT,
            window.electron.clickRedDoubleButton
        );
        this.binding.doubleBlackButton.addEventListener(
            CLICK_EVENT,
            window.electron.clickBlackDoubleButton
        );
        this.binding.exitDoubleButton.addEventListener(
            CLICK_EVENT,
            window.electron.clickExitDoubleButton
        );

        this.binding.betSelectCells.forEach((betSelectCell) => {
            betSelectCell.addEventListener(CLICK_EVENT, (clickEvent) => {
                window.electron.selectBet(
                    Number.parseFloat(clickEvent.target.innerHTML)
                );
            });
        });
    }

    initScreen() {
        for (let row = 0; row < NO_ROWS; row++) {
            for (let column = 0; column < NO_COLUMNS; column++) {
                const randomSlotKeyframe = generateRandomSlotKeyframe()
                this.binding.slotCells[row][column].appendChild(randomSlotKeyframe);
            }
        }
        this.binding.canvas.width = CANVAS_WIDTH;
        this.binding.canvas.height = CANVAS_HEIGHT;
    }

    // TODO Move mappers
    mapSelectedBetToCells(selectedBet) {
        return [
            this.mapSelectedBetToCell(selectedBet.current),
            this.mapSelectedBetToCell(selectedBet.last)
        ];
    }

    // TODO Move mappers
    mapSelectedBetToCell(selectedBet) {
        switch (selectedBet) {
            case 0.2:
                return this.binding.betSelectCells[0];
            case 0.4:
                return this.binding.betSelectCells[1];
            case 0.6:
                return this.binding.betSelectCells[2];
            case 1:
                return this.binding.betSelectCells[3];
            case 2:
                return this.binding.betSelectCells[4];
        }
    }

    onSpinResult([spinResult, spinState]) {
        if (spinState === SPIN_STATE_NOT_SPINNING) {
            this.stopSpinningAnimation(spinResult);
        }
    }

    onSelectBet([currentSelectedBetCell, lastSelectedBetCell]) {
        lastSelectedBetCell.classList.remove(BET_SELECTED_CLASS);
        currentSelectedBetCell.classList.add(BET_SELECTED_CLASS);
    }

    // TODO Fix this shit
    startSpinForColumn(column) {
        let offset = 0;
        for (let row = 0; row < NO_ROWS; row++) {
            const slotCell = this.binding.slotCells[row][column];
            slotCell.innerHTML = "";
            const slotWrapper = document.createElement("div");
            slotWrapper.className = "slot-wrapper";
            for (let k = 0; k < SLOT_KEYFRAMES.length + 1; k++) {
                const divKeyframe = document.createElement("div");
                divKeyframe.className = "slot-keyframe";
                const imgKeyframe = document.createElement("img");
                imgKeyframe.setAttribute(
                    "src",
                    `./${SLOT_KEYFRAMES[(k + offset) % SLOT_KEYFRAMES.length]}.png`
                );
                divKeyframe.appendChild(imgKeyframe);
                slotWrapper.appendChild(divKeyframe);
            }
            slotCell.appendChild(slotWrapper);
            offset += 1;
        }
    }

    // TODO Fix this shit and maybe move to HighlightingUtility?
    highlightWinningCells(lineWon) {
        if (lineWon.line <= 2) {
            for (let i = 0; i < lineWon.noSymbols; i++) {
                this.binding.slotCells[lineWon.line][i].classList.add(
                    WINNING_SLOT_KEYFRAME_CLASS
                );
            }
        } else if (lineWon.line === 3) {
            let i = 0;
            let j = 0;
            let changeDirection = false;
            while (j < lineWon.noSymbols) {
                this.binding.slotCells[i][j].classList.add(
                    WINNING_SLOT_KEYFRAME_CLASS
                );
                if (i < NO_ROWS - 1 && !changeDirection) {
                    i += 1;
                } else if (i === NO_ROWS - 1 && !changeDirection) {
                    changeDirection = true;
                    i -= 1;
                } else {
                    i -= 1;
                }
                j += 1;
            }
        } else if (lineWon.line === 4) {
            let i = 2;
            let j = 0;
            let changeDirection = false;
            while (j < lineWon.noSymbols) {
                this.binding.slotCells[i][j].classList.add(
                    WINNING_SLOT_KEYFRAME_CLASS
                );
                if (i > 0 && !changeDirection) {
                    i -= 1;
                } else if (i === 0 && !changeDirection) {
                    changeDirection = true;
                    i += 1;
                } else {
                    i += 1;
                }
                j += 1;
            }
        }
    }

    // TODO Maybe move to HighlightingUtility?
    highlightWinningScatterCells(positions) {
        for (let [x, y] of positions) {
            this.binding.slotCells[x][y].classList.add(
                WINNING_SLOT_KEYFRAME_CLASS
            );
        }
    }

    drawSpinResult(spinResult) {
        for (let winningLine of spinResult.winningLines) {
            this.drawingUtility.drawLine(winningLine.line)
            this.highlightWinningCells(winningLine);
        }
        if (spinResult.scatterWin) {
            this.highlightWinningScatterCells(spinResult.scatterWin.positions);
        }
        this.binding.currentAmountWon.style.visibility = "visible";
        this.binding.spinButton.disabled = false;
        this.binding.doubleButton.disabled = false;
    }

    // TODO Fix this shit
    stopSpinForColumn(column, spinResult) {
        for (let row = 0; row < NO_ROWS; row++) {
            const slotCell = this.binding.slotCells[row][column];
            slotCell.innerHTML = "";
            const slotKeyframe = document.createElement("div");
            slotKeyframe.className = "slot-keyframe";
            const imgKeyframe = document.createElement("img");
            imgKeyframe.setAttribute(
                "src",
                `./${spinResult.result[row][column].name}.png`
            );
            slotKeyframe.appendChild(imgKeyframe);
            slotCell.appendChild(slotKeyframe);
        }
        if (column === NO_COLUMNS - 1) {
            this.drawSpinResult(spinResult);
        }
    }

    startSpinningAnimation() {
        let timeout = 0;
        for (let j = 0; j < NO_COLUMNS; j++) {
            setTimeout(() => this.startSpinForColumn(j), timeout);
            timeout += 200;
        }
    }

    stopSpinningAnimation(spinResult) {
        let timeout = 0;
        for (let j = 0; j < NO_COLUMNS; j++) {
            setTimeout(() => this.stopSpinForColumn(j, spinResult), timeout);
            timeout += 200;
        }
    }

    clearHighlights() {
        for (let i = 0; i < NO_ROWS; i++) {
            for (let j = 0; j < NO_COLUMNS; j++) {
                this.binding.slotCells[i][j].classList.remove(
                    WINNING_SLOT_KEYFRAME_CLASS
                );
            }
        }
    }

    openDoublingScreen() {
        this.binding.doubleRedButton.disabled = false;
        this.binding.doubleBlackButton.disabled = false;
        this.binding.exitDoubleButton.disabled = false;
        this.binding.cardFlicker.style.animationName = "flicker";
        this.binding.doubleContainer.style.visibility = "visible";
        this.binding.greyedOutBackground.style.visibility = "visible";
    }

    hideDoublingScreen() {
        this.binding.doubleContainer.style.visibility = "hidden";
        this.binding.greyedOutBackground.style.visibility = "hidden";
    }

    showDoublingResult() {
        this.binding.cardFlicker.style.animationName = "none";
    }

    onSpinStateChanged(spinState) {
        switch (spinState) {
            case SPIN_STATE_SPINNING:
                this.drawingUtility.clearLines();
                this.clearHighlights();
                this.startSpinningAnimation();
                this.binding.spinButton.disabled = true;
                this.binding.doubleButton.disabled = true;
                this.binding.currentAmountWon.style.visibility = "hidden";
                break;
            case SPIN_STATE_DOUBLING:
                this.openDoublingScreen();
                break;
            case SPIN_STATE_WAITING_FOR_DOUBLING_RESULT:
                this.binding.doubleRedButton.disabled = true;
                this.binding.doubleBlackButton.disabled = true;
                this.binding.exitDoubleButton.disabled = true;
                break;
            case SPIN_STATE_DOUBLING_END:
                this.hideDoublingScreen();
                break;
            case SPIN_STATE_SHOWING_DOUBLING_RESULT:
                this.showDoublingResult();
        }
    }

    onAmountWon(amountWon) {
        this.binding.amountWonSpan.innerHTML = amountWon.toFixed(2);
    }

    onAmountLost(amountLost) {
        this.binding.amountLostSpan.innerHTML = amountLost.toFixed(2);
    }

    onCurrentWin(currentWin) {
        this.binding.currentAmountWon.innerHTML = generateAmountWonDisplay(currentWin);
    }

    shiftLastChosenColors(lastChosenColor) {
        for (let i = 4; i > 0; i--) {
            this.binding.lastChosenColors[i].style.backgroundImage =
                this.binding.lastChosenColors[i - 1].style.backgroundImage;
        }
        this.binding.lastChosenColors[0].style.backgroundImage = generateAceImageFileName(lastChosenColor);
    }

    onRandomChosenColor(randomChosenColor) {
        this.binding.cardFlicker.style.backgroundImage = generateAceImageFileName(randomChosenColor);
        this.shiftLastChosenColors(randomChosenColor);
    }

    onRustLevel(rustLevel) {
        // this.binding.docBody.style.backgroundImage = generateRustyBackgroundFileName(rustLevel);
    }

    static getInstance() {
        if (!Renderer.instance) {
            Renderer.instance = new Renderer();
        }
    }
}

Renderer.getInstance();
