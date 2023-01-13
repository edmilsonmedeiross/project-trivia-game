import PropTypes from 'prop-types';
import React, { Component } from 'react';

const oneSecond = 1000;

export class Timer extends Component {
  interval;

  state = {
    counter: 30,
  };

  componentDidMount() {
    this.setCounter();
  }

  componentDidUpdate(prevProps, prevState) {
    const { onTimeOut, isCountingDown } = this.props;
    const { counter } = this.state;
    if (counter !== prevState.counter && counter === 0) onTimeOut();

    if (prevProps.isCountingDown !== isCountingDown) {
      if (isCountingDown) this.setCounter();
      else clearInterval(this.interval);
    }
  }

  setCounter() {
    clearInterval(this.interval);
    this.setState({ counter: 30 });
    this.interval = setInterval(this.countDown, oneSecond);
  }

  countDown = () => {
    const { getTimer } = this.props;
    const { counter } = this.state;

    this.setState((state) => ({ counter: state.counter - 1 }), () => getTimer(counter));
  };

  render() {
    const { counter } = this.state;
    return <div>{counter}</div>;
  }
}

Timer.propTypes = {
  getTimer: PropTypes.func.isRequired,
  onTimeOut: PropTypes.func.isRequired,
  isCountingDown: PropTypes.bool.isRequired,
};

export default Timer;
