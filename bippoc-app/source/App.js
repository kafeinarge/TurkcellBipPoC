import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import Routes from './Routes';
import reducers from './reducers/index';

const composeEnhancers =
  process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

export default class App extends Component<{}> {
  async componentWillMount() {
    // console.clear();
  }

  render() {
    return (
      <Provider store={createStore(reducers, {}, composeEnhancers(applyMiddleware(ReduxThunk)))}>
        <Routes />
      </Provider>
    );
  }
}
