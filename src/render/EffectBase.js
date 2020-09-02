/**
 * [EffectBase 特效基础，基础方法]
 * @Author   ZHOUPU
 */
function EffectBase(config) {

    // 基础配置项
    const DefaultConfig = {
        basic: {
            longLat: { // 经纬度转换
                vScale: 40000, // 点缩放值-比例尺
                center: [104.08194733, 30.64614582] // 中心点
            },
            plane: { // 平面转换
                vScale: 1, // 点缩放值-比例尺
                center: [0, 0] // 中心点
            }
        },
        texture: {
            txuePath: '', //路径
            common: {}, //常规纹理
            repeat: {}  //重复纹理
        }
    };
    
    this.Txues = {}; // 纹理
    this.group = new THREE.Group();
    this.eventArray = []; // 事件数组

    this.config = $.extend(true, {}, DefaultConfig, config);
    console.log(this)
    this.loadTexture(this.config.texture);
}

Object.assign(EffectBase.prototype, {

    constructor: EffectBase,

    // 事件执行接口
    onMouseIn: function() {},
    onMouseOut: function() {},
    onMouseDown: function() {},
    onDblclick: function() {},

    animate: function() {},
    // 销毁
    dispose: function() {
        this.group = null;
        this.config = null;
        Object.keys(this.Txues).forEach((item) => {
            this.Txues[item].dispose && this.Txues[item].dispose();
            this.Txues[item] = null;
        });
    },

    // 请求
    ajaxQuer: function(url, func) {
        if (!url) return;
        var _that = this;
        $.ajax( {
            url: url,
            type: "get",
            success: function(result) {
                _that.toFunction(func(result));
            }
        });
    },

    // ---------
    /**
     * [mtl 常用材质对象]
     * @type {Object}
     */
    mtl: {
        // point(param) {
        //     return new THREE.PointsMaterial(param); // 点材质
        // },
        // sprite(param) {
        //     return new THREE.SpriteMaterial(param); // sprite粒子材质
        // },

        // line(param) {
        //     return new THREE.LineBasicMaterial(param); // 线材质
        // },
        // lineD(param) {
        //     return new THREE.LineDashedMaterial(param); // 线段材质
        // },

        shader(param) {
            return new THREE.ShaderMaterial(param); // shader自定义材质
        },

        basic(param) {
            return new THREE.MeshBasicMaterial(param); // 基础几何体材质
        },
        // phong(param) {
        //     return new THREE.MeshPhongMaterial(param); // 高光几何体材质
        // },
        // lambert(param) {
        //     return new THREE.MeshLambertMaterial(param); // 兰伯特感光几何体材质
        // },
        standard(param) {
            return new THREE.MeshStandardMaterial(param); // 标准几何体材质
        }
    },
    /**
     * [geo 常用几何体对象]
     * @type {Object}
     */
    geo: {
        // geo() {
        //     return new THREE.Geometry(); // 基础几何体
        // },
        buf() {
            return new THREE.BufferGeometry(); // 基础buffe几何体
        },
        // insBuf() {
        //     return new THREE.InstancedBufferGeometry(); // 基础buffer实例几何体
        // },

        // shape(shp, seg) {
        //     return new THREE.ShapeBufferGeometry(shp, seg); // 形状
        // },
        // extrude(shp, opt) {
        //     return new THREE.ExtrudeBufferGeometry(shp, opt); // 拉伸几何体
        // },

        plane(w, h, ws, hs) {
            return new THREE.PlaneBufferGeometry(w, h, ws, hs); // 平面
        },
        // circle(r, s) {
        //     return new THREE.CircleBufferGeometry(r, s); // 圆面
        // },
        box(w, h, d) {
            return new THREE.BoxBufferGeometry(w, h, d); // 立方体
        },
        // sphere(r, ws, hs) {
        //     return new THREE.SphereBufferGeometry(r, ws, hs); // 球体
        // },
        // torus(r, t, rs, ts) {
        //     return new THREE.TorusBufferGeometry(r, t, rs, ts); // 圆环
        // },
        // Icosah(r, s) {
        //     return new THREE.IcosahedronBufferGeometry(r, s); // 二十面体
        // },
        cylinder(rt, rb, h, rs, o) {
            return new THREE.CylinderBufferGeometry(rt, rb, h, rs, 1, o); // 圆柱
        }
    },

    // 多边形构面
    tgShape: function (c, h) { return THREE.ShapeUtils.triangulateShape(c, h); },

    color: function (c) { return new THREE.Color(c); },

    // 更改透明度  动画中使用
    setNodeOpacity: function ( node, val ) {
        node.traverse( function( child ) {
            if ( child._opacity ) {
                if (!child.material.uniforms) child.material.opacity = child._opacity * val;
                else child.material.uniforms.u_opacity.value = child._opacity * val;
            }
        } );
    },

    isArray: function(o){
        return Object.prototype.toString.call(o)=='[object Array]';
    },

    isFunction: function(a) {
        return Object.prototype.toString.call(a) === '[object Function]';
    },
    
    toFunction: function(a) {
        var b = Object.prototype.toString.call(a) === '[object Function]';
        return b? a: function(o){};
    },

    // 常规颜色转换为 3D颜色数组 [THREE.Color, opacity]
    getColorArr: function(str) {
        function pad2(c) {
            return c.length === 1 ? `0${c}` : `${c}`;
        }
        if (this.isArray(str)) return str;
        const _arr = [];
        const nStr = (`${str}`).toLowerCase().replace(/\s/g, '');
        if (/^((?:rgba)?)\(\s*([^)]*)/.test(nStr)) {
            const arr = nStr.replace(/rgba\(|\)/gi, '').split(',');
            const hex = [
                pad2(Math.round(arr[0] - 0 || 0).toString(16)),
                pad2(Math.round(arr[1] - 0 || 0).toString(16)),
                pad2(Math.round(arr[2] - 0 || 0).toString(16))
            ];
            _arr[0] = this.color(`#${hex.join('')}`);
            _arr[1] = Math.max(0, Math.min(1, (arr[3] - 0 || 0)));
        } else if (str === 'transparent') {
            _arr[0] = this.color();
            _arr[1] = 0;
        } else {
            _arr[0] = this.color(str);
            _arr[1] = 1;
        }
        return _arr;
    },

    // 3D内颜色还原为 rgba
    getStyle: function (cArr) {
        var cl3 = cArr[0].multiplyScalar(255);
        return `rgba(${(cl3.r | 0)}, ${(cl3.g | 0)}, ${(cl3.b | 0)}, ${cArr[1]})`;
    },

    // 加载图片纹理
    loadTexture: function (texture) {
        var tph = texture.txuePath || '',
            common = texture.common || {},
            repeat = texture.repeat || {},
            txueLoader = new THREE.TextureLoader();
        for (var k in common) {
            this.Txues[`_${k}`] = txueLoader.load(tph + common[k]);
        }
        for (var k in repeat) {
            this.Txues[`_${k}`] = txueLoader.load(tph + repeat[k]);
            this.Txues[`_${k}`].wrapS = THREE.RepeatWrapping;
            this.Txues[`_${k}`].wrapT = THREE.RepeatWrapping;
        }
    },

    // 组装几何体使用
    handleArray: function (arr, scale, center, handleType) {
        var vlen = arr.length;
        if (handleType) {
            var start = arr[0], end = arr[vlen-1];
            if (end[0] !== start[0] && end[1] !== start[1]) {
                arr.push( [start[0], start[1]] );
            }
            vlen = arr.length;
        }
        var k, vx, vy, vec2s = [];
        var xmax = -Infinity, xmin = Infinity, 
            ymax = -Infinity, ymin = Infinity;
            
        for (k = vlen-1; k >= 0; k--) {
            arr[k][0] = vx = (arr[k][0]-center[0])*scale;
            arr[k][1] = vy = (center[1]-arr[k][1])*scale;
            if (handleType) {
                xmax = xmax>vx? xmax: vx; xmin = xmin<vx? xmin: vx;
                ymax = ymax>vy? ymax: vy; ymin = ymin<vy? ymin: vy;
            } else vec2s.push(new THREE.Vector2(vx, vy));
        }
        // x, y, w, h, len vec2s
        return { x: xmin, y: ymin, w: xmax-xmin, h: ymax-ymin, l: vlen, vec2s: vec2s };
    },
    
    handleVec3: function (arr, scale, center) {
        var k, vx, vy, vz;
        var alen = arr.length;
        var vec3 = [];
        for (k = 0; k < alen; k++) {
            if ( arr[k][1] == undefined ) continue;
            vx = (arr[k][0] - center[0]) * scale;
            vy = arr[k][1] * scale;
            vz = (center[1] - arr[k][2]) * scale;
            vec3.push(new THREE.Vector3(vx, vy, vz));
        }
        return vec3;
    },
    
    handleColor: function (colorArr) {
        var colors = [];
        for (var i = 0, clen = colorArr.length; i < clen; i++) {
            if (this.isArray(colorArr[i])) {
                colors.push([
                    this.getColorArr(colorArr[i][0]),
                    this.getColorArr(colorArr[i][1])
                ]);
            } else {
                colors.push(this.getColorArr(colorArr[i]));
            }
        }
        return colors;
    },
    
    pushColor: function (array, ...colors) {
        var i, ci, clen = colors.length;
        for (i = 0; i < clen; i++) {
            ci = colors[i];
            array.push(ci[0].r, ci[0].g, ci[0].b, ci[1]);
        }
    }
});

export default EffectBase