import { browser } from "webextension-polyfill-ts";
import { MessagesToBackground } from "../modules/messagesToBackground";
import { MessagesFromBackground } from "../modules/messagesToPopup";

import "./popup.scss"

browser.runtime.onMessage.addListener((message: MessagesFromBackground, sender) =>
{
  if (message["Timing"] === "initialize")
  {
    (document.getElementById("skip-advertisement") as HTMLInputElement).checked = message["Value"]["skip-advertisement"];
    (document.getElementById("delete-next-popup") as HTMLInputElement).checked = message["Value"]["delete-next-popup"];
  }
  else if (message["Timing"] === "runtime-popup")
  {
    // TOTO: 変更終了通知を表示
    // console.log(message["Value"]);
  }
})

const onInputOptionStatusChanged = (event: Event): void =>
{
  const optionChangedMessage: MessagesToBackground =
  {
    From: "popup",
    Title: (event.target as HTMLInputElement).name,
    Value: (event.target as HTMLInputElement).checked,
  }

  browser.runtime.sendMessage(optionChangedMessage);
}

document.getElementById("skip-advertisement")?.addEventListener("change", (event: Event) =>
{
  onInputOptionStatusChanged(event);
})

document.getElementById("delete-next-popup")?.addEventListener("change", (event: Event) =>
{
  onInputOptionStatusChanged(event);
})

// ポップアップ表示後呼び出し
window.addEventListener('load', () => {
  const loadedMessage: MessagesToBackground = {
    "From": "popup",
    "Title": "get-storage-data",
    "Value": true,
  }
  browser.runtime.sendMessage(loadedMessage);
});