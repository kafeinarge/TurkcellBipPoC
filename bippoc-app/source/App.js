import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import Routes from './Routes';
import reducers from './reducers/index';

import { generateKeys, buf2Hex } from './resources/ecdh';

const composeEnhancers =
  process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

export default class App extends Component<{}> {
  async componentWillMount() {
    // await generateKeys();
    // console.log(buf2Hex(publicKey));
  }

  render() {
    return (
      <Provider store={createStore(reducers, {}, composeEnhancers(applyMiddleware(ReduxThunk)))}>
        <Routes />
      </Provider>
    );
  }
}
