import React from 'react';
import logo from './logo.svg';
import './App.css';
import IpcExample from './components/examples/IpcExample';
import TranslationExample from './components/examples/TranslationExample';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <IpcExample />
        <TranslationExample />
      </header>
    </div>
  );
}

export default App;
