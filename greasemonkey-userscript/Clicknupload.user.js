// ==UserScript==
// @name         Clicknupload
// @description  Automate user interactions required to obtain the direct URL for slow downloads
// @version      0.1.0
// @match        *://clickndownload.name/*
// @icon         https://clickndownload.name/images_new/logo.png
// @run-at       document-end
// @homepage     https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-miscellaneous/issues
// @downloadURL  https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Clicknupload.user.js
// @updateURL    https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Clicknupload.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

// -----------------------------------------------------------------------------
/* notes:
 *   - original description: Bypass the waiting period for slow downloads
 *   - original methodology:
 *       const should_click_download_button = should_click_download_button__bypass_once_then_wait_if_error
 * issue:
 *   - the server recognizes the attempt to bypass the waiting period
 *     * reloads the page with an error message, and the timer is reset to the full waiting period
 */
// -----------------------------------------------------------------------------

const begin_slow_download = function() {
  const button = document.querySelector('input[type="submit"]#method_free')

  if (button)
    button.click()

  return !!button
}

// -----------------------------------------------------------------------------

const bypass_countdown = function() {
  const countdown = document.querySelector('span#countdown')
  const button = document.querySelector('button#downloadbtn')
  let ok = (countdown && button)

  if (ok) {
    try {
      const code  = [...countdown.parentNode.querySelectorAll(':scope > table span[style]')].sort(compareCodes).map(span => span.textContent.trim()).join('')
      const input = countdown.parentNode.querySelector(':scope > table input.captcha_code[type="text"]')
      input.value = code

      if (should_click_download_button())
        click_download_button(button)
      else
        setTimeout(click_download_button.bind(null, button), getTimerDelayMs(countdown))
    }
    catch(e) {
      ok = false
    }
  }

  return !!ok
}

const compareCodes = function(spanA, spanB) {
  const leftA = parseInt(spanA.style.paddingLeft)
  const leftB = parseInt(spanB.style.paddingLeft)

  return (leftA - leftB)
}

const click_download_button = function(button) {
  button.removeAttribute('disabled')
  button.disabled = false
  button.click()
}

const should_click_download_button__bypass_once_then_wait_if_error = function() {
  try {
    return (document.querySelector('div.err').textContent.trim() !== 'Skipped countdown')
  }
  catch(e) {
    return true
  }
}

const should_click_download_button__always_wait = function() {
  return false
}

const should_click_download_button = should_click_download_button__always_wait

const getTimerDelayMs = function(countdown) {
  try {
    const secs = parseInt(countdown.querySelector(':scope > span.seconds').textContent.trim(), 10)
    return (secs * 1000)
  }
  catch(e) {
    return 20000
  }
}

// -----------------------------------------------------------------------------

const copy_direct_download_url = function() {
  const anchor = document.querySelector('button#downloadbtn > a.downloadbtn[href]')

  if (anchor) {
    try {
      navigator.clipboard.writeText(anchor.getAttribute('href'))

      window.alert('direct download URL is copied to the clipboard')
    }
    catch(e) {}
  }

  return !!anchor
}

// -----------------------------------------------------------------------------

const init = function() {
  begin_slow_download() || bypass_countdown() || copy_direct_download_url()
}

init()
