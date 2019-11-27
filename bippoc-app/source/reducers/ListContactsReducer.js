import { CONTACTS_LIST } from './../resources/types';

const INITIAL_STATE = {
  data: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CONTACTS_LIST:
      return { data: action.payload };
    default:
      return state;
  }
};
