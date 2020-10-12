// ==UserScript==
// @name         Glassdoor - remove "hard sell" overlay
// @description  Undo dynamic changes made by website to cripple functionality when the visitor is not logged in (to a free user account).
// @version      0.1.0
// @match        *://glassdoor.com/*
// @match        *://*.glassdoor.com/*
// @icon         https://www.glassdoor.com/favicon.ico
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-miscellaneous/issues
// @downloadURL  https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Glassdoor-remove-overlay.user.js
// @updateURL    https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Glassdoor-remove-overlay.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var user_options = {
  "script_injection_delay_ms": 1500
}

var payload = function(){
  var el = document.getElementById('HardsellOverlay')

  if (el) {
    el.remove()
    document.body.style.overflow = 'auto'
    window.addEventListener('scroll', function(event) {event.stopPropagation()}, true)
  }
}

var get_hash_code = function(str){
  var hash, i, char
  hash = 0
  if (str.length == 0) {
    return hash
  }
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash  // Convert to 32bit integer
  }
  return Math.abs(hash)
}

var inject_function = function(_function){
  var inline, script, head

  inline = _function.toString()
  inline = '(' + inline + ')()' + '; //# sourceURL=crx_extension.' + get_hash_code(inline)
  inline = document.createTextNode(inline)

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.head
  head.appendChild(script)
}

var bootstrap = function(){
  inject_function(payload)
}

setTimeout(
  bootstrap,
  user_options['script_injection_delay_ms']
)
