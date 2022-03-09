/**
 * Define global variable for fscripts in src folder.
 * You can defint your own interface.
 * Below is an example of how to call in React component:
 * @example
 * const { example } = window;
 * example.foo.bar(...);
 * example.ping();
 */
declare global {
  interface Window {
    example: IExample;
    electron: IElectron;
  }
}

// This is an example interface. You can define your own interface.
export interface IExample {
  foo: {
    bar: (...args: any[]) => void;
  };
  ping: () => void;
}

// This is an interface for electron.ipcRenderer
export interface IElectron {
  ipcRenderer: {
    /**
     * Add a listener that listens to a channel.
     * @param channel The channel to listen to.
     * @param listener Listener function.
     * @returns A function that removes the listener when called.
     */
    on: (channel: string, func: (...args: any[]) => void) => () => void;
    /**
     * Add a listener that listens to a channel. Only trigger once.
     * @param channel The channel to listen to.
     * @param listener Listener function.
     * @returns A function that removes the listener when called.
     */
    once: (channel: string, func: (...args: any[]) => void) => () => void;
    /**
     * Sends args to main process via ipcRenderer.send()
     * @param channel
     * @param args
     */
    send: (channel: string, ...args: any[]) => void;
    /**
     * Sends args to main process via ipcRenderer.invoke()
     * @param channel 
     * @param args 
     * @returns A promise.
     */
    invoke: (channel: string, ...args: any[]) => Promise<any>;
  };
}
