<script setup lang="ts">
import { onMounted } from 'vue'
import { fabric } from 'fabric'
import { RGBADepthPacking } from 'three';
import * as TWEEN from '@tweenjs/tween.js'
let canvas = null
const lockBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMtJREFUOE/tk0EOgjAQRWeKEg+hTVkJt8CbwEmIJ9GbwC2AlQ3xEIaYjhkiWAuabtzZ1WT652X684uwcGq1UcKYggDS4ZpIUxDkib5pLM35ug4fRmMsSmISIXMgM0MrwRAAZEFVEdGQQIhaAmCLAed/1uQ2fARoZ0rC1MYfkeq+4rrerFIUouY67/m3mI8AVjuDfA5bM+9abntDs1iUb5QOwzXwBnub5AGwz/wAA2wPOv/I0UcddHw0xHwdaGfLvy3wgdsxnUfbcYJI9AGY0ZBFSKe+rAAAAAElFTkSuQmCC"
// 定义好一些基础配置
const options = {
    width:1000,
    height:800,
    offsetDistance:10,
    lines:{
        stroke: '#409eff',
        strokeWidth:4,

        arrows:{
            show:true,
            fill: '#8a8a8a', // 填充颜色
        },
        data:[
            {line:['AP7','LM2'],v:0},
            {line:['LM2','AP8'],v:0},
            {line:['AP8','LM3'],v:0},
            {line:['LM3','CP15'],v:0},
            {line:['LM3','AP9'],v:0},
            {line:['LM3','LM4'],v:0}, 
            {line:['AP9','LM4'],v:0},
            {line:['LM4','PP18'],v:0}, 
            {line:['LM4','AP10'],v:0},
            {line:['AP10','LM5'],v:1},
            {line:['LM4','LM5'],v:0}, 
            {line:['LM5','AP11'],v:0},
            {line:['LM5','LM6'],v:0}, 
            {line:['AP11','LM6'],v:0}, 
            {line:['LM6','CP16'],v:0},
            {line:['LM6','AP12'],v:0},
            {line:['LM6','LM1'],v:0},
            {line:['AP12','LM1'],v:0},
            {line:['LM1','PP17'],v:0},
            {line:['LM1','AP7'],v:0}, 
            {line:['LM1','LM2'],v:0}, 
            {line:['LM2','LM3'],v:0},
        ]
    },
    arrows:{
        color:'',
        height: ''
    },
    points:{
        radius:8,
        background:'',
        data:[
            {
                x:300,
                y:100,
                text:'AP7'
            },
            {
                x:400,
                y:200,
                text:'LM2'
            },
            {
                x:500,
                y:100,
                text:'AP8'
            },
            {
                x:600,
                y:200,
                text:'LM3'
            },
            {
                x:700,
                y:200,
                text:'CP15'
            },
            {
                x:700,
                y:300,
                text:'AP9'
            },
            {
                x:600,
                y:400,
                text:'LM4'
            },
            {
                x:700,
                y:400,
                text:'PP18'
            },
            {
                x:500,
                y:500,
                text:'AP10'
            },
            {
                x:400,
                y:400,
                text:'LM5'
            },
            {
                x:300,
                y:500,
                text:'AP11' 
            },
            {
                x:200,
                y:400,
                text:'LM6'
            },
            {
                x:100,
                y:400,
                text:'CP16'
            },
            {
                x:100,
                y:300,
                text:'AP12'
            },
            {
                x:200,
                y:200,
                text:'LM1'
            },
            {
                x:100,
                y:200,
                text:'PP17' 
            }
        ]
    },
    inventory:{
        rx:4,
        ry:4,
        width:30,
        height:30,
        stroke: 'white', // 边框白色
        strokeWidth: 2, // 边框宽度
        data:[
            {
                id:'PS 01',
                position:[300,50],
                status:0,//锁定
                lock:true
            },
            {
                id:'PS 02',
                position:[500,50],
                status:1,//锁定
                lock:false
            },
            {
                id:'WS 01',
                position:[300,550],
                status:1,//锁定
                lock:false
            },
            {
                id:'WS 02',
                position:[500,550],
                status:1,//锁定
                lock:true
            },
            {
                id:'BUF 02',
                position:[50,300],
                status:1,//锁定
                lock:false
            },
        ]
    },
    robots:{
        width:40,
        height:32,
        background:'',
        rx:2,
        ry:2,
        arrow:{
            color:'',
            height: ''
        },
        data:[
            // {
            //     id:'01',
            //     name:'机器人1',
            //     currentPosition:[],
            //     nextPosition:[],
            //     status:1,
            //     width:40,
            //     height:32,
            //     angle:0,
            //     path:['AP7','LM2','AP8','LM3','CP15','LM3','LM4','AP10','LM5']
            // },
            // {
            //     id:'02',
            //     name:'机器人2',
            //     currentPosition:[],
            //     nextPosition:[],
            //     status:1,
            //     width:40,
            //     height:32,
            //     angle:0,
            //     path:['LM6','LM1','AP7','LM1','AP7','LM2','AP8']
            // },
        ]
    }
}


