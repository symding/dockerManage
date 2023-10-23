<script setup>
import { reactive, onMounted } from 'vue'
import { useDockerClientStore } from '../store/dockerClient'
const docker_client = useDockerClientStore()
const service_spec = reactive({
    Loading: false,
    Name: "",
    Mode: {
        Replicated: {
            Replicas: 0
        },
        Global: false,
    },
    TaskTemplate: {
        ContainerSpec: {
            Args: "", // commnd -> list
            Command: "", // entrypoint -> list
            Dir: "",
            Image: "",
            Registry: "",
            Mounts: ""
        },
        Networks: [],
        Placement: {
            Constraints: "",
        },
        Resources: {
            Limits: {
                MemoryBytes: 0
            }
        }

    }
})

const registries = [
    "registry.cn-hangzhou.aliyuncs.com",
    "registry-vpc.cn-hangzhou.aliyuncs.com",
    "registry.us-west-1.aliyuncs.com"
]

const networks = reactive([])
onMounted(async () => {
    let ns = await docker_client.networkList()
    ns.forEach(item => {
        if (item.Driver != "null") {
            networks.push(item)
        }
    })
})

function splitString(s) {
    let l = s.split(" ")
    return l.filter(i => i != "")
}

function parseMount(s) {
    let l = s.split(";")
    let result = [
    ]
    l.forEach(i => {
        let m = i.split(':')
        result.push({
            Type: "bind",
            Source: m[0],
            Target: m[1]
        })
    })
    return result
}

function parseNetwork(l) {
    let result = []
    l.forEach(n => {
        result.push({
            Target: n
        })
    })
    return result
}

async function commitServiceSpec() {
    let spec = {
        Name: service_spec.Name,
        TaskTemplate: {
            ContainerSpec: {
                Image: `${service_spec.TaskTemplate.ContainerSpec.Registry}/${service_spec.TaskTemplate.ContainerSpec.Image}`
            },
            Networks: parseNetwork(service_spec.TaskTemplate.Networks)
        }
    }
    if (service_spec.Mode.Global) {
        spec['Mode'] = {
            Global: {}
        }
    } else {
        spec['Mode'] = {
            Replicated: { Replicas: service_spec.Mode.Replicated.Replicas }
        }
    }
    if (service_spec.TaskTemplate.ContainerSpec.Dir != "") {
        spec.TaskTemplate.ContainerSpec['Dir'] = service_spec.TaskTemplate.ContainerSpec.Dir
    }
    if (service_spec.TaskTemplate.ContainerSpec.Command != "") {
        spec.TaskTemplate.ContainerSpec['Command'] = splitString(service_spec.TaskTemplate.ContainerSpec.Command)
    }
    if (service_spec.TaskTemplate.ContainerSpec.Args != "") {
        spec.TaskTemplate.ContainerSpec['Args'] = splitString(service_spec.TaskTemplate.ContainerSpec.Args)
    }
    if (service_spec.TaskTemplate.Resources.Limits.MemoryBytes > 0) {
        spec.TaskTemplate["Resources"] = { Limits: { MemoryBytes: service_spec.TaskTemplate.Resources.Limits.MemoryBytes * 1024 * 1024 } }
    }
    if (service_spec.TaskTemplate.Placement.Constraints != "") {
        spec.TaskTemplate["Placement"] = { Constraints: service_spec.TaskTemplate.Placement.Constraints.split(";") }
    }
    if (service_spec.TaskTemplate.ContainerSpec.Mounts != "") {
        spec.TaskTemplate.ContainerSpec['Mount'] = parseMount(service_spec.TaskTemplate.ContainerSpec.Mounts)
    }
    service_spec.Loading = true
    await docker_client.createService(spec)
    await new Promise(resolve => setTimeout(resolve, 1000))
    service_spec.Loading = false

}

</script>

<template>
    <div style="height:calc(60vh);padding-top:10px;">
        <el-form :inline="true" style="height:calc(60vh - 60px);overflow: scroll;" label-position="right"
            label-width="90px">
            <el-form-item label="Name" style="width:100%;">
                <el-input v-model="service_spec.Name" />
            </el-form-item>
            <el-form-item label="Image" style="width:100%;">
                <el-space size="small">
                    <el-select v-model="service_spec.TaskTemplate.ContainerSpec.Registry" placeholder="Select Registry"
                        style="width:350px;">
                        <el-option v-for="item in registries" :key="item" :label="item" :value="item" />
                    </el-select>
                    <el-input v-model="service_spec.TaskTemplate.ContainerSpec.Image" placeholder="image:latest"
                        style="width:250px;" />
                </el-space>
            </el-form-item>
            <el-form-item label="Replicated">
                <el-space :size="20">
                    <el-input-number v-model="service_spec.Mode.Replicated.Replicas" />
                    <el-checkbox v-model="service_spec.Mode.Global" border>Global</el-checkbox>
                </el-space>
            </el-form-item>
            <el-form-item label="Memory Limit (MB)" label-width="150px">
                <el-input-number v-model="service_spec.TaskTemplate.Resources.Limits.MemoryBytes" show-input />
            </el-form-item>
            <el-form-item label="Work dir" style="width:20%;">
                <el-input placeholder="/root" v-model="service_spec.TaskTemplate.ContainerSpec.Dir" />
            </el-form-item>
            <el-form-item label="Entrypoint">
                <el-input placeholder="/bin/bash" v-model="service_spec.TaskTemplate.ContainerSpec.Command" />
            </el-form-item>
            <el-form-item label="Command" style="width:100%;">
                <el-input placeholder="ls -lh" v-model="service_spec.TaskTemplate.ContainerSpec.Args" />
            </el-form-item>
            <el-form-item label="Constraints" style="width:100%;">
                <el-input v-model="service_spec.TaskTemplate.Placement.Constraints"
                    placeholder="node.role!=manager;node.labels.foo==bar;" />
            </el-form-item>
            <el-form-item label="Mounts" style="width:100%;">
                <el-input v-model="service_spec.TaskTemplate.ContainerSpec.Mounts" placeholder="/etc:/etc;/root:/root" />
            </el-form-item>
            <el-form-item label="Networks" style="width:100%;">
                <el-select v-model="service_spec.TaskTemplate.Networks" multiple placeholder="Add network"
                    style="width:100%;">
                    <el-option v-for="item in networks" :key="item.Id" :label="`${item.Name} (${item.Driver})`"
                        :value="item.Id" />
                </el-select>
            </el-form-item>
        </el-form>
        <div style="float: right;">
            <el-button type="primary" @click="commitServiceSpec()" :loading="service_spec.Loading">Commit</el-button>
            <el-button>Clear</el-button>
        </div>
    </div>
</template>

<style scoped></style>
