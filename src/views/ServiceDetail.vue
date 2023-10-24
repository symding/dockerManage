<script setup>
import { reactive, onMounted } from 'vue'
import { useDockerClientStore } from '../store/dockerClient'
import MainHeader from '../components/MainHeader.vue'
import ServiceTask from '../components/ServiceTask.vue';

const docker_client = useDockerClientStore()
const props = defineProps({
    cli_id: String,
    service_id: String
})

const page_header = {
    router: [{ "name": "Service", "url": `/e/${props.cli_id}/service` }],
    currentName: "Service Inspect"

}

const data = reactive({
    spec: {
        Spec: {
            Name: ""
        }
    }
})
onMounted(async () => {
    let service = docker_client.getService(props.service_id)
    data.spec = await service.inspect()
})
</script>

<template>
    <MainHeader :header-info="page_header" />
    <br />
    <h4>Service Task</h4>
    <ServiceTask :service_id="props.service_id" :cli_id="props.cli_id" :service_name="data.spec.Spec.Name"></ServiceTask>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
