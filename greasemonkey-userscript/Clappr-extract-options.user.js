// ==UserScript==
// @name         Clappr: extract options
// @description  Generic script to extract and display the config options for an initialized instance of the Clappr video player. Has an option to redirect the extracted video to an external website, which is enabled by default. Runs on all websites by default; update "@match" to restrict its scope.
// @version      1.0.0
// @match        *://*/*
// @run-at       document-start
// @homepage     https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-miscellaneous/issues
// @downloadURL  https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Clappr-extract-options.user.js
// @updateURL    https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Clappr-extract-options.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

var user_options = {
  "poll_window_interval_ms":        1000,
  "poll_window_timeout_ms":        30000,

  "redirect_to_webcast_reloaded":  true,
  "force_http":                    true,
  "force_https":                   false
}

var redirect_to_url = function(url) {
  if (!url) return

  unsafeWindow.location = url

  if (unsafeWindow.window !== unsafeWindow.top) {
    try {
      unsafeWindow.top.location = url
    }
    catch(e) {}
  }
}

var get_webcast_reloaded_url_from_clappr_options = function(options) {
  var video_url    = options.source
  var captions_url = null
  var referer_url  = options.referer || unsafeWindow.location.href

  try {
    captions_url = options.playback.externalTracks
      .filter(function(track){return (track.kind === 'subtitles') && track.src})
      .map(function(track){return track.src})

    captions_url = (captions_url.length)
      ? captions_url[0]
      : null
  }
  catch(e){
    captions_url = null
  }

  return get_webcast_reloaded_url(video_url, captions_url, referer_url)
}

var get_webcast_reloaded_url = function(video_url, captions_url, referer_url, force_http, force_https) {
  force_http  = (typeof force_http  === 'boolean') ? force_http  : user_options.force_http
  force_https = (typeof force_https === 'boolean') ? force_https : user_options.force_https

  var encoded_video_url, encoded_captions_url, encoded_referer_url, webcast_reloaded_base, webcast_reloaded_url

  encoded_video_url     = encodeURIComponent(encodeURIComponent(btoa(video_url)))
  encoded_captions_url  = captions_url ? encodeURIComponent(encodeURIComponent(btoa(captions_url))) : null
  referer_url           = referer_url ? referer_url : unsafeWindow.location.href
  encoded_referer_url   = encodeURIComponent(encodeURIComponent(btoa(referer_url)))

  webcast_reloaded_base = {
    "https": "https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html",
    "http":  "http://webcast-reloaded.frii.site/index.html"
  }

  webcast_reloaded_base = (force_http)
                            ? webcast_reloaded_base.http
                            : (force_https)
                               ? webcast_reloaded_base.https
                               : (video_url.toLowerCase().indexOf('http:') === 0)
                                  ? webcast_reloaded_base.http
                                  : webcast_reloaded_base.https

  webcast_reloaded_url  = webcast_reloaded_base + '#/watch/' + encoded_video_url + (encoded_captions_url ? ('/subtitle/' + encoded_captions_url) : '') + '/referer/' + encoded_referer_url
  return webcast_reloaded_url
}

var init = function() {
  var playerId = 1

  var timer_elapsed = 0
  var timer = setInterval(
    function() {
      try {
        timer_elapsed += user_options.poll_window_interval_ms
        if (timer_elapsed > user_options.poll_window_timeout_ms) {
          clearInterval(timer)
          return
        }

        // https://unpkg.com/browse/clappr@0.2.63/docs/files/src_components_player.js.html#L291
        var options = Clappr.PlayerInfo.getInstance(playerId).options

        if (options && options.source) {
          options.referer = unsafeWindow.location.href

          clearInterval(timer)
          unsafeWindow.document.body.innerHTML = '<pre>' + JSON.stringify(options, null, 2) + '</pre>'
          unsafeWindow.document.body.style.backgroundColor = 'white'
          unsafeWindow.document.body.style.color = 'black'
          unsafeWindow.document.body.style.fontSize = '16px'
          unsafeWindow.document.body.style.margin = '10px'

          if (user_options.redirect_to_webcast_reloaded) {
            redirect_to_url(
              get_webcast_reloaded_url_from_clappr_options(options)
            )
          }
        }
      }
      catch(e){}
    },
    user_options.poll_window_interval_ms
  )
}

init()
