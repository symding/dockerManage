<script setup>
import { ref } from 'vue'
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
const node_dialog = ref(false)
const client_dialog = ref(false)
const getData = () => {
    console.log("xxx")
}

// function open_dialog

</script>

<template>
    <MainHeader :header-info="header_info" />
    <div style="margin:20px 0 20px 0;height:calc(100vh - 130px);overflow: scroll;">
        <!-- <h3 style="margin-bottom: 10px;">Resource stat</h3>
        <el-row>
            <el-col :span="3" class="rs-class" @click="router.push({ path: `/e/${props.cli_id}/container` })">
                <el-statistic :value="dockerClientStore.activeClient().containers.length">
                    <template #title>
                        <div style="display: inline-flex; align-items: center">
                            <strong>Container</strong>
                        </div>
                    </template>
                </el-statistic>
            </el-col>
            <el-col :span="3" class="rs-class" @click="router.push({ path: `/e/${props.cli_id}/service` })">
                <el-statistic :value="dockerClientStore.activeClient().services.length">
                    <template #title>
                        <div style="display: inline-flex; align-items: center">
                            <strong>Service</strong>
                        </div>
                    </template>
                </el-statistic>
            </el-col>
        </el-row>
        <br> -->
        <h3 style="margin-bottom: 10px;">Environment Info</h3>
        <el-descriptions :column="1" :border="true" size="small">
            <el-descriptions-item label="Name">{{ active_client.name }}</el-descriptions-item>
            <el-descriptions-item label="Url">{{ active_client.host }}</el-descriptions-item>
            <el-descriptions-item label="Api Version">{{ active_client.api_version }}</el-descriptions-item>
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
            </el-descriptions-item>
        </el-descriptions>
        <div>
        </div>
        <br>
        <el-button type="primary" @click="client_dialog = true"> Switch Client</el-button>
    </div>
    <el-dialog v-model="node_dialog" title="Node List" width="60%" :destroy-on-close="true">
        <SwarmNode></SwarmNode>
    </el-dialog>
    <el-dialog v-model="client_dialog" title="Switch Client" width="60%" :destroy-on-close="true" @close="getData">
        <ClientList></ClientList>
    </el-dialog>
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
