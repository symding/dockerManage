<script setup>
import { reactive, onMounted } from 'vue'
import { useDockerClientStore } from '../store/dockerClient'
import MainHeader from '../components/MainHeader.vue'

const docker_client = useDockerClientStore()
const props = defineProps({
    cli_id: String,
    container_id: String
})

const container = docker_client.getContainer(props.container_id)
const data = reactive({
    containerInfo: {
        Id: "",
        Name: "",
        State: {
            Status: ""
        },
        Config: {
            Image: ""
        }
    }
})
const header_info = {
    title: "Detail",
    subTitle: "Container Detail",
    router: [],
    icon: "icon-container",
    currentName: "Detail"

}
onMounted(async () => {
    data.containerInfo = await container.Inspect()
})
</script>

<template>
    <MainHeader :header-info="header_info" />
    <div style="margin:20px 0 10px 0;height:calc(100vh - 130px);overflow: scroll;">
        <el-button-group class="ml-5" size="small" style="margin-bottom:20px;">
            <el-button type="success">Start</el-button>
            <el-button type="danger">Stop</el-button>
            <el-button type="danger">Kill</el-button>
            <el-button type="primary">Restart</el-button>
            <el-button type="primary">Pause</el-button>
            <el-button type="danger">Remove</el-button>
        </el-button-group>
        <el-descriptions title="Container Info" column="1" :border="true">
            <el-descriptions-item label="Id">{{ data.containerInfo.Id }}</el-descriptions-item>
            <el-descriptions-item label="Name">{{ data.containerInfo.Name }}</el-descriptions-item>
            <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
            <el-descriptions-item label="Status">{{ data.containerInfo.State.Status }}</el-descriptions-item>
            <el-descriptions-item label="Created">{{ data.containerInfo.Created }}</el-descriptions-item>
            <el-descriptions-item label="StartedAt">{{ data.containerInfo.State.StartedAt }}</el-descriptions-item>
            <el-descriptions-item label="Operation">
                <el-button type="text" size="small">Logstat</el-button>
                <el-button type="text" size="small">Console</el-button>
                <el-button type="text" size="small" disabled>Expand to service</el-button>
                <el-button type="text" size="small" disabled>Export as compose.yml</el-button>
            </el-descriptions-item>
        </el-descriptions>
        <br />
        <el-descriptions title="Container Config" column="1" :border="true">
            <el-descriptions-item label="Image">{{ data.containerInfo.Config.Image }}</el-descriptions-item>
            <el-descriptions-item label="CMD">{{ data.containerInfo.Config.Cmd }}</el-descriptions-item>
            <el-descriptions-item label="EntryPoint">{{ data.containerInfo.Config.Entrypoint }}</el-descriptions-item>
            <el-descriptions-item label="Env">
                <el-descriptions column="1" size="small">
                    <el-descriptions-item v-for="item in data.containerInfo.Config.Env" :label="item.split('=')[0]"
                        :key="item">{{ item.split('=')[1] }}</el-descriptions-item>
                </el-descriptions>
            </el-descriptions-item>
            <el-descriptions-item label="Labels">
                <el-descriptions column="1" size="small">
                    <el-descriptions-item v-for="(value, key) in data.containerInfo.Config.Labels" :label="key"
                        :key="key">{{ value }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
