<script setup lang="ts">
import { onMounted } from 'vue'
import { fabric } from 'fabric'


// 定义所有点
const points = {
    v1:{
        x:300,
        y:100,
    },
    v2:{
        x:400,
        y:200, 
    },
    v3:{
        x:500,
        y:100, 
    },
    v4:{
        x:600,
        y:200, 
    },
    v5:{
        x:700,
        y:200, 
    },
    v6:{
        x:700,
        y:300,
    },
    v7:{
        x:600,
        y:400,
    },
    v8:{
        x:700,
        y:400,
    },
    v9:{
        x:500,
        y:500
    },
    v10:{
        x:400,
        y:400
    }
}

const lines = {
    a1:['v1','v2'],
    a2:['v2','v3'],
    a3:['v3','v4'],
    a4:['v4','v5'],
    a5:['v4','v6'],
    a6:['v4','v7'],
    a7:['v6','v7'],
    a8:['v7','v8'],
    a9:['v7','v9'],
    a10:['v9','v10'],
    a11:['v7','v10']
}







const init = ()=>{
        const canvas = new fabric.Canvas('canvas')

        

        Object.keys(lines).forEach(k=>{
            const p = lines[k].map(j=>points[j])
            const line = new fabric.Line([p[0].x,p[0].y,p[1].x,p[1].y],{stroke: '#27ABE1',strokeWidth:2})
            canvas.add(line)
        })

        const rect = new fabric.Rect({
            top: 30, // 距离容器顶部 30px
            left: 30, // 距离容器左侧 30px
            width: 100, // 宽 100px
            height: 60, // 高 60px
            fill: 'green' // 填充 红色
        })


        canvas.add(rect)

        // setTimeout(()=>{
            
        // canvas.setZoom(2.0);
        // canvas.renderAll();
        // },4000)
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