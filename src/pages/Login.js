import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { login } from '../redux/actions';
import { fetchToken } from '../service/triviaServices';
import '../Login.css';

class Login extends Component {
  state = {
    name: '',
    email: '',
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  validateButton = () => {
    const { email, name } = this.state;
    const minCharactersPassWord = 1;
    const verifyEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(email);
    const verifyName = name.length >= minCharactersPassWord;
    return verifyEmail && verifyName;
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { history, dispatch } = this.props;
    console.log(this.props);
    const { name, email } = this.state;
    const { token } = await fetchToken();
    dispatch(login(name, email));
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
      <section className="login-container">
        <Header />
        <div className="form-login-container">
          <form onSubmit={ this.handleSubmit } className="form-login">
            <input
              type="text"
              placeholder="Username"
              data-testid="input-player-name"
              name="name"
              value={ name }
              onChange={ this.handleChange }
              className="input-name"
            />
            <input
              type="text"
              placeholder="E-mail"
              name="email"
              value={ email }
              data-testid="input-gravatar-email"
              onChange={ this.handleChange }
              className="input-email"
            />
            <button
              type="submit"
              data-testid="btn-play"
              disabled={ !this.validateButton() }
              className="btn-play"
            >
              Play
            </button>
            <button
              type="button"
              data-testid="btn-settings"
              onClick={ this.handleSettingsButton }
              className="btn-settings"

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
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default connect()(Login);
