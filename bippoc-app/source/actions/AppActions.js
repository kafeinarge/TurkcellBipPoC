import { AsyncStorage } from 'react-native';

import { API } from '../resources/axios';
import * as BULUT from '../resources/bulut-crypto';

import {
  ADD_CONTACT,
  ADD_NEW_CONTACT_ERROR,
  ADD_NEW_CONTACT_SUCCESS,
  CONTACTS_LIST,
  CHANGE_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  LIST_CONVERSATION_USER,
  FETCH_ALL_CHATS,
} from '../resources/types';

/* added to redux */
export const addContact = email => {
  return {
    type: ADD_CONTACT,
    payload: email,
  };
};

export const registerNewContact = email => {
  return async dispatch => {
    try {
      await API.get(`/contact/add/${email}`);
      await dispatch(fetchContacts());
      registerNewContactSuccess(dispatch);
    } catch (error) {
      registerNewContactError(error, dispatch);
    }
  };
};

export const fetchContacts = () => {
  return async dispatch => {
    try {
      const response = await API.get('/contact');
      dispatch({ type: CONTACTS_LIST, payload: response.data });
    } catch (error) {
      //
    }
  };
};

export const sendMessage = ({ message, contactUserId, contactEmail, isLegacy, publicKey }) => {
  return async dispatch => {
    let newMessage = message;
    if (!isLegacy) {
      const secretKey = await getSecretKey(publicKey);
      const encrypted = await BULUT.encrypt(secretKey, message);
      const hex = BULUT.buf2Hex(encrypted);
      newMessage = hex;
    }

    try {
      await API.post('/message/send', {
        message: newMessage,
        encrypted: !isLegacy,
        receiver: { id: contactUserId },
      });
      dispatch({ type: SEND_MESSAGE_SUCCESS });
      dispatch(fetchMessages({ contactEmail, publicKey, isLegacy }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchAllChats = currentUserEmail => {
  return dispatch => {
    // Not Impl. Yet
  };
};

/* Search conversation and return it to ListConversation reducer */
export const fetchMessages = ({ contactEmail, publicKey, isLegacy }) => async dispatch => {
  try {
    const response = await API.get(`/message/thread/${contactEmail}`);

    if (!isLegacy) {
      const secretKey = await getSecretKey(publicKey);
      const decryptedData = await decryptMessages(response.data, secretKey);
      dispatch({ type: LIST_CONVERSATION_USER, payload: decryptedData });
    } else {
      dispatch({ type: LIST_CONVERSATION_USER, payload: response.data });
    }
  } catch (error) {
    console.log(error);
  }
};

const registerNewContactError = (error, dispatch) => {
  dispatch({
    type: ADD_NEW_CONTACT_ERROR,
    // payload: error.message,
    payload: 'Başarısız',
  });
};

const registerNewContactSuccess = dispatch =>
  dispatch({
    type: ADD_NEW_CONTACT_SUCCESS,
    payload: true,
  });

export const enableInclusionContact = () => ({
  type: ADD_NEW_CONTACT_SUCCESS,
  payload: false,
});

/* Chat component message */
export const changeMessage = text => {
  return {
    type: CHANGE_MESSAGE,
    payload: text,
  };
};

export async function getSecretKey(publicKey) {
  const privateKey = BULUT.parse(await AsyncStorage.getItem('@bippoc:privateKey_bip'));
  const importedPrivateKey = await BULUT.importPrivateKey(privateKey);
  const importedPublicKey = await BULUT.importPublicKey(BULUT.parse(publicKey));
  const secretKey = await BULUT.deriveSecretKey(importedPrivateKey, importedPublicKey);
  return secretKey;
}

async function decryptMessages(data, secretKey) {
  const messages = [...data];
  const length = messages.length;
  const mappedData = [];

  for (let i = 0; i < length; i++) {
    if (messages[i].encrypted) {
      const decrypted = await BULUT.decrypt(secretKey, BULUT.hex2Arr(messages[i].message));
      mappedData.push({ ...messages[i], message: decrypted });
    } else {
      mappedData.push({ ...messages[i] });
    }
  }

  return mappedData;
}