const initCanvas = ()=>{
    canvas = new fabric.StaticCanvas('canvas')
}

// 初始库存转态正方形点位
const initInventoryStatusRect = ()=>{
    const {inventory} = options
    inventory.data.forEach(item=>{
         const square = new fabric.Rect({
            left: item.position[0] - inventory.width/2,
            top: item.position[1] - inventory.height/2,
            width: inventory.width,
            height: inventory.height,
            fill: item.status === 1 ? '#00c0ff':'#ff8060',
            stroke: inventory.stroke,
            strokeWidth: inventory.strokeWidth,
            rx: inventory.rx, 
            ry: inventory.ry 
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
            left: item.position[0] - inventory.width/2,
            top: item.position[1]+20, 
            fontSize: 12,
            fill: 'black' 
        });
        canvas.add(text);
        canvas.add(square)
    })
}


const initLines = ()=>{
    const { lines,points} = options
    const pointsMap = {}
    points.data.forEach(v=>{
        pointsMap[v.text] = v
    })
    lines.data.forEach(k=>{
        const p = k.line.map(j=>pointsMap[j])
        console.log("ss",p)
        const line = new fabric.Line([p[0].x,p[0].y,p[1].x,p[1].y],{
            stroke:lines.stroke,
            strokeWidth:lines.strokeWidth,
        })
        if(lines.arrows.show){
            // 计算两点之间中点
            const n = k.line
            const p1 = pointsMap[k.line[0]]
            const p2 = pointsMap[k.line[1]]
            const center = [(p1.x + p2.x)/2,(p1.y + p2.y)/2+2]
            const v = [p2.x - p1.x,p2.y-p1.y]  // 计算两点向量
            const size = 16
            const path = k.v === 0 ? 'M0 0 L7 7 L0 14Z' : 'M8 0 L14 7 L8 14 Z M6 0 L6 14 L0 7 Z'
            const pathImg = new fabric.Path(path, {
                fill: lines.arrows.fill,
                left:center[0],
                top:center[1],
                originX:'center',
                originY:'center',
                angle:Math.atan2(v[1], v[0]) * (180 / Math.PI)
            });
            if(canvas){
                canvas.add(line)
                canvas.add(pathImg)
            }
        }
    })
}


