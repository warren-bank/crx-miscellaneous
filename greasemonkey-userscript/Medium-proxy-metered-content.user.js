// ==UserScript==
// @name         Medium: proxy metered content
// @description  Detect articles made available to Medium members only, and redirect URL through a proxy.
// @version      1.0.0
// @match        *://*.medium.com/*
// @icon         https://miro.medium.com/v2/5d8de952517e8160e40ef9841c781cdc14a5db313057fa3c3de41c6f5b494b19
// @run-at       document-end
// @homepage     https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-miscellaneous/issues
// @downloadURL  https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Medium-proxy-metered-content.user.js
// @updateURL    https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Medium-proxy-metered-content.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

var proxy_index = 0  // edit this index to choose a proxy from the following list

var proxies = [
  "https://freedium.cfd/",
  "https://readmedium.com/",
  "https://12ft.io/",
  "https://archive.is/"
]

var proxy = proxies[proxy_index]

if (document.querySelector('article.meteredContent')) {
  window.location = proxy + window.location.href
}
