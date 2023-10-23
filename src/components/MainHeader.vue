<script setup>
defineProps({
    headerInfo: Object,
})

</script>

<template #breadcrumb>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
            homepage
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: item.url }" v-for="item in headerInfo.router" :key="item.name">
            {{ item.name }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ headerInfo.currentName }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
