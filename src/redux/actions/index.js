export const LOGIN = 'LOGIN';
export const SAVE_SCORE = 'SAVE_SCORE';
export const SAVE_GRAVATAR = 'SAVE_GRAVATAR';
export const RESET_STATE = 'RESET_STATE';

export const login = (name, gravatarEmail) => ({
  type: LOGIN,
  name,
  gravatarEmail,
});

export const saveScore = (points) => ({
  type: SAVE_SCORE,
  payload: points,
});

export const saveGravatar = (gravatarImage) => ({
  type: SAVE_GRAVATAR,
  payload: gravatarImage,
});

export const resetState = () => ({
  type: RESET_STATE,
});
