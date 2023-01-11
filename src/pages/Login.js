import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import fetchToken from '../service/triviaServices';

class Login extends Component {
  state = {
    name: '',
    email: '',
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  validateButon = () => {
    const { email, name } = this.state;
    const minCharactersPassWord = 1;
    const verifyEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(email);
    const verifyName = name.length >= minCharactersPassWord;
    return verifyEmail && verifyName;
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { history } = this.props;
    const { token } = await fetchToken();
    localStorage.setItem('token', token);
    history.push('/game');
  };

  handleSettingsButton = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  render() {
    const { name, email } = this.state;

    return (
      <section>
        <Header />
        <div>
          <form onSubmit={ this.handleSubmit }>
            <input
              type="text"
              placeholder="Username"
              data-testid="input-player-name"
              name="name"
              value={ name }
              onChange={ this.handleChange }
            />
            <input
              type="text"
              placeholder="E-mail"
              name="email"
              value={ email }
              data-testid="input-gravatar-email"
              onChange={ this.handleChange }
            />
            <button
              type="submit"
              data-testid="btn-play"
              disabled={ !this.validateButon() }
            >
              Play
            </button>
            <button
              type="button"
              data-testid="btn-settings"
              onClick={ this.handleSettingsButton }
            >
              Configurações
            </button>
          </form>
        </div>
      </section>
    );
  }
}

Login.defaultProps = {
  history: {},
};

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default Login;
