import { createApp } from 'vue'

export default class MessagesRender {
    constructor() {
        [...document.querySelectorAll('.chat-container__wrap > *')].forEach(w => w.remove())
    
        createApp({
            data() {
                return {
                    colors: {},
                    messages: [],
                    isLoading: true,
                    loadingProgress: 0,
                }
            },
        
            template: `
                <div class="block-wrapper">
                    <template v-if="isLoading === false">
                        <TransitionGroup name="list">
                        <div class="block__messages__item" v-for="message in messages" :key="message.id">
                            <div class="wasd-chat-message">
                                <div class="message">
                                    <div class="message__img">
                                        <img alt="" :src="message.info.user_avatar.small" class="visible"/>
                                    </div>
                                    <div class="message__info">
                                        <div class="message__info__text">
                                            <div class="info__text__status">
                                                <div class="info__text__status__name" :style="message.info.color" v-text="message.info.user_login"/>
                                            </div>
                                            <div class="message-text">
                                                <span v-text="message.info?.message"/>
                                                <img v-if="message.type === 'STICKER'" alt="sticker" class="sticker small" :src="message.info.sticker.sticker_image.small">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </TransitionGroup>
                    </template>
                    <div class="text-center" v-else>
                        {{ loadingProgress }}
                    </div>
                </div>
            `,
        
            methods: {
                randomHex() {
                    return Math.random() * 255 ^ 0
                },
            
                randomColor() {
                    return `color: rgb(${this.randomHex()}, ${this.randomHex()}, ${this.randomHex()})`
                },
            
                setMessages({detail: {messages}}) {
                    messages = messages.map(message => {
                        if (!this.colors.hasOwnProperty(message.info.user_id)) {
                            this.colors[message.info.user_id] = this.randomColor()
                        }
                        message.info.color = this.colors[message.info.user_id]
                        return message
                    })
                    this.messages = messages
                
                    setTimeout(() => {
                        const wrap = document.querySelector('.chat-container__wrap .block-wrapper')
                        wrap.scrollTop = wrap.scrollHeight
                    })
                },
            
                setLoading({detail}) {
                    this.isLoading = detail.isLoading
                    if (detail.loadingProgress > 0) {
                        this.loadingProgress = detail.loadingProgress
                    }
                }
            },
        
            mounted() {
                document.addEventListener('MessagesObserver:last50', this.setMessages)
                document.addEventListener('MessagesObserver:loadingProgress', this.setLoading)
            }
        }).mount('.chat-container__wrap')
    }
}