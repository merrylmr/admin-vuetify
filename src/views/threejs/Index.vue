<template>
  <div class="editor-3d">
    <div class="header">
      <div class="header-wrapper">
        <div class="sub-title">作品标题</div>
        <div class="right">
          <v-btn class="ma-2" small outlined color="success">保存</v-btn>
          <v-btn class="ma-2" small outlined color="indigo"
                 @click="isShowPreviewDlg=true">预览
          </v-btn>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left-sidebar">
        <ul class="menu-list">
          <li
              class="menu-item"
              v-for="(item,index) in menuNav"
              :key="index"
              :class="{'is-active':activeName===item.value}"
              @click="changeMenu(item)">
            <div class="menu-item__icon">
              <v-icon v-text="item.icon"></v-icon>
            </div>
            <div class="menu-item__label">{{ item.label }}</div>
          </li>
        </ul>
      </div>
      <div class="stage">
        <div class="view-area"
             id="container">
        </div>

        <div class="help-frame"
             v-if="$route.name==='view'">
          <v-btn
              class="btn"
              color="primary"
              small
              @click="setCameraPosHandle">把当前视觉设置为初始视角
          </v-btn>
        </div>
        <!--热点列表-->
        <div class="hotSpot-list"
             v-if="$route.name==='hot' && !isLoading">
          <div class="hotStop-item"
               @mousedown="pointMoveStartHandle($event,item)"
               v-for="(item,index) in hotSpots"
               :style="transformStyle(item.pos)"
               :key="index">
            <img :src="item.iconPath">
          </div>
        </div>
      </div>
      <div class="right-sidebar">
        <div v-if="$route.name==='view'">
          <div class="section">
            <div class="section-title">
              当前初始视觉
            </div>
            <div class="section-content">
              <div id="preview-thumbnail">

              </div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">视觉（FOV）范围设置</div>
            <v-range-slider
                :min="0.1"
                :max="180"
                :step="0.1"
                :value="[params.near,params.far]"
                @input="changeHandle($event,'fov')"
            ></v-range-slider>
            <v-row>
              <v-col cols="4">
                <v-text-field label="最近"
                              v-model="params.near"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field label="初始"
                              v-model="params.fov"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field label="最远"
                              v-model="params.far"></v-text-field>
              </v-col>
            </v-row>
            <!--  垂直视角限制         -->
          </div>
          <div class="section">
            <div class="section-title">
              垂直视觉限制
            </div>
            <div class="section-content">
              <v-range-slider
                  :min="-90"
                  :max="180"
                  :value="[params.minPolarAngle,params.maxPolarAngle]"
                  @input="changeHandle($event,'vertical')"
              ></v-range-slider>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                      label="最低"
                      v-model="params.minPolarAngle"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      label="最高"
                      v-model="params.maxPolarAngle"></v-text-field>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="section">
            <div class="section-title">
              水平视觉限制
            </div>
            <div class="section-content">
              <v-range-slider
                  :min="-180"
                  :max="180"
                  :value="[params.minAzimuthAngle,params.maxAzimuthAngle]"
                  @input="changeHandle($event,'horizontal')"
              ></v-range-slider>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                      label="最左"
                      v-model="params.minAzimuthAngle"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      label="最右"
                      v-model="params.maxAzimuthAngle"></v-text-field>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
        <div v-else-if="$route.name==='hot'">
          <HotSpot></HotSpot>
        </div>
      </div>
    </div>
    <PreviewDlg
        v-if="isShowPreviewDlg"
        :visible="isShowPreviewDlg"
        :params="params"
        :camera-pos="cameraPos"
        @close="isShowPreviewDlg=false">
    </PreviewDlg>
  </div>
