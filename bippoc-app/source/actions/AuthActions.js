import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import uuid from 'react-native-uuid';

import { API } from '../resources/axios';
import { formUrlEncoded } from '../resources/utils';
import * as BULUT from '../resources/bulut-crypto';

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
export const SignIN = ({ email }, callbackSuccess, callbackFail) => {
  return async dispatch => {
    dispatch({ type: SIGN_IN_LOADING });

    const password = await AsyncStorage.getItem('@bippoc:password_bip');
    const data = formUrlEncoded({ username: email, password });
    try {
      const response = await API.post('/login', data, config);

      AsyncStorage.setItem('@bippoc:auth_bip2', JSON.stringify({ email, password }));

      console.log(response);
      authSuccess(dispatch, { email });

      callbackSuccess && callbackSuccess();
      console.log('step2', callbackSuccess);
    } catch (error) {
      callbackFail && callbackFail();
      authUnsuccess(error, dispatch);
    }
  };
};
/*
ActionCreator to create new user registration
*/
// Legacy User
export const registerUser = ({ name, email }) => {
  return async dispatch => {
    dispatch({ type: SIGN_UP_LOADING });

    console.log('Registering legacy user !!!');

    try {
      const password = await uuid.v4();
      console.log(password);

      const response = await API.post('/user/register', {
        name,
        password,
        username: email,
      });

      await AsyncStorage.setItem('@bippoc:password_bip', password);
      registerSuccess(dispatch);
    } catch (error) {
      console.log(error);
      registerUnsuccess(error, dispatch);
    }
  };
};

export const registerUserV2 = ({ name, email }) => {
  return async dispatch => {
    dispatch({ type: SIGN_UP_LOADING });

    console.log('Registering user v2 !!!');

    const keyPair = await BULUT.generateKey();
    const exportedPrivateKey = await BULUT.exportKey(keyPair.privateKey);
    const exportedPublicKey = await BULUT.exportKey(keyPair.publicKey);

    try {
      const password = await uuid.v4();
      console.log(password);

      const response = await API.post('/user/registerV2', {
        name,
        password,
        publicKey: BULUT.stringify(exportedPublicKey),
        username: email,
      });
      console.log('registerV2', response);

      await AsyncStorage.setItem('@bippoc:privateKey_bip', BULUT.stringify(exportedPrivateKey));
      await AsyncStorage.setItem('@bippoc:password_bip', password);

      registerSuccess(dispatch);
    } catch (error) {
      console.log(error);
      registerUnsuccess(error, dispatch);
    }
  };
};

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
    payload: error.status,
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
