<script setup lang="ts">
import { ref,onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let scene:any = null
let camera:any = null
let renderer:any = null
let control:any = null
let earthPoints:any = null
let moon = null
const ALL_IMGS = [
    {
        url:'./assets/img/earth.jpg',
        data:null,
        width:0,
        height:0
    },
    {
        url:'./assets/img/glow.png',
        data:null,
        width:0,
        height:0
    }
]




let imageData = {
    width:0,
    height:0,
    data:null
}

function getPosColor(x,y){
  const sum = (imageData.width*y) - (imageData.width -x) - 1
  return imageData.data[sum*4]
}


function isLandByUV(c:number, f:number) {
  let n:any = parseInt(`${ALL_IMGS[0].width * c}`) // 根据横纵百分比计算图象坐标系中的坐标
  let o = parseInt(`${ALL_IMGS[0].height * f}`) // 根据横纵百分比计算图象坐标系中的坐标
  return 1 >= ALL_IMGS[0].data.data[4 * (o * ALL_IMGS[0].width + n)] // 查找底图中对应像素点的rgba值并判断
}

// 加载图片
const loadAllImage = ()=> {
    const promises = ALL_IMGS.map((item)=>{
        return new Promise((resolve)=>{
            const img = new Image()
            img.src = item.url
            img.onload = function(e){
                const canvas = document.createElement("canvas")
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img,0,0,img.width,img.height)
                imageData = ctx.getImageData(0,0,img.width,img.height)
                resolve({
                    img,
                    imageData
                })
            }
        })
    })
    return Promise.all(promises).then((res:any)=>{
        res.forEach((v,i)=>{
            ALL_IMGS[i].width = v.img.width
            ALL_IMGS[i].height = v.img.height
            ALL_IMGS[i].data = v.imageData
        })
        return
    })
}

const initBasic = ()=>{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 1000);
    camera.position.z = 3;
    camera.position.y = 3;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, 800);
    const el = document.querySelector('#homePage-banner')
    el.appendChild(renderer.domElement);
}

const initControl = ()=>{
    control = new OrbitControls(camera, renderer.domElement);
}


const initEarth = ()=>{
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const step = 250
    for (let i = 0; i < step; i++) {
        let vec = new THREE.Vector3()
        let radians = step * (1 - Math.sin(i / step * Math.PI)) / step + .5 // 每个纬线圈内的角度均分
        for (let j = 0; j < step; j += radians) {
            let c = j / step // 底图上的横向百分比
            let f = i / step // 底图上的纵向百分比
            if (isLandByUV(c, f)) { // 根据横纵百分比判断在底图中的像素值
                const vec3 = new THREE.Vector3()
                var color = new THREE.Color();
                vec3.setFromSpherical(new THREE.Spherical(1.5,f * Math.PI,c * Math.PI * 2 - Math.PI / 2))
                positions.push(vec3.x,vec3.y,vec3.z)
                color.setRGB(3/255,168/255,158/255);
                colors.push(color.r, color.g, color.b);
            }
        }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    var material = new THREE.PointsMaterial({
        vertexColors:true,  // 颜色通过buffer传递进去
        size: 0.01,
        blending:THREE.AdditiveBlending,
        transparent:true,
        depthWrite: true
    });
    earthPoints = new THREE.Points(geometry, material);
    scene.add(earthPoints);
}


const initEarthGlow = ()=>{
    const map = new THREE.TextureLoader().load( './assets/img/glow.png' );
    const material2 = new THREE.SpriteMaterial( {
        map,
        color: 0xffffff,
        transparent: true, //开启透明
        opacity: 0.8, // 可以通过透明度整体调节光圈
        depthWrite: false, //禁止写入深度缓冲区数据
    });

    const sprite = new THREE.Sprite( material2 );
    sprite.position.set(0,0,0);
    sprite.scale.set(5,5,1)
    scene.add( sprite );

}

const initSun = ()=>{
    //const map = new THREE.TextureLoader().load( './assets/img/earth.jpg' );
    const geometry = new THREE.SphereGeometry( 1.5,64,64);
	const material = new THREE.MeshBasicMaterial( { 
        color: 0x0000CD,
        transparent: true, //开启透明
        opacity: 0, // 可以通过透明度整体调节光圈
        depthWrite: false, //禁止写入深度缓冲区数据
    });
	const sphere = new THREE.Mesh( geometry, material );
	scene.add( sphere );
}

const initMoon = ()=>{
    const map = new THREE.TextureLoader().load( './assets/img/moon.png' );
    const geometry = new THREE.SphereGeometry(0.5,64,64);
	const material = new THREE.MeshBasicMaterial({
        map,
        opacity: 0.5, // 可以通过透明度整体调节光圈
        depthWrite: true, //禁止写入深度缓冲区数据
    });
	moon = new THREE.Mesh( geometry, material );
    moon.position.x = 0
    moon.position.y = 0
    moon.position.z = -4
	scene.add( moon );
}

const initStars = ()=>{
    // 构建点缀的1000 个 stars
    const starCount = 5000;
    const starPos = []
    const starColor = []
    const starGeometry = new THREE.BufferGeometry();
    for(let i = 0; i < starCount; i++){
        const vec3 = new THREE.Vector3()
        var color = new THREE.Color();
        vec3.x = Math.random() * 2 - 1;
        vec3.y = Math.random() * 2 - 1;
        vec3.z = Math.random() * 2 - 1;
        starPos.push(vec3.x,vec3.y,vec3.z)
        color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55);
        starColor.push(color.r, color.g, color.b);
    }
    console.log('starPos',starPos)
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute( starPos, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColor, 3));
    const texture = new THREE.TextureLoader().load('./assets/img/star.png');
    var particleMaterial = new THREE.PointsMaterial({
        size: 3,
        map: texture,
    });

    let stars = new THREE.Points(starGeometry,particleMaterial)
    stars.scale.set(500, 500, 500);
    scene.add(stars)
}

onMounted(async ()=>{
    await loadAllImage()
    initBasic()
    initControl()
    // 初始太阳
    initSun()
    initEarth()
    // 初始地球光晕
    initEarthGlow()

    // 初始化月球
    initMoon()
    // 初始化星星
    initStars()
    let angle = 0
    function animate() {
        requestAnimationFrame(animate);
        earthPoints.rotation.y += 0.006;
        moon.rotation.y += 0.02;
        moon.position.x = -4.0*Math.sin((3.1415/180)*angle)
        moon.position.z = -4.0*Math.cos((3.1415/180)*angle)
        renderer.render(scene, camera);
        angle+=1
    }
    
    animate();
    
})

</script>

<template>
  <div class="homePage">
      <div class="homePage-banner" id="homePage-banner">

      </div>
  </div>
</template>

<style>
.homePage{
    position: relative;
}
.homePage-banner{
    position: fixed;
    background: black;
    left:0;
    right:0;
    top:60px;
    height:800px;
    z-index:1;
}
</style>
