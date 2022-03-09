import { contextBridge, ipcRenderer } from 'electron';

// This one is just an example.
contextBridge.exposeInMainWorld('example', {
  foo: {
    bar(...args: any[]) {
      args.forEach((arg) => {
        console.log('example function args:', arg);
      });
    }
  },
  ping() {
    ipcRenderer.send('ping');
  }
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    /**
     * Add a listener that listens to a channel.
     * @param channel The channel to listen to.
     * @param listener Listener function.
     * @returns A function that removes the listener when called.
     */
    on(channel: string, listener: (...args: any[]) => void) {
      const _listener = (event: Electron.IpcRendererEvent, ...args: any[]) => {
        listener(...args);
      };
      ipcRenderer.on(channel, _listener);
      return () => {
        ipcRenderer.removeListener(channel, _listener);
      };
    },
    /**
     * Add a listener that listens to a channel. Only trigger once.
     * @param channel The channel to listen to.
     * @param listener Listener function.
     * @returns A function that removes the listener when called.
     */
    once(channel: string, listener: (...args: any[]) => void) {
      const _listener = (event: Electron.IpcRendererEvent, ...args: any[]) => {
        listener(...args);
      };
      ipcRenderer.once(channel, _listener);
      return () => {
        ipcRenderer.removeListener(channel, _listener);
      };
    },
    /**
     * Sends args to main process via ipcRenderer.send()
     * @param channel
     * @param args
     */
    send(channel: string, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    /**
     * Sends args to main process via ipcRenderer.invoke()
     * @param channel
     * @param args
     * @returns A promise.
     */
    invoke(channel: string, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args);
    }
  }
});
