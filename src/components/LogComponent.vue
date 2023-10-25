<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { useSessionStore } from '../store/sessionStore'
import { useDockerClientStore } from '../store/dockerClient'

const sessions = useSessionStore()
const docker_client = useDockerClientStore()


const props = defineProps({
    id: {
        type: String,
        required: true
    },
    cli_id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    }
})

const log_string = ref('')
// const statData = reactive([
//     ["time", "Memory", "Cache", "Limit", "MemoryUsage", "Cpu", "Rx", "Tx", "Write", "Read"]
// ])

const refresh_freq = ref(10000)
const display_time = ref(false)
const search_text = ref('')
const tail = ref("100")


const searchLog = computed(() => {
    let log_line = log_string.value.split('\n')
    let hit_line = log_line.filter(item => item.includes(search_text.value))
    return hit_line.join('\n')
})


onMounted(async () => {
    while (true) {
        let full_type = props.type + '.log'
        if (!sessions.hasSession(props.id, full_type)) {
            break
        }
        if (
            refresh_freq.value == -1 ||
            ((sessions.isDrawerOpened == false ||
                sessions.isSelectedSession({ id: props.id, type: full_type }) == false) &&
                sessions.backgrounRefresh == false)
        ) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            continue
        }
        await getData()
        // percentage.value = 0
        // let x = setInterval(() => {
        //     if (percentage.value < 100) {
        //         percentage.value = percentage.value + 2
        //     }
        // }, refreshInterval.value / 50)
        await new Promise(resolve => setTimeout(resolve, refresh_freq.value))
        // clearInterval(x)
    }
}
)

function formatLog(ls) {
    let result = '\n'
    for (let i of ls.split('\n')) {
        let format_line
        if (i.startsWith('\u0002') || i.startsWith('\u0001') || i.startsWith('\u0000')) {
            format_line = i.substring(8)
        } else {
            format_line = i
        }
        let t = format_line.indexOf(' ')
        if (t != -1) {
            if (display_time.value) {
                format_line = `<font color="#f56c6c">${format_line.substring(0, t).split('.')[0].replace('T', ' ')}</font> ${format_line.substring(t + 1)}`
            } else {
                format_line = format_line.substring(t + 1)
            }
        }
        result = result + format_line + '\n'
    }
    return result
}


function computeStatMetric(stat) {
    let cache = Math.round(stat.memory_stats.stats.cache / 1024 / 1024 * 1000) / 1000
    let limit = Math.round(stat.memory_stats.limit / 1024 / 1024 * 10) / 10
    let memory = Math.round((stat.memory_stats.usage - stat.memory_stats.stats.cache) / 1024 / 1024 * 1000) / 1000
    let system_cpu_delta = stat.cpu_stats.system_cpu_usage - stat.precpu_stats.system_cpu_usage
    let cpu_delta = stat.cpu_stats.cpu_usage.total_usage - stat.precpu_stats.cpu_usage.total_usage
    let memeory_usage = Math.round(memory / limit * 10000) / 100
    let cpu_usage = Math.round(cpu_delta / system_cpu_delta * stat.cpu_stats.online_cpus * 100000) / 1000
    let rx = Math.round(stat.networks.eth0.rx_bytes / 1024 / 1024 * 1000) / 1000
    let tx = Math.round(stat.networks.eth0.tx_bytes / 1024 / 1024 * 1000) / 1000
    let read, write
    if (stat.blkio_stats.io_service_bytes_recursive == null || stat.blkio_stats.io_service_bytes_recursive.length == 0) {
        read = 0
        write = 0
    } else {
        read = Math.round(stat.blkio_stats.io_service_bytes_recursive.find(item => item.op == "Read").value / 1024 / 1024 * 1000) / 1000
        write = Math.round(stat.blkio_stats.io_service_bytes_recursive.find(item => item.op == "Write").value / 1024 / 1024 * 1000) / 1000
    }
    return [Date.parse(new Date()), memory, cache, limit, memeory_usage, cpu_usage, rx, tx, read, write]
}

async function getData() {
    let data = await docker_client.fetchLog(props.cli_id, props.id, props.type, tail.value)
    log_string.value = formatLog(data)
}
function closeClient() {
    sessions.removeClient(props.id, props.type + '.log')
}


</script>
<template>
    <div>
        <span>{{ sessions.selectedSession.name }} Log</span>
        <el-button size="small" type="text" @click="closeClient">Close</el-button>
    </div>
    <div style="height:calc(60vh - 100px);width:100%;">
        <el-form :inline="true" size="small" style="height:30px;">
            <el-form-item label="Search" size="small">
                <el-input v-model="search_text" placeholder="Search" size="small" />
            </el-form-item>
            <el-form-item label="Lines" size="small">
                <el-input v-model="tail" placeholder="Lines" size="small" />
            </el-form-item>
            <el-form-item label="Refresh Freq" size="small">
                <el-select v-model="refresh_freq" clearable placeholder="Select" size="small">
                    <el-option label="2 Seconds" :value="2000" />
                    <el-option label="5 Seconds" :value="5000" />
                    <el-option label="10 Seconds" :value="10000" />
                    <el-option label="Never" :value="-1" />
                </el-select>
            </el-form-item>
            <el-form-item size="small">
                <el-checkbox v-model="display_time" label="display time" size="small" border @change="getData()" />
            </el-form-item>
        </el-form>
        <pre style="overflow: scroll;font-size: 13px;font-weight:500;line-height:16px;border:1px solid #eaeaea;width:100%;height:100%;"
            v-html="searchLog"></pre>
    </div>
</template>