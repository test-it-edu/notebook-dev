import React from "react";



/**
 * util KeyManager
 * @author Ingo Andelhofs
 */
class KeyManager {
  private readonly event: React.KeyboardEvent;


  /**
   * Constructor
   * @param event The keyboard event
   */
  public constructor(event: React.KeyboardEvent) {
    event.persist();
    this.event = event;
  }


  /**
   * Calls the callbacks of the current active keys
   * @param eventMap A map of keys, with their callback
   */
  public on(eventMap: object): void {
    let {key, altKey, ctrlKey, shiftKey} = this.event;
    let actionKeyMap: any = {
      "Alt": altKey,
      "Ctrl": ctrlKey,
      "Shift": shiftKey,
    }

    for (let [listenKey, listener] of Object.entries(eventMap)) {
      if (listenKey.indexOf("+") !== -1) {
        let mapKeys = listenKey.split("+");

        for (let i = 0; i < mapKeys.length - 1; i++) {
          let actionKey = mapKeys[i];

          if (actionKeyMap[actionKey]) {
            actionKeyMap[actionKey] = false;
          }
          else {
            return;
          }
        }

        for (let actionKeyOfMap of Object.keys(actionKeyMap)) {
          if (actionKeyMap[actionKeyOfMap]) {
            return;
          }
        }

        if (mapKeys[mapKeys.length - 1] === key) {
          listener(this.event);
          return;
        }
      }
      else {
        if (key === listenKey && !altKey && !ctrlKey && !shiftKey) {
          listener(this.event);
          return;
        }
      }
    }
  }


  /**
   * Checks if the event key matches the given key
   * @param key The key you want to check
   */
  public isKey(key: string): boolean {
    return this.event.key === key;
  }
}


export default KeyManager;