const initPointAndText = ()=>{
    const { lines,points} = options
    const pointsMap = {}
    points.data.forEach(v=>{
        pointsMap[v.text] = v
    })
     Object.keys(pointsMap).forEach(item=>{
        let circle = new fabric.Circle({
            radius: 8,
            fill: 'rgb(215, 229, 243,1)',
            left: pointsMap[item].x-8,
            top: pointsMap[item].y-8
        });

        const PlusIcon = new fabric.Path('M7 0 L9 0 L9 16 L7 16 Z M0 7 L16 7 L16 9 L0 9 Z', {
            fill: 'blue',
            left: pointsMap[item].x-8,
            top: pointsMap[item].y-8,
        });

        
        canvas.add(circle)
        canvas.add(PlusIcon)
        if(pointsMap[item].text){
            var text = new fabric.Text(pointsMap[item].text+`(${pointsMap[item].x},${pointsMap[item].y})`, {
                left: pointsMap[item].x-10,
                top:pointsMap[item].y+10, 
                fontSize: 12,
                fill: 'black'
            });
            canvas.add(text);
        }
    })
}


const addRobot = (id,position)=>{
    const { robots } = options
    // 机器人外围圆圈
    const circle = new fabric.Circle({
        name: 'robot' + id,
        left: position[0]-30,
        top: position[1]-30,
        x:position[0],
        y:position[1],
        n:30,
        radius: 30,
        fill: 'rgba(64,158,255,0.2)',
        stroke: 'rgba(64,158,255,1)',
        strokeWidth: 1,
    })
    // 机器人长方形
    const robotRect = new fabric.Rect({
        left: position[0]- robots.width/2,
        top: position[1]- robots.height/2,
        width:robots.width,
        height: robots.height,
        fill: 'black',
        rx:4,
        ry:4
    })

    // 电池
    const powerRect = new fabric.Rect({
        left: position[0]-10,
        top:position[1]-4,
        width: 20,
        height: 6,
        fill: new fabric.Gradient({
            type:'linear',
            coords: {
                x1: 0,
                y1: 0,
                x2: 20,
                y2: 0
            },
            colorStops: [
                { offset: 0, color: 'red' }, // 渐变开始颜色
                { offset: 0.1, color: 'red' },
                { offset: 0.1, color: 'rgba(255,255,255,1)' },
                { offset: 1, color: 'rgba(255,255,255,1)' } // 渐变结束颜色
            ]

        }),
        stroke:'white',
        strokeWidth:2,
        rx:2,
        ry:2,
    })

    // const lt = []
    // const power2 = new fabric.Polygon([
    //     position[0]-10
    // ])

    const rect2 = new fabric.Path('M0 0 L20 0 L20 4 L24 4 L24 8 L20 8 L20 12 L0 12 Z', {
        fill: 'white',
        left: position[0]-10,
        top: position[1]-6,
    });
    const x0 = position[0] - 10
    const y0 = position[1] - 5
    const powerRect1 = new fabric.Rect({
        left: x0,
        top:y0,
        width: 4,
        height: 10,
        fill:'green',
    })

    const powerRect2 = new fabric.Rect({
        left: x0+5,
        top:y0,
        width: 4,
        height: 10,
        fill:'green',
    })

    const powerRect3 = new fabric.Rect({
        left: x0+10,
        top:y0,
        width: 4,
        height: 10,
        fill:'green',
    })

    const powerRect4 = new fabric.Rect({
        left: x0+15,
        top:y0,
        width: 4,
        height: 10,


        
        fill:'green',
    })

    // 机器人箭头指向
    let headerTriangle = new fabric.Polygon([
        {x:position[0]+robots.width/2+6,y:position[1]-6},
        {x:position[0]+robots.width/2+6,y:position[1]+6},
        {x:position[0]+robots.width/2+6+8,y:position[1]}
    ],{ fill:'red'})

    const group = new fabric.Group([circle,robotRect,rect2,powerRect1,powerRect2,powerRect3,powerRect4,headerTriangle], {
        groupName:id,
        originX:'center',
        originY:'center',
        selectable: false // 禁止选中组合对象
    });
    canvas.add(group)
}




