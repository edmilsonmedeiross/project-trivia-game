import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetState } from '../redux/actions';

const HITSBREAKPOINT = 3;

class Feedback extends Component {
  goRanking = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  restartGame = () => {
    const { history, dispatch } = this.props;
    dispatch(resetState());
    history.push('/');
  };

  render() {
    const { name, score, gravatarImage, assertions } = this.props;
    console.log(assertions);

    return (
      <section className="App-section">
        <h2>Feedback</h2>
        <section>
          <img src={ gravatarImage } alt="Avatar" data-testid="header-profile-picture" />
          <h4 data-testid="header-player-name">{ name }</h4>
          <p data-testid="header-score">{ score }</p>
        </section>
        <section>
          <h3 data-testid="feedback-text">
            {
              assertions >= HITSBREAKPOINT ? 'Well Done!' : 'Could be better...'
            }
          </h3>
          <p data-testid="feedback-total-score">{ score }</p>
          <p data-testid="feedback-total-question">{ assertions }</p>
        </section>
        <section>
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ this.restartGame }
          >
            Play Again
          </button>

          <button
            type="button"
            onClick={ this.goRanking }
            data-testid="btn-ranking"
          >
            Ranking
          </button>
        </section>
      </section>

    );
  }
}

Feedback.defaultProps = {
  history: {},
};

Feedback.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
  gravatarImage: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = (state) => ({
  name: state.player.name,
  assertions: state.player.assertions,
  score: state.player.score,
  gravatarImage: state.player.gravatarImage,
});

export default connect(mapStateToProps)(Feedback);
