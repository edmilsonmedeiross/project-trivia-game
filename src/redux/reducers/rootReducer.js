import { combineReducers } from 'redux';
import { LOGIN, SAVE_GRAVATAR, SAVE_SCORE, RESET_STATE } from '../actions';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarImage: '',
  gravatarEmail: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case LOGIN:
    return {
      ...state,
      name: action.name,
      gravatarEmail: action.gravatarEmail,
    };
  case SAVE_SCORE:
    return {
      ...state,
      score: state.score + action.payload,
      assertions: state.assertions + 1,
    };
  case SAVE_GRAVATAR:
    return {
      ...state,
      gravatarImage: action.payload,
    };
  case RESET_STATE:
    return {
      name: '',
      assertions: 0,
      score: 0,
      gravatarImage: '',
      gravatarEmail: '',
    };
  default:
    return state;
  }
};

const rootReducer = combineReducers({ player });

export default rootReducer;
