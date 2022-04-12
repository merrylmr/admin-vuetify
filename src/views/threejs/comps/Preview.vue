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
    },
    doc: {
      type: Object,
      default: () => {
        return {
          scenes: []
        }
      }
    }
  },
  methods: {
    closeHandle() {
      console.log('closeHandle');
      this.$emit('close')
    },
    // 角度转弧度
    degToRad(deg) {
      return Math.PI / 180 * deg
    },
    async renderScene(data) {
      const container = document.getElementById('preview');
      const width = container.clientWidth;
      const height = container.clientHeight;

      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height)
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(data.params.fov, width / height, data.params.near, data.params.far);
      camera.position.x = data.cameraPos.x;
      camera.position.y = data.cameraPos.y;
      camera.position.z = data.cameraPos.z;

      this.camera = camera;
      this.scene = scene;


      const controls = new OrbitControls(camera, renderer.domElement);
      // controls.minPolarAngle = this.degToRad(data.params.minPolarAngle)
      // controls.maxPolarAngle = this.degToRad(data.params.maxPolarAngle)
      //
      // controls.minAzimuthAngle = this.degToRad(data.params.minAzimuthAngle);
      // controls.maxAzimuthAngle = this.degToRad(data.params.maxAzimuthAngle);

      function renderModel(url) {
        return new Promise((resolve) => {
          const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
          sphereGeometry.scale(1, 1, -1);
          const texture = new THREE.TextureLoader().load(url, () => {
            const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            scene.add(sphere)
            // render();
            resolve()
          });
        })

      }

      await renderModel(data.url);

      function render() {
        renderer.render(scene, camera);
        //  获取当前视觉的坐标（x,y,z）
      }

      controls.addEventListener('change', render);

      return {renderer, controls, camera, scene}
    },

    textureLoaderHandle(url) {
      return new Promise((resolve) => {
        const pointTexture = new THREE.TextureLoader().load(url, () => {
          resolve(pointTexture)
        });
      })
    },
    // 渲染热点
    async renderPoint(scene, hotPoints) {
      let poiObjects = [];
      for (let i = 0; i < hotPoints.length; i++) {
        const item = hotPoints[i];
        // 这里加载是一个异步的过程
        const pointTexture = await this.textureLoaderHandle(item.iconPath)
        console.log('pointTexture:', pointTexture)
        const material = new THREE.SpriteMaterial({map: pointTexture});
        const sprite = new THREE.Sprite(material);

        sprite.scale.set(0.1, 0.1, 0.1);
        const position = hotPoints[i].pos
        sprite.position.set(position.x, position.y, position.z)

        scene.add(sprite);

        sprite.detail = hotPoints[i].detail;
        poiObjects.push(sprite);
      }

      return poiObjects
    },
    async init() {
      const data = this.doc.scenes[0]
      const points = data.hotSpots
      // 渲染场景
      const {renderer, controls, scene, camera} = await this.renderScene(data)
      // 渲染热点
      await this.renderPoint(scene, points)

      function render() {
        renderer.render(scene, camera);
      }

      render();
      controls.addEventListener('change', render);
    }
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
