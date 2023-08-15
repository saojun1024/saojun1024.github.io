shader也称`着色器`.着色器分为`顶点着色器`和`片元着色器`.


## 第一个程序

示例：  
html布局如下：  

```html
<div class="grid">
	<canvas id="app" width="1000" height="700"></canvas>
	<div class="xaxis"></div>
	<div class="yaxis"></div>
</div>
```
```js
const el = document.getElementById("app")
const gl = el.getContext("webgl")
// 创建顶点着色器
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    precision mediump float;
    attribute vec2 a_Position;
    void main(){
        gl_Position = vec4(a_Position,0.0, 1.0);
    }
`);
gl.compileShader(vertexShader);

// 创建片元着色器
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    precision mediump float;      
    void main(){
        if(gl_FragCoord.x>500.0){
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }else{
            gl_FragColor = vec4(0.0,1.0,0.0,1.0);
        }
        
    }
`);
gl.compileShader(fragmentShader);
// 创建程序
var program = gl.createProgram();
//将顶点着色器挂载在着色器程序上。
gl.attachShader(program, vertexShader); 
//将片元着色器挂载在着色器程序上。
gl.attachShader(program, fragmentShader);
//链接着色器程序
gl.linkProgram(program);
gl.useProgram(program);

const buffer = gl.createBuffer()
// 通过类型化数组来传递数据给webgl
const data = new Float32Array([
    -1.0,1.0,
    -1.0,-1.0,
    1.0,-1.0,
])
gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW)
const a_position_pointer = gl.getAttribLocation(program,'a_Position')
gl.vertexAttribPointer(a_position_pointer,2,gl.FLOAT,false,8,0)
gl.enableVertexAttribArray(a_position_pointer)
// 绘制三角形
gl.drawArrays(gl.TRIANGLES,0,3)
```
![](../../assets/img/test01.png)



## 基础语法


## 变量

## 宏

## 常用函数

## length

## distance

## step

## smoothstep

## dot


