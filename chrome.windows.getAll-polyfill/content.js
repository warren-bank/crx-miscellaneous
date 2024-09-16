var reset_dom = function() {
  var body = document.body
  body.style.backgroundColor = 'white'
  while (body.childNodes.length)
    body.removeChild(body.childNodes[0])
}

window.alert('addon is running..')

chrome.runtime.sendMessage('chrome.windows.getAll-polyfill', function(window_list) {
  reset_dom()
  var pre = document.createElement('pre')
  pre.textContent = JSON.stringify(window_list, null, 2)
  document.body.appendChild(pre)
})
