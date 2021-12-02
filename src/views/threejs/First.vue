<template>
  <div class="first">
    <div id="container"></div>
  </div>
</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {
  methods: {
    init() {
      const scene = new THREE.Scene();
      const geometry = new THREE.BoxGeometry(100, 100, 100);

      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        // specular: 0x4488ee,
        // shininess: 12
      });

      // const material = new THREE.MeshLambertMaterial({
      //   color:0xff0000,
      //   // opacity:0.7,
      //   // transparent:true,
      // })
      const mesh = new THREE.Mesh(geometry, sphereMaterial);
      scene.add(mesh)

      // 点光源
      const point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 200);
      scene.add(point);

      //   环境光
      const ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);

      // 点光源2  位置和point关于原点对称
      const point2 = new THREE.PointLight(0xffffff);
      point2.position.set(-400, -200, -200); //点光源位置
      scene.add(point2); //点光源添加到场景中

      //  相机设置
      const width = window.innerWidth;
      const height = window.innerHeight;
      const k = width / height;
      const s = 200;

      const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      camera.position.set(250, 300, 200);
      camera.lookAt(scene.position)

      //  创建渲染器对象
      const renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setClearColor(0xb9d3ff, 1);
      const container = document.getElementById('container');
      container.appendChild(renderer.domElement);

      function render() {
        renderer.render(scene, camera)
        // mesh.rotateY(0.01);
        // window.requestAnimationFrame(render);
      }

      render()
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', render)

      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      const axisHelper = new THREE.AxisHelper(250);
      scene.add(axisHelper);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  }
}
</script>