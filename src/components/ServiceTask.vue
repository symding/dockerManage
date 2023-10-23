<template>
    <div style="height:60vh;">
        <el-table :data="table_data" size="small" style="height:calc(100% - 20px);overflow: scroll;">
            <el-table-column property="Id" label="Id" width="220" />
            <el-table-column property="Status" label="Status" width="100" :filter-method="filterHandler" :filters="[
                { text: 'running', value: 'running' },
                { text: 'shutdown', value: 'shutdown' },
                { text: 'failed', value: 'failed' },
                { text: 'orphaned', value: 'orphaned' },
                { text: 'shutdown', value: 'shutdown' },
                { text: 'complete', value: 'complete' },
            ]">
                <template #default="scope">
                    <el-tag effect="dark" :type="TaskStatus[scope.row.Status]" size="small">{{ scope.row.Status
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column property="Node" label="Node" width="220" />
            <el-table-column property="Slot" label="Slot" sortable />
            <el-table-column property="UpdateTime" label="UpdateAt" width="200" sortable>
                <template #default="scope">
                    {{ FormatTimestamp(current_timestamp - scope.row.UpdateTime) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="80">
                <template #default="scope">
                    <el-space :size="10">
                        <el-link type="primary" :key="scope.row.Status" @click="taskLog(scope.row)">Log</el-link>
                    </el-space>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { useDockerClientStore } from '../store/dockerClient'
import { onMounted, reactive } from 'vue';
import { TaskStatus, FormatTimestamp } from '../utils/common.js'
import { useSessionStore } from '../store/sessionStore'

const sessions = useSessionStore()
const props = defineProps({
    service_id: String,
    cli_id: String,
    service_name: String,
})


const table_data = reactive([])
const docker_client = useDockerClientStore()
const service = dockerClientStore.getService(props.service_id)
const current_timestamp = Date.parse(new Date()) / 1000

onMounted(async () => {
    await get_data()
})



const getData = async () => {
    table_data.splice(0, table_data.length)
    let node_list = await service.tasks()
    node_list.forEach(item => {
        table_data.push(item)
    })
}



const filterHandler = (
    value,
    row,
    column
) => {
    let property = column['property']
    return row[property] === value
}

function taskLog(row) {
    let name = `${props.service_name}.${row.Slot}`
    sessions.addClient(row.Id, name, props.cli_id, 'task.log')
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