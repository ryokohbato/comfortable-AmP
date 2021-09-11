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
    try {
      browser.runtime.sendMessage(
        {
          From: "tabs",
          Title: "unmute-tab",
          Value: tabId,
        }
      );
      console.log('mute ok');
    } catch (error) {
      console.log("mute アウト" + error);
    }
  }
  else if (message["Timing"] === "runtime-tabs")
  {
    document.querySelector('html')?.setAttribute(message.Value["Title"], message.Value["Value"].toString());
    console.log(`${message.Value["Title"]}を${message.Value["Value"].toString()}`);
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
    console.log("observerが変更を検知");
    if (document.querySelectorAll('.adSkipButton').length > 0)
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
        (document.querySelectorAll('.adSkipButton')[0] as HTMLElement).click();
        console.log("広告をスキップしました。");
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

  console.log("loadしました。");
})
