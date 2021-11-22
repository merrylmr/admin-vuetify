<template>
  <div>
    <div id="demo2"></div>
  </div>
</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'demo-2',
  methods: {
    init() {
      const container = document.getElementById('demo2');
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      // renderer.setClearColor(0xffffff, 1); //设置背景颜色
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);


      let scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 0.01;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.rotateSpeed = -0.25;


      const imgArr = [
        '3d/images/scene_left.jpeg',
        '3d/images/scene_right.jpeg',
        '3d/images/scene_top.jpeg',
        '3d/images/scene_bottom.jpeg',
        '3d/images/scene_front.jpeg',
        '3d/images/scene_back.jpeg',
      ]

      let materials = [];
      for (let i = 0; i < imgArr.length; i++) {
        const texture = new THREE.TextureLoader().load(imgArr[i]);
        materials.push(new THREE.MeshBasicMaterial({map: texture}))
      }

      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
      scene.add(box)
      box.geometry.scale(1, 1, -1);

      window.addEventListener('resize', onWindowResize);

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

      }

      function animate() {

        requestAnimationFrame( animate );

        controls.update(); // required when damping is enabled

        renderer.render( scene, camera );

      }

      animate()

    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>