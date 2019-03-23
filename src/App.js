import React, { Component } from 'react';
import { Reels } from './components/reels';
import { REEL_ITEMS, REEL_POSITIONS, SPIN_DURATION, REEL_ITEM_WIDTH } from "./consts";
import Fab from '@material-ui/core/Fab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import getWinnings from "./calculateWin";
import withStyles from "react-jss";

const styles = {
  payTable: {
    width: (REEL_ITEM_WIDTH + 40) * 3,
    margin: '50px auto',
    fontSize: 12
  },
  formItemContainer: {
    width: REEL_ITEM_WIDTH + 40,
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  particularWinningRow: {
    color: 'red',
    animation: 'blinker 1s linear infinite'
  }
  ,
  '@keyframes blinker': {
    '50%': {
      opacity: 0
    }
  }

};
class App extends Component {
  constructor() {
    super();
    this.state = {
      balance: 1000,

      // mode can be 'random' or 'debug'
      mode: 'random',

      // reels contains reels data and we change the items when the spin butten pressed
      reels: null,

      // debugModeItems contains the target items and positions 
      debugModeItems: [],

      // reelsKey used for forcing to re render when we change the reels item in state
      reelsKey: '1',

      // spinning variable used for the availability of spin button for pressing
      // When we press spin and reels are spinning, the user can't do anything
      spinning: false

    }
    this.setReels = this.setReels.bind(this);
    this.toggleDebugMode = this.toggleDebugMode.bind(this);
    this.updateDebugModeItems = this.updateDebugModeItems.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
  }

  // When the spin button pressed, this method will be called
  // setReels method recalculates the reels items 
  setReels() {
    const { mode, debugModeItems, balance, reels } = this.state;
    let isFirstTime = false
    if (!reels) {
      isFirstTime = true;
    }
    if (balance < 1) {
      alert('Sorry. There is not enough balance. Please charge your account.');
      return;
    }
    let newReels = [0, 1, 2].map((reelId, index) => {
      let currentItemPosition = REEL_POSITIONS[0];
      let currentItem = REEL_ITEMS[0];
      if (mode === 'random') {
        currentItemPosition = REEL_POSITIONS[parseInt(Math.random() * 3)];
        currentItem = REEL_ITEMS[parseInt(Math.random() * 5)];
      } else if (debugModeItems[index]) {
        currentItemPosition = debugModeItems[index].position;
        currentItem = debugModeItems[index].item;

      }

      return {
        id: reelId,
        data: {
          targetPosition: currentItemPosition,
          targetItem: currentItem,

          //Delay between each reel spin 500 ms
          duration: SPIN_DURATION + (index * 500)
        }
      }
    });
    // We calculate the winning lines and many other data here
    // But we wait until spinning end, to show the result to user
    let winnings = getWinnings(newReels.map(r => r.data));

    // We change the reels items and by changing the key we force to rerender even the object refrences not change 
    this.setState({
      winnings: null,
      reels: newReels,
      reelsKey: 'A' + parseInt(Math.random() * 10000),
      spinning: true,
      balance: isFirstTime ? balance : balance - 1,
      isFirstTime
    });

    window.setTimeout(() => {

      // We show the winning table to user and release the disabled form
      this.setState({
        spinning: false,
        winnings
      })
    }
      , SPIN_DURATION + (newReels.length - 1) * 500)

  }

  // Toggles debug mode in our app
  toggleDebugMode() {
    const { mode } = this.state;
    this.setState({
      mode: mode === 'debug' ? 'random' : 'debug'
    })
  }

  // When the game starts to run for the first time
  // It will spin
  componentDidMount() {
    this.setReels();
  }

  // Handler for changing debug positions and items when the game is in debug mode
  updateDebugModeItems(index, position, item) {
    const { debugModeItems } = this.state;
    if (!debugModeItems[index]) {
      debugModeItems[index] = {
        position: REEL_POSITIONS[0],
        item: REEL_ITEMS[0]
      }
    }

    // If target position setted
    if (position)
      debugModeItems[index].position = position;

    // If target item setted
    if (item)
      debugModeItems[index].item = item;

    // debugModeItems changed but the user must click on spin item to see the results in animation
    this.setState({
      debugModeItems
    })

  }

  // Handler for changing balance in debug mode by editing balance textbox
  updateBalance(e) {
    let newVal = e.target.value;
    if (newVal > 5000 || newVal < 1) {
      // Do nothing
      return;
    }
    this.setState({ balance: newVal })
  }


  render() {
    const { reels, mode, debugModeItems, reelsKey, spinning, winnings, isFirstTime } = this.state;
    const { classes } = this.props
    return (
      <div style={{ textAlign: 'center' }}>
        <Reels key={reelsKey} reels={reels} winnings={winnings}/>
        <div style={{ margin: '10px 0px 20px 0px' }}>
          {mode === 'debug' && [0, 1, 2].map(index => {
            return (
              <div key={'debug_items_container_' + index} className={classes.formItemContainer}>
                <Select
                  key={'debug_item_' + index}
                  value={debugModeItems[index] ? debugModeItems[index].item : REEL_ITEMS[0]}
                  onChange={(e) => this.updateDebugModeItems(index, null, e.target.value)}
                  displayEmpty
                  name="Item"
                  disabled={spinning}
                >
                  {REEL_ITEMS.map(reelItem => <MenuItem key={reelItem} value={reelItem}>{reelItem}</MenuItem>)}

                </Select>
                <Select
                  key={'debug_position_' + index}
                  value={debugModeItems[index] ? debugModeItems[index].position : REEL_POSITIONS[0]}
                  onChange={(e) => this.updateDebugModeItems(index, e.target.value, null)}
                  displayEmpty
                  name="Position"
                  disabled={spinning}
                >
                  {REEL_POSITIONS.map(reelPosition => <MenuItem key={reelPosition} value={reelPosition}>{reelPosition}</MenuItem>)}

                </Select>
              </div>)
          })}
        </div>


        <div className={classes.formItemContainer}>
          <FormControlLabel
            control={
              <Switch
                disabled={spinning}
                disableRipple
                checked={this.state.mode === 'debug'}
                onChange={this.toggleDebugMode}
                value="Debug Mode"
              />
            }
            label="Debug Mode"
          />
        </div>


        <div className={classes.formItemContainer}>
          <TextField
            label="Balance"
            value={this.state.balance}
            onChange={this.updateBalance}
            margin="none"
            type="number"
            disabled={spinning || mode !== 'debug'}
          />
        </div>


        <div className={classes.formItemContainer}>
          <Fab
            variant="round"
            size="large"
            color="primary"
            aria-label="Spin"
            onClick={this.setReels}
            disabled={spinning}
          >Spin</Fab>
        </div>

        {!spinning && !isFirstTime && (<table border={1} className={classes.payTable}>
          <thead>
            <tr>
              <th>Winning line</th>
              <th>Winning value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {winnings && winnings.map((winItem, index) => {
              return (<tr key={'winning_' + index} className={winItem.winningValue >= 1000 ? classes.particularWinningRow : ''}>
                <td>{winItem.winningLine}({winItem.winningLineData.map(item => !item ? '○' : item).join(',')})</td>
                <td>{winItem.winningValue}</td>
                <td>{winItem.winningDescription}</td>
              </tr>)
            })}
            {(!winnings || winnings.length == 0) && (<tr>
              <td colspan={3}>Sorry you have no winning in this round</td>
            </tr>)}
          </tbody>
        </table>)}
      </div>
    );
  }
}
const StyledApp = withStyles(styles)(App);
export default StyledApp;
