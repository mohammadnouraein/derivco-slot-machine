import React, { Component } from 'react';
import { PropTypes } from "prop-types";
import withStyles from "react-jss";

import { Reel } from "./Reel";
import { REEL_ITEM_HEIGHT, REEL_ITEM_WIDTH, REEL_POSITIONS } from '../../consts';

const styles = {
    horizontalLine: {
        position: 'absolute',
        width: '100%',
        left: 0,
        border: 'solid 2px white'
    },
    winningHorizontalLine: {
        position: 'absolute',
        left: -1,
        width: '100%',
        borderTop: 'solid 5px red',
        animation: 'blinker 1s linear infinite',
        borderBottom: 'solid 5px red',
        height: 3,
        backgroundColor: 'white'
    },
    reelsContainer: {

        display: 'flex',
        alignItems: 'center',
        margin: '20px auto',
        backgroundColor: 'black',
        borderRadius: 6,
        position: 'relative'
    },
    reel: {
        flex: 1,
        padding: 10
    },
    '@keyframes blinker': {
        '50%': {
            opacity: 0
        }
    }
};

export default class ReelItems extends Component {
    constructor() {
        super();
        this.state = {
            reels: []
        };
    }

    // When props updated, this means that new spin requested
    // Then starts spin
    static getDerivedStateFromProps(props, state) {
        if (state.reels !== props.reels) {
            return { reels: props.reels };
        }
        return null
    }

    render() {
        const { classes, winnings } = this.props;
        const { reels } = this.state;
        if (!reels) {
            return <div>Loading ...</div>
        }
        let hasParticularWinningInTop = false;
        let hasParticularWinningInCenter = false;
        let hasParticularWinningInBottom = false;

        if (winnings) {
            if (winnings.find(w => w.winningValue >= 1000 && w.winningLine === REEL_POSITIONS[0])) {
                hasParticularWinningInTop = true;
            }
            if (winnings.find(w => w.winningValue >= 1000 && w.winningLine === REEL_POSITIONS[1])) {
                hasParticularWinningInCenter = true;
            }
            if (winnings.find(w => w.winningValue >= 1000 && w.winningLine === REEL_POSITIONS[2])) {
                hasParticularWinningInBottom = true;
            }
        }

        return (
            <div className={classes.reelsContainer} style={{ width: reels.length * (REEL_ITEM_WIDTH + 40) }}>
                <hr className={hasParticularWinningInTop ? classes.winningHorizontalLine : classes.horizontalLine} style={{ top: REEL_ITEM_HEIGHT / 2 }} />
                <hr className={hasParticularWinningInCenter ? classes.winningHorizontalLine : classes.horizontalLine} style={{ top: REEL_ITEM_HEIGHT }} />
                <hr className={hasParticularWinningInBottom ? classes.winningHorizontalLine : classes.horizontalLine} style={{ top: REEL_ITEM_HEIGHT * 3 / 2 }} />
                {
                    reels.map(reel => <Reel key={reel.id} data={reel.data} />)
                }
            </div>
        )
    }
}

ReelItems.propTypes = {
    reels: PropTypes.array,
    winnings: PropTypes.array
};

//Styled Reels generated here and returned as "Reels" component
const Reels = withStyles(styles)(ReelItems);
export { Reels }