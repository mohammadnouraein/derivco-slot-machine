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
class App extends Component {
  constructor() {
    super();
    this.state = {
      balance: 1000,

      // mode can be 'random' or 'debug'
      mode: 'random',

      // reels contains reels data and we change the items when the spin butten pressed
      reels: [],

      // debugModeItems contains the target items and positions 
      debugModeItems: [],

      // reelsKey used for forcing to re render when we change the reels item in state
      reelsKey: '1',

      // disabled means the availability of spin button for pressing
      // When we press spin and reels are spinning, the user can't do anything
      disabled: false
    }
    this.setReels = this.setReels.bind(this);
    this.toggleDebugMode = this.toggleDebugMode.bind(this);
    this.updateDebugModeItems = this.updateDebugModeItems.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
  }

  // When the spin button pressed, this method is calling
  // setReels method recalculates the reels items 
  setReels() {
    const { mode, debugModeItems, balance } = this.state;
    if (balance < 1) {
      alert('Sorry. There is not enough balance. Please charge your account.');
      return;
    }
    let reels = [0, 1, 2].map((reelId, index) => {
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

    // We change the reels items and by changing the key we force to rerender even the object refrences not change 
    this.setState({
      winnings: null,
      reels,
      reelsKey: 'A' + parseInt(Math.random() * 10000),
      disabled: true,
      balance: balance - 1
    });
    window.setTimeout(() => {
      let winnings = getWinnings(reels.map(r => r.data));
      this.setState({
        disabled: false,
        winnings
      })
    }
      , SPIN_DURATION + (reels.length - 1) * 500)

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

  updateBalance(e) {
    let newVal = e.target.value;
    if (newVal > 5000 || newVal < 1) {
      // Do nothing
      return;
    }
    this.setState({ balance: newVal })
  }
  render() {
    const { reels, mode, debugModeItems, reelsKey, disabled, winnings } = this.state;
    return (
      <div style={{ textAlign: 'center' }}>
        <Reels key={reelsKey} reels={reels} />
        <div style={{ margin: '10px 0px 20px 0px' }}>
          {mode === 'debug' && [0, 1, 2].map(index => {
            return (
              <div key={'debug_items_container_' + index} style={{ width: REEL_ITEM_WIDTH + 40, display: 'inline-block' }}>
                <Select
                  key={'debug_item_' + index}
                  value={debugModeItems[index] ? debugModeItems[index].item : REEL_ITEMS[0]}
                  onChange={(e) => this.updateDebugModeItems(index, null, e.target.value)}
                  displayEmpty
                  name="Item"
                  disabled={disabled}
                >
                  {REEL_ITEMS.map(reelItem => <MenuItem key={reelItem} value={reelItem}>{reelItem}</MenuItem>)}

                </Select>
                <Select
                  key={'debug_position_' + index}
                  value={debugModeItems[index] ? debugModeItems[index].position : REEL_POSITIONS[0]}
                  onChange={(e) => this.updateDebugModeItems(index, e.target.value, null)}
                  displayEmpty
                  name="Position"
                  disabled={disabled}
                >
                  {REEL_POSITIONS.map(reelPosition => <MenuItem key={reelPosition} value={reelPosition}>{reelPosition}</MenuItem>)}

                </Select>
              </div>)
          })}
        </div>


        <div style={{ width: REEL_ITEM_WIDTH + 40, display: 'inline-block', verticalAlign: 'middle' }}>
          <FormControlLabel
            control={
              <Switch
                disabled={disabled}
                disableRipple
                checked={this.state.mode === 'debug'}
                onChange={this.toggleDebugMode}
                value="Debug Mode"
              />
            }
            label="Debug Mode"
          />
        </div>


        <div style={{ width: REEL_ITEM_WIDTH + 40, display: 'inline-block', verticalAlign: 'middle' }}>
          <TextField
            label="Balance"
            value={this.state.balance}
            onChange={this.updateBalance}
            margin="none"
            type="number"
            disabled={disabled || mode !== 'debug'}
          />
        </div>


        <div style={{ width: REEL_ITEM_WIDTH + 40, display: 'inline-block', verticalAlign: 'middle' }}>
          <Fab
            variant="round"
            size="large"
            color="primary"
            aria-label="Spin"
            onClick={this.setReels}
            disabled={disabled}
          >Spin</Fab>
        </div>


        {winnings && mode === 'debug' && winnings.map((winItem,index) => {
          return (<div key={'winning_' + index}>{winItem.winningLine}-{winItem.winningValue}</div>)
        })}
      </div>
    );
  }
}

export default App;
