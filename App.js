import React, { Component } from 'react';
import Hello from './components/HelloComponent';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
const store = ConfigureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
export default App;
