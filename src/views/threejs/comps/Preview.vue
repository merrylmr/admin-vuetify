<template>
  <v-dialog
      max-width="800px"
      width="800px"
      :value="visible"
      :overlay-opacity="0.8"
      @click:outside="closeHandle">
    <v-card>
      <v-card-title>作品预览</v-card-title>
      <div id="preview"></div>
    </v-card>
  </v-dialog>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'preview-dlg',
  props: {
    visible: {
      type: Boolean
    },
    url: {
      type: String,
    },
    cameraPos: {
      type: Object
    },
    params: {
      type: Object
    }
  },
  methods: {
    closeHandle() {
      console.log('closeHandle');
      this.$emit('close')
    },
    init() {
      const container = document.getElementById('preview');
      const width = container.clientWidth;
      const height = container.clientHeight;
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height)
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(this.params.fov, width / height, this.params.near, this.params.far);
      camera.position.x = this.cameraPos.x;
      camera.position.y = this.cameraPos.y;
      camera.position.z = this.cameraPos.z;
      // camera.position.z = 0.01;
      this.camera = camera;
      const controls = new OrbitControls(camera, renderer.domElement);

      controls.minPolarAngle = this.degToRad(this.params.minPolarAngle)
      controls.maxPolarAngle = this.degToRad(this.params.maxPolarAngle)

      controls.minAzimuthAngle = this.degToRad(this.params.minAzimuthAngle);
      controls.maxAzimuthAngle = this.degToRad(this.params.maxAzimuthAngle);


      function renderModel(url) {
        const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
        sphereGeometry.scale(1, 1, -1);
        const texture = new THREE.TextureLoader().load(url, () => {
          const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          scene.add(sphere)
          render();
        });
      }

      renderModel('3d/images/scene.jpeg');

      function render() {
        renderer.render(scene, camera);
        //  获取当前视觉的坐标（x,y,z）
      }

      controls.addEventListener('change', render);
    },
    // 角度转弧度
    degToRad(deg) {
      return Math.PI / 180 * deg
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style scoped lang="scss">
#preview {
  width: 100%;
  height: 400px;
}
</style>