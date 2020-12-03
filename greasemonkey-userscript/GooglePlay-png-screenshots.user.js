// ==UserScript==
// @name         GooglePlay - PNG screenshots
// @description  Change screenshot URLs to load in PNG format, rather than WebP.
// @version      0.1.0
// @match        *://play.google.com/store/apps/details?id=*
// @icon         https://www.gstatic.com/android/market_images/web/favicon_v2.ico
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-miscellaneous/issues
// @downloadURL  https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/GooglePlay-png-screenshots.user.js
// @updateURL    https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/GooglePlay-png-screenshots.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var user_options = {
  "delay_script_execution_ms": 0,
  "delay_slideshow_init_ms":   1000
}

var payload = function(){
  var update_attribute = function(attr) {
    return attr.replace(/((?:https:)?\/\/play-lh\.googleusercontent\.com\/[^\s]+)-rw(\s|$)/ig, '$1$2')
  }

  var update_image_attribute = function(img, name) {
    if (img.hasAttribute(name)) {
      var old_val = img.getAttribute(name)
      var new_val = update_attribute(old_val)

      if (old_val !== new_val)
        img.setAttribute(name, new_val)
    }
  }

  var get_all_images = function() {
    return document.querySelectorAll('img')
  }

  var get_slideshow_container = function() {
    try {
      return document.querySelector('button[data-screenshot-item-index]').parentElement
    }
    catch(e) {
      return null
    }
  }

  var update_all_images = function(images) {
    if (!images)
      images = get_all_images()

    for (var i=0; i < images.length; i++) {
      update_image_attribute(images[i], 'src')
      update_image_attribute(images[i], 'srcset')
      update_image_attribute(images[i], 'data-src')
      update_image_attribute(images[i], 'data-srcset')
    }
  }

  var attach_slideshow_open_listener = function(slideshow_container) {
    if (!slideshow_container)
      slideshow_container = get_slideshow_container()

    if (!slideshow_container) return

    slideshow_container.addEventListener('click', function() {
      setTimeout(
        update_all_images,
        user_options['delay_slideshow_init_ms']
      )
    })
  }

  var initialize_all_images = function() {
    update_all_images()
    attach_slideshow_open_listener()
  }

  initialize_all_images()
}

setTimeout(
  payload,
  user_options['delay_script_execution_ms']
)
