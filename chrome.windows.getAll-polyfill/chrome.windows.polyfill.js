(function(){
  const $chrome  = (typeof chrome  === 'undefined') ? null : chrome
  const $browser = (typeof browser === 'undefined') ? null : browser
  if (!$chrome && !$browser) return

  const $tabs = $browser ? $browser.tabs : $chrome.tabs

  // feature detection
  {
    const promise = $tabs.query({windowType: 'popup'})
    if (!promise || !(promise instanceof Promise)) return
  }

  for (let $global of [$chrome, $browser]) {
    if (!$global) continue

    if (!$global.windows) $global.windows = {}

    if (!$global.windows.getAll) {
      $global.windows.getAll = async (queryOptions, callback) => {
        const windows = {}  // map: window id => window object

        // strategy:
        //   1. query each individual WindowType, because the tabs.query API only accepts one value
        //   2. query the current tab to determine the focused window

        const windowTypes = (queryOptions && queryOptions.windowTypes && queryOptions.windowTypes.length)
          ? queryOptions.windowTypes
          : ['normal', 'popup']

        for (let windowType of windowTypes) {
          const tabs = await $tabs.query({windowType})
          if (tabs && tabs.length) {
            for (let tab of tabs) {
              if (tab && tab.windowId) {
                const windowId = tab.windowId

                if (!windows[windowId]) {
                  // initialize a new window with an empty tabs array
                  windows[windowId] = {
                    id: windowId,
                    type: windowType,
                    incognito: !!tab.incognito,
                    width: tab.width || 0,
                    height: tab.height || 0,
                    left: 0,
                    top: 0,
                    state: 'maximized',
                    alwaysOnTop: false,
                    focused: false,
                    tabs: []
                  }
                }

                // append tab to its associated window
                windows[windowId].tabs.push(tab)
              }
            }
          }
        }

        {
          let tab
          tab = await $tabs.query({active: true, lastFocusedWindow: true})
          if (tab && Array.isArray(tab) && tab.length) {
            tab = tab[0]
            if (tab && tab.windowId && windows[tab.windowId]) {
              windows[tab.windowId].focused = true
            }
          }
        }

        const result = Object.values(windows)
        if (callback)
          callback(result)
        return result
      }
    }

    if (!$global.windows.getCurrent) {
      $global.windows.getCurrent = async (queryOptions, callback) => {
        const windows = await $global.windows.getAll(queryOptions)

        const result = windows.find(win => !!win.focused)
        if (callback)
          callback(result)
        return result
      }
    }

    if (!$global.windows.getLastFocused) {
      $global.windows.getLastFocused = $global.windows.getCurrent
    }

    if (!$global.windows.get) {
      $global.windows.get = async (windowId, queryOptions, callback) => {
        const windows = await $global.windows.getAll(queryOptions)

        const result = windows.find(win => win.id === windowId)
        if (callback)
          callback(result)
        return result
      }
    }
  }

})()
