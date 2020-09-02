import EffectRender from '../render/EffectRender'
import CreatTest from '../demo1/CreatTest'
import backgroun from '../images/test.jpg'
import px from '../images/cubSky/px.jpg'
import nx from '../images/cubSky/nx.jpg'
import py from '../images/cubSky/py.jpg'
import ny from '../images/cubSky/ny.jpg'
import pz from '../images/cubSky/pz.jpg'
import nz from '../images/cubSky/nz.jpg' 
// 渲染器
var Render = new EffectRender({
    cts: 'canvas-frame',
    background: {
        color: '#ffffff', opacity: 0, type: 'cubSky' // type: shpereSky-天空球,cubSky-天空盒
    },
    texture: {
        txuePath: '', //路径
        background: { //背景
            shpereSky: backgroun,
            cubSky: { // 天空盒
                px: px,
                nx: nx,
                py: py,
                ny: ny,
                pz: pz,
                nz: nz,
            }
        },
    },
    light: {
        isHemisphere: true,  // 半球光
        hemisphere: {
            color: '#ffffff', groundColor: '#A3A3A3',
            strength: 1, position: [0, 0, 0]
        },
    },
    camera: {
        position: [0, 296, 200], ratio: 1
    },
    controls: {
        target: { x: 0, y: 0, z: 0 }, // 中心点
        enablePan: true, // 平移  
        enableZoom: true, // 缩放  
        enableRotate: true, // 旋转
    },
    composer: {
        isBloom: false, // 是否开启辉光
        bloomThreshold: 0.1, // 辉光亮度阀值，颜色亮度大于阀值起效
        bloomStrength: 0.15, // 辉光强度
        bloomRadius: 1, // 辉光半径

        isFocus: false, // 是否径向模糊
        focusVal: 0.0001, // 径向模糊值
        waveFactor: 0.00000001, //模糊系数

        isAntialias: false, // 是否开启 smaa 、 ssaa 抗锯齿
        antialiasType: 'smaa', // smaa 、 ssaa 抗锯齿 ssaa-硬件要求高
        antialiasLevel: 1, // ssaa 抗锯齿级别
    }
}); 
 

var test2 = new CreatTest({
    test: 123
});
 

Render.addEffect(test2);