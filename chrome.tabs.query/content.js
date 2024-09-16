var reset_dom = function() {
  var body = document.body
  body.style.backgroundColor = 'white'
  while (body.childNodes.length)
    body.removeChild(body.childNodes[0])
}

window.alert('addon is running..')

chrome.runtime.sendMessage('chrome.tabs.query', function(tab_list) {
  reset_dom()
  var pre = document.createElement('pre')
  pre.textContent = JSON.stringify(tab_list, null, 2)
  document.body.appendChild(pre)
})
