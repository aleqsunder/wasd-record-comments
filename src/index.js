'use strict'

import './css/index.scss'
import MessagesObserver from "./js/MessagesObserver"
import TimeMutation from "./js/TimeMutation"
import { customEvent, log } from "./js/helpers"

window.currentVersion = '0.1.5';

(function (history) {
    const replaceState = history.replaceState
    history.replaceState = function(state) {
        if (typeof history.onreplacestate == "function") {
            history.onreplacestate({state: state})
        }
        setTimeout(() => {
            const event = new CustomEvent('replaceState')
            event.arguments = arguments
            window.dispatchEvent(event)
        })
        return replaceState.apply(history, arguments)
    }
    const pushState = history.pushState
    history.pushState = function (state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state})
        }
        setTimeout(() => {
            const event = new CustomEvent('pushState')
            event.arguments = arguments
            window.dispatchEvent(event)
        })
        return pushState.apply(history, arguments)
    }
})(window.history);

(async function () {
    let timeMutation, messagesObserver
    
    async function selectiveListener() {
        timeMutation = new TimeMutation()
        
        if (messagesObserver instanceof MessagesObserver) {
            messagesObserver.isAvailable = false
        }
        messagesObserver = new MessagesObserver()
        if (location.search.length === 0) {
            return false
        }
    
        const search = location.search.slice(1)
        const GET = search.split('&').reduce((object, item) => {
            const [key, value] = item.split('=')
            if (key.length > 0 && value.length > 0) {
                object[key] = value
            }
            return object
        }, {})
    
        if (!GET.hasOwnProperty('record')) {
            return false
        }
    
        const record = GET.record
        log('Got video: ' + record)
        
        timeMutation.observeChannelChat()
        messagesObserver.getMessagesByStream(record).then(() => {
            customEvent({isLoading: false}, 'MessagesObserver:loadingProgress')
            messagesObserver.video = record
            timeMutation.observeChannelWrapper()
        })
    }
    
    log('Старт')
    
    window.addEventListener('pushState', selectiveListener)
    window.addEventListener('replaceState', selectiveListener)
})()