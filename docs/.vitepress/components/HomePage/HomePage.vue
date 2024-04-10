<script setup lang="ts">
import { ref,onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
let scene:any = null
let camera:any = null
let renderer:any = null
let control:any = null
let earthPoints:any = null
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
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, 800);
    const el = document.querySelector('#homePage-banner')
    el.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 颜色和强度
    //scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff,1,0,1); // 颜色、强度和距离
    pointLight.position.set(0, 3, 0); // 设置光源位置
    //scene.add(pointLight);
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
        opacity: 0.7, // 可以通过透明度整体调节光圈
        depthWrite: false, //禁止写入深度缓冲区数据
    });

    const sprite = new THREE.Sprite( material2 );
    sprite.position.set(0,0,0);
    sprite.scale.set(5.3,5.3,1)
    scene.add( sprite );

}

const initSun = ()=>{
 // 添加太阳
 const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    //sunGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0.5,0.0,0.1], 3));
    //sunGeometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5,0.5,0.5], 3));
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF,
        depthWrite: false,
        transparent: true, //开启透明
    });
    const sun = new THREE.Mesh(sunGeometry,sunMaterial);
    sun.position.x = -2
    scene.add(sun);
}


const initUFO = ()=>{
    const loader = new OBJLoader()
    const mtlLoader = new MTLLoader();
    return new Promise((resolve,reject)=>{
        mtlLoader.load('./assets/obj/UFO_Empty.mtl', function (materials) {
            materials.preload();
            loader.load('./assets/obj/UFO_Empty.obj',function(object){
                resolve({object,materials,loader})
            },()=>{},(err)=>{
                reject(err)
            })
        })
    })
}

const initBox = ()=>{
    var vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
// 片元着色器代码
var fragmentShader = `
    uniform vec3 color;
    varying vec2 vUv;

    void main() {
        gl_FragColor = vec4(vUv.x,vUv.y,1.0,1.0);
    }
`;

var shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        color: { value: new THREE.Color(0xff0000) } // 红色
    }
});


    //scene.add(cube)




    const geometry3 = new THREE.RingGeometry( 1, 2, 32 );
    console.log('uv',geometry3.attributes);

}

onMounted(async ()=>{
    await loadAllImage()
   
    initBasic()
    initControl()
    initBox()
    //initSun()
    initEarth()
    // 初始地球光晕
    //initEarthGlow()
    // 初始太阳

    //const { object, materials, loader} = await initUFO()
    //const map2 = new THREE.TextureLoader().load( './assets/img/ufo/UFO_nmap.jpg' );
    // object.traverse((child)=>{
    //     if (child instanceof THREE.Mesh) {
    //         const reflectiveMaterial = new THREE.MeshPhongMaterial({
    //           color: 0xffffff, // 设置材质颜色
    //           specular: 0xffffff, // 设置高光颜色
    //           shininess: 800, // 设置高光亮度
    //           map:map2
    //         });
    //         reflectiveMaterial.map = map2;
    //         // 为每个网格创建一个新的材质，将纹理作为map属性传入
    //         child.material = reflectiveMaterial;
    //     }
    // })
    //loader.setMaterials(materials);
    //object.scale.set(0.2, 0.2, 0.2);
    //object.position.set(-3.0,0.0,0);
    //scene.add(object)


    
    

    function animate() {
        requestAnimationFrame(animate);
        earthPoints.rotation.y += 0.006;
        renderer.render(scene, camera);
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
