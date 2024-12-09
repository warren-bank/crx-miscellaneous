### [Miscellaneous Userscripts](https://github.com/warren-bank/crx-miscellaneous/tree/greasemonkey-userscript)

#### GreaseMonkey Userscript Download URLs:

* [Clappr: extract options](https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Clappr-extract-options.user.js)
  - website: `*`
  - summary:
    * generic script to extract and display the config options for an initialized instance of the Clappr video player
    * has an option to redirect the extracted video to an external website, which is enabled by default
    * runs on all websites by default; update `@match` to restrict its scope
* [PlutoTV - channel guide](https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/PlutoTV-channel-guide.user.js)
  - website: [https://pluto.tv/live-tv/](https://pluto.tv/live-tv/)
  - summary:
    * hide video player
    * enlarge channel guide
    * disable _window.onkeydown()_ handler
      - allows scrolling page vertically with arrow keys
    * retain focus on scrollable area
      - allows scrolling page vertically with arrow keys regardless of where the user clicks on the page
  - notes:
    * [https://pluto.tv/live-tv](https://pluto.tv/live-tv) loads the unmodified channel guide
* [ShidurLive](https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/ShidurLive-embed.user.js)
  - website: [https://shidurlive.com/](https://shidurlive.com/)
  - summary:
    * transfers embedded video stream to alternate video players: [WebCast-Reloaded](https://github.com/warren-bank/crx-webcast-reloaded), [ExoAirPlayer](https://github.com/warren-bank/Android-ExoPlayer-AirPlay-Receiver)
* [GooglePlay - PNG screenshots](https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/GooglePlay-png-screenshots.user.js)
  - website: [https://play.google.com/store/apps/details?id=](https://play.google.com/store/apps/)
  - summary:
    * change screenshot URLs to load in PNG format, rather than WebP
* [Glassdoor - remove "hard sell" overlay](https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Glassdoor-remove-overlay.user.js)
  - website: [https://www.glassdoor.com/](https://www.glassdoor.com/)
  - summary:
    * undo dynamic changes made by website to cripple functionality when the visitor is not logged in (to a free user account)
* [Clicknupload](https://github.com/warren-bank/crx-miscellaneous/raw/greasemonkey-userscript/greasemonkey-userscript/Clicknupload.user.js)
  - website: [https://clickndownload.name/](https://clickndownload.name/)
  - summary:
    * automate user interactions required to obtain the direct URL for slow downloads
  - note:
    * it isn't possible to fully bypass the waiting period, because of server-side validation
    * this script: enters the captcha, clicks the button after the waiting period has ended, copies the direct download URL to the clipboard
    * the direct download URL is valid for 12 hours, can be accessed only from the current IP address, and can be used with any HTTP download client (ex: `wget`)

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
