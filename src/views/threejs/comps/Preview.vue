<template>
  <v-dialog
      max-width="800px"
      width="800px"
      :fullscreen="false"
      :value="visible"
      :overlay-opacity="0.8"
      @click:outside="closeHandle">
    <v-card class="preview-wrapper">
      <!--      <v-card-title>作品预览</v-card-title>-->
      <div id="preview">
      </div>
      <div class="hot-point__list"
           :key="uniqueId">
        <div class="hot-point__item"
             :style="transformStyle(item.pos,item)"
             v-for="(item,index) in hotPointList"
             :key="index">
          <!--场景说明   -->
          <div class="item__label"
               @click="pointLabelClickHandle(item)">
            {{ _.get(item, 'title.label') }}
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {pointInSceneView, worldVector2Screen} from '../common.js'
import {randomString} from '@/assets/js/utils.js'

export default {
  name: 'preview-dlg',
  props: {
    visible: {
      type: Boolean
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
  data() {
    return {
      controls: null,
      camera: null,
      scene: null,
      renderer: null,
      container: null,
      // 热点
      poiObjects: [],
      // 热点原始数据
      hotPointList: [],
      uniqueId: ''
    }
  },
  computed: {
    transformStyle() {
      return (point, item) => {
        let pos = worldVector2Screen({
          x: point.x,
          y: point.y,
          z: point.z
        }, this.container, this.camera);

        console.log('transformStyle pos:', pos)
        const visible = pointInSceneView(point, this.camera)
        return {
          transform: `translateZ(0px) translate(${pos.x}px,${pos.y}px) translate(-40px,-40px)`,
          width: item.iconSize + 'px',
          height: item.iconSize + 'px',
          opacity: visible ? 1 : 0
        }
      }

    },
  },
  methods: {
    closeHandle() {
      this.$emit('close')
    },
    // 角度转弧度
    degToRad(deg) {
      return Math.PI / 180 * deg
    },
    // 切换场景
    async changeSceneHandle(data) {
      console.log('changeSceneHandle data', data)
      if (data.sphere) {
        this.sphere.material = data.sphere;
      } else {
        // TODO:切换场景这里，可增加动画过渡（https://juejin.cn/post/7047709128600322056#heading-13）
        // gsap.to
        const texture = await this.textureLoaderHandle(data.url);
        const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
        this.sphere.material = sphereMaterial;
        data.sphere = sphereMaterial;
      }
      // 相机位置
      const cameraPos = data.cameraPos;
      this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
      // important:通过参数更新相机位置，必须调用controls的update才会生效
      this.controls.update();
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


      const controls = new OrbitControls(camera, renderer.domElement);


      const texture = await this.textureLoaderHandle(data.url)
      const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
      const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
      sphereGeometry.scale(1, 1, -1);
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere)
      return {renderer, controls, camera, scene, container, sphere}
    },

    textureLoaderHandle(url) {
      return new Promise((resolve) => {
        const pointTexture = new THREE.TextureLoader().load(url, () => {
          resolve(pointTexture)
        });
      })
    },

    // 计算Sprite的缩放
    // https://segmentfault.com/a/1190000041644858
    // TODO: 这里还需要计算一个tan(fov/2)的值，默认90为1
    calcSpriteScale(icon) {
      //  LScaleY = PX * (2 * tan(fov / 2)) / canvasHeight (高度)
      //  PX = L/(2*tan(fov/2))*canvasHeight => LScaleX =px* 2*tan(fov/2) / canvasHeight
      const scaleY = icon.iconSize * 2 / this.container.clientHeight
      const scaleX = icon.iconSize * 2 / this.container.clientHeight
      console.log('calcSpriteScale:', scaleX, scaleY)
      return {scaleX, scaleY}
    },
    // 渲染热点(点击范围)
    async renderPoint(scene, hotPoints) {
      this.hotPointList = hotPoints;
      let poiObjects = [];
      for (let i = 0; i < hotPoints.length; i++) {
        const item = hotPoints[i];
        // 这里加载是一个异步的过程
        const pointTexture = await this.textureLoaderHandle(item.iconPath)
        console.log('renderPoint pointTexture:', pointTexture)
        const material = new THREE.SpriteMaterial(
            {
              map: pointTexture,
              // 关闭大小跟随相机距离变化的特性
              sizeAttenuation: false
            });
        const sprite = new THREE.Sprite(material);

        const {scaleX, scaleY} = this.calcSpriteScale(item)
        sprite.scale.x = scaleX;
        sprite.scale.y = scaleY;
        const position = hotPoints[i].pos
        sprite.position.set(position.x, position.y, position.z)

        sprite.detail = item
        poiObjects.push(sprite);
        scene.add(sprite);
      }
      return poiObjects
    },
    // 寻找目标场景
    findTargetScene(id) {
      const target = this.doc.scenes.find(item => {
        return item.id === id
      })
      return target
    },

    async init(data = this.doc.scenes[0]) {
      const points = data.hotSpots
      // 渲染场景
      const {
        renderer,
        controls,
        scene,
        camera,
        container,
        sphere
      } = await this.renderScene(data)
      this.renderer = renderer;
      this.controls = controls;
      this.scene = scene;
      this.camera = camera;
      this.container = container;
      this.sphere = sphere;
      // 渲染热点
      this.poiObjects = await this.renderPoint(scene, points)

      // 渲染热点上的文字说明
      const _this = this;

      function render() {
        renderer.render(scene, camera);
        //  获取当前视觉的坐标（x,y,z）
        _this.uniqueId = randomString()
      }

      render();
      controls.addEventListener('change', render);
    },
    // 点击热点的文字说明
    async pointLabelClickHandle(detail) {
      // 清空场景的元素（热点）
      this.scene.children = this.scene.children.filter(item => {
        return item.type !== 'Sprite'
      })
      switch (detail.hotType) {
        case 'scene': {
          // 切换场景
          const scene = this.findTargetScene(detail.value);
          if (scene) {
            // 重新渲染热点
            this.poiObjects = await this.renderPoint(this.scene, scene.hotSpots);
            // 切换场景
            this.changeSceneHandle(scene);
          }
        }
          break;
        default:
          break;
      }
    },
    // 点击热点回调
    async pointClickHandle(event) {
      event.preventDefault();
      // 光线投射Raycaster
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // https://www.it1352.com/1990090.html
      // 鼠标坐标问题
      const canvasPos = this.container.getBoundingClientRect();
      const mouseX = event.clientX - canvasPos.left;
      const mouseY = event.clientY - canvasPos.top;
      mouse.x = (mouseX / this.container.clientWidth) * 2 - 1;
      mouse.y = -(mouseY / this.container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera)

      const intersects = raycaster.intersectObjects(this.poiObjects);

      console.log('intersects:', intersects);

      if (intersects.length > 0) {
        console.log('点击了热点', intersects[0])
        const detail = intersects[0].object.detail;

        this.pointLabelClickHandle(detail)
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.init();
      this.container.addEventListener('click', this.pointClickHandle, false)
    })
  }
}
</script>

<style scoped lang="scss">
.preview-wrapper {
  position: relative;
  overflow: hidden;
}

#preview {
  width: 100%;
  height: 400px;
}

.hot-point__list {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  user-select: none;
  pointer-events: none;
}

.hot-point__item {
  position: absolute;

  .item__label {
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    word-break: keep-all;
    cursor: pointer;
  }
}
</style>
