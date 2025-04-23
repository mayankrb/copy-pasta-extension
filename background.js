chrome.action.onClicked.addListener((tab) => {
  const url = tab.url || "";
  if (url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
    console.warn("Extension cannot be executed on Chrome internal pages.");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"]
  });
});