import { FETCH_ALL_CHATS } from './../resources/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ALL_CHATS:
      return action.payload;
    default:
      return state;
  }
};
