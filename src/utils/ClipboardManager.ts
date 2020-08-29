import React from "react";



/**
 * util ClipboardManager
 * @author Ingo Andelhofs
 */
class ClipboardManager {
  public static retrieveImageAsBlob(event: React.ClipboardEvent, callback: any) {
    if (!event.clipboardData) {
      callback(undefined);
      return;
    }

    let items = event.clipboardData.items;

    if (!items) {
      callback(undefined);
      return;
    }

    for (let i = 0; i < items.length; i++) {
      let item = items[i];

      if (item.type.indexOf("image") === -1)
        continue;

      let blob = item.getAsFile();
      callback(blob);
      return;
    }
  }
  public static retrieveImageAsBase64(event: React.ClipboardEvent, callback: any) {
    event.persist();
    event.preventDefault();

    if (!event.clipboardData) {
      callback(undefined);
      return;
    }

    let items = event.clipboardData.items;

    if (!items) {
      callback(undefined);
      return;
    }

    for (let i = 0; i < items.length; i++) {
      let item = items[i];

      if (item.type.indexOf("image") === -1)
        continue;

      let blob = item.getAsFile();

      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");

      let image = new Image();

      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;

        context!.drawImage(image, 0, 0);
        callback(canvas.toDataURL("image/png"));
      }

      let URLObj = window.URL || window.webkitURL;
      image.src = URLObj.createObjectURL(blob);
    }
  }
}


export default ClipboardManager;