<script setup lang="ts">
import { onMounted } from 'vue'
import { fabric } from 'fabric'
import { RGBADepthPacking } from 'three';
let canvas = null

// 定义所有点
const points = {
    v1:{
        x:300,
        y:100,
        text:'AP7'
    },
    v2:{
        x:400,
        y:200,
        text:'LM2' 
    },
    v3:{
        x:500,
        y:100,
        text:'AP8'
    },
    v4:{
        x:600,
        y:200, 
        text:'LM3'
    },
    v5:{
        x:700,
        y:200,
        text:'CP15'
    },
    v6:{
        x:700,
        y:300,
        text:'AP9'
    },
    v7:{
        x:600,
        y:400,
        text:'LM4'
    },
    v8:{
        x:700,
        y:400,
        text:'PP18'
    },
    v9:{
        x:500,
        y:500,
        text:'AP10'
    },
    v10:{
        x:400,
        y:400,
        text:'LM5'
    },
    v11:{
        x:300,
        y:500,
        text:'AP11' 
    },
    v12:{
        x:200,
        y:400,
        text:'LM6'
    },
    v13:{
        x:100,
        y:400,
        text:'CP16'
    },
    v14:{
        x:100,
        y:300,
        text:'AP12'
    },
    v15:{
        x:200,
        y:200,
        text:'LM1'
    },
    v16:{
        x:100,
        y:200,
        text:'PP17' 
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
    a11:['v7','v10'],
    a12:['v10','v11'],
    a13:['v10','v12'],
    a14:['v11','v12'],
    a15:['v12','v13'],
    a16:['v12','v14'],
    a17:['v12','v15'],
    a18:['v14','v15'],
    a19:['v15','v16'],
    a20:['v15','v1'],
    a21:['v15','v2'],
    a22:['v2','v4'],
}







const init = ()=>{
        canvas = new fabric.Canvas('canvas')

        
        // 创建线
        Object.keys(lines).forEach(k=>{
            const p = lines[k].map(j=>points[j])
            const line = new fabric.Line([p[0].x,p[0].y,p[1].x,p[1].y],{
                stroke: 'rgba(140, 191, 255,0.7)' ,
                strokeWidth:4,
                // shadow: new fabric.Shadow({
                //     color: 'rgb(20,20,20)', // 阴影的颜色
                //     blur: 8, // 阴影的模糊度
                //     offsetX: 3, // 阴影的水平偏移量
                //     offsetY: 3 // 阴影的垂直偏移量
                // })
            })
            canvas.add(line)
        })

        // 创建点
        Object.keys(points).forEach(item=>{
            var circle = new fabric.Circle({
                radius: 15, // 设置圆的半径
                fill: 'rgb(215, 229, 243,0.8)',
                left: points[item].x-15,
                top: points[item].y-15
            });
            canvas.add(circle)
            if(points[item].text){
                var text = new fabric.Text(points[item].text, {
                    left: points[item].x-10, // 文字的左边距（相对于画布）
                    top: points[item].y+20, // 文字的顶边距（相对于画布）
                    fontSize: 12, // 文字的字号
                    fill: 'black' // 文字的颜色
                });

                canvas.add(text);
            }
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


function zoomIn() {
  var zoom = canvas.getZoom();
  zoom = zoom + 0.1; // 增加 10% 的缩放比例
  if (zoom > 5) zoom = 5; // 设置最大缩放比例为 5
  canvas.setZoom(zoom);
}

// 缩小画布
function zoomOut() {
  var zoom = canvas.getZoom();
  zoom = zoom - 0.1; // 减少 10% 的缩放比例
  if (zoom < 0.1) zoom = 0.1; // 设置最小缩放比例为 0.1
  canvas.setZoom(zoom);
}


onMounted(() => {
  init()
})
</script>

<template>
    <div>
        <canvas width="1000" height="800" id="canvas" style="border: 1px solid #ccc;"></canvas>
        <button @click="zoomIn">放大</button>
        <button @click="zoomOut">缩小</button>
    </div>
</template>