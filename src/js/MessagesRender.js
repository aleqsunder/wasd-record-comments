import { createApp } from 'vue'
import main from "./components/main"

export default class MessagesRender {
    constructor() {
        [...document.querySelectorAll('.chat-container__wrap > *')].forEach(w => w.remove())
        createApp(main).mount('.chat-container__wrap')
    }
}