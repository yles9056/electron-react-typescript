import React from 'react';

const { example, electron } = window;

const IpcExample = () => {
  // Example of how to receive messages from main process.
  const exampleFunc = (message: string) => {
    console.log('Received a message from main process:', message);
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

  return null;
};

export default IpcExample;
