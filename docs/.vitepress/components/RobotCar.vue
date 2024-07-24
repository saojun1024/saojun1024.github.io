<script setup lang="js">
import { ref,onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as TWEEN from '@tweenjs/tween.js'
let scene = null
let camera = null
let renderer = null
let control = null

// 站点
const points = [
    {id:1,posX:0,posY:0},
    {id:2,posX:0,posY:-2},
    {id:3,posX:0,posY:-4},
    {id:4,posX:0,posY:-6},
    {id:5,posX:0,posY:-8}
]

// 雷达区
const rect = [
    {id:0,x:1,y:1,w:3,h:2,text:'hello',color:0xffa500},
    {id:1,x:-1,y:-1,w:3,h:2,text:'雷达区',color: 0x00ff00},
]




const initBasic = ()=>{
    scene = new THREE.Scene()
    const ratio = window.innerWidth / (window.innerHeight - 60)
    camera = new THREE.PerspectiveCamera(75,ratio,0.1,1000)
    camera.position.z = 3
    camera.position.x = 3
    camera.position.y = 3
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight - 60)
    const el = document.querySelector('#map-container')
    el.appendChild(renderer.domElement)


    const size = 100
    const divisions = 100

    const gridHelper = new THREE.GridHelper( size, divisions )
    scene.add( gridHelper )

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );


    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 颜色和强度
    //scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff,1,0,1); // 颜色、强度和距离
    pointLight.position.set(0, 3, 0); // 设置光源位置
    //scene.add(pointLight);
}

const initControl = ()=>{
    control = new OrbitControls(camera, renderer.domElement)
}

const initStation = () => {
    points.forEach((item)=>{
        const geometry = new THREE.BoxGeometry(1,1,1)
		const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
		const cube = new THREE.Mesh(geometry,material)
        cube.position.set(item.posX,0,item.posY)
		scene.add(cube);
    })
}

const initRect = ()=>{
    rect.forEach((item)=>{
        const rectShape = new THREE.Shape()
        rectShape.moveTo(0,0)
        rectShape.lineTo(item.w,0)
        rectShape.lineTo(item.w,item.h)
        rectShape.lineTo(0,item.h)
		
        const geometry = new THREE.ShapeGeometry(rectShape)
        const material = new THREE.MeshBasicMaterial({color: item.color })
        const mesh = new THREE.Mesh( geometry, material )
        mesh.position.set(item.x,0,0,item.y)
        scene.add(mesh)
    })
}


const init = ()=>{
    initBasic()
    initControl()
    initStation()
    initRect()
    setTimeout(()=>{
        renderer.render(scene, camera);
    },100)
    
}



onMounted(()=>{
    init()
})
</script>
<template>
<div class="robot-map" id="map-container">
    
</div>
</template>

<style>
.robot-map{
    position: fixed;
    background: black;
    left:0;
    right:0;
    top:60px;
    bottom:0;
    z-index:1000;
}

</style>