const spinButton = document.getElementById("spin-button")
const doubleButton = document.getElementById("double-button")
const docBody = document.getElementById("doc-body")

const doubleContainer = document.getElementById("double-container")
const greyedOutBackground = document.getElementById("greyed-out-background")

const doubleRedButton = document.getElementById("double-red")
const doubleBlackButton = document.getElementById("double-black")
const cardFlicker = document.getElementById("card-flicker")

doubleContainer.style.visibility = "hidden"
greyedOutBackground.style.visibility = "hidden"

const slotKeyframes = ["ACE", "DENIS", "J", "K", "KANYE", "Q", "RARES", "TOILET", "TUDOR", "VIRUS"]
const lastDrawnCards = []

const noRows = 3
const noColumns = 5

let spinState = null
let spinResult

let selectedBetElement = document.getElementsByClassName("bet-select-cell bet-selected")[0]
let selectedBetAmount = 0.2
let lastWin = 0
let amountWon = 0
let amountLost = 0

const canvas = document.getElementById("line-canvas")
const amountLostSpan = document.getElementById("amount-lost")
const amountWonSpan = document.getElementById("amount-won")
const context = canvas.getContext("2d")
const currentAmountWon = document.getElementById("current-amount-won")

canvas.width = 780
canvas.height = 460

const rustyBackgroundThreshold = [100, 200, 300, 400]

initScreen()

async function spin(bet) {
    if (!spinState) {
        spinResult = await window.electron.spin(bet);
        lastWin = spinResult.totalPrize
        amountLost += Number.parseFloat(bet)

        checkRustThreshold()

        lastWin = Number(lastWin.toFixed(2))
        amountLost = Number(amountLost.toFixed(2))

        currentAmountWon.style.visibility = "hidden"
        currentAmountWon.innerHTML = `Amount won: ${lastWin}`

        amountLostSpan.innerHTML = amountLost
        spinButton.disabled = true
        doubleButton.disabled = true
        context.clearRect(0, 0, 780, 460)
        spinState = "spinning"
        let timeout = 0
        for (let i = 0; i < noRows; i++) {
            for (let j = 0; j < noColumns; j++) {
                document.getElementById(`${i}-${j}`).classList.remove("winning-slot-keyframe")
            }
        }
        for (let j = 0; j < noColumns; j++) {
            setTimeout(() => startSpinForColumn(j), timeout)
            setTimeout(() => stopSpinForColumn(j, spinResult.spin), 2000 + timeout)
            timeout += 200
        }
    }
}

doubleRedButton.addEventListener("click", () => {
    onDoubleButtonPress("RED")
})

doubleBlackButton.addEventListener("click", () => {
    onDoubleButtonPress("BLACK")
})

function onDoubleButtonPress(color) {
    doubleRedButton.disabled = true
    doubleBlackButton.disabled = true
    document.getElementById("exit-double-button").disabled = true
    const randomColor = Math.random() < 0.5 ? "RED" : "BLACK"
    cardFlicker.style.animationName = "none"
    cardFlicker.style.backgroundImage = `url(../assets/${randomColor}_ACE.png)`
    let won = true
    if (randomColor === color) {
        lastWin *= 2;
        currentAmountWon.innerHTML = `Amount won: ${lastWin}`
    } else {
        lastWin = 0
        currentAmountWon.innerHTML = `Amount won: ${lastWin}`
        won = false
    }
    setTimeout(() => {
        doubleRedButton.disabled = false
        doubleBlackButton.disabled = false
        document.getElementById("exit-double-button").disabled = false
        cardFlicker.style.animationName = "flicker"
        lastDrawnCards.pop()
        lastDrawnCards.unshift(randomColor)
        drawLastDrawnCards()
        if (!won) {
            stopDoubleDialogue()
        }
    }, 2000)
}

function checkRustThreshold() {
    for (let i = rustyBackgroundThreshold.length - 1; i >= 0; i--) {
        if (amountLost > rustyBackgroundThreshold[i]) {
            docBody.style.backgroundImage = `url(../assets/RUSTY_BG_${i + 1}.png)`
            break;
        }
    }
}

