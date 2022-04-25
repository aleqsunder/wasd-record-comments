import { LOG_STYLE_DEFAULT } from "./constants"

export function log(text = '...', type = "wasdleqsunder") {
    console.log(
        `%c${type}%c${text}`,
        
        `${LOG_STYLE_DEFAULT}
            background-color: #8895d3;
            color: #ffffff;
            border-top-left-radius: .3rem;
            border-bottom-left-radius: .3rem;`,
        
        `${LOG_STYLE_DEFAULT}
            background-color: #939393;
            color: #ffffff;
            border-top-right-radius: .3rem;
            border-bottom-right-radius: .3rem;`
    )
}

export function promiseTimeout(ms = 1) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function customEvent(detail, eventName = 'TimeMutation:listen') {
    const event = new CustomEvent(eventName, {detail})
    return document.dispatchEvent(event)
}

export function debounce(func, wait, immediate) {
    let timeout
    
    return function executedFunction() {
        const context = this
        const args = arguments
        const later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}