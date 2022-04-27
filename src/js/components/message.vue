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
              <div :class="userLoginClassList" :style="userLoginStyle" v-html="userLogin"/>
            </div>
            <div class="message-text">
              <span v-html="messageText"/>
              <img v-if="isSticker" alt="sticker" class="sticker small" :src="message?.info?.sticker?.sticker_image?.small">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CHANNEL_MODERATOR, CHANNEL_ADMIN, CHANNEL_OWNER } from "../constants"

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
    },

    nickname() {
      return document.querySelector('.user-profile__name')?.innerText
    },

    messageText() {
      if (this.nickname) {
        return this.message?.info?.message?.replace(
          `@${this.nickname}`,
          `<span class='summoned'>@${this.nickname}</span>`
        )
      }
      return this.message?.info?.message
    },

    channelRole() {
      return this.message?.info?.user_channel_role
    },

    isModerator() {
      return this.channelRole === CHANNEL_MODERATOR
    },

    isAdmin() {
      return this.channelRole === CHANNEL_ADMIN
    },

    isOwner() {
      return this.channelRole === CHANNEL_OWNER
    },

    userLoginClassList() {
      return [
        'info__text__status__name', {
          'is-moderator': this.isModerator,
          'is-admin': this.isAdmin,
          'is-owner': this.isOwner,
        }
      ]
    },

    isRoleIncluded() {
      return [CHANNEL_MODERATOR, CHANNEL_ADMIN, CHANNEL_OWNER].includes(this.channelRole)
    },

    userLoginStyle() {
      if (!this.isRoleIncluded) {
        return this.message?.info?.color
      }
      return null
    },

    userLogin() {
      let name = this.message?.info?.user_login ?? ''
      if (this.isRoleIncluded) {
        switch (this.channelRole) {
          case CHANNEL_MODERATOR:
            name = '<i class="icon wasd-icons-moderator"></i>' + name
            break
          case CHANNEL_ADMIN:
            name = '<i class="icon wasd-icons-admin"></i>' + name
            break
          case CHANNEL_OWNER:
            name = '<i class="icon wasd-icons-owner"></i>' + name
            break
        }
      }

      return name
    }
  }
}
</script>