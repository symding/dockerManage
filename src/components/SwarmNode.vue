<template>
    <div style="height:60vh;">
        <el-button type="danger" size="small">Remove</el-button>
        <el-button size="small" style="float:right;margin-left:5px;" @click="getData()">Refresh</el-button>
        <el-table :data="table_data" size="small" style="height:calc(100% - 30px);overflow: scroll;">
            <el-table-column type="selection" width="30" />
            <el-table-column property="Name" label="Name" width="220" sortable />
            <el-table-column property="Role" label="Role" width="100" sortable />
            <el-table-column property="Cpu" label="CPU" sortable />
            <el-table-column property="Memory" label="Memory" width="100" sortable />
            <el-table-column property="Addr" label="IP Addr" sortable width="120" />
            <el-table-column property="Status" label="Status" width="100" :filters="[
                { text: 'ready', value: 'ready' },
                { text: 'dawn', value: 'dawn' },
            ]" />
            <el-table-column property="Availability" label="Availability" width="100" />
        </el-table>
    </div>
</template>

<script setup>
import { useDockerClientStore } from '../store/dockerClient'
import { onMounted, reactive } from 'vue';

const table_data = reactive([])
const docker_client = useDockerClientStore()

onMounted(async () => {
    await getData()
})

const getData = async () => {
    table_data.splice(0, table_data.length)
    let node_list = await docker_client.nodeList()
    node_list.forEach(item => {
        table_data.push(item)
    })
}

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