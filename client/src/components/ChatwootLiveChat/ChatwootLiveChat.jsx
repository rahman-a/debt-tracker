import { useEffect, useRef } from 'react'
import i18next from 'i18next'
import { useSelector } from 'react-redux'

export default function ChatWootLiveChat() {
  const lang = i18next.language
  const { isAuth } = useSelector((state) => state.isAuth)
  const BASE_URL = 'https://app.chatwoot.com'
  // Add Chatwoot Settings
  window.chatwootSettings = {
    hideMessageBubble: false,
    position: 'right', // This can be left or right
    locale: lang, // Language to be set
    type: 'standard', // [standard, expanded_bubble]
  }
  // Paste the script from inbox settings except the <script> tag
  const createScript = function (d, t) {
    let g = d.createElement(t)
    let s = d.getElementsByTagName(t)[0]
    g.src = BASE_URL + '/packs/js/sdk.js'
    s.parentNode.insertBefore(g, s)
    g.async = !0
    g.onload = function () {
      window.chatwootSDK.run({
        websiteToken: import.meta.env.VITE_CHATWOOT_KEY,
        baseUrl: BASE_URL,
      })
    }
  }

  // remove the script when user is not authenticated
  const removeScript = function () {
    document.querySelectorAll('script').forEach((script) => {
      if (script.src === BASE_URL + '/packs/js/sdk.js') {
        script.remove()
      }
    })
    const chatContainer = document.querySelector('.woot--bubble-holder')
    if (chatContainer) {
      chatContainer.remove()
    }
    const chatWidget = document.querySelector('.woot-widget-holder')
    if (chatWidget) {
      chatWidget.remove()
    }
  }
  useEffect(() => {
    // Paste the script from inbox settings except the <script> tag
    isAuth ? createScript(document, 'script') : removeScript()
  }, [lang, isAuth])
  return null
}
