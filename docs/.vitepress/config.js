module.exports = {
    title:'前端Sam哥',
    description: 'A VitePress site',
    appareance:true,
    themeConfig:{
        nav:[
            { text: '首页', link: '/',activeMatch: '/'  },
            { text: '数学算法', link: '/articles/algmath/index.md',activeMatch: '/articles/algmath/index.md' },
            { 
                text: '文档教程',
                items:[
                    {text:'WebGL文档',link:'/articles/docs/webgl.md'},
                    {text:'Shader教程',link:'/articles/docs/shader.md'},
                    {text:'Three.js教程'}
                ] 
            }
        ],
        footer: {
            message: '其实我也不知道写啥注脚',
            copyright: '那我就随便写个吧',
        }
    },
    
}