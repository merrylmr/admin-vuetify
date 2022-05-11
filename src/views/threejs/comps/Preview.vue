<template>
  <v-card class="preview-wrapper">
    <!--      <v-card-title>作品预览</v-card-title>-->
    <div id="preview">
    </div>
    <div class="hot-point__list"
         :key="uniqueId">
      <div class="hot-point__item"
           v-for="(item,index) in hotPointList"
           :key="index"
           :style="hotLabelStyleArr[index]">
        <!--场景说明-->
        <div class="item__label"
             @click="pointLabelClickHandle(item)">
          {{ _.get(item, 'title.label') }}
        </div>
      </div>
    </div>

    <!--场景列表-->
    <div class="scene-list">
      <div class="scene-item"
           :class="{'is-active':index===activeIndex}"
           v-for="(item,index) in doc.scenes"
           :key="index"
           @click="changeSceneHandle(item,index)">
        <div class="scene-item__thumbnail">
          <img :src="item.url">
        </div>
        <div class="scene-item__label">
          {{ item.name }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {pointInSceneView, worldVector2Screen, TextureAnimator} from '../common.js'
// import {randomString} from '@/assets/js/utils.js'
import gsap from 'gsap';
import docJSON from 'json/doc.json'

// TODO: 初始化的动画过渡
// TODO:requestAnimationFrame:替换掉change
// TODO: 代码优化
export default {
  name: 'preview-dlg',
  props: {
    visible: {
      type: Boolean
    },
    doc: {
      type: Object,
      default: () => {
        return docJSON
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
      uniqueId: '',
      activeIndex: 0,
      needUpdate: [],
      hotLabelStyleArr: []
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
          transform: `translateZ(0px) translate(${pos.x}px,${pos.y}px) translate(-${item.iconSize / 2}px,-${item.iconSize / 2}px)`,
          width: item.iconSize + 'px',
          height: item.iconSize + 'px',
          opacity: visible ? 1 : 0
        }
      }

    },
  },
  methods: {
    hotLabelStyles() {
      const arr = [];
      this.hotPointList.forEach(item => {
        const visible = pointInSceneView(item.pos, this.camera)
        if (visible) {
          let pos = worldVector2Screen({
            x: item.pos.x,
            y: item.pos.y,
            z: item.pos.z
          }, this.container, this.camera);
          arr.push({
            transform: `translateZ(0px) translate(${pos.x}px,${pos.y}px) translate(-${item.iconSize / 2}px,-${item.iconSize / 2}px)`,
            width: item.iconSize + 'px',
            height: item.iconSize + 'px',
            visibility: 'visible'
          })
        } else {
          arr.push({
            width: item.iconSize + 'px',
            height: item.iconSize + 'px',
            visibility: 'hidden',
            transform: `translateZ(0px) translate(-999999px,-999999px) translate(-${item.iconSize / 2}px,-${item.iconSize / 2}px)`,
          })
        }

      })
      this.hotLabelStyleArr = arr;
    },
    closeHandle() {
      this.$emit('close')
    },
    // 角度转弧度
    degToRad(deg) {
      return Math.PI / 180 * deg
    },
    /**
     *
     *  切换场景
     *  @param data 场景数据对象
     *  @param index 当前场景的索引值
     *
     */
    async changeSceneHandle(data, index) {
      if (this.activeIndex === index) return
      this.activeIndex = index;
      // 清空场景的元素（热点）
      this.scene.children = this.scene.children.filter(item => {
        return item.type !== 'Sprite'
      })

      this.hotPointList = []
      if (data.sphere) {
        data.sphere.opacity = 0;
        data.sphere.transparent = true;
        this.sphere.material = data.sphere;
      } else {
        const texture = await this.textureLoaderHandle(data.url);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
        });
        this.sphere.material = sphereMaterial;
        data.sphere = sphereMaterial;
      }

      gsap.to(data.sphere, {
        transparent: false,
        opacity: 1,
        duration: 1.5,
        onComplete: async () => {
          // 重新渲染热点
          this.poiObjects = await this.renderPointList(this.scene, data.hotSpots);
          this.hotLabelStyles()
        }
      });

      this.camera.fov = data.params.fov;
      this.camera.near = data.params.near;
      this.camera.far = data.params.far;
      // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用
      this.camera.updateProjectionMatrix();
      // 相机位置
      const cameraPos = data.cameraPos;
      this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
      // important:通过参数更新相机位置，必须调用controls的update才会生效
      this.controls.update();
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
    calcSpriteScale(icon, fov = 90) {
      //  LScaleY = PX * (2 * tan(fov / 2)) / canvasHeight (高度)
      //  PX = L/(2*tan(fov/2))*canvasHeight => LScaleX =px* 2*tan(fov/2) / canvasHeight
      const scaleY = icon.iconSize * 2 * Math.tan(fov / 2 * Math.PI / 180) / this.container.clientHeight
      const scaleX = icon.iconSize * 2 * Math.tan(fov / 2 * Math.PI / 180) / this.container.clientHeight
      console.log('calcSpriteScale:', scaleX, scaleY)
      return {scaleX, scaleY}
    },
    /** 渲染热点
     * @param scene:场景
     * @param item: 热点对象
     */
    async renderHotPoint(scene, item) {
      const pointTexture = await this.textureLoaderHandle(item.iconPath)
      let annie = null
      if (item.gif) {
        annie = new TextureAnimator(
            pointTexture,
            item.texture.horizontalNum,
            item.texture.verticalNum,
            item.texture.numTiles,
            item.texture.duration)
      }
      const material = new THREE.SpriteMaterial(
          {
            map: pointTexture,
            // 关闭大小跟随相机距离变化的特性
            sizeAttenuation: false,
          });
      const sprite = new THREE.Sprite(material);
      const {scaleX, scaleY} = this.calcSpriteScale(item, this.camera.fov)
      sprite.scale.set(scaleX, scaleY);

      // 位置信息
      const position = item.pos
      sprite.position.set(position.x, position.y, position.z)
      sprite.detail = item
      scene.add(sprite);
      return {sprite, annie}
    },
    // 渲染热点列表(点击范围)
    async renderPointList(scene, hotPoints) {
      this.hotPointList = hotPoints;
      let poiObjects = [];
      let needUpdate = [];
      for (let i = 0; i < hotPoints.length; i++) {
        const item = hotPoints[i];
        const {sprite, annie} = await this.renderHotPoint(scene, item)
        poiObjects.push(sprite);
        if (annie) {
          needUpdate.push(annie)
        }
      }
      this.needUpdate = needUpdate;
      return poiObjects
    },
    // 寻找目标场景
    findTargetScene(id) {
      let i = -1;
      const target = this.doc.scenes.find((item, index) => {
        if (item.id === id) {
          i = index;
        }
        return item.id === id
      })
      return {scene: target, index: i}
    },

    initScene() {
      const scene = new THREE.Scene();
      this.scene = scene;
    },

    initCamera(element, data) {
      const width = element.clientWidth;
      const height = element.clientHeight;
      const camera = new THREE.PerspectiveCamera(data.params.fov, width / height, data.params.near, data.params.far);
      camera.position.set(data.cameraPos.x, data.cameraPos.y, data.cameraPos.z)
      this.camera = camera;
    },

    initRenderer(element) {
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(element.clientWidth, element.clientHeight)
      element.appendChild(renderer.domElement)
      this.renderer = renderer
    },
    initControls() {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls = controls;
    },

    // TODO:添加loading特效
    async initContent(data) {
      const texture = await this.textureLoaderHandle(data.url)
      const sphereMaterial = new THREE.MeshBasicMaterial(
          {map: texture});
      const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
      // 贴图内翻
      sphereGeometry.scale(1, 1, -1);
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.scene.add(sphere)
      this.sphere = sphere;
    },

    async init(data = this.doc.scenes[0]) {
      this.clock = new THREE.Clock();
      const container = document.getElementById('preview');
      this.container = container;
      this.initScene();
      this.initCamera(container, data);
      this.initRenderer(container);
      this.initControls(container);
      // 等待内容渲染完成，才去渲染热点
      this.initContent(data)
      // 渲染热点
      const points = data.hotSpots
      this.poiObjects = await this.renderPointList(this.scene, points)
      this.hotLabelStyles();
      this.render();

      console.log('this.camera:', this.camera)

      this.controls.addEventListener('change', () => {
        // this.uniqueId = randomString();
        this.hotLabelStyles();
      });
    },
    render() {
      this.renderer.render(this.scene, this.camera);
      this.updateHandle()
      this.timer = requestAnimationFrame(this.render);
    },
    // 点击热点的文字说明
    async pointLabelClickHandle(detail) {
      switch (detail.hotType) {
        case 'scene': {
          // 切换场景
          const {scene, index} = this.findTargetScene(detail.value);
          if (scene) {
            this.changeSceneHandle(scene, index)
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
    },

    resizeHandle() {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.renderer.setSize(width, height);
      //窗口宽高比
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      // this.uniqueId = randomString();
      this.hotLabelStyles()
    },
    /**
     *
     * @param texture 贴图
     * @param tilesHoriz 水平多少个
     * @param tilesVert 有多少行瓦片
     * @param numTiles 瓦片个数
     * @param tileDispDuration
     * @constructor
     */
    TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
      // note: texture passed by reference, will be updated by the update function.

      this.tilesHorizontal = tilesHoriz;
      this.tilesVertical = tilesVert;
      // how many images does this spritesheet contain?
      //  usually equals tilesHoriz * tilesVert, but not necessarily,
      //  if there at blank tiles at the bottom of the spritesheet.
      this.numberOfTiles = numTiles;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

      // how long should each image be displayed?
      this.tileDisplayDuration = tileDispDuration;

      // how long has the current image been displayed?
      this.currentDisplayTime = 0;

      // which image is currently being displayed?
      this.currentTile = this.numberOfTiles;

      this.update = function (milliSec) {
        this.currentDisplayTime += milliSec;

        while (this.currentDisplayTime > this.tileDisplayDuration) {
          this.currentDisplayTime -= this.tileDisplayDuration;
          this.currentTile--;
          if (this.currentTile === 0) {
            this.currentTile = this.numberOfTiles;
          }
          const currentColumn = this.currentTile % this.tilesHorizontal;
          texture.offset.x = currentColumn / this.tilesHorizontal;
          const currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
          texture.offset.y = currentRow / this.tilesVertical;
        }
      };
    },
    updateHandle() {
      const delta = this.clock.getDelta();
      this.needUpdate.forEach(item => {
        item.update(1000 * delta);
      })
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.init();
      this.container.addEventListener('click', this.pointClickHandle, false)
      window.addEventListener('resize', this.resizeHandle)
    })
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timer)
  }
}
</script>

<style scoped lang="scss">
.preview-dlg {
  #preview {
    height: 400px;
  }
}

.preview-wrapper {
  position: relative;
  overflow: hidden;
}

#preview {
  width: 100%;
  height: 100vh;
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
  visibility: hidden;

  .item__label {
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    word-break: keep-all;
    cursor: pointer;
  }
}

.scene-list {
  position: absolute;
  width: 100%;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  @include flex(center);
  background-color: rgba(0, 0, 0, 0.3);
}

.scene-item {
  position: relative;
  width: 60px;
  height: 60px;
  margin-right: 15px;
  border: 2px solid #fff;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__thumbnail {
    height: 100%;
  }

  &__label {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 3px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
  }

  &.is-active {
    border-color: $--color-primary;
  }
}
</style>
