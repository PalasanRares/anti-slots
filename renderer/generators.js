import { IMAGE_KEYFRAME_ELEMENT, IMAGE_SOURCE_ATTRIBUTE, SLOT_KEYFRAME_CLASS, SLOT_KEYFRAME_ELEMENT, SLOT_KEYFRAMES } from "./constants";

function generateImageKeyframeFileName(keyframe) {
    return `./${keyframe}.png`
}

export function generateRandomSlotKeyframe() {
    const newSlotKeyframe = document.createElement(SLOT_KEYFRAME_ELEMENT)
    newSlotKeyframe.className = SLOT_KEYFRAME_CLASS;
    const imageKeyframe = document.createElement(IMAGE_KEYFRAME_ELEMENT);
    const randomKeyframe = Math.floor(
        Math.random() * SLOT_KEYFRAMES.length
    );
    imageKeyframe.setAttribute(
        IMAGE_SOURCE_ATTRIBUTE,
        generateImageKeyframeFileName(SLOT_KEYFRAMES[randomKeyframe])
    );
    newSlotKeyframe.appendChild(imageKeyframe);
    return newSlotKeyframe
}

export function generateAmountWonDisplay(amountWon) {
    return `Amount won: ${amountWon}`
}

export function generateAceImageFileName(aceColor) {
    return `url(./${aceColor}_ACE.png)`
}

export function generateRustyBackgroundFileName(rustLevel) {
    return `url(./RUSTY_BG_${rustLevel}.png)`
}
