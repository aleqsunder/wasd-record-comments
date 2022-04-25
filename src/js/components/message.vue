<template>
  <div class="block__messages__item">
    <div class="wasd-chat-message">
      <div class="message">
        <div class="message__img">
          <img alt="" :src="message?.info?.user_avatar?.small" class="visible"/>
        </div>
        <div class="message__info">
          <div class="message__info__text">
            <div class="info__text__status">
              <div class="info__text__status__name" :style="message?.info?.color" v-text="message?.info?.user_login"/>
            </div>
            <div class="message-text">
              <span v-text="message?.info?.message"/>
              <img v-if="isSticker" alt="sticker" class="sticker small" :src="message?.info?.sticker?.sticker_image?.small">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "message",
  props: {
    message: {
      type: Object,
      default: {}
    }
  },

  computed: {
    isSticker() {
      return this.message.type === 'STICKER'
    }
  }
}
</script>