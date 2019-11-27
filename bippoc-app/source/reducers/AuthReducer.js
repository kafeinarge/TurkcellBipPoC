import * as constants from '../resources/constants';
import * as type from '../resources/types';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  message: '',
  signInLoading: false,
  signUpLoading: false,

  authUsername: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case type.ADD_EMAIL:
      return { ...state, email: action.payload };
    case type.ADD_PASSWORD:
      return { ...state, password: action.payload };
    case type.ADD_NAME:
      return { ...state, name: action.payload };
    case type.FAILURE_REGISTER:
      return {
        ...state,
        message: 'Başarısız',
        signUpLoading: false,
      };

    case type.SUCCESS_REGISTER:
      return { ...state, name: '' };
    case type.AUTH_SUCCESS:
      return { ...state, email: '', password: '', authUsername: action.payload.email };
    case type.AUTH_FAILURE:
      return {
        ...state,
        message: 'Başarısız',
        signInLoading: false,
        authUsername: null,
      };

    case type.SIGN_IN_LOADING:
      return { ...state, signInLoading: true };
    case type.SIGN_UP_LOADING:
      return { ...state, signUpLoading: true };
    default:
      return state;
  }
};
