<script setup lang="ts">
import { onMounted } from 'vue'
import { fabric } from 'fabric'
import { RGBADepthPacking } from 'three';
let canvas = null
const lockBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMtJREFUOE/tk0EOgjAQRWeKEg+hTVkJt8CbwEmIJ9GbwC2AlQ3xEIaYjhkiWAuabtzZ1WT652X684uwcGq1UcKYggDS4ZpIUxDkib5pV45ug4fRmMsSmISIXMgM0MrwRAAZEFVEdGQQIhaAmCLAed/1uQ2fARoZ0rC1MYfkeq+4rrerFIUouY67/m3mI8AVjuDfA5bM+9abntDs1iUb5QOwzXwBnub5AGwz/wAA2wPOv/I0UcddHw0xHwdaGfLvy3wgdsxnUfbcYJI9AGY0ZBFSKe+rAAAAAElFTkSuQmCC"
const triangleBase64 ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAATRJREFUOE+N009LhEAUAPD3Rr1YVGxUVBT1daRv4/+bF/8h6l78St0Kii0oKNioaKOoDl7U0RCWMEdXvfnezG9m3sxDaH1BEKwBwKmqqrN2rusf28EkSdbTNJ0h4tkYhAEsy9oQRfEHAOZjEAbwPG+TEPK93NkgwgBxHG/lef7VONpKhAGiKJoURfHZqk0vwgCO42zzPP/RUfFOpAvY4Xn+vecKGYQBgiDYrapq0XnniBcAIKmq+rcAA0yn070sy97aACJelWUp6br+2swxgG3b+4Ig/BsEADf1ZMMwnhi4HfB9/wARXxrxO0qpZJrm46inHEXRYVEUz8vBDxzHSbIs3/f1BXOEMAyPKKX1VueEEElRlNtVTdX1lI8JIeeIWFf7eqgjGcB13ROO4yaapl0OTa7zv5xVeBG36HZ2AAAAAElFTkSuQmCC"
// 定义好一些基础配置
const options = {
    lineColor:'',
    dotRadius:10,

}


const inventoryStatusRect = [
    {
        id:'PS 01',
        size:30,
        position:[300,50],
        status:0,//锁定
        lock:true
    },
    {
        id:'PS 02',
        position:[500,50],
        size:30,
        status:1,//锁定
        lock:false
    },
    {
        id:'WS 01',
        position:[300,550],
        size:30,
        status:1,//锁定
        lock:false
    },
    {
        id:'WS 02',
        position:[500,550],
        size:30,
        status:1,//锁定
        lock:true
    },
    {
        id:'BUF 02',
        position:[50,300],
        size:30,
        status:1,//锁定
        lock:false
    },
]


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
    a1:{line:['v1','v2'],v:0},
    a2:{line:['v2','v3'],v:0},
    a3:{line:['v3','v4'],v:0},
    a4:{line:['v4','v5'],v:0},
    a5:{line:['v4','v6'],v:0},
    a6:{line:['v4','v7'],v:0}, 
    a7:{line:['v6','v7'],v:0},
    a8:{line:['v7','v8'],v:0}, 
    a9:{line:['v7','v9'],v:0},
    a10:{line:['v9','v10'],v:1},
    a11:{line:['v7','v10'],v:0}, 
    a12:{line:['v10','v11'],v:0},
    a13:{line:['v10','v12'],v:0}, 
    a14:{line:['v11','v12'],v:0}, 
    a15:{line:['v12','v13'],v:0},
    a16:{line:['v12','v14'],v:0},
    a17:{line:['v12','v15'],v:0},
    a18:{line:['v14','v15'],v:0},
    a19:{line:['v15','v16'],v:0},
    a20:{line:['v15','v1'],v:0}, 
    a21:{line:['v15','v2'],v:0}, 
    a22:{line:['v2','v4'],v:0},
}



const robits = [
    {
        id:'01',
        current:'v1',
        status:1,
        width:40,
        height:20,
        pathIndex:0,
        angle:0,
        path:['v1','v2','v3','v4','v5']
    },
    {
        id:'02',
        current:'v12',
        status:1,
        width:40,
        height:20,
        pathIndex:0,
        angle:0,
        path:['v1','v2','v3','v4','v5']
    }
]

const initCanvas = ()=>{
    canvas = new fabric.StaticCanvas('canvas')
}

