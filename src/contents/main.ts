import { browser } from "webextension-polyfill-ts";
import { MessagesToBackground } from "../modules/messagesToBackground";
import { MessagesFromBackground } from "../modules/messagesToPopup";
import { adSkipButton } from "../modules/queries";

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
    if (document.querySelector('[skip-advertisement="true"] .scalingVideoContainerBottom > .rendererContainer') != null && tabId > 0)
    {
      if (document.querySelector('[skip-advertisement="true"] .scalingVideoContainerBottom > .rendererContainer')!.childElementCount >= 2)
      {
        if ((document.querySelector('[skip-advertisement="true"] .scalingVideoContainerBottom > .rendererContainer')!
          .firstElementChild as HTMLElement).style.visibility === "hidden")
        {
          browser.runtime.sendMessage(
            {
              From: "tabs",
              Title: "unmute-tab",
              Value: tabId,
            }
          );
        }
        else
        {
          browser.runtime.sendMessage(
            {
              From: "tabs",
              Title: "mute-tab",
              Value: tabId,
            }
          );
        }
      }
    }

    adSkipButton.forEach(x =>
      {
        if (document.querySelector(x) != null && tabId > 0)
        {
          (document.querySelector(x) as HTMLElement).click();
          let skipDate = new Date();
          console.log(`%ccomfortable-AmP: 広告をスキップしました (${skipDate})`, "color: #FFB0A8;");
        }
      })
  });

  observer.observe(targetElement, { subtree: true, childList: true, attributes: true });
  let loadDate = new Date();
  console.log(`%ccomfortable-AmP: ロードしました (${loadDate})`, "color: #FFB0A8;");
})
