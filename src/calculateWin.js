import { REEL_ITEMS, REEL_POSITIONS } from "./consts";

// Winning states are :
//
// 3 CHERRY symbols on top line 2000
// 3 CHERRY symbols on center line 1000
// 3 CHERRY symbols on bottom line 4000
// 3 7 symbols on any line 150
// Any combination of CHERRY and 7 on any line 75 
// 3 3xBAR symbols on any line 50
// 3 2xBAR symbols on any line 20
// 3 BAR symbols on any line 10
// Combination of any BAR symbols on any line 5

/**
 * Calculates the winning walue
 * @param {Array} reels 
 */
export default function (reels) {
    let lineItems = getLines(reels);
    let winnings = [];
    lineItems.forEach((lineItem, lineIndex) => {

        // 3 CHERRY symbols on top line 2000  
        if (lineItem[0] === lineItem[1] && lineItem[1]=== lineItem[2] && lineItem[2]=== 'Cherry' && lineIndex === 0) {
            winnings.push({
                winningValue: 2000,
                winningLine: REEL_POSITIONS[0]//top
            })
        }

        // 3 CHERRY symbols on center line 1000
        if (lineItem[0] === lineItem[1] && lineItem[1]=== lineItem[2] && lineItem[2]=== 'Cherry' && lineIndex === 1) {
            winnings.push({
                winningValue: 1000,
                winningLine: REEL_POSITIONS[1]//center
            })
        }

        // 3 CHERRY symbols on bottom line 4000
        if (lineItem[0] === lineItem[1] && lineItem[1]=== lineItem[2] && lineItem[2]=== 'Cherry' && lineIndex === 2) {
            winnings.push({
                winningValue: 4000,
                winningLine: REEL_POSITIONS[2]//bottom
            })
        }

        // 3 7 symbols on any line 150
        if (lineItem[0] === lineItem[1] && lineItem[1]=== lineItem[2] && lineItem[2]=== '7') {
            winnings.push({
                winningValue: 150,
                winningLine: REEL_POSITIONS[lineIndex]
            })
        }

        // Any combination of CHERRY and 7 on any line 75 
        if (['7', 'Cherry'].indexOf(lineItem[0]) !== -1
            && ['7', 'Cherry'].indexOf(lineItem[1]) !== -1
            && ['7', 'Cherry'].indexOf(lineItem[2]) !== -1
        ) {
            winnings.push({
                winningValue: 75,
                winningLine: REEL_POSITIONS[lineIndex]
            })
        }

        // 3 3xBAR symbols on any line 50
        if (lineItem[0] === lineItem[1] && lineItem[1]=== lineItem[2] && lineItem[2]=== '3xBAR') {
            winnings.push({
                winningValue: 50,
                winningLine: REEL_POSITIONS[lineIndex]
            })
        }

        // 3 2xBAR symbols on any line 20
        if (lineItem[0] === lineItem[1] && lineItem[1]=== lineItem[2] && lineItem[2]=== '2xBAR') {
            winnings.push({
                winningValue: 20,
                winningLine: REEL_POSITIONS[lineIndex]
            })
        }

        // 3 BAR symbols on any line 10
        if (lineItem[0] === lineItem[1] && lineItem[1]=== lineItem[2] && lineItem[2]=== 'BAR') {
            winnings.push({
                winningValue: 10,
                winningLine: REEL_POSITIONS[lineIndex]
            })
        }

        // Combination of any BAR symbols on any line 5
        if (lineItem[0] === 'BAR' || lineItem[1] === 'BAR' || lineItem[2] === 'BAR') {
            winnings.push({
                winningValue: 5,
                winningLine: REEL_POSITIONS[lineIndex]
            })
        }
    })

    return winnings;
    //targetPosition,targetItem
}
/**
 * Gets lines items and
 * Arranges all 3 visible line items in an array
 * Note:    null in any row means that place is not fixed and therefore there is no item for this position
 * @param {Array} reels 
 */
function getLines(reels) {
    let line1 = [], line2 = [], line3 = [];
    // Reel 1
    if (reels[0].targetPosition === REEL_POSITIONS[0]) { // Top
        line1[0] = reels[0].targetItem;
        line2[0] = null;
        line3[0] = getNextReelItem(reels[0].targetItem);
    }
    if (reels[0].targetPosition === REEL_POSITIONS[1]) { // Center
        line1[0] = null;
        line2[0] = reels[0].targetItem;
        line3[0] = null;
    }
    if (reels[0].targetPosition === REEL_POSITIONS[2]) { // Bottom
        line1[0] = getPrevReelItem(reels[0].targetItem);
        line2[0] = null;
        line3[0] = reels[0].targetItem;
    }
    
    // Reel 2
    if (reels[1].targetPosition === REEL_POSITIONS[0]) { // Top
        line1[1] = reels[1].targetItem;
        line2[1] = null;
        line3[1] = getNextReelItem(reels[1].targetItem);
    }
    if (reels[1].targetPosition === REEL_POSITIONS[1]) { // Center
        line1[1] = null;
        line2[1] = reels[1].targetItem;
        line3[1] = null;
    }
    if (reels[1].targetPosition === REEL_POSITIONS[2]) { // Bottom
        line1[1] = getPrevReelItem(reels[1].targetItem);
        line2[1] = null;
        line3[1] = reels[1].targetItem;
    }
    
    // Reel 3
    if (reels[2].targetPosition === REEL_POSITIONS[0]) { // Top
        line1[2] = reels[2].targetItem;
        line2[2] = null;
        line3[2] = getNextReelItem(reels[2].targetItem);
    }
    if (reels[2].targetPosition === REEL_POSITIONS[1]) { // Center
        line1[2] = null;
        line2[2] = reels[2].targetItem;
        line3[2] = null;
    }
    if (reels[2].targetPosition === REEL_POSITIONS[2]) { // Bottom
        line1[2] = getPrevReelItem(reels[2].targetItem);
        line2[2] = null;
        line3[2] = reels[2].targetItem;
    }
    
    return [line1, line2, line3];
}

function getNextReelItem(item) {
    let selectedItemIndex = REEL_ITEMS.indexOf(item);
    if (selectedItemIndex === REEL_ITEMS.length - 1) {
        return REEL_ITEMS[0];
    } else {
        return REEL_ITEMS[selectedItemIndex + 1];
    }
}
function getPrevReelItem(item) {
    let selectedItemIndex = REEL_ITEMS.indexOf(item);
    if (selectedItemIndex === 0) {
        return REEL_ITEMS[REEL_ITEMS.length - 1];
    } else {
        return REEL_ITEMS[selectedItemIndex - 1];
    }
}