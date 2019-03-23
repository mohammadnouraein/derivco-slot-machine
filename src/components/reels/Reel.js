import React, { Component } from 'react';
import { PropTypes } from "prop-types";
import withStyles from "react-jss";
import {
    REEL_ITEMS,
    REEL_ITEM_WIDTH,
    REEL_ITEM_HEIGHT,
    SPIN_DELAY,
    SPIN_DURATION,
    SPIN_SMOOTHNESS,
    SPIN_SPEED,
    REEL_POSITIONS
} from "../../consts";

const styles = {
    flex: {
        flex: 1,
        position:'relative'
    },
    shadowItem:{
        boxShadow: '0px 0px 68px 45px white',
        //overflow:'visible',
        borderRadius: 100,
        width:60,
        height:REEL_ITEM_HEIGHT,
        position:'absolute',
        top:REEL_ITEM_HEIGHT/2+20,
        left: 'calc(100%/2 - 30px)'
    },
    reelContainer: {
        //The width of each reel is equal to width of reel items
        width: REEL_ITEM_WIDTH,

        //The height of container is equal to visible part of reel
        //the container height equals (2 x each reel item height)
        height: REEL_ITEM_HEIGHT * 2,
        overflow: 'hidden',
        position: 'relative',
        border: 'solid 3px white',
        borderRadius: 4,

        margin: '10px auto',
        backgroundColor: 'silver',
        background:'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(170,170,170,1) 100%)'
    },
    reelItem: {
        position: 'absolute',
        left: 0
    }
};

class ReelItem extends Component {
    constructor(props) {
        super();
        this.state = {
            // spinTop used in animating the reel when the user presses spin button
            spinnerTop: 0,

            // spinIntervalId used for storing intervalId
            // We need it when we want to shutdown the interval
            spinIntervalId: null,

            //reelData is the same as data prop
            reelData: props.data
        }

        this.spin = this.spin.bind(this);
        this.initializeSpin = this.initializeSpin.bind(this);
    }

    /**
     * Spin method Animates the reel until show the result item
     * This function only runs if initializeSpin() method return true
     * Warning: Don't call this method without initializing the spin
     */
    spin() {
        const { spinnerTop, allPixelsToSpin, spinIntervalId, reelData } = this.state;
        let smoothness = SPIN_SMOOTHNESS;

        //Validates that user enters valid number for smoothnesss and prevents from unwanted affects
        if (smoothness > .99 || smoothness < 0) {
            smoothness = .9;
        }

        // In this part of code we calculate the next top position for items
        let nextTop = spinnerTop + (1 - smoothness) * 100;

        // If the calculated next top position is bigger than our target 
        if (nextTop >= allPixelsToSpin) {

            // The next top replaces with the target top position
            nextTop = allPixelsToSpin;

            // If there is a running intterval
            if (spinIntervalId) {

                // If the interval is running then we shut it down
                clearInterval(spinIntervalId);
            }
        }
        else {

            // Calculates the interval time based on SPIN_DURATION 
            let intervalTime = (nextTop - spinnerTop) * (reelData.duration || SPIN_DURATION) / allPixelsToSpin;

            // If interval is not running
            if (!spinIntervalId) {

                // Runs the spin until it will stop the interval method
                let intervalId = window.setInterval(() => this.spin(), intervalTime)
                this.setState({
                    spinIntervalId: intervalId
                })
            }
        }
        this.setState({
            spinnerTop: nextTop
        })
    }

    /**
     * The main method that spins the reel
     */
    spinReel() {
        const { spinnerTop, reelData } = this.state;
        this.setState({
            spinnerTop: spinnerTop % (REEL_ITEM_HEIGHT * REEL_ITEMS.length),
            spinIntervalId: null
        })
        // targetPosition is a string value ('top' , 'center' , 'bottom')
        // targetItem is one of the REEL_ITEMS ('3xBAR', 'BAR', '2xBAR', '7', 'Cherry')
        const { targetPosition, targetItem } = reelData;

        // If the prerequirement of spinning is provided in props
        // The spinner will spin until showing the result
        if (this.initializeSpin(targetPosition, targetItem)) {
            window.setTimeout(() => this.spin(), SPIN_DELAY);
        }
    }


