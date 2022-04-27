<template>
  <template v-if="isLoading === false">
    <div class="block-wrapper">
      <TransitionGroup name="list">
        <Message v-for="message in messages" :key="message.id" :message="message"/>
      </TransitionGroup>
    </div>
  </template>
  <div class="block-wrapper__loading" v-else>
    <span class="block-wrapper__loading-title">Загрузка</span>
    <span class="block-wrapper__loading-content" v-text="loadingProgress"/>
  </div>
</template>

<script>
import Message from "./message"

export default {
  name: 'main',
  components: {
    Message
  },

  data() {
    return {
      colors: {},
      messages: [],
      isLoading: true,
      loadingProgress: 0,
    }
  },

  methods: {
    randomHex() {
      return 50 + (Math.random() * 205 ^ 0)
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
      if (this.messages?.length > 0) {
        setTimeout(() => {
          const wrap = document.querySelector('.chat-container__wrap .block-wrapper')
          if (wrap) {
            wrap.scrollTop = wrap.scrollHeight
          }
        })
      }
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
}
</script>