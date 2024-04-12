<script setup lang="ts">
import { onMounted } from 'vue'
import { fabric } from 'fabric'

const init = ()=>{
        const canvas = new fabric.Canvas('canvas')
        const line = new fabric.Line(
            [
            10, 10, // 起始点坐标
            200, 300 // 结束点坐标
            ],
            {
            stroke: 'red', // 笔触颜色
            }
        )
        canvas.add(line)
}

onMounted(() => {
  init()
})
</script>

<template>
    <div>
        <canvas width="1000" height="800" id="canvas" style="border: 1px solid #ccc;"></canvas>
    </div>
</template>