    /**
     * Initializing spin value for start animation
     * The main duty of this function is to calculate the whole amount of pixels that we need to decrese
     */
    initializeSpin(targetPosition, targetItem) {
        const { reelData } = this.state;
        if (targetPosition && targetItem) {

            // These are some mathematical calculation
            // The result of these calculation is just 1 integer number that indicates
            // how much pixels spinner will move to top to reach the target 
            // and the important part of calculation is that we must pay attention to 
            // SPIN_DURATION & SPIN_SPEED & targetPosition & targetItem
            let pixelPerSecond = SPIN_SPEED * REEL_ITEM_HEIGHT;
            let allPixelsToSpin = pixelPerSecond * (reelData.duration || SPIN_DURATION) / 1000;
            let targetItemIndex = REEL_ITEMS.indexOf(targetItem);

            if (targetItemIndex !== -1) {
                allPixelsToSpin += targetItemIndex * REEL_ITEM_HEIGHT;
                switch (targetPosition) {

                    // Top
                    case REEL_POSITIONS[0]:
                        allPixelsToSpin += 0;
                        break;

                    // Center
                    case REEL_POSITIONS[1]:
                        allPixelsToSpin -= (REEL_ITEM_HEIGHT / 2);
                        break;

                    //Bottom
                    case REEL_POSITIONS[2]:
                        allPixelsToSpin -= REEL_ITEM_HEIGHT;
                        break;

                    default://It mus never happen
                        allPixelsToSpin += 0;
                        break;

                }
            }

            this.setState({
                // The result of calculation updates here
                allPixelsToSpin: allPixelsToSpin
            })
            return true;
        }


        // If targetPosition and targetItem not sent by props
        // The spinner will not spin
        return false;
    }

    // When component did mount start to spin automatically
    componentDidMount() {
        this.spinReel();
    }


    // When props updated, this means that new spin requested
    // Then starts spin by changing the state reelData
    static getDerivedStateFromProps(props, state) {
        if (state.reelData !== props.data) {
            return { reelData: props.data };
        }

        // Do not change the state
        return null;
    }

    // Renders the component
    render() {

        // We uses jss for styling because of some dynamic styles such as height and width of images
        const { classes } = this.props;
        const { spinnerTop } = this.state;

        return (
            <div className={classes.flex}>
            <div className={classes.shadowItem}></div>
                <div className={classes.reelContainer}>
                    {
                        REEL_ITEMS.map((imgName, index, items) => {

                            // Because of loop in images we need to manuplate spinnerTop variable
                            // In this part of code we check if the top position value of image needs to recalculate 
                            let itemTop = index * REEL_ITEM_HEIGHT - spinnerTop;
                            let spinNumber = parseInt(spinnerTop / (items.length * REEL_ITEM_HEIGHT));

                            // If this is second or more spin
                            if (spinNumber > 0) {
                                itemTop += (items.length * REEL_ITEM_HEIGHT * spinNumber);
                            }

                            // Two last items in each loop needs repositioning and stick to the end of the list
                            if (itemTop <= -((items.length - 2) * REEL_ITEM_HEIGHT)) {
                                itemTop += (items.length * REEL_ITEM_HEIGHT);
                            }

                            return <img
                                style={{
                                    top: itemTop
                                }}
                                className={classes.reelItem}
                                key={imgName}
                                alt={imgName}
                                src={`/images/reel-items/${imgName}.png`}

                            />
                        })
                    }
                </div>
            </div>
        )
    }
}

ReelItem.propTypes = {

    // data is an object and contains : 
    //
    // targetPosition
    // targetItem
    // duration
    data: PropTypes.object
};

//Styled Reel generated here and returned as "Reel" component
const Reel = withStyles(styles)(ReelItem);
export { Reel }