</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import PreviewDlg from './comps/Preview.vue'
import html2canvas from "html2canvas";
import HotSpot from './comps/HotSpot.vue'
// TODO: 水平和垂直的角度需要再修改修改
// 热点：
// 第一步：实现可以拖拽
// 第二步：位置坐标转化，随着鼠标的滚动、拖拽
// 第三步： camera旋转时候， 位置改变（世界坐标系转屏幕坐标系）
export default {
  name: 'editor-3d',
  data() {
    return {
      // 相机参数
      params: {
        near: 0.1,
        far: 100,
        fov: 90,
        // 最大仰角和俯视角
        minPolarAngle: -90,
        maxPolarAngle: 90,
        // 水平方向视角限制
        minAzimuthAngle: -180,
        maxAzimuthAngle: 180,
      },
      camera: null,
      container: null,
      cameraPos: {
        x: 0,
        y: 0,
        z: 0.1
      },
      isShowPreviewDlg: false,
      menuNav: [
        {
          label: '基础',
          value: 'basic',
          icon: 'mdi-format-list-bulleted'
        },
        {
          label: '视角',
          value: 'view',
          icon: 'mdi-eye-outline'
        },
        {
          label: '热点',
          value: 'hot',
          icon: 'mdi-map-marker-outline'
        }
      ],
      activeName: 'view',
      // 热点列表
      hotSpots: [
        {
          iconPath: 'img/new_spotd1_gif.png',
          pos: {
            x: 0,
            y: 0,
            z: 0
          }
        }
      ],
      isLoading: true
    }
  },
  components: {PreviewDlg, HotSpot},
  computed: {
    transformStyle() {
      return (point) => {
        const pos = this.worldVector2Screen(point);
        return {
          transform: `translate(${pos.x}px,${pos.y}px) translate(-40px,-40px)`
        }
      }

    }
  },
  methods: {
    createThumbnail() {
      if (this.$route.name !== 'view') return
      console.log('this.$route.name', this.$route.name);
      const dom = document.querySelector('#container');
      const thumbnailDom = document.querySelector('#preview-thumbnail');
      html2canvas(dom, {
        useCORS: true,
        allowTaint: false,
      }).then(canvas => {
        thumbnailDom.innerHTML = ''
        thumbnailDom.appendChild(canvas);
      })


    },
    async init() {
      this.isLoading = true;
      const container = document.getElementById('container');

      const width = container.clientWidth;
      const height = container.clientHeight;
      const renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height)
      container.appendChild(renderer.domElement)


      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(this.params.fov, width / height, this.params.near, this.params.far);
      camera.position.set(0, 0, 0.1)

      this.camera = camera;

      const controls = new OrbitControls(camera, renderer.domElement);

      controls.minPolarAngle = this.degToRad(this.params.minPolarAngle)
      controls.maxPolarAngle = this.degToRad(this.params.maxPolarAngle)

      controls.minAzimuthAngle = this.degToRad(this.params.minAzimuthAngle);
      controls.maxAzimuthAngle = this.degToRad(this.params.maxAzimuthAngle);


      function renderModel(url) {
        return new Promise((resolve) => {
          const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
          sphereGeometry.scale(1, 1, -1);
          const texture = new THREE.TextureLoader().load(url, () => {
            const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            scene.add(sphere)
            resolve();
          });
        })
      }

      await renderModel('3d/images/scene.jpeg');
      render();
      this.isLoading = false;

      function render() {
        renderer.render(scene, camera);
        //  获取当前视觉的坐标（x,y,z）
      }


      function resizeHandle() {
        console.log('resizeHandle1111')
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        const k = width / width;//窗口宽高比
        camera.aspect = k;
        camera.updateProjectionMatrix();
      }

      window.addEventListener('resize', resizeHandle);

      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      const axisHelper = new THREE.AxisHelper(25000);
      scene.add(axisHelper);

      this.container = container;
      return {scene, camera, controls, renderer, container}
    },

    renderHotPoints(scene) {
      const pointTexture = new THREE.TextureLoader().load('img/new_spotd1_gif.png');
      const material = new THREE.SpriteMaterial({map: pointTexture});

      let poiObjects = []
      for (let i = 0; i < this.hotSpots.length; i++) {
        let sprite = new THREE.Sprite(material);
        sprite.scale.set(0.1, 0.1, 0.1);

        const position = this.hotSpots[i].pos;
        console.log('position:', position)
        sprite.position.set(position.x, position.y, position.z)

        scene.add(sprite)
        poiObjects.push(sprite);
      }
      return poiObjects
    },
    // 角度转弧度
    degToRad(deg) {
      return Math.PI / 180 * deg
    },
    changeHandle(v, key) {
      switch (key) {
        case 'horizontal':
          this.params.minAzimuthAngle = v[0];
          this.params.maxAzimuthAngle = v[1];
          break;
        case 'vertical':
          this.params.minPolarAngle = v[0];
          this.params.maxPolarAngle = v[1];
          break;
        case 'fov':
          this.params.near = v[0];
          this.params.far = v[1];
          break;
        default:
          break;
      }
    },
    // 设置当前视觉
    setCameraPosHandle() {
      this.cameraPos = this.camera.position;
      // this.camera.updateProjectionMatrix();
      // console.log('this.camera', this.camera);
      this.createThumbnail()
    },
    changeMenu(item) {
      this.activeName = item.value;
      this.$router.push({
        name: item.value
      })
    },
    //TODO: 边界情况处理
    pointMoveStartHandle(e) {
      // 操作的是样式（style.transform）
      console.log('e.currentTarget', e.currentTarget)
      const target = e.currentTarget;
      console.log('target', target.style.transform);
      let transform = target.style.transform;
      const reg = /translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/;
      transform = transform.match(reg);


      let translateX = parseInt(transform[1]);
      let translateY = parseInt(transform[2]);

      console.log('translateX', translateX)
      console.log('translateY', translateY)
      e.preventDefault();
      let startPos = {
        x: e.clientX,
        y: e.clientY
      }

      const mouseMoveHandle = (e) => {
        console.log('mouseMoveHandle:', e)

        const diffX = e.clientX - startPos.x;
        const diffY = e.clientY - startPos.y;

        translateX += diffX;
        translateY += diffY;

        startPos = {
          x: e.clientX,
          y: e.clientY
        }

        console.log('diffX', diffX, diffY)
        target.style.transform = `translate(${translateX}px,${translateY}px) translate(-40px,-40px)`
      }
      const mouseUpHandle = (e) => {
        console.log('mouseUpHandle:', e)
        // 转化成世界坐标，存储
        document.body.removeEventListener('mousemove', mouseMoveHandle)
        document.body.removeEventListener('mouseup', mouseUpHandle)
      }
      document.body.addEventListener('mousemove', mouseMoveHandle)
      document.body.addEventListener('mouseup', mouseUpHandle)
    },
    // 矢量坐标转化成平面坐标点
    vectorToPos(vector3) {
      console.log('vector', vector3);
      const width = window.innerWidth - 51 - 230;
      const height = window.innerHeight - 41;
      console.log('width:', width, 'height:', height);
      // const sceneCenter = this.cameraPos;
    },
    worldVector2Screen(center) {
      // 相对于相机的位置（{x:0,y:0,z:0.1}）
      const cameraPos = this.camera.position;

      const worldVector = new THREE.Vector3(center.x, center.y, center.z);
      const stdVector = worldVector.project(this.camera);
      console.log('stdVector:', stdVector);
      const a = this.container.clientWidth / 2;
      const b = this.container.clientHeight / 2;

      console.log('a:', a, 'b:', b)
      const x = Math.round(stdVector.x * a + a);
      const y = Math.round(stdVector.y * b + b);

      console.log('this.camera.position', cameraPos);

      const worldVector1 = new THREE.Vector3(
          Number((cameraPos.x).toFixed(16)),
          Number((cameraPos.y).toFixed(16)),
          Number((cameraPos.z).toFixed(16)));
      const stdVector1 = worldVector1.project(this.camera);
      console.log('stdVector1', stdVector1)
      const x1 = Math.round(stdVector1.x * a + a);
      const y1 = Math.round(stdVector1.y * b + b);

      console.log('x:', x, 'y:', y)
      console.log('x1:', x1, 'y1:', y1)
      return {x, y}
    },

    // transformStyle(point) {
    //   const pos = this.worldVector2Screen(point);
    //   return {
    //     transform: `translate(${pos.x}px,${pos.y}px) translate(-40px,-40px)`
    //   }
    // },
  },
  mounted() {
    this.activeName = this.$route.name;
    this.$nextTick(async () => {
      const {scene, camera, controls, renderer} = await this.init();

      // const poiObjects = this.renderHotPoints(scene)

      function changeHandle() {
        renderer.render(scene, camera);
        console.log('camera.position', camera.position)

        // console.log('poiObjects', poiObjects, camera)
        // poiObjects[0].scale.set(0.2, 0.2, 0.2)
      }

      controls.addEventListener('change', changeHandle);


      this.createThumbnail();
    })
  },
  watch: {
    params: {
      handler(n, o) {
        console.log('new', n, 'old', o)
        if (!this._.isEqual(n, o)) {
          console.log('new', n, 'old', o)
        }
      },
      deep: true
    }
  }
}
</script>


