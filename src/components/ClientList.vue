<template>
    <div style="height:60vh;">
        <el-form :inline="true" :model="client_form" size="small">
            <el-form-item label="Name">
                <el-input v-model="client_form.name" placeholder="name" clearable style="width: 200px;" />
            </el-form-item>
            <el-form-item label="Host">
                <el-input v-model="client_form.host" placeholder="host" clearable style="width: 200px;" />
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="addClient()">+ Add</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="table_data" size="small" style="margin-bottom: 20px;" @row-click="switchClient">
            <el-table-column property="name" label="Name" />
            <el-table-column property="host" label="Host" />
        </el-table>
        <br>
    </div>
</template>

<script setup>
import { useDockerClientStore } from '../store/dockerClient'
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const docker_client = useDockerClientStore()
const table_data = reactive([])
const getData = async () => {
    table_data.splice(0, table_data.length)
    let cli_list = await docker_client.getClientList()
    cli_list.forEach(item => {
        table_data.push(item)
    })
}
const client_form = reactive({
    name: "",
    host: ""
})

const addClient = (async () => {
    await docker_client.addClient(client_form.name, client_form.host)
    await getData()
    client_form.name = ""
    client_form.host = ""
})

onMounted(async () => {
    await getData()
})


const switchClient = ((row, a, v) => {
    docker_client.setActiveClient(row.name)
    router.push({ path: `/e/${row.name}` })
})
</script>

<style scoped>
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>