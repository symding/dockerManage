<script setup>
import { ArrowDown } from "@element-plus/icons"
import { useDockerClientStore } from '../store/dockerClient'
import { useSessionStore } from '../store/sessionStore'
import { onMounted, ref, reactive } from 'vue';
import { ContainerState } from '../utils/state'
import MainHeader from '../components/MainHeader.vue'
import { useRouter, } from 'vue-router'

const dockerClientStore = useDockerClientStore()
const sessionStore = useSessionStore()
const router = useRouter()
const props = defineProps({
    cli_id: {
        type: String,
        required: true
    }
})
const pageHeaderInfo = {
    title: "List",
    subTitle: `${dockerClientStore.clients[props.cli_id].name}'s Container List`,
    router: [],
    icon: "icon-container",
    currentName: "Container"

}
const tableData = reactive([])
onMounted(async () => {
    await reloadData()
})

const input = ref('')

const ExecCommand = (o) => {
    let c = dockerClientStore.getContainer(o.c_id)
    switch (o.operation) {
        case "exec":
            sessionStore.addClient(c.id, c.Name(), props.cli_id, "container.bash")
            break;
        case "log":
            sessionStore.addClient(c.id, c.Name(), props.cli_id, "container.log",)
            break;
        case "stat":
            sessionStore.addClient(c.id, c.Name(), props.cli_id, "container.stat")
            break;
        default:
            c.Operation(o.operation)
            break;
    }

}

const reloadData = async () => {
    tableData.splice(0, tableData.length)
    let container_list = await dockerClientStore.contianerList()
    container_list.forEach(item => {
        tableData.push(
            {
                id: item.Id,
                name: item.Names[0].split('/')[1],
                image: item.Image,
                state: item.State,
                created: new Date(item.Created * 1000).toLocaleString(),
                ipAddress: item.IpAddr,
                publishedPorts: item.Ports
            }
        )
    })
}

const containerLog = (row) => {
    sessionStore.addClient(row.id, row.name, props.cli_id, "container.log",)
}

const containerExec = (row) => {
    console.log(row)
}
</script>
<template>
    <div>
        <MainHeader :header-info="pageHeaderInfo" />
        <div style="margin:24px 0 12px 0">
            <el-button type="primary" style="margin-right:10px;">New</el-button>
            <el-input v-model="input" placeholder="Please input" style="width:300px;" />
            <el-button style="float:right;margin-left:5px;" @click="reloadData()">Refresh</el-button>
            <el-button-group class="ml-4" style="float:right;">
                <el-button type="success" disabled>Start</el-button>
                <el-button type="danger" disabled>Stop</el-button>
                <el-button type="danger" disabled>Kill</el-button>
                <el-button type="primary" disabled>Restart</el-button>
                <el-button type="primary" disabled>Pause</el-button>
                <el-button type="danger" disabled>Remove</el-button>
            </el-button-group>
        </div>
        <el-table :data="tableData.filter(item => item.name.indexOf(input) != -1)" style="width: 100%"
            max-height="calc(100vh - 150px)">
            <el-table-column type="selection" width="40" />
            <el-table-column fixed prop="name" label="Name" width="200" :show-overflow-tooltip="true">
                <template #default="scope">
                    <el-link type="primary"
                        @click="router.push({ path: `/e/${props.cli_id}/container/${scope.row.id}` })">{{
                            scope.row.name }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="Status" width="100">
                <template #default="scope">
                    <div>
                        <el-tag class="mx-1" effect="dark" :type="ContainerState[scope.row.state]">
                            {{ scope.row.state }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="image" label="Image" width="450" :show-overflow-tooltip="true" />
            <el-table-column prop="created" label="Created" width="180" />
            <el-table-column prop="ipAddress" label="Ip Addr" width="120" />
            <el-table-column prop="publishedPorts" label="Port " />
            <el-table-column fixed="right" label="Operations" width="120">
                <template #default="scope">
                    <el-space :size="16">
                        <el-link type="primary" @click="containerLog(scope.row)">Log</el-link>
                        <el-link type="primary" @click="containerExec(scope.row)">Exec</el-link>
                    </el-space>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style>
.el-button--small {
    --el-button-size: 26px;
    font-size: 14px;
}

.el-input--small {
    --el-input-height: 26px;
    font-size: 14px;
}
</style>
