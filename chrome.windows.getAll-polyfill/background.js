chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if (message === 'chrome.windows.getAll-polyfill') {
    chrome.windows.getAll({windowTypes: ['normal'], populate : true}, callback)
    return true
  }
  return false
})
