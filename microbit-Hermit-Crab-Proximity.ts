let hermitcounter = 0
let hermit1: Image = null
let farThresholdDelay = 0
let farThreshold = 0
let firstFarTime = 0
let nearThreshold = 0
let isNear = false
let ishuman = 0
let lastSignalStrength = 0
radio.onDataPacketReceived( ({ receivedNumber, signal }) =>  {
    lastSignalStrength = signal
    if (ishuman != receivedNumber) {
        updateProximity()
        if (ishuman) {
            humanCondition()
        } else {
            if (isNear) {
                basic.showLeds(`
                    # # . . .
                    # # . . .
                    # # . . .
                    # # . . .
                    # # . . .
                    `)
            } else {
                hermit1.showImage(hermitcounter)
                hermitcounter += 1
                if (hermitcounter > 9) {
                    hermitcounter = 0
                }
            }
        }
    }
})
function updateProximity()  {
    if (lastSignalStrength > nearThreshold) {
        isNear = true
        firstFarTime = 0
    }
    if (lastSignalStrength < farThreshold) {
        if (input.runningTime() == 0) {
            firstFarTime = input.runningTime()
        } else if (input.runningTime() - firstFarTime > farThresholdDelay) {
            isNear = false
        }
    }
}
input.onButtonPressed(Button.B, () => {
    ishuman = 0
})
input.onButtonPressed(Button.A, () => {
    ishuman = 1
})
function humanNear()  {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
}
function humanCondition()  {
    if (isNear) {
        humanNear()
    } else {
        humanFar()
    }
}
function humanFar()  {
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
}
isNear = false
nearThreshold = -70
farThreshold = 0 - (70 + 3 * 4)
farThresholdDelay = 500
radio.setGroup(1)
radio.setTransmitPower(3)
ishuman = 0
hermit1 = images.createBigImage(`
    # # . . . # # # # #
    # # # # # # . # # .
    # # # # # # . . . .
    # # # # # # . # # .
    # # . # # # # # # #
    `)
hermitcounter = 0
basic.forever(() => {
    radio.sendNumber(ishuman)
})
