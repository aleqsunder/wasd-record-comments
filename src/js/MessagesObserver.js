import DataReceiver from "./DataReceiver"
import { WASD_SECONDS_OFFSET } from "./constants"
import { customEvent } from "./helpers"

export default class MessagesObserver extends DataReceiver {
    constructor() {
        super()
        this.videoId = null
        this.getMessages = this.getMessages.bind(this)
        document.addEventListener('TimeMutation:receivedCurrentTime', this.getMessages)
    }
    
    set video (id) {
        this.videoId = id
    }
    
    async getMessages({detail: {currentTime}}) {
        if (this.videoId !== null) {
            let [hours, minutes, seconds] = currentTime.split(':')
            const timestamp = WASD_SECONDS_OFFSET + +seconds + +minutes * 60 + +hours * 60 * 60
            const startTime = await this.getStreamStartTime(this.videoId)
            const date = new Date(startTime)
            date.setSeconds(date.getSeconds() + timestamp)
            
            const messages = this.getMessagesBefore(date.getTime(), 50)
            customEvent({ messages }, 'MessagesObserver:last50')
        }
    }
}