// 初始库存转态正方形点位
const initInventoryStatusRect = ()=>{
    inventoryStatusRect.forEach(item=>{
         const square = new fabric.Rect({
            left: item.position[0] - item.size/2,
            top: item.position[1] - item.size/2,
            width: item.size,
            height: item.size,
            fill: item.status === 1 ? '#00c0ff':'#ff8060', // 填充蓝色
            stroke: 'white', // 边框白色
            strokeWidth: 2, // 边框宽度
            rx: 4, // 圆角半径
            ry: 4 // 圆角半径
        })
        if(item.lock === true){
            fabric.Image.fromURL(lockBase64,(img)=>{
                img.set({
                    left:item.position[0]-7,
                    top:item.position[1]-7
                })
                canvas.add(img)
            })
        }
        let text = new fabric.Text(item.id, {
            left: item.position[0] - item.size/2, // 文字的左边距（相对于画布）
            top: item.position[1]+20, // 文字的顶边距（相对于画布）
            fontSize: 12, // 文字的字号
            fill: 'black' // 文字的颜色
        });
        canvas.add(text);
        canvas.add(square)
    })
}


const initLines = ()=>{
    Object.keys(lines).forEach(k=>{
        const p = lines[k].line.map(j=>points[j])
        const line = new fabric.Line([p[0].x,p[0].y,p[1].x,p[1].y],{
            stroke: '#409eff',
            strokeWidth:4,
            shadow: new fabric.Shadow({
                color: 'rgb(100,100,100)', // 阴影的颜色
                blur: 8, // 阴影的模糊度
                offsetX: 3, // 阴影的水平偏移量
                offsetY: 3 // 阴影的垂直偏移量
            })
        })
        canvas.add(line)
        // 绘制箭头
        // 计算两点之间中点
        const n = lines[k].line
        const p1 = points[lines[k].line[0]]
        const p2 = points[lines[k].line[1]]
        const center = [(p1.x + p2.x)/2,(p1.y + p2.y)/2+2]
        // const dx = p2[0] - p1[0];
        // const dy = p2[1] - p1[1];
        // const normalVector = [-dy, dx]
        // const length = Math.sqrt(normalVector[0] * normalVector[0] + normalVector[1] * normalVector[1]);
        // // 将法向量标准化为单位向量
        // const unitNormalVector = [normalVector[0] / length, normalVector[1] / length];
        // const v1 = [center[0] - p1[0] +8*unitNormalVector[0] ,center[1] - p1[1] + 8*unitNormalVector[1]]

        // const v2 = [center[0] - p1[0] -8*unitNormalVector[0] ,center[1] - p1[1] - 8*unitNormalVector[1]]
        // // 计算两点向量
        const v = [p2.x - p1.x,p2.y-p1.y]
        const size = 16
        var square = new fabric.Rect({
            left: center[0]-size, // 左上角横坐标
            top: center[1]-size, // 左上角纵坐标
            width: size*2, // 正方形宽度
            height: size*2, // 正方形高度
            fill: 'red' // 填充颜色
        })

        const path = lines[k].v === 0 ? 'M0 0 L7 7 L0 14Z' : 'M8 0 L14 7 L8 14 Z M6 0 L6 14 L0 7 Z'

        var pathImg = new fabric.Path(path, {
            fill: '#8a8a8a', // 填充颜色
            left:center[0],
            top:center[1],
            originX:'center',
            originY:'center',
            angle:Math.atan2(v[1], v[0]) * (180 / Math.PI)
        });
        canvas.add(pathImg)
    })
}


const initPointAndText = ()=>{
     Object.keys(points).forEach(item=>{
        let circle = new fabric.Circle({
            radius: 8, // 设置圆的半径
            fill: 'rgb(215, 229, 243,1)',
            left: points[item].x-8,
            top: points[item].y-8
        });
        canvas.add(circle)
        if(points[item].text){
            var text = new fabric.Text(points[item].text, {
                left: points[item].x-10, // 文字的左边距（相对于画布）
                top: points[item].y+10, // 文字的顶边距（相对于画布）
                fontSize: 12, // 文字的字号
                fill: 'black' // 文字的颜色
            });
            canvas.add(text);
        }
    })
}

let circle
let circle2

