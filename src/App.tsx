import React from 'react';
import logo from './logo.svg';
import './App.css';

const { example, electron } = window;

function App() {
  // Example of how to receive messages from main process.
  const exampleFunc = (message: string) => {
    console.log('Received a message from main process.', message);
  };

  React.useEffect(() => {
    // Example of how to send messages to main process.
    let removeListenerFunc = electron.ipcRenderer.on('pong', exampleFunc);
    // Send a ping message to main process.
    example.ping();
    return () => {
      // Always remember to remove listener!
      removeListenerFunc();
    };
  });

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
      </header>
    </div>
  );
}

export default App;
