// List of Reel items
// Order is important
// There is an image for each item with the same name by .png extension in "/public/images/reel-items" folder
const REEL_ITEMS = ['3xBAR', 'BAR', '2xBAR', '7', 'Cherry'];

// Positions that each reel can stop
const REEL_POSITIONS = ['top','center','bottom'];

// The width of each item in reel (image width)
const REEL_ITEM_WIDTH = 141;

// The height of each item in reel (image height)
const REEL_ITEM_HEIGHT = 121;

// SPIN_DELAY const value specifies how long spinning delays before start
// The value is in milisecond 
const SPIN_DELAY = 0;

// SPIN_DURATION const value specifies how long spinning take time before stop
// The value is in milisecond 
const SPIN_DURATION = 2000;

// SPIN_SMOOTHNESS const value specifies how smooth spinner spin
// Acceptable value is between 0.0 - 0.99
// 0.0 means high performance and low smothness
// 0.9 means low performance and high smoothness
const SPIN_SMOOTHNESS = 0.9;

// SPIN_SPEED const value specifies how fast spinner spin
// Acceptable value is between 1 - unlimited
// 1 means 1 reel item per second
// Default value is set to (REEL_ITEMS.length x 2)
const SPIN_SPEED = REEL_ITEMS.length * 2;

const WINNING_DESCRIPTIONS=[
    '3 CHERRY symbols on top line 2000',
    '3 CHERRY symbols on center line 1000',
    '3 CHERRY symbols on bottom line 4000',
    '3 7 symbols on any line 150',
    'Any combination of CHERRY and 7 on any line 75 ',
    '3 3xBAR symbols on any line 50',
    '3 2xBAR symbols on any line 20',
    '3 BAR symbols on any line 10',
    'Combination of any BAR symbols on any line 5'
    ]

export {
    REEL_ITEMS,
    REEL_ITEM_WIDTH,
    REEL_ITEM_HEIGHT,
    SPIN_DELAY,
    SPIN_DURATION,
    SPIN_SMOOTHNESS,
    SPIN_SPEED,
    REEL_POSITIONS,
    WINNING_DESCRIPTIONS
}
