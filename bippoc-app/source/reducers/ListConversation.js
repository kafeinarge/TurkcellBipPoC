import { LIST_CONVERSATION_USER } from './../resources/types';

const INITIAL_STATE = {
  data: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIST_CONVERSATION_USER:
      return { data: action.payload };
    default:
      return state;
  }
};
