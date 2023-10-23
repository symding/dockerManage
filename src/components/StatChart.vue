<script setup>
import { onMounted, watch } from 'vue'
import * as echarts from "echarts";
const ChartMap = {
    memory: ["Memory", "Cache",],
    cpu: ["Cpu", "MemoryUsage"],
    network: ["Rx", "Tx"],
    io: ["Write", "Read"]
}
const props = defineProps({
    chartData: {
        type: Array,
        default: () => [],
    },
    containerId: {
        type: String,
        required: true
    },
})
onMounted(() => {
    let chart = {}
    for (let chartName in ChartMap) {
        let cols = ChartMap[chartName]
        chart[chartName] = echarts.init(document.getElementById(`${chartName}-${props.containerId}`, "purple-passion"))
        chart[chartName].setOption(getChartOption(cols))
        chart[chartName].group = "stat"
    }
    echarts.connect('stat');
    watch(
        props.chartData,
        (newValue, _) => {
            for (let chartName in ChartMap) {
                chart[chartName].setOption({
                    dataset: {
                        source: newValue
                    }
                })
            }
        },
        { immediate: true }
    );
})




function getChartOption(cols) {
    let option = {
        xAxis: {
            type: 'time',
            splitNumber: 4
        },
        yAxis: {
            type: 'value',
            splitNumber: 4
        },
        series: [],
        tooltip: {
            position: [0, 0],
            trigger: "axis",
            textStyle: {
                fontSize: 10,
                lineHeight: 12
            }
        }
    }
    cols.forEach(
        col => option.series.push({
            name: col,
            encode: {
                // 将 "amount" 列映射到 X 轴。
                x: 'time',
                // 将 "product" 列映射到 Y 轴。
                y: col
            },
            type: "line",
            symbol: "circle",
            symbolSize: 5,
            areaStyle: {},
            label: {
                //显示最后一个点的值
                show: true,
                position: "bottom",
                align: "right",
                formatter: function (params) {
                    let t = params.value[0]
                    let max_t = props.chartData[props.chartData.length - 1][0]
                    let c
                    if (t != max_t) {
                        return ""
                    } else {
                        c = params.dimensionNames.indexOf(col)
                        return `${col}: ${params.value[c]} ${col == "Cpu" || col == "MemoryUsage" ? "%" : "Mb"}`
                    }
                }
            }
        })
    )
    return option
}
</script>

<template>
    <div style="width: 100%;">
        <el-row :gutter="20" style="height: 100%;margin:0px;">
            <!-- <el-col :span="6" style="height: 100%;">
                <p style="font-size: 14px;line-height: 20px;">{{ chartName }}</p>
                <p style="font-size: 26px;font-weight: bolder;">1024</p>
            </el-col> -->
            <el-col :span="24" style="height: 100%;">
                <div style="width:100%;height:90px;border: 1px;margin-bottom:10px;" :id="`${k}-${containerId}`"
                    v-for="(_, k) in ChartMap" :key="k"></div>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>