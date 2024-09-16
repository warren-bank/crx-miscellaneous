chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if (message === 'chrome.tabs.query') {
    chrome.tabs.query({windowType: 'normal'}, callback)
    return true
  }
  return false
})