spinButton.addEventListener("click", async () => {
    amountWon += lastWin
    amountWon = Number(amountWon.toFixed(2))
    amountWonSpan.innerHTML = amountWon
    await spin(selectedBetAmount)
})

doubleButton.addEventListener("click", async () => {
    if (lastWin !== 0) {
        startDoubleDialogue()
    }
})

document.addEventListener("keydown", async (event) => {
    if (event.key === " " && !spinState) {
        amountWon += lastWin
        amountWon = Number(amountWon.toFixed(2))
        amountWonSpan.innerHTML = amountWon
        await spin(selectedBetAmount)
    }
})

function startDoubleDialogue() {
    cardFlicker.style.animationName = "flicker"
    doubleContainer.style.visibility = "visible"
    greyedOutBackground.style.visibility = "visible"
}

function stopDoubleDialogue() {
    doubleContainer.style.visibility = "hidden"
    greyedOutBackground.style.visibility = "hidden"
}

function startSpinForColumn(column) {
    let offset = 0;
    for (let row = 0; row < noRows; row++) {
        const slotCell = document.getElementById(`${row}-${column}`)
        slotCell.innerHTML = ""
        const slotWrapper = document.createElement("div")
        slotWrapper.className = "slot-wrapper"
        for (let k = 0; k < slotKeyframes.length + 1; k++) {
            const divKeyframe = document.createElement("div")
            divKeyframe.className = "slot-keyframe"
            const imgKeyframe = document.createElement("img")
            imgKeyframe.setAttribute("src", `../assets/${slotKeyframes[(k + offset) % slotKeyframes.length]}.png`)
            divKeyframe.appendChild(imgKeyframe)
            slotWrapper.appendChild(divKeyframe)
        }
        slotCell.appendChild(slotWrapper)
        offset += 1;
    }
}

function stopSpinForColumn(column, spin) {
    for (let row = 0; row < noRows; row++) {
        slotCell = document.getElementById(`${row}-${column}`)
        slotCell.innerHTML = ""
        const slotKeyframe = document.createElement("div")
        slotKeyframe.className = "slot-keyframe"
        const imgKeyframe = document.createElement("img")
        imgKeyframe.setAttribute("src", `../assets/${spin[row][column].name}.png`)
        slotKeyframe.appendChild(imgKeyframe)
        slotCell.appendChild(slotKeyframe)
    }
    if (column === noColumns - 1) {
        onSpinStop()
    }
}

function onSpinStop() {
    for (let lineWon of spinResult.linesWon) {
        drawLine(lineWon.line)
        highlightWinningCells(lineWon)
    }
    if (spinResult.scatterWin.isWinning) {
        highlightWinningScatterCells(spinResult.scatterWin.positions)
    }
    currentAmountWon.style.visibility = "visible"
    spinState = null
    spinButton.disabled = false
    doubleButton.disabled = false
}

function initScreen() {
    for (let row = 0; row < noRows; row++) {
        for (let column = 0; column < noColumns; column++) {
            const slotCell = document.getElementById(`${row}-${column}`)
            const slotKeyframe = document.createElement("div")
            slotKeyframe.className = "slot-keyframe"
            const imgKeyframe = document.createElement("img")
            const randomKeyframe = Math.floor(Math.random() * slotKeyframes.length)
            imgKeyframe.setAttribute("src", `../assets/${slotKeyframes[randomKeyframe]}.png`)
            slotKeyframe.appendChild(imgKeyframe)
            slotCell.appendChild(slotKeyframe)
        }
    }
    for (let i = 1; i <= 5; i++) {
        let cardColor = Math.random() < 0.5 ? "RED" : "BLACK"
        document.getElementById(`last-drawn-card-${i}`).style.backgroundImage = `url(../assets/${cardColor}_ACE.png)`
        lastDrawnCards.push(cardColor)
    }
    document.getElementById("exit-double-button").addEventListener("click", () => {
        doubleContainer.style.visibility = "hidden"
        greyedOutBackground.style.visibility = "hidden"
    })
}

