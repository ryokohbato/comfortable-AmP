import { browser } from "webextension-polyfill-ts";
import { MessagesToBackground } from "../modules/messagesToBackground";

browser.runtime.onInstalled.addListener(() =>
{
  browser.storage.sync.set({
    "skip-advertisement": true,
    "delete-next-popup": true,
  })
})

browser.runtime.onMessage.addListener(async (message: MessagesToBackground, sender) =>
{
  if (message.From === "popup")
  {
    if (message.Title === "get-storage-data")
    {
      const storageData = await browser.storage.sync.get(["skip-advertisement", "delete-next-popup"])
      browser.runtime.sendMessage(
        {
          Timing: "initialize",
          Value: storageData
        }
      );
      return;
    }

    browser.storage.sync.set({[message.Title]: message.Value});

    const tabs = await browser.tabs.query({ url: "https://www.amazon.co.jp/gp/*" });

    switch(message.Title)
    {
      case "skip-advertisement":
        browser.runtime.sendMessage(
          {
            Timing: "runtime-popup",
            Value: `広告自動スキップを${message.Value === true ? "ON" : "OFF"}にしました。`,
          });
        tabs.forEach(x =>
        {
          if (x.id != null)
          {
            browser.tabs.sendMessage(x.id, {
              Timing: "runtime-tabs",
              Value: message,
            });
          }
        })
        break;
      case "delete-next-popup":
        browser.runtime.sendMessage(
          {
            Timing: "runtime-popup",
            Value: `次話ポップアウト非表示を${message.Value === true ? "ON" : "OFF"}にしました。`,
          });
        tabs.forEach(x =>
        {
          if (x.id != null)
          {
            browser.tabs.sendMessage(x.id, {
              Timing: "runtime-tabs",
              Value: message,
            });
          }
        })
        break;
    }
  }
  else if (message.From === "tabs")
  {
    if (message.Title === "get-storage-data")
    {
      const tabs = await browser.tabs.query({ url: "https://www.amazon.co.jp/gp/*" });
      const storageData = await browser.storage.sync.get(["skip-advertisement", "delete-next-popup"])
      tabs.forEach(x =>
      {
        if (x.id != null)
        {
          browser.tabs.sendMessage(x.id, {
            Timing: "initialize",
            Value: {
              tabId: x.id,
              storageData: storageData,
            }
          });
        }
      })
    }
    else if (message.Title === "mute-tab")
    {
      console.log(`${(message.Value as number)}をミュートします。`)
      browser.tabs.update((message.Value as number), {muted: true});
    }
    else if (message.Title === "unmute-tab")
    {
      console.log(`${(message.Value as number)}をアンミュートします。`)
      browser.tabs.update((message.Value as number), {muted: false});
    }
  }
});