const initRobots = ()=>{
    const { lines,points,robots} = options
    const pointsMap = {}
    points.data.forEach(v=>{
        pointsMap[v.text] = v
    })
    // 定义机器人
    robots.data.forEach(item=>{
            let circle = new fabric.Circle({
                name: 'robot' + item.id,
                left: pointsMap[item.current].x-30,
                top: pointsMap[item.current].y-30,
                x:pointsMap[item.current].x,
                y:pointsMap[item.current].y,
                n:30,
                radius: 30,
                fill: 'rgba(64,158,255,0.2)', // 设置为空字符串，表示不填充
                stroke: 'rgba(64,158,255,1)', // 边框颜色
                strokeWidth: 1, // 边框宽度
            });
           

            let rect1 = new fabric.Rect({
                left: pointsMap[item.current].x-item.width/2,
                top: pointsMap[item.current].y-item.height/2,
                width: item.width,
                height: item.height,
                fill: 'black',
                rx:4,
                ry:4
            })

            let rect2 = new fabric.Rect({
                left: pointsMap[item.current].x-10,
                top: pointsMap[item.current].y-10,
                width: 20,
                height: 6,
                fill: new fabric.Gradient({
                    type:'linear',
                    coords: {
                        x1: 0,
                        y1: 0,
                        x2: 20,
                        y2: 0
                    },
                    colorStops: [
                        { offset: 0, color: 'red' }, // 渐变开始颜色
                        { offset: 0.1, color: 'red' },
                        { offset: 0.1, color: 'rgba(255,255,255,1)' },
                        { offset: 1, color: 'rgba(255,255,255,1)' } // 渐变结束颜色
                    ]

                }),
                stroke:'white',
                strokeWidth:2,
                rx:2,
                ry:2,
            })

            // 绘制电池

            // 机器人箭头指向
            let headerTriangle = new fabric.Polygon([
                {x:pointsMap[item.current].x+5,y:pointsMap[item.current].y-6},
                {x:pointsMap[item.current].x+5,y:pointsMap[item.current].y+6},
                {x:pointsMap[item.current].x+5+6,y:pointsMap[item.current].y}
            ],{
                fill:'green',
            })
            const group = new fabric.Group([rect1,rect2,circle,headerTriangle], {
                groupName:item.id,
                originX:'center',
                originY:'center',
                selectable: false // 禁止选中组合对象
            });

            canvas.add(group)
            //animate()

            const aa = ()=>{
                circle.set('radius',30)
                circle.animate({
                    radius:40,
                },{
                    duration:2000,
                    onChange(v){
                        circle.set('left',group.x -v)
                        circle.set('top',group.y -v)
                        circle.set('stroke',`rgba(64,158,255,${(40-v)/30})`)
                        canvas.renderAll()
                    },
                    onComplete(){
                        
                        aa()
                    }
                })
            }
            canvas.add(circle)
            aa()
            canvas.renderAll()
            // rect.set('fill', gradient);
            // canvas.add(circle)
            // canvas.add(circle2)

        })

        
}

// 通过组名获取组
function getGroupByName(groupName) {
  const objects = canvas.getObjects();
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].type === 'group' && objects[i].groupName === groupName) {
      return objects[i];
    }
  }
  return null; // 如果找不到对应的组，返回 null
}

//'AP7','LM2','AP8','LM3','CP15','LM3','LM4','AP10','LM5'




const calcNewPosition = (pos)=>{
    // 先判断是否在点范围内
    let result = []
    const { lines,points,robots,offsetDistance} = options
    const len = points.data.length
    for(let i = 0;i<len;i++){
        const {x,y} = points.data[i]
        const r = Math.pow((pos[0] - x),2) + Math.pow((pos[0] - y),2)
        if(r < Math.pow(offsetDistance, 2)){
            result = [x,y]
            return result
        }
    }
    const len2 = lines.data.length
    for(let j = 0;j<len2;j++){

    }
    // 不在再判断是否在线段内
}





