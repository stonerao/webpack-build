import EffectBase from '../render/EffectBase';

var _Shaders = {

};

class CreateEarth extends EffectBase {
    constructor(config) {
        super(config);

        if (typeof InitFbx == 'function') InitFbx();

        this.group = new THREE.Group();

        this.group.add(new THREE.GridHelper(1500, 50, 0x29292C, 0x29292C));

        const plane = new THREE.Mesh(this.geo.box(100, 100, 100), this.mtl.basic({
            color: 0xffff00, transparent: true, opacity: 0.8
        }));

        this.eventArray.push(plane);
        this.group.add(plane);
    } 

    animate = (dt, clock) => {


    }

}

export default CreateEarth