<script setup>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import { onMounted } from 'vue'
import { useSessionStore } from '../store/sessionStore'

const sessionStore = useSessionStore()

const props = defineProps({
    containerId: {
        type: String,
        required: true
    },
    clientHost: {
        type: String,
        required: true
    }
})
//mounted
const socket = new WebSocket(`ws://${location.host}/ws/container_console?container_id=${props.containerId}&client_host=${props.clientHost}`)

onMounted(() => {
    if (!props.containerId) {
        return
    }

    var term = new Terminal(
        {
            allowProposedApi: true,
            fontSize: 14,
            cursorBlink: true,
            disableStdin: false,
            theme: {
                foreground: "#000", //字体
                background: "#fff", //背景色
                cursor: "#000", //设置光标,
                cursorAccent: "#000", //光标颜色
            }
        }
    );
    var fitAddon = new FitAddon()
    var attachAddon = new AttachAddon(socket)
    socket.onclose = function () {
        console.log('socket closed')
    }
    socket.onerror = function () {
        console.log('socket error')
    }
    socket.onmessage = function (e) {
        fitAddon.fit()
    }
    term.loadAddon(attachAddon)
    term.loadAddon(fitAddon)
    term.open(document.getElementById(props.containerId))
    fitAddon.activate(term)
    fitAddon.fit()
    term.focus()
    window.onresize = function () { // 窗口尺寸变化时，终端尺寸自适应
        fitAddon.fit()
    }
}
)

function closeClient() {
    socket.close()
    sessionStore.removeClient(props.containerId, 'bash')
}
</script>
<template>
    <div>
        <span>Exec Container</span><el-button size="small" type="text" @click="closeClient">Close</el-button>
    </div>
    <div :id="containerId" style="height:100%;wdith:100%"></div>
</template>