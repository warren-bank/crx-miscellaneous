chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if (message === 'chrome.windows.getAll') {
    chrome.windows.getAll({windowTypes: ['normal'], populate : true}, callback)
    return true
  }
  return false
})
