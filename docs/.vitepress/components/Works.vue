<script setup lang="ts">
import { onMounted } from 'vue'
import { fabric } from 'fabric'
import { RGBADepthPacking } from 'three';
import * as TWEEN from '@tweenjs/tween.js'
onMounted(() => {
  //init()
})
</script>

<template>
   <div>
        <div>
            <img/>
            <h2>基于Fabric.js 小车运动图</h2>
        </div>
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