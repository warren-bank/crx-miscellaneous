// ==UserScript==
// @name         PlutoTV - channel guide
// @description  Apply CSS/JS tweaks to "live tv" page: hide video player, enlarge channel guide, disable window.onkeydown() handler to allow scrolling page vertically with arrow keys.
// @version      0.2.0
// @match        *://pluto.tv/live-tv/*
// @match        *://*.pluto.tv/live-tv/*
// @icon         https://pluto.tv/images/favicon.png
// @run-at       document-end
// @homepage     https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-miscellaneous/issues
// @downloadURL  https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/PlutoTV-channel-guide.user.js
// @updateURL    https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/PlutoTV-channel-guide.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

const user_options = {
  "delay_script_execution_ms": 0
}

const CSS = `
video,
body > *,
body > #root > *,
body > #root > div.withGuide > div[kind="linearChannel"]
{display: none !important;}

body > #root,
body > #root > div.withGuide
{display: block !important;}

body > #root > div.withGuide,
body > #root > div.withGuide > div[kind="linearChannel"] + div
{height: 100% !important;}
`

const payload = function(){
  const style     = document.createElement('style')
  style.type      = 'text/css'
  style.innerHTML = CSS
  document.getElementsByTagName('head')[0].appendChild(style)

  window.onkeydown = function(event){event.stopPropagation();event.stopImmediatePropagation();event.preventDefault();event.returnValue=true;}
}

setTimeout(
  payload,
  user_options['delay_script_execution_ms']
)
