<script setup>
import { useDockerClientStore } from '../store/dockerClient'
import { useSessionStore } from '../store/sessionStore'
import { onMounted, ref, reactive } from 'vue';
import MainHeader from '../components/MainHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import ServiceTask from '../components/ServiceTask.vue';
import CreateService from '../views/CreateService.vue';

const dockerClientStore = useDockerClientStore()
const props = defineProps({
    cli_id: {
        type: String,
        required: true
    }
})
const pageHeaderInfo = {
    router: [],
    currentName: "Service"

}
const tableData = reactive([])
onMounted(async () => {
    await get_data()
})

const input = ref('')

const active_row = reactive({
    data: {}
})
const task_dialog = reactive({
    open: false
})
const scale_dialog =
    reactive({
        open: false,
        replicas: 0,
        loading: false
    })
const createService = reactive({
    dialog: false,
    config: {}
})

const open_scale_dialog = (s) => {
    active_row.data = s
    scale_dialog.open = true
    scale_dialog.replicas = s.Mode.Replicated.Replicas

}

const show_service_task = (s) => {
    active_row.data = s
    task_dialog.open = true
}

const ServiceScale = async () => {
    scale_dialog.loading = true
    await dockerClientStore.scaleService(active_row.data.Id, active_row.data.Version, scale_dialog.replicas)
    await new Promise(resolve => setTimeout(resolve, 1000))
    scale_dialog.loading = false
    scale_dialog.open = false
}

const flush_selectService = () => {
    active_row.data = {}
}
const close_scale_dialog = () => {
    scale_dialog.open = false
    flush_selectService()
}


const get_data = async () => {
    tableData.splice(0, tableData.length)
    let service_list = await dockerClientStore.serviceList()
    service_list.forEach(item => {
        tableData.push(
            item
        )
    })
}

const remove_service = async () => {
    await dockerClientStore.removeServices(select_service)
    select_service.splice(0, tableData.length)
    get_data()
}

const select_service = reactive([])
const handleSelectionChange = async (row) => {
    select_service.splice(0, tableData.length)
    row.forEach(item => {
        select_service.push(item.Id)
    })
    console.log(select_service)
}
</script>
<template>
    <div>
        <MainHeader :header-info="pageHeaderInfo" />
        <div style="margin:20px 0 10px 0">
            <el-button type="primary" style="margin-right:10px;" @click="createService.dialog = true">
                New
            </el-button>
            <el-input v-model="input" placeholder="Please input" style="width:300px;" />
            <el-button style="float:right;margin-left:5px;" @click="get_data()">Refresh</el-button>
            <el-button-group class="ml-4" style="float:right;">
                <el-button type="primary" :disabled="select_service.length == 0">Update</el-button>
                <el-button type="danger" :disabled="select_service.length == 0" @click="remove_service()">Remove</el-button>
            </el-button-group>
        </div>
        <el-table :data="tableData.filter(item => item.Name.indexOf(input) != -1)" style="width: 100%"
            max-height="calc(100vh - 170px)" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" />
            <el-table-column label="Name" width="400">
                <template #default="scope">
                    <p><el-link type="primary">{{ scope.row.Name }}</el-link></p>
                </template>
            </el-table-column>
            <el-table-column label="Stack">
                <template #default="scope">
                    <p v-if="scope.row.Stack"> {{ scope.row.Stack }}</p>
                    <p v-if="!scope.row.Stack"> - </p>
                </template>
            </el-table-column>
            <el-table-column label="Mode" width="180">
                <template #default="scope">
                    <span v-if="scope.row.Mode.Replicated != undefined" class="replica-num">
                        Replicated</span>
                    <span v-if="scope.row.Mode.Replicated == undefined" class="replica-num"> Global</span>
                    <el-link type="primary" style="float: right;" @click="show_service_task(scope.row)">Show task</el-link>
                </template>
            </el-table-column>
            <el-table-column label="Replicas" width="140">
                <template #default="scope">
                    <span v-if="scope.row.Mode.Replicated != undefined">
                        <span class="replica-num">{{ scope.row.Mode.Replicated.Replicas }}</span>
                    </span>
                    <el-link type="primary" v-if="scope.row.Mode.Replicated != undefined" style="margin-left:10px;"
                        @click="open_scale_dialog(scope.row)">Scale</el-link>
                    <p v-if="scope.row.Mode.Replicated == undefined"> -/- </p>
                </template>
            </el-table-column>
            <el-table-column label="Image" width="250">
                <template #default="scope">
                    <p>{{ scope.row.Image.split('@')[0].split('/')[2] }}</p>
                </template>
            </el-table-column>
            <!-- <el-table-column fixed="right" label="Operations" width="150">
                <template #default="scope">
                    <el-space :size="10">
                        <el-link type="primary" @click="goContainerDetail(scope.row.id)">Detail</el-link>
                        <el-link type="danger">Remove</el-link>
                    </el-space>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
    <el-dialog v-model="scale_dialog.open" :title="'Scale ' + active_row.data.Name" width="30%" @close="get_data">
        <span style="margin-right: 10px;">Service Replicas</span>
        <el-input-number v-model="scale_dialog.replicas" size="small" />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close_scale_dialog()" size="small">Cancel</el-button>
                <el-button type="primary" @click="ServiceScale()" size="small" :loading="scale_dialog.loading">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="task_dialog.open" :title="active_row.data.Name + ' task list'" width="60%" :destroy-on-close="true">
        <ServiceTask :service_id="active_row.data.Id" :cli_id="props.cli_id" :service_name="active_row.data.Name">
        </ServiceTask>
    </el-dialog>
    <el-dialog v-model="createService.dialog" title="Fast Create" width="60%" :destroy-on-close="true" @close="get_data">
        <CreateService></CreateService>
    </el-dialog>
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

.replica-num {
    background-color: #f9f2f4;
    margin-right: 3px;
    color: #c7254e;
    border-radius: 4px;
    padding: 0px 4px;
}
</style>