function drawLastDrawnCards() {
    for (let i = 0; i < 5; i++) {
        document.getElementById(`last-drawn-card-${i + 1}`).style.backgroundImage = `url(../assets/${lastDrawnCards[i]}_ACE.png)`
    }
}

// TODO fix this shit
function highlightWinningCells(lineWon) {
    if (lineWon.line <= 3) {
        for (let i = 0; i < lineWon.symbols; i++) {
            document.getElementById(`${lineWon.line - 1}-${i}`).classList.add("winning-slot-keyframe")
        }
    } else if (lineWon.line === 4) {
        let i = 0;
        let j = 0;
        let changeDirection = false;
        while (j < lineWon.symbols) {
            document.getElementById(`${i}-${j}`).classList.add("winning-slot-keyframe")
            if (i < noRows - 1 && !changeDirection) {
                i += 1;
            } else if (i === noRows - 1 && !changeDirection) {
                changeDirection = true
                i -= 1;
            } else {
                i -= 1
            }
            j += 1;
        }
    } else if (lineWon.line === 5) {
        let i = 2
        let j = 0
        let changeDirection = false
        while (j < lineWon.symbols) {
            document.getElementById(`${i}-${j}`).classList.add("winning-slot-keyframe")
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

function highlightWinningScatterCells(positions) {
    for ([x, y] of positions) {
        document.getElementById(`${x}-${y}`).classList.add("winning-slot-keyframe")
    }
}

function drawLine(lineNumber) {
    switch (lineNumber) {
        case 1:
            drawLineOne()
            break;
        case 2:
            drawLineTwo()
            break;
        case 3:
            drawLineThree()
            break;
        case 4:
            drawLineFour()
            break;
        case 5:
            drawLineFive()
            break;
    }
}

function drawLineOne() {
    context.beginPath()
    context.moveTo(0, 460 / 6)
    context.lineTo(780, 460 / 6)
    context.strokeStyle = "#7393B3"
    context.lineWidth = 2
    context.stroke()
}

function drawLineTwo() {
    context.beginPath()
    context.moveTo(0, 230)
    context.lineTo(780, 230)
    context.strokeStyle = "#B2BEB5"
    context.lineWidth = 2
    context.stroke()
}

function drawLineThree() {
    context.beginPath()
    context.moveTo(0, 460 / 2 + 460 / 6 * 2)
    context.lineTo(780, 460 / 2 + 460 / 6 * 2)
    context.strokeStyle = "#36454F"
    context.lineWidth = 2
    context.stroke()
}

function drawLineFour() {
    context.beginPath()
    context.moveTo(0, 460 / 6)
    context.lineTo(75, 460 / 6)
    context.lineTo(390, 460 / 2 + 460 / 6 * 2)
    context.lineTo(705, 460 / 6)
    context.lineTo(780, 460 / 6)
    context.strokeStyle = "#A9A9A9"
    context.lineWidth = 2
    context.stroke()
}

function drawLineFive() {
    context.beginPath()
    context.moveTo(0, 460 / 2 + 460 / 6 * 2)
    context.lineTo(75, 460 / 2 + 460 / 6 * 2)
    context.lineTo(390, 460 / 6)
    context.lineTo(705, 460 / 2 + 460 / 6 * 2)
    context.lineTo(780, 460 / 2 + 460 / 6 * 2)
    context.strokeStyle = "#6082B6"
    context.lineWidth = 2
    context.stroke()
}

Array.from(document.getElementsByClassName("bet-select-cell")).forEach(element => {
    element.addEventListener("click", clickEvent => {
        if (clickEvent.target.innerHTML === selectedBetAmount) return
        selectedBetAmount = clickEvent.target.innerHTML
        selectedBetElement.classList.remove("bet-selected")
        clickEvent.target.classList.add("bet-selected")
        selectedBetElement = clickEvent.target
    })
})
