import { combineLatest, fromEventPattern, map, Observable } from "rxjs"
import { NO_ROWS, NO_COLUMNS } from "./constants"
import { SlotsBinding } from "./slots-binding"

class Renderer {
    static instance = undefined

    #spinResultObservable = fromEventPattern(
        (handler) => window.electron.spinResultObservable(handler)
    )

    #amountWonObservable = fromEventPattern(
        (handler) => window.electron.amountWonObservable(handler)
    )

    #amountLostObservable = fromEventPattern(
        (handler) => window.electron.amountLostObservable(handler)
    )

    #spinStateObservable = fromEventPattern(
        (handler) => window.electron.spinStateObservable(handler)
    )

    #selectedBetObservable = fromEventPattern(
        (handler) => window.electron.selectedBetObservable(handler)
    )

    #currentWinObservable = fromEventPattern(
        (handler) => window.electron.currentWinObservable(handler)
    )

    #randomChosenColorObservable = fromEventPattern(
        (handler) => window.electron.randomChosenColorObservable(handler)
    )

    #rustLevelObservable = fromEventPattern(
        (handler) => window.electron.rustLevelObservable(handler)
    )

    binding

    constructor() {
        this.binding = new SlotsBinding(document)
        this.initSubscriptions()
        this.initEventListeners()
        this.initScreen()
    }

    initSubscriptions() {
        this.#spinStateObservable.subscribe(this.onSpinStateChanged.bind(this))

        combineLatest([this.#spinResultObservable, this.#spinStateObservable])
            .subscribe(this.onSpinResult.bind(this))

        this.#selectedBetObservable
            .pipe(map(this.mapSelectedBetToCells.bind(this)))
            .subscribe(this.onSelectBet.bind(this))

        this.#amountWonObservable.subscribe(this.onAmountWon.bind(this))
        this.#amountLostObservable.subscribe(this.onAmountLost.bind(this))
        this.#currentWinObservable.subscribe(this.onCurrentWin.bind(this))
        this.#randomChosenColorObservable.subscribe(this.onRandomChosenColor.bind(this))
        this.#rustLevelObservable.subscribe(this.onRustLevel.bind(this))
    }

    initEventListeners() {
        this.binding.spinButton.addEventListener("click", this.onSpinButtonClick.bind(this))
        this.binding.betSelectCells.forEach(betSelectCell => {
            betSelectCell.addEventListener("click", clickEvent => {
                window.electron.selectBet(Number.parseFloat(clickEvent.target.innerHTML))
            })
        })
        this.binding.doubleButton.addEventListener("click", window.electron.clickDoubleButton)
        this.binding.doubleRedButton.addEventListener("click", window.electron.clickRedDoubleButton)
        this.binding.doubleBlackButton.addEventListener("click", window.electron.clickBlackDoubleButton)
        this.binding.exitDoubleButton.addEventListener("click", window.electron.clickExitDoubleButton)
    }

    mapSelectedBetToCells(selectedBet) {
        return [
            this.mapSelectedBetToCell(selectedBet.current),
            this.mapSelectedBetToCell(selectedBet.last)
        ]
    }

    mapSelectedBetToCell(selectedBet) {
        switch (selectedBet) {
            case 0.2:
                return this.binding.betSelectCells[0]
            case 0.4:
                return this.binding.betSelectCells[1]
            case 0.6:
                return this.binding.betSelectCells[2]
            case 1:
                return this.binding.betSelectCells[3]
            case 2:
                return this.binding.betSelectCells[4]
        }
    }

    initScreen() {
        for (let row = 0; row < NO_ROWS; row++) {
            for (let column = 0; column < NO_COLUMNS; column++) {
                const slotKeyframe = document.createElement("div")
                slotKeyframe.className = "slot-keyframe"
                const imgKeyframe = document.createElement("img")
                const randomKeyframe = Math.floor(Math.random() * slotKeyframes.length)
                imgKeyframe.setAttribute("src", `./${slotKeyframes[randomKeyframe]}.png`)
                slotKeyframe.appendChild(imgKeyframe)
                this.binding.slotCells[row][column].appendChild(slotKeyframe)
            }
        }
        this.binding.canvas.width = 780
        this.binding.canvas.height = 460
    }

    onSpinResult([spinResult, spinState]) {
        if (spinState === "NOT_SPINNING") {
            this.stopSpinningAnimation(spinResult)
        }
    }

    onSelectBet([currentSelectedBetCell, lastSelectedBetCell]) {
        lastSelectedBetCell.classList.remove("bet-selected")
        currentSelectedBetCell.classList.add("bet-selected")
    }

    onSpinButtonClick() {
        window.electron.spin();
    }

    startSpinForColumn(column) {
        let offset = 0;
        for (let row = 0; row < NO_ROWS; row++) {
            const slotCell = this.binding.slotCells[row][column]
            slotCell.innerHTML = ""
            const slotWrapper = document.createElement("div")
            slotWrapper.className = "slot-wrapper"
            for (let k = 0; k < slotKeyframes.length + 1; k++) {
                const divKeyframe = document.createElement("div")
                divKeyframe.className = "slot-keyframe"
                const imgKeyframe = document.createElement("img")
                imgKeyframe.setAttribute("src", `./${slotKeyframes[(k + offset) % slotKeyframes.length]}.png`)
                divKeyframe.appendChild(imgKeyframe)
                slotWrapper.appendChild(divKeyframe)
            }
            slotCell.appendChild(slotWrapper)
            offset += 1;
        }
    }

    drawLineOne() {
        this.binding.canvasContext.beginPath()
        this.binding.canvasContext.moveTo(0, 460 / 6)
        this.binding.canvasContext.lineTo(780, 460 / 6)
        this.binding.canvasContext.strokeStyle = "#7393B3"
        this.binding.canvasContext.lineWidth = 2
        this.binding.canvasContext.stroke()
    }

    drawLineTwo() {
        this.binding.canvasContext.beginPath()
        this.binding.canvasContext.moveTo(0, 230)
        this.binding.canvasContext.lineTo(780, 230)
        this.binding.canvasContext.strokeStyle = "#B2BEB5"
        this.binding.canvasContext.lineWidth = 2
        this.binding.canvasContext.stroke()
    }

    drawLineThree() {
        this.binding.canvasContext.beginPath()
        this.binding.canvasContext.moveTo(0, 460 / 2 + 460 / 6 * 2)
        this.binding.canvasContext.lineTo(780, 460 / 2 + 460 / 6 * 2)
        this.binding.canvasContext.strokeStyle = "#36454F"
        this.binding.canvasContext.lineWidth = 2
        this.binding.canvasContext.stroke()
    }

    drawLineFour() {
        this.binding.canvasContext.beginPath()
        this.binding.canvasContext.moveTo(0, 460 / 6)
        this.binding.canvasContext.lineTo(75, 460 / 6)
        this.binding.canvasContext.lineTo(390, 460 / 2 + 460 / 6 * 2)
        this.binding.canvasContext.lineTo(705, 460 / 6)
        this.binding.canvasContext.lineTo(780, 460 / 6)
        this.binding.canvasContext.strokeStyle = "#A9A9A9"
        this.binding.canvasContext.lineWidth = 2
        this.binding.canvasContext.stroke()
    }

    drawLineFive() {
        this.binding.canvasContext.beginPath()
        this.binding.canvasContext.moveTo(0, 460 / 2 + 460 / 6 * 2)
        this.binding.canvasContext.lineTo(75, 460 / 2 + 460 / 6 * 2)
        this.binding.canvasContext.lineTo(390, 460 / 6)
        this.binding.canvasContext.lineTo(705, 460 / 2 + 460 / 6 * 2)
        this.binding.canvasContext.lineTo(780, 460 / 2 + 460 / 6 * 2)
        this.binding.canvasContext.strokeStyle = "#6082B6"
        this.binding.canvasContext.lineWidth = 2
        this.binding.canvasContext.stroke()
    }

    drawLine(lineNumber) {
        switch (lineNumber) {
            case 0:
                this.drawLineOne()
                break;
            case 1:
                this.drawLineTwo()
                break;
            case 2:
                this.drawLineThree()
                break;
            case 3:
                this.drawLineFour()
                break;
            case 4:
                this.drawLineFive()
                break;
        }
    }

    // TODO fix this shit
    highlightWinningCells(lineWon) {
        if (lineWon.line <= 2) {
            for (let i = 0; i < lineWon.noSymbols; i++) {
                this.binding.slotCells[lineWon.line][i].classList.add("winning-slot-keyframe")
            }
        } else if (lineWon.line === 3) {
            let i = 0;
            let j = 0;
            let changeDirection = false;
            while (j < lineWon.noSymbols) {
                this.binding.slotCells[i][j].classList.add("winning-slot-keyframe")
                if (i < NO_ROWS - 1 && !changeDirection) {
                    i += 1;
                } else if (i === NO_ROWS - 1 && !changeDirection) {
                    changeDirection = true
                    i -= 1;
                } else {
                    i -= 1
                }
                j += 1;
            }
        } else if (lineWon.line === 4) {
            let i = 2
            let j = 0
            let changeDirection = false
            while (j < lineWon.noSymbols) {
                this.binding.slotCells[i][j].classList.add("winning-slot-keyframe")
                if (i > 0 && !changeDirection) {
                    i -= 1;
                } else if (i === 0 && !changeDirection) {
                    changeDirection = true
                    i += 1;
                } else {
                    i += 1
                }
                j += 1;
            }
        }
    }

    highlightWinningScatterCells(positions) {
        console.log(positions)
        for (let [x, y] of positions) {
            this.binding.slotCells[x][y].classList.add("winning-slot-keyframe")
        }
    }

    drawSpinResult(spinResult) {
        for (let winningLine of spinResult.winningLines) {
            this.drawLine(winningLine.line)
            this.highlightWinningCells(winningLine)
        }
        if (spinResult.scatterWin) {
            this.highlightWinningScatterCells(spinResult.scatterWin.positions)
        }
        this.binding.currentAmountWon.style.visibility = "visible"
        this.binding.spinButton.disabled = false
        this.binding.doubleButton.disabled = false
    }

    stopSpinForColumn(column, spinResult) {
        for (let row = 0; row < NO_ROWS; row++) {
            const slotCell = this.binding.slotCells[row][column]
            slotCell.innerHTML = ""
            const slotKeyframe = document.createElement("div")
            slotKeyframe.className = "slot-keyframe"
            const imgKeyframe = document.createElement("img")
            imgKeyframe.setAttribute("src", `./${spinResult.result[row][column].name}.png`)
            slotKeyframe.appendChild(imgKeyframe)
            slotCell.appendChild(slotKeyframe)
        }
        if (column === NO_COLUMNS - 1) {
            this.drawSpinResult(spinResult)
        }
    }

    startSpinningAnimation() {
        let timeout = 0;
        for (let j = 0; j < NO_COLUMNS; j++) {
            setTimeout(() => this.startSpinForColumn(j), timeout)
            timeout += 200;
        }
    }

    stopSpinningAnimation(spinResult) {
        let timeout = 0;
        for (let j = 0; j < NO_COLUMNS; j++) {
            setTimeout(() => this.stopSpinForColumn(j, spinResult), timeout)
            timeout += 200;
        }
    }

    clearHighlights() {
        for (let i = 0; i < NO_ROWS; i++) {
            for (let j = 0; j < NO_COLUMNS; j++) {
                this.binding.slotCells[i][j].classList.remove("winning-slot-keyframe")
            }
        }
    }

    openDoublingScreen() {
        this.binding.doubleRedButton.disabled = false
        this.binding.doubleBlackButton.disabled = false
        this.binding.exitDoubleButton.disabled = false
        this.binding.cardFlicker.style.animationName = "flicker"
        this.binding.doubleContainer.style.visibility = "visible"
        this.binding.greyedOutBackground.style.visibility = "visible"
    }

    hideDoublingScreen() {
        this.binding.doubleContainer.style.visibility = "hidden"
        this.binding.greyedOutBackground.style.visibility = "hidden"
    }

    showDoublingResult() {
        this.binding.cardFlicker.style.animationName = "none"
    }

    onSpinStateChanged(spinState) {
        switch (spinState) {
            case "SPINNING":
                this.binding.canvasContext.clearRect(0, 0, 780, 460)
                this.clearHighlights();
                this.startSpinningAnimation()
                this.binding.spinButton.disabled = true
                this.binding.doubleButton.disabled = true
                this.binding.currentAmountWon.style.visibility = "hidden"
                break
            case "DOUBLING":
                this.openDoublingScreen()
                break;
            case "WAITING_FOR_DOUBLING_RESULT":
                this.binding.doubleRedButton.disabled = true
                this.binding.doubleBlackButton.disabled = true
                this.binding.exitDoubleButton.disabled = true
                break
            case "DOUBLING_END":
                this.hideDoublingScreen()
                break
            case "SHOWING_DOUBLING_RESULT":
                this.showDoublingResult()
        }
    }

    onAmountWon(amountWon) {
        this.binding.amountWonSpan.innerHTML = amountWon.toFixed(2)
    }

    onAmountLost(amountLost) {
        this.binding.amountLostSpan.innerHTML = amountLost.toFixed(2)
    }

    onCurrentWin(currentWin) {
        this.binding.currentAmountWon.innerHTML = `Amount won: ${currentWin}`
    }

    shiftLastChosenColors(lastChosenColor) {
        for (let i = 4; i > 0; i--) {
            this.binding.lastChosenColors[i].style.backgroundImage = 
                this.binding.lastChosenColors[i - 1].style.backgroundImage;
        }
        this.binding.lastChosenColors[0].style.backgroundImage = `url(./${lastChosenColor}_ACE.png)`
    }

    onRandomChosenColor(randomChosenColor) {
        this.binding.cardFlicker.style.backgroundImage = `url(./${randomChosenColor}_ACE.png)`
        this.shiftLastChosenColors(randomChosenColor)
    }

    onRustLevel(rustLevel) {
        this.binding.docBody.style.backgroundImage = `url(./RUSTY_BG_${rustLevel}.png)`
    }

    static getInstance() {
        if (!Renderer.instance) {
            Renderer.instance = new Renderer()
        }
    }
}

const slotKeyframes = ["ACE", "DENIS", "J", "K", "KANYE", "Q", "RARES", "TOILET", "TUDOR", "VIRUS"]

const rustyBackgroundThreshold = [100, 200, 300, 400]

Renderer.getInstance()
