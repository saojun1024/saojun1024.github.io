
整理了一些常用的原生WebGL API。

## createShader
创建一个着色器类型。可以是`顶点着色器`或者`片元着色器`,返回`WebGLShader`对象  
顶点着色器:
```js
// 创建顶点着色器
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
```
片元着色器
```js
// 创建片元着色器
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
```

## shaderSource
用于将着色器源代码分配给createShader 创建出的着色器对象。
```js
gl.shaderSource(shader, source);
```
- `shader`: WebGLShader 对象，要给其分配着色器源代码
- `source`: 着色器的源代码字符串，即包含着色器程序的 GLSL (OpenGL Shading Language) 代码

示例：
```js
// 创建一个顶点着色器
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// 创建一个片元着色器
const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

// 创建 WebGL 着色器对象
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

// 给着色器对象分配源代码
gl.shaderSource(vertexShader, vertexShaderSource);
gl.shaderSource(fragmentShader, fragmentShaderSource);

```

## compileShader
编译 createShader 创建出的 `WebGLShader` 对象。  


编译顶点着色器：
```js
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
        precision mediump float;
        void main(){
                gl_Position = vec4(0.5,0.0,0.0, 1.0);
                gl_PointSize = 10.0;
        }
`);
// 编译顶点着色器
gl.compileShader(vertexShader);
```
编译片元着色器：
```js
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
        precision mediump float;
        void main(){
                gl_FragColor = vec4(1.0, 0, 0, 1);
        }
`);
gl.compileShader(fragmentShader);
```


## attachShader
`attachShader` 用于将顶点着色器和片元着色器附加到 WebGL 程序对象上，使它们成为一个完整的着色器程序.
```js
// 创建程序
var program = gl.createProgram();
//将顶点着色器挂载在着色器程序上。
gl.attachShader(program, vertexShader); 
//将片元着色器挂载在着色器程序上。
gl.attachShader(program, fragmentShader);
```

## createProgram
`createProgram` 方法用于创建一个着色器程序。没有参数，创建出程序后应该将着色器挂载在程序（program）上。
```js
// 创建顶点着色器
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
        precision mediump float;
        void main(){
                gl_Position = vec4(0.5,0.0,0.0, 1.0);
                gl_PointSize = 10.0;
        }
`);
gl.compileShader(vertexShader);

// 创建片元着色器
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
        precision mediump float;
        void main(){
                gl_FragColor = vec4(1.0, 0, 0, 1);
        }
`);
gl.compileShader(fragmentShader);

// 创建程序
var program = gl.createProgram();
//将顶点着色器挂载在着色器程序上。
gl.attachShader(program, vertexShader); 
//将片元着色器挂载在着色器程序上。
gl.attachShader(program, fragmentShader);
```

## linkProgram
链接着色器程序，一般在attachShader之后执行。
```js
// 创建程序
var program = gl.createProgram();
//将顶点着色器挂载在着色器程序上。
gl.attachShader(program, vertexShader); 
//将片元着色器挂载在着色器程序上。
gl.attachShader(program, fragmentShader);
//链接着色器程序
gl.linkProgram(program);
```

## useProgram
使用某个程序，一般在 linkProgram 之后执行。
```js
gl.linkProgram(program);
gl.useProgram(program);
```

## bufferData

## uniformMatrix4fv

## vertexAttribPointer

## getAttribLocation
获取顶点着色器中变量的地址，从而进一步给它赋值。 这是 WebGL 与 浏览器环境常见的通信接口之一，后续我们会一直使用到这个接口。 


```js
gl.getAttribLocation(webgl程序,shader中的变量名称)
```

例如要实现动态绘制一个点，当鼠标在 canvas 上点击某一处时，在该位置绘制一个点。点的位置变量`a_Position` 从外部的JS程序传入。
```js
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    precision mediump float;
    attribute vec2 a_Position;
    void main(){
        gl_Position = vec4(a_Position,0.0, 1.0);
        gl_PointSize = 10.0;
    }
`);
```

```js
const pointer = gl.getAttribLocation(program,'a_Position')
el.addEventListener("click",(e)=>{
const {x,y} = canvasxytowebglxy(1000,700,e.offsetX,e.offsetY)
	gl.vertexAttrib2f(pointer,x,y)
	gl.drawArrays(gl.POINTS, 0,1)
})
```




## enable

## clear
清除屏幕或画布上的内容。为了准备进行下一次绘制，确保绘制的新内容不会与之前的内容叠加，而是完全替换之前的画面，类似于canvas 2d中的 clearRect 的作用。

## drawArrays
webgl最重要的 API 之一






## 绘制一个点
## 绘制一个三角形
## 绘制正方体
## 绘制球体
## 绘制小圆点
## 绘制旋转的立方体
## 绘制旋转的球体

## 正交相机
## 投影相机
## 光照