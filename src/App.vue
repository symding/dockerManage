

<template>
  <div class="layout">
    <el-container>
      <el-header>
        <h2 style="font-weight: bolder;color: white;text-align: left;line-height: 60px;width: 400px;"
          @click="router.push({ path: '/' })">
          DockerManager</h2>
        <!-- <el-select v-model="value" class="m-2" placeholder="Select">
          <el-option key="item" label="item" value="item" />
        </el-select> -->
        <!-- <el-avatar shape="square" :size="40" :src="squareUrl" style="right:20px;top:10px;" /> -->
      </el-header>
      <el-container>
        <el-aside>
          <NaviGation ref="navi" propmsg="xxxx" />
          <el-badge :value="sessionStore.sessionList.length" class="session-botton">
            <el-button type="primary" @click="sessionStore.changeOpenDrawer(undefined)" style="width:100%;">Session
              List</el-button>
          </el-badge>
        </el-aside>
        <el-main>
          <RouterView v-slot="{ Component }">
            <Transition name="el-fade-in">
              <div>
                <component :is="Component" />
              </div>
            </Transition>
          </RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <el-drawer v-model="sessionStore.isDrawerOpened" direction="btt" :with-header="false" size="60%">
    <ConsoleBoard />
  </el-drawer>
  <!-- <Transition name="el-zoom-in-bottom">
    <div class="console-board" v-show="sessionStore.isDrawerOpened">
      <div class="console-header">
        <span style="margin-left:10px;color: black;font-size: 14px;font-weight: bolder;line-height: 24px;">Session
          List</span>
        <el-botton @click="sessionStore.changeOpenDrawer(false)" style="margin-right:5px;float:right;"><el-icon :size="22"
            color="#111">
            <Close />
          </el-icon>
        </el-botton>
      </div>
      <div class="console-main">
        <ConsoleBoard />
      </div>
    </div>
  </Transition> -->
</template>
<script setup>
import { RouterView } from 'vue-router'
import NaviGation from './components/NaviGation.vue'
import ConsoleBoard from './components/ConsoleBoard.vue';
import { useSessionStore } from './store/sessionStore'
import { useDockerClientStore } from './store/dockerClient'
import { onMounted } from "vue"
import { useRouter } from 'vue-router'
const router = useRouter()
const sessionStore = useSessionStore()
const clientStore = useDockerClientStore()
onMounted(async () => {
  await clientStore.getClientList()
})
</script>
<style>
html,
body {
  overflow: hidden;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
}

.el-header {
  height: 60px;
  background-color: #01224a;
}

.el-main {
  width: 100%;
  overflow: scroll;
  padding: 20px;
}

.el-aside {
  width: 250px;
  height: 100vh;
  background-color: #003f8c;
}

.layout {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}

.console-board {
  height: 60vh;
  overflow: auto;
  bottom: 0;
  width: 100vw;
  position: absolute;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  /* border-top: 1px solid rgb(192, 192, 192); */
  box-shadow: 4px var(--cb-color-shadow, rgba(0, 0, 0, 0.16));
  display: flex;
  flex-flow: column;
  z-index: 999;
}

.console-header {
  border-radius: 12px 12px 0 0;
  height: 25px;
  width: 100%;
  background-color: #bdbdbd;
}

.console-main {
  flex: 1;
  height: calc(60vh - 24px);
}

h2.title {
  color: black;
}

.el-button {
  font-weight: 600;
}

.api-message {
  line-height: 20px !important;
  padding: 8px;
}

.session-botton {
  bottom: 20px;
  left: 20px;
  width: 210px;
}

.el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}

.el-drawer__body {
  padding: 0px;
}
</style>
