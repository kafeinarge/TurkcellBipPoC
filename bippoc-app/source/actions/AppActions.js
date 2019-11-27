import base64 from 'base-64';
import _ from 'lodash';

import { API } from '../resources/axios';

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

export const sendMessage = ({ message, contactUserId, contactEmail, isLegacy }) => {
  return async dispatch => {
    let newMessage = message;
    if (!isLegacy) {
      // TODO: encrypted
      newMessage = message;
    }

    try {
      await API.post('/message/send', {
        message: newMessage,
        encrypted: !isLegacy,
        receiver: { id: contactUserId },
      });
      dispatch({ type: SEND_MESSAGE_SUCCESS });
      dispatch(fetchMessages(contactEmail));
    } catch (error) {
      //
    }
  };
};

export const fetchAllChats = currentUserEmail => {
  return dispatch => {
    // Not Impl. Yet
  };
};

/* Search conversation and return it to ListConversation reducer */
export const fetchMessages = contactEmail => {
  return async dispatch => {
    try {
      const response = await API.get(`/message/thread/${contactEmail}`);

      const messageList = response.data.map(item => {
        if (item.encrypted) {
          // TODO:
          return {
            ...item,
            message: item.message,
          };
        }
        return item;
      });

      dispatch({ type: LIST_CONVERSATION_USER, payload: messageList });
    } catch (error) {
      //
    }
  };
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