const startMove = (item,group,duration)=>{
    // 计算旋转角度
    const { lines,points,robots} = options
    const pointsMap = {}
    points.data.forEach(v=>{
        pointsMap[v.text] = v
    })
    const start = pointsMap[item.path[item.pathIndex]]
    const next = item.path[item.pathIndex+1]
    const end = next ? pointsMap[next] : null
    if(end === null){
        return false
    }
    const p1 = [start.x,start.y]
    const p2 = [end.x,end.y]
    // 计算两点向量
    const v = [p2[0] - p1[0],p2[1]-p1[1]]
    const angle = Math.atan2(v[1], v[0]) * (180 / Math.PI)
    
    group.set('angle', angle)
    group.animate({
        top:p2[1],
        left:p2[0],
    },{
        duration:2000,
        onChange(){canvas.renderAll()},
        onComplete(){
            item.pathIndex += 1
            item.current = item.path[item.pathIndex]
            startMove(item,group,1000)
            canvas.renderAll()
        }
    })
    
 
}


// 机器人移动
const robotMove = (item,group,to)=>{
    const p1 = item.currentPosition
    const p2 = to
    if(p2){
        // 计算两点向量
        const v = [p2[0] - p1[0],p2[1]-p1[1]]
        const angle = Math.atan2(v[1], v[0]) * (180 / Math.PI)
        group.animate({
            angle
        },{
            duration:500,
            onChange(){
                canvas.renderAll()
            },
            onComplete(){
                group.animate({
                    top:p2[1],
                    left:p2[0],
                },{
                    duration:2000,
                    onChange(){
                        canvas.renderAll()
                    },
                    onComplete(){
                        item.currentPosition = p2
                        canvas.renderAll()
                    }
                })
            }
        })     
    }
}



function zoomIn() {
  var zoom = canvas.getZoom();
  zoom = zoom + 0.1; // 增加 10% 的缩放比例
  if (zoom > 5) zoom = 5; // 设置最大缩放比例为 5
  setZoom(zoom)
}

// 缩小画布
function zoomOut() {
  var zoom = canvas.getZoom();
  zoom = zoom - 0.1; // 减少 10% 的缩放比例
  if (zoom < 0.1) zoom = 0.1; // 设置最小缩放比例为 0.1
  setZoom(zoom)
}



function setZoom(zoom){
    var center = canvas.getCenter();
    canvas.viewportTransform = [zoom, 0, 0, zoom, center.left * (1 - zoom), center.top * (1 - zoom)];
    canvas.requestRenderAll(); // 刷新画布
}







// 模拟数据
const mock = {
    '01':[[300,104],[350,150],[360,200],[400,200],[450,156],[500,88]],
    '02':[[100,300],[200,200],[400,200],[600,200]],
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
       

        setInterval(()=>{
            Object.keys(mock).forEach(key=>{
                // TODO 机器人可能下线
                const item = options.robots.data.find(item=>{
                    return item.id === key
                })
                // 这个机器人如果不存在的话先执行初始化机器人位置
                const p = mock[key].shift()
                if(!item){
                    options.robots.data.push({
                        id:key,
                        name:'机器人'+key,
                        currentPosition:p,
                        nextPosition:[],
                        status:1,
                        angle:0,
                        path:[]
                    })
                    addRobot(key,p)
                } else {
                    const g = getGroupByName(key)
                    robotMove(item,g,p) 
                }   
            })
        },2000)

}


onMounted(() => {
  init()
})
</script>

<template>
    <div>
        <canvas width="1000" height="800" id="canvas" style="border: 1px solid #ccc;"></canvas>
        <button class="btn btn-zoom-in" @click="zoomIn">+</button>
        <button class="btn btn-zoom-out" @click="zoomOut">-</button>
    </div>
</template>

<style>
.btn{
    background: #409eff;
    width:30px;
    height:30px;
    font-size: 18px;
    color:white;
    margin-top:8px;
}
.btn-zoom-in{
    margin-right:16px;
}
</style>