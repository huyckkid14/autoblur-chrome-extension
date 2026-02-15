/*!
 * AutoBlur v1.0.0
 * Copyright (c) 2026 Jaewon Lee (huyckkid14)
 * Email: bestorangelover@gmail.com
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

async function toggleForTab(tabId){
  try{
    await chrome.tabs.sendMessage(tabId, { type: "AUTO_BLUR_TOGGLE" });
  }catch(e){
    // If content script isn't ready, try injecting it once (rare).
    try{
      const tab = await chrome.tabs.get(tabId);
      if(!tab || !tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) return;
      await chrome.scripting.executeScript({ target: { tabId }, files: ["content/content.js"] });
      await chrome.tabs.sendMessage(tabId, { type: "AUTO_BLUR_TOGGLE" });
    }catch(_){}
  }
}

chrome.action.onClicked.addListener((tab) => {
  if(!tab || !tab.id) return;
  toggleForTab(tab.id);
});

chrome.commands.onCommand.addListener(async (command) => {
  console.log("[AutoBlur] Command fired:", command);

  if (command !== "toggle-sidebar") {
    console.log("[AutoBlur] Not toggle-sidebar command.");
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.id) {
    console.log("[AutoBlur] No active tab found.");
    return;
  }

  console.log("[AutoBlur] Sending toggle to tab:", tab.id);

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "AUTO_BLUR_TOGGLE" });
    console.log("[AutoBlur] Message sent successfully.");
  } catch (err) {
    console.log("[AutoBlur] Error sending message:", err);
  }
});

