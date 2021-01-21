// ==UserScript==
// @name         ShidurLive
// @description  Transfers embedded video stream to alternate video players: WebCast-Reloaded, ExoAirPlayer.
// @version      0.1.2
// @match        *://shidurlive.com/embed/*
// @match        *://*.shidurlive.com/embed/*
// @icon         https://shidurlive.com/shidur3.png
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-miscellaneous/issues
// @downloadURL  https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/ShidurLive-embed.user.js
// @updateURL    https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/ShidurLive-embed.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var user_options = {
  "script_injection_delay_ms":    0,
  "redirect_to_webcast_reloaded": true,
  "force_http":                   true,
  "force_https":                  false
}

var payload = function(){

  const get_hls_url = function(){
    let hls_url = (player && player.options && player.options.source)
      ? player.options.source
      : ''

    if (!hls_url && (typeof startPlayer === 'function')) {
      const hls_url_regex = /^.*source:\s*(['"])([^'"]+)(?:\1).*$/i

      const src = startPlayer.toString().replace(/[\r\n]+/g, ' ')
      const url = src.replace(hls_url_regex, '$2')

      if (url !== src)
        hls_url = url
    }

    // Links on site use HTTPS.
    // Server supports HTTP.
    // ExoAirPlayer on Android 4.4 won't play HTTPS link.
    // I didn't investigate whether it's an untrusted root certificate authority or a TLS handshake issue;
    // My guess is the former.
    // Switching to HTTP fixes the problem.
    hls_url = hls_url.replace(/^(http)s/i, '$1')

    return hls_url
  }

  const get_referer_url = function() {
    return window.location.href
  }

  const get_webcast_reloaded_url = (hls_url, vtt_url, referer_url) => {
    if (!hls_url) return ''

    let encoded_hls_url, encoded_vtt_url, encoded_referer_url, webcast_reloaded_base, webcast_reloaded_url

    encoded_hls_url       = encodeURIComponent(encodeURIComponent(btoa(hls_url)))
    encoded_vtt_url       = vtt_url ? encodeURIComponent(encodeURIComponent(btoa(vtt_url))) : null
    referer_url           = referer_url ? referer_url : get_referer_url()
    encoded_referer_url   = encodeURIComponent(encodeURIComponent(btoa(referer_url)))

    webcast_reloaded_base = {
      "https": "https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html",
      "http":  "http://webcast-reloaded.surge.sh/index.html"
    }

    webcast_reloaded_base = (window.force_http)
                              ? webcast_reloaded_base.http
                              : (window.force_https)
                                 ? webcast_reloaded_base.https
                                 : (hls_url.toLowerCase().indexOf('http:') === 0)
                                    ? webcast_reloaded_base.http
                                    : webcast_reloaded_base.https

    webcast_reloaded_url  = webcast_reloaded_base + '#/watch/' + encoded_hls_url + (encoded_vtt_url ? ('/subtitle/' + encoded_vtt_url) : '') + '/referer/' + encoded_referer_url
    return webcast_reloaded_url
  }

  const redirect_to_url = function(url) {
    if (!url) return

    try {
      top.location = url
    }
    catch(e) {
      window.location = url
    }
  }

  redirect_to_url(
    get_webcast_reloaded_url(
      get_hls_url()
    )
  )
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

var inject_options = function(){
  var _function = `function(){
    window.force_http  = ${user_options['force_http']}
    window.force_https = ${user_options['force_https']}
  }`
  inject_function(_function)
}

var bootstrap = function(){
  inject_options()
  inject_function(payload)
}

if (user_options['redirect_to_webcast_reloaded']) {
  setTimeout(
    bootstrap,
    user_options['script_injection_delay_ms']
  )
}
