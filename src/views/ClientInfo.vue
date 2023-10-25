<script setup>
import { ref, onMounted, reactive } from 'vue'
import MainHeader from '../components/MainHeader.vue'
import SwarmNode from '../components/SwarmNode.vue'
import ClientList from '../components/ClientList.vue'
import { useDockerClientStore } from '../store/dockerClient'
const docker_client = useDockerClientStore()
const active_client = docker_client.activeClient()
const props = defineProps({
    cli_id: String,
})
const header_info = {
    router: [],
    currentName: "Client DashBoard"
}

const done = ref(false)
const client_data = reactive({
    info: {}
})

onMounted(async () => {
    await getData()
    done.value = true
})

const getData = async () => {
    client_data.info = await docker_client.ClientInfo()
}

// function open_dialog

</script>

<template>
    <MainHeader :header-info="header_info" />
    <div style="margin:20px 0 20px 0;height:calc(100vh - 130px);overflow: scroll;">
        <h3 style="margin-bottom: 10px;">Environment Info</h3>
        <el-descriptions :column="1" :border="true" :v-if="done">
            <el-descriptions-item label="Name">{{ active_client.name }}</el-descriptions-item>
            <el-descriptions-item label="Url">{{ active_client.host }}</el-descriptions-item>
            <el-descriptions-item label="CPU">{{ client_data.info.NCPU }} Core</el-descriptions-item>
            <el-descriptions-item label="Memory">{{ client_data.info.MemTotal / 1024 / 1024 / 1024 }}
                GB</el-descriptions-item>
            <!-- <el-descriptions-item label="Api Version">{{ active_client.api_version }}</el-descriptions-item>
            <el-descriptions-item label="CPU">{{ active_client.cpu_core_num }} Core</el-descriptions-item>
            <el-descriptions-item label="Memory">{{ active_client.memory }} GB</el-descriptions-item>
            <el-descriptions-item label="Swarm Info">
                <el-descriptions size="small" column="1" v-if="active_client.swarm_info != null">
                    <el-descriptions-item label="Node Num">
                        <el-space :size="20">
                            <span>{{ active_client.swarm_info.node_num }}</span>
                            <el-link @click="node_dialog = true" type="primary">
                                show nodes
                            </el-link>
                        </el-space>
                    </el-descriptions-item>
                    <el-descriptions-item label="Swarm Version">{{ active_client.swarm_info.swarm_version
                    }}</el-descriptions-item>
                </el-descriptions>
                <p v-if="active_client.swarm_info == null">This Client is not an swarm node.</p>
            </el-descriptions-item> -->
        </el-descriptions>
        <div>
        </div>
        <br>
        <h3 style="margin-bottom:10px;">Node list</h3>
        <SwarmNode></SwarmNode>
    </div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}

.rs-class {
    border-left: 5px solid rgb(12, 76, 72);
    border-radius: 5px;
    padding: 5px;
    margin-right: 10px;
    background-color: #f0f0f0;
}

.rs-class:hover {
    background-color: #e0e0e0;
}
</style>