const initRobots = ()=>{

        // 定义机器人
       robits.forEach(item=>{
            

            let rect1 = new fabric.Rect({
                left: points[item.current].x-item.width/2,
                top: points[item.current].y-item.height/2,
                width: item.width/2,
                height: item.height,
                fill: 'purple'
            })

            let rect2 = new fabric.Rect({
                left: points[item.current].x,
                top: points[item.current].y-item.height/2,
                width: item.width/2,
                height: item.height,
                fill: 'green'
            })

            // 机器人箭头指向
            let headerTriangle = new fabric.Polygon([
                {x:points[item.current].x+5,y:points[item.current].y-6},
                {x:points[item.current].x+5,y:points[item.current].y+6},
                {x:points[item.current].x+5+6,y:points[item.current].y}
            ],{
                fill:'red',
            })

            const group = new fabric.Group([rect1, rect2,headerTriangle], {
                groupName:item.id,
                originX:'center',
                originY:'center',
                selectable: false // 禁止选中组合对象
            });

            canvas.add(group)

            // circle = new fabric.Circle({
            //     left: points[item.current].x-30,
            //     top: points[item.current].y-30,
            //     x:points[item.current].x,
            //     y:points[item.current].y,
            //     n:30,
            //     radius: 30,
            //     fill: '', // 设置为空字符串，表示不填充
            //     stroke: '#409eff', // 边框颜色
            //     strokeWidth: 2 // 边框宽度
            // });

            // circle2 = new fabric.Circle({
            //     left: points[item.current].x-60,
            //     top: points[item.current].y-60,
            //     x:points[item.current].x,
            //     y:points[item.current].y,
            //     radius: 60,
            //     n:60,
            //     fill: '', // 设置为空字符串，表示不填充
            //     stroke: 'orange', // 边框颜色
            //     strokeWidth: 2 // 边框宽度
            // });

            // rect.set('fill', gradient);
            // canvas.add(circle)
            // canvas.add(circle2)

        })
}

// 通过组名获取组
function getGroupByName(groupName) {
    debugger
  var objects = canvas.getObjects();
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].type === 'group' && objects[i].groupName === groupName) {
      return objects[i];
    }
  }
  return null; // 如果找不到对应的组，返回 null
}

const init = ()=>{
        // 初始化画布
        initCanvas()
        // 初始化库存信息
        initInventoryStatusRect()
        // 初始化线条
        initLines()
        // 初始化点位以及文字描述
        initPointAndText()
        // 初始化机器人对象
        initRobots()

        // 绘制机器人
     

   // 动画函数
    function animateRadius() {
      // 定义动画参数
      var startRadius = 1;
      var endRadius = 10;
      var duration = 2000; // 动画持续时间，单位毫秒

      // 创建动画
      fabric.util.animate({
        startValue: startRadius,
        endValue: endRadius,
        duration: duration,
        easing: fabric.util.ease.easeInOut,
        onChange: function(value) {
          // 在动画过程中更新圆的半径
          const r1 = value+circle.get('n')
          const r2 = value+circle2.get('n')
          circle.set('radius', r1);
          circle.set('left', circle.get('x')-r1);
          circle.set('top', circle.get('y')-r1);

          circle2.set('radius', r2);
          circle2.set('left', circle2.get('x')-r2);
          circle2.set('top', circle2.get('y')-r2);
          // 重新绘制画布
          canvas.renderAll();
        },
        onComplete: function() {
          // 动画完成后，反转动画参数并重新开始动画
          var temp = startRadius;
          startRadius = endRadius;
          endRadius = temp;
          animateRadius();
        }
      });
    }

    // 启动动画
    animateRadius();


        // setTimeout(()=>{
            
        // canvas.setZoom(2.0);
        // canvas.renderAll();
        // },4000)

    setTimeout(()=>{
        const g = getGroupByName('01')

        startMove(
            g,
            0,
            [points['v1'].x,points['v1'].y],
            [points['v2'].x,points['v2'].y],
            1000
        )
    },3000)
}




const startMove = (group,currentAngle,currentPosition,nextPosition,duration)=>{
    // 计算旋转角度
    const p1 = currentPosition
    const p2 = nextPosition
    // 计算两点向量
    const v = [p2[0] - p1[0],p2[1]-p1[1]]
    const angle = Math.atan2(v[1], v[0]) * (180 / Math.PI)
    group.set('angle', angle)
    canvas.renderAll()
    group.animate({
        top:p2[1],
        left:p2[0],
    },{
        duration:2000,
        onChange(){
            canvas.renderAll()
        }
    })
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