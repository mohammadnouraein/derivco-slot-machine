import React, { Component } from 'react';
import { PropTypes } from "prop-types";
import withStyles from "react-jss";

import { Reel } from "./Reel";
import { REEL_ITEM_HEIGHT, REEL_ITEM_WIDTH } from '../../consts';

const styles = {
    horizontalLine: {
        position: 'absolute',
        width: '100%',
        left: 0,
        border: 'solid 2px white'
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
        const { classes } = this.props;
        const { reels } = this.state;
        if (!reels) {
            return <div>Loading ...</div>
        }
        return (
            <div className={classes.reelsContainer} style={{ width: reels.length * (REEL_ITEM_WIDTH + 40) }}>
                <hr className={classes.horizontalLine} style={{ top: REEL_ITEM_HEIGHT / 2 }} />
                <hr className={classes.horizontalLine} style={{ top: REEL_ITEM_HEIGHT }} />
                <hr className={classes.horizontalLine} style={{ top: REEL_ITEM_HEIGHT * 3 / 2 }} />
                {
                    reels.map(reel => <Reel key={reel.id} data={reel.data} />)
                }
            </div>
        )
    }
}

ReelItems.propTypes = {
    reels: PropTypes.array
};

//Styled Reels generated here and returned as "Reels" component
const Reels = withStyles(styles)(ReelItems);
export { Reels }