<style scoped lang="scss">
.editor-3d {
  height: 100vh;
}

.header {

  height: 40px;
  border-bottom: 1px solid #eee;
  //@include flex(flex-start, center);


  .header-wrapper {
    text-align: center;
    max-width: 1920px;
    line-height: 40px;
  }

  .sub-title {
    display: inline-block;
  }

  .right {
    float: right;

  }

}


.content {
  width: 100%;
  height: calc(100vh - 40px);
  @include flex(space-between);

  .left-sidebar {
    width: 50px;
    height: 100%;
    border-right: 1px solid #eee;
    flex: none;
  }

  .stage {
    flex: auto;
    height: 100%;
    //padding: 20px;
    position: relative;

    .view-area {
      width: 100%;
      height: 100%;
    }

    .help-frame {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 75%;
      height: 74%;
      background: url('/img/view_frame.png') no-repeat;
      background-size: contain;
      background-position: center;
      pointer-events: none;

      .btn {
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translate(-50%, 0);
        pointer-events: auto;
      }
    }

    .hotSpot-list {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      user-select: none;
      pointer-events: none;
    }

    .hotStop-item {
      position: absolute;
      border: 3px solid orange;
      border-radius: 5px;
      cursor: pointer;
      width: 80px;
      height: 80px;
      transform-origin: 50% 50%;
      pointer-events: auto;
    }
  }

  .right-sidebar {
    width: 230px;
    height: 100%;
    border-left: 1px solid #eee;
    flex: none;
    padding: 0 5px;
  }
}

.section {
  &-title {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
  }
}

#preview-thumbnail {
  width: 100%;
  height: 120px;

  ::v-deep canvas {
    width: 100% !important;
    height: 100% !important;
  }
}

.menu-list,
.menu-list .menu-item {
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-item {
  cursor: pointer;
  @include flex(center, center);
  flex-direction: column;
  padding: 5px 0 !important;

  &.is-active {
    background-color: #5e35b1 !important;

    .menu-item__icon i,
    .menu-item__label {
      color: #fff;
    }
  }

  &__icon {
    i {
      font-size: 18px;
    }
  }

  &__label {
    font-size: 12px;
    color: #666;
  }
}
</style>