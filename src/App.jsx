import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeInSeconds: 1500,
      statusTimer: 'stopped',
      countDown: '',
      colorTimer: {color: 'white'},
      phase: 'Session'
    }
    this.increaseLengthBreak = this.increaseLengthBreak.bind(this);
    this.decreaseLengthBreak = this.decreaseLengthBreak.bind(this);
    this.increaseLengthSession = this.increaseLengthSession.bind(this);
    this.decreaseLengthSession = this.decreaseLengthSession.bind(this);
    this.increaseLength = this.increaseLength.bind(this);
    this.getTimeLeft = this.getTimeLeft.bind(this);
    this.controlTimer = this.controlTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.warning = this.warning.bind(this);
    this.switchSession = this.switchSession.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
  }

  increaseLengthBreak() {
    this.increaseLength('breakLength', this.state.breakLength, 1);
  }

  decreaseLengthBreak() {
    this.increaseLength('breakLength', this.state.breakLength, -1);
  }

  increaseLengthSession() {
    this.increaseLength('sessionLength', this.state.sessionLength, 1);
  }

  decreaseLengthSession() {
    this.increaseLength('sessionLength', this.state.sessionLength, -1);
  }

  increaseLength(state, timeLength, interval) {
    if (state === 'sessionLength') {
      if ((timeLength < 60 && interval === 1) 
        || (timeLength > 1 && interval === -1)) {
        this.setState({
          [state]: timeLength + interval,
          timeInSeconds: this.state.timeInSeconds + interval * 60
        });
      } else {
        console.log("Max or min time already reached!");
      }
    } else {
      if ((timeLength < 60 && interval === 1) 
        || (timeLength > 1 && interval === -1)) {
        this.setState({
          [state]: timeLength + interval
        });
      } else {
        console.log("Max or min time already reached!");
      }
    }
  }

  getTimeLeft() {
    let minutes = Math.floor(this.state.timeInSeconds / 60);
    let seconds = this.state.timeInSeconds - minutes * 60;
    let showMinutes = '';
    let showSeconds = '';
    minutes < 10 ? showMinutes = '0' + minutes : showMinutes = minutes;
    seconds < 10 ? showSeconds = '0' + seconds : showSeconds = seconds;
    let time = showMinutes + ':' + showSeconds;
    return time;
  }

  controlTimer() {
    if (this.state.statusTimer === 'stopped') {
      this.setState({
        countDown: setInterval(() => {
          this.warning();
          this.switchSession();
          this.setState({
            timeInSeconds: this.state.timeInSeconds - 1
          });
        }, 1000)
      });
      this.setState({
        statusTimer: 'running'
      });
    } else {
      clearInterval(this.state.countDown);
      this.setState({
        statusTimer: 'stopped',
        countDown: ''
      });
    }
  }

  resetTimer() {
    if (this.state.statusTimer === 'running') {
      clearInterval(this.state.countDown);
    }
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeInSeconds: 1500,
      statusTimer: 'stopped',
      countDown: '',
      colorTimer: {color: 'white'},
      phase: 'Session'
    })
    this.stopAudio();
  }

  warning() {
    if (this.state.timeInSeconds <= 60) {
      this.setState({
        colorTimer: {color: 'red'}
      });
    } else {
      this.setState({
        colorTimer: {color: 'white'}
      });
    }
  }

  switchSession() {
    if (this.state.timeInSeconds === 0) {
      this.playAudio();
      this.setState({
        colorTimer: {color: 'white'}
      });
      if (this.state.phase === 'Session') {
        this.setState({
          timeInSeconds: this.state.breakLength * 60 + 1,
          colorTimer: {color: 'white'},
          phase: 'Break'
        });
      } else {
        this.setState({
          timeInSeconds: this.state.sessionLength * 60 + 1,
          colorTimer: {color: 'white'},
          phase: 'Session'
        });
      }
    }
  }

  playAudio() {
    let audio = document.getElementById('beep');
    audio.play();
  }

  stopAudio() {
    let audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  }

  render() { 
    return (
      <div className="App">
        <div id="title">
          <h1>25 + 5 Clock</h1>
        </div>
        <div id="timer-settings">
          <div id="break-label" className="labels">
            <p>
              Break Length
            </p>
            <div className="timer-adjustments">
              <button id="break-decrement" onClick={this.decreaseLengthBreak}>
                <i className="fa-solid fa-arrow-down"></i>
              </button>
              <p id="break-length">
                {this.state.breakLength}
              </p>
              <button id="break-increment" onClick={this.increaseLengthBreak}>
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
          <div id="session-label" className="labels">
            <p>
              Session Length
            </p>
            <div className="timer-adjustments">
              <button id="session-decrement" onClick={this.decreaseLengthSession}>
                <i className="fa-solid fa-arrow-down"></i>
              </button>
              <p id="session-length">
                {this.state.sessionLength}
              </p>
              <button id="session-increment" onClick={this.increaseLengthSession}>
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
        <div id="timer">
          <p id="timer-label" style={this.state.colorTimer}>{this.state.phase}</p>
          <div id="time-left" style={this.state.colorTimer}>{this.getTimeLeft()}</div>
          <audio
            id="beep"
            preload="auto"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          />
        </div>
        <div id="actions">
          <button id="start_stop" onClick={this.controlTimer}>
            <i className="fa-solid fa-play"></i>
            <i className="fa-solid fa-pause"></i>
          </button>
          <button id="reset" onClick={this.resetTimer}>
            <i className="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>
      </div>
    );
  }
}
 
export default App;