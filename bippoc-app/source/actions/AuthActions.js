import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import base64 from 'base-64';

import { API } from '../resources/axios';
import { formUrlEncoded } from '../resources/utils';

import {
  ADD_NAME,
  ADD_EMAIL,
  ADD_PASSWORD,
  SIGN_IN_LOADING,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  SIGN_UP_LOADING,
  SUCCESS_REGISTER,
  FAILURE_REGISTER,
  SIGN_IN_SUCCESS,
} from '../resources/types';

const config = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

/*
ActionCreator to manipulate InputText on (SignUpScreen)
*/
export const addName = name => {
  return {
    type: ADD_NAME,
    payload: name,
  };
};
export const addEmail = email => {
  return {
    type: ADD_EMAIL,
    payload: email,
  };
};
export const addPassword = password => {
  return {
    type: ADD_PASSWORD,
    payload: password,
  };
};
/*
ActionCreator to signIn on application
*/
export const SignIN = ({ email, password }, callback) => {
  return async dispatch => {
    dispatch({ type: SIGN_IN_LOADING });

    const data = formUrlEncoded({ username: email, password });
    try {
      const response = await API.post('/login', data, config);
      console.log('SignIn', response);
      AsyncStorage.setItem('@bippoc2:key', JSON.stringify({ email, password }));
      authSuccess(dispatch, { email });
      callback && callback();
    } catch (error) {
      authUnsuccess(error, dispatch);
    }
  };
};
/*
ActionCreator to create new user registration
*/
export const registerUser = ({ name, email, password }) => {
  return async dispatch => {
    dispatch({ type: SIGN_UP_LOADING });

    try {
      // TODO:
      // Legacy - register
      // New - registerV2
      const response = await API.post('/user/register', {
        name,
        password,
        username: email,
      });
      registerSuccess(dispatch);
    } catch (error) {
      registerUnsuccess(error, dispatch);
    }
  };
};

// export const registerUserV2 = ({ name, email, password }) => {
//   return async dispatch => {
//     dispatch({ type: SIGN_UP_LOADING });

//     try {
//       const response = await API.post('/user/registerV2', {
//         name,
//         password,
//         username: email,
//       });
//       console.log('registerUserV2', response);
//       registerSuccess(dispatch);
//     } catch (error) {
//       registerUnsuccess(error, dispatch);
//     }
//   };
// };

const authSuccess = (dispatch, payload) => {
  dispatch({
    type: AUTH_SUCCESS,
    payload,
  });
  Actions.mainScreen();
};

const authUnsuccess = (error, dispatch) => {
  dispatch({
    type: AUTH_FAILURE,
    payload: error.code,
  });
};

const registerSuccess = dispatch => {
  dispatch({ type: SUCCESS_REGISTER });
  Actions.welcomeScreen();
};

const registerUnsuccess = (error, dispatch) => {
  dispatch({
    type: FAILURE_REGISTER,
    payload: error.code,
  });
};
