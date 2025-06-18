import { NO_ROWS, NO_COLUMNS } from "./constants"

export class SlotsBinding {

    slotCells = []
    betSelectCells = []
    lastChosenColors = []
    spinButton
    doubleButton
    docBody
    doubleContainer
    greyedOutBackground
    doubleRedButton
    doubleBlackButton
    cardFlicker
    canvas
    canvasContext
    amountLostSpan
    amountWonSpan
    currentAmountWon

    constructor(document) {
        this.initCells(document)
        this.initBinding(document)
    }

    initCells(document) {
        for (let row = 0; row < NO_ROWS; row++) {
            this.slotCells.push([])
            for (let column = 0; column < NO_COLUMNS; column++) {
                this.slotCells[row].push(document.getElementById(`${row}-${column}`))
            }
        }

        this.betSelectCells = Array.from(document.getElementsByClassName("bet-select-cell"))
    }

    initBinding(document) {
        this.spinButton = document.getElementById("spin-button")
        this.doubleButton = document.getElementById("double-button")
        this.docBody = document.getElementById("doc-body")
        this.doubleContainer = document.getElementById("double-container")
        this.greyedOutBackground = document.getElementById("greyed-out-background")
        this.doubleRedButton = document.getElementById("double-red")
        this.doubleBlackButton = document.getElementById("double-black")
        this.exitDoubleButton = document.getElementById("exit-double-button")
        this.cardFlicker = document.getElementById("card-flicker")
        this.canvas = document.getElementById("line-canvas")
        this.canvasContext = this.canvas.getContext("2d")
        this.amountLostSpan = document.getElementById("amount-lost")
        this.amountWonSpan = document.getElementById("amount-won")
        this.currentAmountWon = document.getElementById("current-amount-won")

        for (let i = 0; i < 5; i++) {
            this.lastChosenColors.push(document.getElementById(`last-drawn-card-${i}`))
        }
    }

}
