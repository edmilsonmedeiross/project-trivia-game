import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import logo from '../images/trivia.png';
import { saveGravatar } from '../redux/actions';

class Header extends Component {
/*  A imagem do perfil vinda do Gravatar em um elemento que deve possuir o atributo data-testid com o valor header-profile-picture
O nome da pessoa em um elemento que deve possuir o atributo data-testid com o valor header-player-name
O placar zerado em um elemento que deve possuir o atributo data-testid com o valor header-score */
  state = {
    gravatar: '',
  };

  componentDidMount() {
    const { gravatarEmail, dispatch } = this.props;
    const hash = md5(gravatarEmail).toString();
    dispatch(saveGravatar(`https://www.gravatar.com/avatar/${hash}`));
    this.setState({ gravatar: hash });
  }

  render() {
    const { name, score } = this.props;
    const { gravatar } = this.state;
    // const { player: { score } } = JSON.parse(localStorage.getItem('state'));
    return (
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <p>SUA VEZ</p>
        <section>
          <img
            data-testid="header-profile-picture"
            src={ `https://www.gravatar.com/avatar/${gravatar}` }
            alt="player avatar"
          />
          <h4 data-testid="header-player-name">{ name }</h4>
          <p data-testid="header-score">{ score }</p>
        </section>
      </header>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.player.name,
  score: state.player.score,
  gravatarImage: state.player.gravatarImage,
  gravatarEmail: state.player.gravatarEmail,
});
Header.propTypes = {
  gravatarEmail: PropTypes.string,
  name: PropTypes.string,
}.isRequired;
export default connect(mapStateToProps)(Header);
