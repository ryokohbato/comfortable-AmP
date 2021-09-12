import { browser } from "webextension-polyfill-ts";
import { MessagesToBackground } from "../modules/messagesToBackground";
import { MessagesFromBackground } from "../modules/messagesToPopup";

import "./style.scss"

let tabId: number = -1;

browser.runtime.onMessage.addListener((message: MessagesFromBackground, sender) => {
  if (message["Timing"] === "initialize")
  {
    tabId = message["Value"]["tabId"];
    document.querySelector('html')?.setAttribute("skip-advertisement", message.Value["storageData"]["skip-advertisement"])
    document.querySelector('html')?.setAttribute("delete-next-popup", message.Value["storageData"]["delete-next-popup"])
  }
  else if (message["Timing"] === "runtime-tabs")
  {
    document.querySelector('html')?.setAttribute(message.Value["Title"], message.Value["Value"].toString());
  }
})

const contentsLoadedMessage: MessagesToBackground =
{
  From: "tabs",
  Title: "get-storage-data",
  Value: true
}

window.addEventListener("load", () =>
{
  browser.runtime.sendMessage(contentsLoadedMessage);

  const targetElement = document.querySelector("html") as HTMLElement;

  const observer = new MutationObserver(function() {
    if (document.querySelectorAll('[skip-advertisement="true"] .adSkipButton').length > 0)
    {
      if (tabId >= 0)
      {
        browser.runtime.sendMessage(
          {
            From: "tabs",
            Title: "mute-tab",
            Value: tabId,
          }
        );
        (document.querySelector('[skip-advertisement="true"] .adSkipButton') as HTMLElement).click();
        browser.runtime.sendMessage(
          {
            From: "tabs",
            Title: "unmute-tab",
            Value: tabId,
          }
        );
      }
    }
  });

  observer.observe(targetElement, {subtree: true, childList: true});
})
