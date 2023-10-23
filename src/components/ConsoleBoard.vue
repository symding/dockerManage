<script setup>
import { useSessionStore } from '../store/sessionStore'
import LogComponent from './LogComponent.vue';
import { Delete } from "@element-plus/icons"
const sessionStore = useSessionStore()
defineProps({
    consoleClients: {
        type: Array,
        default: () => []
    }
})
</script>

<template>
    <el-container style="height:100%;">
        <el-aside width="250px" style="height:100%;background-color: #dadada;padding:10px;">
            <div style="height:calc(60vh - 70px);overflow-y: auto;">
                <div v-for="item in sessionStore.sessionList" :key="item.id + item.type">
                    <el-button size="small" type="danger" @click="sessionStore.removeClient(item.id, item.type)"
                        style="right:10px;position: absolute;padding: 0px;height: 20px;width:20px;z-index: 999;top:4px;">
                        <el-icon size="12">
                            <Delete />
                        </el-icon>
                    </el-button>
                    <div class="menu-item" :class="{ 'is-active': sessionStore.isSelectedSession(item) }"
                        @click="sessionStore.setActiveSession(item)">
                        <el-tag size="small">{{ item.type }}</el-tag>
                        <el-text truncated style="font-weight: normal;margin:4px;width:100%;">
                            {{ item.name }}
                        </el-text>
                    </div>
                </div>
            </div>
        </el-aside>
        <el-main style="padding:20px;">
            <!-- <el-empty description="当前没有任何会话" v-if="sessionStore.sessionList.length == 0"></el-empty> -->
            <div v-for="item in sessionStore.sessionList " :key="item.id + item.type">
                <div v-show="sessionStore.isSelectedSession(item)">
                    <!-- <TermConsole :container-id="item.id" :client-host="item.host" v-if="item.type == 'bash'" /> -->
                    <LogComponent :id="item.id" :cli_id="item.cli_id" :type="item.type.split('.')[0]"
                        v-if="item.type.endsWith('log')" />
                    <!-- <StatChart :container-id="item.id" :client-host="item.host" v-if="item.type == 'stat'" /> -->
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<style scoped>
.menu-item {
    font-size: 10px;
    padding: 5px;
    border-radius: 3px;
    background-color: rgb(232, 232, 232);
    margin: 10px 0 0 0;
}

.menu-item:hover {
    background-color: rgb(255, 255, 255);
    cursor: pointer;
}

.menu-item:active {
    background-color: rgb(239, 239, 239);
    cursor: pointer;
}

.menu-item.is-active {
    background-color: rgb(255, 255, 255);
    cursor: pointer;
}
</style>