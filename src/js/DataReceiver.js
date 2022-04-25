import { customEvent, log, promiseTimeout } from "./helpers"

export default class DataReceiver {
    constructor() {
        this.streamId = null
        this.start = null
        this.api = 'https://wasd.tv/api/'
        this.mediaDataResultCache = null
        this.limit = 500
        this.messagesList = []
        this.isAvailable = true
        
        this.getStreamID = this.getStreamID.bind(this)
        this.getMessagesByStream = this.getMessagesByStream.bind(this)
        this.receiveMessages = this.receiveMessages.bind(this)
        this.getMessagesByOffset = this.getMessagesByOffset.bind(this)
        this.sortMessagesList = this.sortMessagesList.bind(this)
    }
    
    async getStreamData(videoID) {
        if (this.mediaDataResultCache === null) {
            const mediaStreamData = await fetch(`${this.api}v2/media-containers/${videoID}`)
            const mediaContainerStreamData = await mediaStreamData.json()
            const mediaDataResult = mediaContainerStreamData?.result
            if (mediaDataResult) {
                this.mediaDataResultCache = mediaDataResult
                return mediaDataResult
            }
            return false
        }
        return this.mediaDataResultCache
    }
    
    async getStreamID(videoID) {
        const streamData = await this.getStreamData(videoID)
        if (streamData) {
            const [container] = streamData?.media_container_streams
            const {stream_id} = container
            this.streamId = stream_id
            return true
        }
        return false
    }
    
    async getStreamStartTime(videoID) {
        const streamData = await this.getStreamData(videoID)
        if (streamData) {
            this.start = streamData?.published_at
            return this.start
        }
        return false
    }
    
    async getMessagesByStream(videoID) {
        this.messagesList = []
        
        if (await this.getStreamID(videoID)) {
            await this.receiveMessages()
            return this.sortMessagesList()
        }
        
        return []
    }
    
    sortMessagesList() {
        this.messagesList = this.messagesList
            .sort((a, b) => new Date(a.info.date_time).getTime() - new Date(b.info.date_time).getTime())
    }
    
    async receiveMessages(offset = 0) {
        const result = await this.getMessagesByOffset(offset)
        log(offset, 'Offset')
        customEvent({isLoading: true, loadingProgress: offset}, 'MessagesObserver:loadingProgress')
        
        if (result.length > 0 && this.isAvailable === true) {
            this.messagesList = [
                ...this.messagesList,
                ...result
            ]
            
            await promiseTimeout()
            await this.receiveMessages(offset + this.limit)
        }
    }
    
    async getMessagesByOffset(offset = 0) {
        const mediaStreamData = await fetch(`${this.api}chat/streams/${this.streamId}/messages?limit=${this.limit}&offset=${offset}`)
        const mediaContainerStreamData = await mediaStreamData.json()
        const mediaDataResult = mediaContainerStreamData?.result
        
        if (mediaDataResult && mediaDataResult.length > 0) {
            return mediaDataResult
        }
        
        return false
    }
    
    getMessagesBefore(lastDate, limit = 50) {
        const to = this.messagesList.findIndex(item => (new Date(item.date_time)).getTime() > lastDate)
        if (to >= 0) {
            const from = to - limit > 0 ? to - limit : 0
            return this.messagesList.slice(from, to)
        }
        return []
    }
}