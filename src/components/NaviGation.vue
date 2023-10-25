<script setup>
import IconRender from '../utils/svg'
import { useRoute, useRouter } from 'vue-router'
import { useDockerClientStore } from '../store/dockerClient'

const router = useRouter()
const docker_client = useDockerClientStore()
const route = useRoute()

</script>

<template>
    <div style="width:100%;height:calc(100vh - 100px);overflow: scroll;">
        <el-link :underline="false" @click="router.push({ path: `/e/${docker_client.activeClientId}` })"
            style="color: aliceblue;line-height: 30px;height:30px;font-size: 16px;margin-top:10px;width:100%;text-align: center;padding-right:30px;">
            <IconRender :style="{ width: 20, height: 20 }" name="icon-env">
            </IconRender>
            &nbsp;{{ docker_client.activeClientId }}
        </el-link>
        <el-menu default-active="1" :router="true">
            <el-menu-item-group :title="group.name" v-for="group in docker_client.navigation">
                <el-menu-item :class="{ 'is-active': route.meta.page_type === item.page_type }" v-for="item in group.items"
                    :index="item.index" :key="item.index" :disabled="docker_client.activeClientId == undefined">
                    <span style="margin-right:10px;line-height:30px;">
                        <IconRender :style="{ width: 15, height: 15, style: 'bottom:8px;', routeName: item.index }"
                            :name="item.icon">
                        </IconRender>
                    </span>{{ item.text }}
                </el-menu-item>
            </el-menu-item-group>
        </el-menu>
    </div>
</template>

<style scoped>
.el-menu-item.is-active::before,
.el-menu-item.is-active::after {
    content: "";
    display: block;
    height: 16px;
    width: 16px;
    position: absolute;
    bottom: 0;
    background: radial-gradient(16px at 16px 0px,
            transparent 16px,
            #fff 16px);
    z-index: 2;
    right: 0;
}

.el-menu-item.is-active::before {
    bottom: calc(-1 * 16px);
    transform: scale(-1);
}

.el-menu-item.is-active::after {

    top: calc(-1 * 16px);
    transform: scaleX(-1);
}

.el-menu {
    width: 100%;
    height: 100%;
    border: 0px;

    --el-menu-text-color: #fff;
    font-weight: bolder;
    --el-menu-bg-color: #003f8c;
}

.el-menu-item.is-active {
    background-color: #fff;
    color: #003f8c;
}

.el-menu-item.is-active:hover {
    background-color: #fff;
    color: #003f8c;
}

.el-menu-item:hover {
    background-color: #c2c2c2;
    color: #02499f;

}

.el-menu-item {
    position: relative;
    height: 40px;
    line-height: 40px;
}
</style>


