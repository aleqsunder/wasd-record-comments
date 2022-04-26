import { GOT_CHANNEL_WRAPPER, GOT_CHAT_CONTAINER, GOT_SEEK_TIME_CONTAINER } from "./constants"
import { customEvent } from "./helpers"
import MessagesRender from "./MessagesRender"

export default class TimeMutation {
    constructor () {
        this.isAvailable = false
        this.observeChannelWrapper = this.observeChannelWrapper.bind(this)
        this.observeSeekTime = this.observeSeekTime.bind(this)
        this.timeObserve = this.timeObserve.bind(this)
        this.listen = this.listen.bind(this)
        
        document.addEventListener('TimeMutation:listen', this.listen)
    }
    
    set available(bool) {
        this.isAvailable = bool
    }
    
    listen(event) {
        switch (event.detail.type) {
            // Получаем channel-wrapper
            case GOT_CHANNEL_WRAPPER:
                this.observeSeekTime(event.detail.target)
                break
            // Получаем seek-time-container
            case GOT_SEEK_TIME_CONTAINER:
                if (this.isAvailable === false) {
                    this.isAvailable = true
                    this.timeObserve(event.detail.target)
                }
                break
        }
    }
    
    defaultObserve(type, selector, parent, observe = 'body', callback) {
        const defaultEventData = {type}
        const target = parent.querySelector(selector)
        if (target instanceof HTMLElement) {
            return customEvent({...defaultEventData, target})
        }
        
        let observer = new MutationObserver(mutationRecords => {
            for (let mutation of mutationRecords) {
                const target = mutation.target
                if (callback(observer, {...defaultEventData, target})) {
                    break
                }
            }
        })
        
        observer.observe(document.querySelector(observe), {
            childList: true,
            subtree: true
        })
    }
    
    timeObserve(parent) {
        let observer = new MutationObserver(mutationRecords => {
            const [record] = mutationRecords
            customEvent({
                currentTime: record.target.innerText
            }, 'TimeMutation:receivedCurrentTime')
        })
        
        observer.observe(parent, {
            childList: true,
            subtree: true
        })
    }
    
    observeChannelWrapper() {
        this.defaultObserve(GOT_CHANNEL_WRAPPER, '.content-wrapper__info', document, 'body', (observer, detail) => {
            if (detail.target.classList.contains('content-wrapper__info')) {
                observer.disconnect()
                customEvent(detail)
                return true
            }
        })
    }
    
    observeChannelChat() {
        this.defaultObserve(GOT_CHAT_CONTAINER, 'block__messages__item', document, 'body', (observer, detail) => {
            if (detail.target.classList.contains('block__messages__item')) {
                observer.disconnect()
                setTimeout(() => {
                    new MessagesRender()
                })
                return true
            }
        })
    }
    
    observeSeekTime(channelWrapper) {
        this.defaultObserve(GOT_SEEK_TIME_CONTAINER, '.seek-time-current', channelWrapper, '#channel-wrapper', (observer, detail) => {
            if (detail.target.classList.contains('seek-time-current')) {
                observer.disconnect()
                customEvent(detail)
                return true
            }
        })
    }
}