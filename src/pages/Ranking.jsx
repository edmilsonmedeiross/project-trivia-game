import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetState } from '../redux/actions';

class Ranking extends Component {
  state = {
    listGravatar: [],
  };

  componentDidMount() {
    const negative = -1;
    const listGravatar = JSON.parse(localStorage.getItem('listGravatar'));
    listGravatar.sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return negative;
      return 0;
    });
    this.setState({ listGravatar });
  }

  goHome = () => {
    const { history, dispatch } = this.props;
    localStorage.removeItem('token');
    history.push('/');
    dispatch(resetState());
  };

  render() {
    const { listGravatar } = this.state;
    return (
      <main>
        <section>
          <h1 data-testid="ranking-title">Ranking</h1>
          <ol>
            {listGravatar.map((gravatar, index) => (
              <li
                key={ gravatar.token }
              >
                <p data-testid={ `player-name-${index}` }>{gravatar.name}</p>
                <p data-testid={ `player-score-${index}` }>{gravatar.score}</p>
                <img src={ gravatar.gravatarImage } alt={ gravatar.token } />
              </li>))}
          </ol>
        </section>
        <button
          type="button"
          onClick={ this.goHome }
          data-testid="btn-go-home"
        >
          VOLTAR PARA O INICIO
        </button>
      </main>
    );
  }
}
Ranking.defaultProps = {
  history: {},
};

Ranking.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
const mapStateToProps = (state) => ({
  name: state.player.name,
  score: state.player.score,
  gravatarImage: state.player.gravatarImage,
});

export default connect(mapStateToProps)(Ranking);
