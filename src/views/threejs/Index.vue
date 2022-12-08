<template>
  <div class="editor-3d">
    <div class="header">
      <div class="header-wrapper">
        <div class="sub-title">{{ doc.name }}</div>
        <div class="right">
          <v-btn class="ma-2" small outlined color="success"
                 @click="saveAction">保存
          </v-btn>
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
        <div class="wrapper">
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
               :key="uniqueId"
               v-if="$route.name==='hot' && !isLoading">
            <div class="hotStop-item"
                 :class="{'is-active':item.id===_.get(activePoint,'id')}"
                 @mousedown="pointDownHandle($event,item)"
                 v-for="(item,index) in hotSpots"
                 :style="transformStyle(item.pos,item)"
                 :key="index">
              <img :src="SYS_ICON_MAP1[item.iconPath]||item.iconPath">
              <!--      说明、注释渲染        -->
              <div class="point-item__label"
                   v-if="_.get(item,'title.show')">
                {{ item.title.label }}
              </div>
            </div>
          </div>
          <!-- 沙盘 -->
          <div class="sand-table-box"
               v-if="$route.name==='sandTable'"
               id="sandTableBox">
            <div class="img"
            >
              <img :src="doc.sandTable.url" draggable="false">
            </div>
            <div class="marker-list">
              <div class="marker-item"
                   v-for="(item,index) in doc.sandTable.markers"
                   :key="index"
                   :class="{'is-active':activeMarkerIndex===index}"
                   :style="{left:item.pos.x+'px',top:item.pos.y+'px'}"
                   @mousedown="markerItemDownHandle($event,item,index)">
                <div class="marker-item__outline"
                >
                  <div class="marker-item__circle"
                       :style="{transform:`rotate(${item.angle}deg)`}">
                    <div class="marker-item__point"
                         @mousedown.stop.prevent="pointMouseDownHandle($event,item,index)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  场景列表  -->
        <div class="scene-list">
          <div class="scene-item"
               v-for="(item,index) in doc.scenes"
               :key="index"
               :class="{'is-active':index===activeIndex}"
               @click="changeSceneHandle(index)">
            <img :src="item.url" alt="">
            <div class="scene-item__name">{{ item.name }}</div>
          </div>
          <div class="scene-item plus">
            <v-icon v-text="'mdi-plus'"></v-icon>
            <div>添加场景</div>
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
            <div class="section-title">视觉范围设置</div>
            <v-text-field
                label="初始视场（FOV）"
                :max="179"
                :min="1"
                v-model.number="params.fov"
                @change="changeFovParamsHandle">
            </v-text-field>
            <v-range-slider
                :min="0.1"
                :max="2000"
                :step="0.1"
                :value="[params.near,params.far]"
                @input="changeHandle($event,'fov')"
            ></v-range-slider>
            <v-row>
              <v-col cols="6">
                <v-text-field
                    label="最近(near)"
                    v-model.number="params.near">
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                    label="最远(far)"
                    v-model.number="params.far">
                </v-text-field>
              </v-col>
            </v-row>
          </div>
        </div>
        <div v-else-if="$route.name==='hot'">
          <HotSpot
              :list="hotSpots"
              :activePoint="activePoint"
              :doc="_.cloneDeep(doc)"
              @addPoint="addPointHandle"
              @change="changePointHandle"
              @cancel="cancelPointHandle"
              @delPoint="delPointHandle">
          </HotSpot>
        </div>
        <!-- 沙盘 -->
        <div v-else-if="$route.name==='sandTable'"
        >
          <SandTable
              :sand-table="doc.sandTable"
              :doc="doc"
              :activeIndex="activeMarkerIndex"
              @change="changeSandTableHandle"
              @changeIndex="changeMarkerIndexHandle"
          ></SandTable>
        </div>
      </div>
    </div>
    <v-dialog
        v-if="isShowPreviewDlg"
        max-width="800px"
        width="800px"
        :fullscreen="false"
        :value="isShowPreviewDlg"
        :overlay-opacity="0.8"
        content-class="preview-dlg"
        @click:outside="isShowPreviewDlg=false">
      <PreviewDlg
          :doc="doc"
      >
      </PreviewDlg>
    </v-dialog>
  </div>
</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import PreviewDlg from './comps/Preview.vue'
import html2canvas from "html2canvas";
import HotSpot from './comps/HotSpot.vue'
import SandTable from './comps/SandTable';
import {ICON_MAP, SYS_ICON_MAP1} from '@/assets/js/const.js'


import docJSON from 'json/doc.json'
import {randomString} from '@/assets/js/utils.js'

import {pointInSceneView, screenVector2World, worldVector2Screen} from './common.js'

export default {
  name: 'editor-3d',
  data() {
    return {
      ICON_MAP,
      SYS_ICON_MAP1,
      scene: null,
      renderer: null,
      camera: null,
      container: null,
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
          icon: 'mdi-record-circle-outline'
        },
        {
          label: '沙盘',
          value: 'sandTable',
          icon: 'mdi-map-marker-outline'
        }
      ],
      activeName: 'view',
      isLoading: true,

      doc: docJSON,
      // 当前编辑item的索引值
      activeIndex: 0,
      controls: null,
      // 选中的热点
      activePoint: {},
      uniqueId: '',
      // 每个场景的透视相机参数
      params: {},
      sphere: null,
      activeMarkerIndex: 0,
    }
  },
  components: {PreviewDlg, HotSpot, SandTable},
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
    activeItem() {
      return this.doc.scenes[this.activeIndex]
    },
    // 当前编辑场景的热点列表
    hotSpots() {
      return this.doc.scenes[this.activeIndex].hotSpots
    },
  },
  methods: {
    // 添加热点：
    addPointHandle(data) {
      // 计算pos,当前窗口的中间位置
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const pos = screenVector2World({x: centerX, y: centerY}, this.container, this.camera);
      console.log('pos:', pos)
      const point = this._.cloneDeep(data);
      point.pos = pos;
      this.doc.scenes[this.activeIndex].hotSpots.push(point);
      this.activePoint = point
    },
    // 选中的热点属性变化
    changePointHandle(data) {
      this.activePoint = this._.cloneDeep(data);
      this.setActivePoint(data);
    },
    // 取消选中的热点
    cancelPointHandle() {
      this.activePoint = {};
    },
    // 删除热点
    delPointHandle() {
      const points = this.doc.scenes[this.activeIndex].hotSpots;
      const index = points.findIndex(item => {
        return item.id === this.activePoint.id
      })
      points.splice(index, 1)
      this.activePoint = {};
    },
    // 生成缩略图
    createThumbnail() {
      if (this.$route.name !== 'view') return
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
    // 图片资源加载器
    textureLoaderHandle(url) {
      return new Promise((resolve) => {
        const pointTexture = new THREE.TextureLoader().load(url, () => {
          resolve(pointTexture)
        });
      })
    },

    async init() {
      this.isLoading = true;
      const container = document.getElementById('container');
      this.container = container;
      const data = this.doc.scenes[0];
      this.initScene();
      this.initCamera(container, data);
      this.initRenderer(container);
      this.initControls(container);
      await this.initContent(data)
      this.render();
      this.isLoading = false;
    },
    render() {
      this.renderer.render(this.scene, this.camera);
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
      this.doc.scenes[this.activeIndex].cameraPos = this._.cloneDeep(this.camera.position);
      // 获取水平角度
      this.doc.scenes[this.activeIndex].angleX = this.controls.getAzimuthalAngle() * 180 / Math.PI;
      this.createThumbnail()
    },
    // 切换左侧菜单
    changeMenu(item) {
      this.activeName = item.value;
      this.$router.push({
        name: item.value
      })
    },

    // 判断是点击还是拖拽
    pointDownHandle(e, item) {
      console.log('pointDownHandle:', e, item)
      e.preventDefault();
      let isDragging = false;
      const setDragTrue = () => {
        isDragging = true;
      }

      let timer = setTimeout(setDragTrue, 200)

      const target = e.currentTarget;
      let transform = target.style.transform;
      const reg = /translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/;
      transform = transform.match(reg);

      let translateX = parseInt(transform[1]);
      let translateY = parseInt(transform[2]);


      let startPos = {
        x: e.clientX,
        y: e.clientY
      }

      const mouseMoveHandle = (e) => {
        isDragging = true;

        const diffX = e.clientX - startPos.x;
        const diffY = e.clientY - startPos.y;
        translateX += diffX;
        translateY += diffY;

        startPos = {
          x: e.clientX,
          y: e.clientY
        }
        target.style.transform = `translateZ(0px) translate(${translateX}px,${translateY}px) translate(-40px,-40px)`
      }

      const mouseUpHandle = () => {
        if (!isDragging) {
          clearTimeout(timer);
          this.clickPointHandle(item);
          console.log('mouse up');
        } else {
          isDragging = false;
          console.log('drag over');
          const pos = screenVector2World({
            x: translateX,
            y: translateY
          }, this.container, this.camera)
          item.pos = {
            x: pos.x,
            y: pos.y,
            z: pos.z,
          };
        }
        document.body.removeEventListener('mousemove', mouseMoveHandle)
        document.body.removeEventListener('mouseup', mouseUpHandle)
      }
      document.body.addEventListener('mousemove', mouseMoveHandle)
      document.body.addEventListener('mouseup', mouseUpHandle)
    },
    findSandMarkerIndex(sceneId) {
      const sandTable = this.doc.sandTable.markers;
      console.log('sandTable:', sandTable)
      return sandTable.findIndex(item => {
        return item.sceneId === sceneId
      })

    },
    // 切换场景
    async changeSceneHandle(index) {
      const scene = this.doc.scenes[index];
      if (this.$route.name === 'sandTable') {
        this.activeMarkerIndex = this.findSandMarkerIndex(scene.id)
        console.log('activeMarkerIndex:', this.activeMarkerIndex);
      }
      this.activeIndex = index;
      this.params = scene.params;
      // 选中的热点置空
      this.activePoint = {};
      // TODO:当前的场景重新渲染 + 生成缩略图
      if (this.activeItem.shape) {
        this.sphere.material = this.activeItem.shape;
      } else {
        // const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
        // sphereGeometry.scale(1, 1, -1);

        const texture = await this.textureLoaderHandle(this.activeItem.url)
        const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
        this.sphere.material = sphereMaterial;
        this.activeItem.shape = sphereMaterial;
      }

      this.camera.fov = this.params.fov;
      this.camera.near = this.params.near;
      this.camera.far = this.params.far;
      // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用
      this.camera.updateProjectionMatrix();

      // 相机位置
      const cameraPos = this.activeItem.cameraPos;
      this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
      // important:通过参数更新相机位置，必须调用controls的update才会生效
      this.controls.update();
      this.renderer.render(this.scene, this.camera)

      this.createThumbnail();
    },

    // 修改相机的参数，更新像机投影矩阵
    changeFovParamsHandle() {
      this.camera.fov = this.params.fov;
      this.camera.near = this.params.near;
      this.camera.far = this.params.far;
      // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera)
    },

    // 设置选中的热点
    setActivePoint(data) {
      const points = this.doc.scenes[this.activeIndex].hotSpots;
      const index = points.findIndex(item => {
        return item.id === data.id
      })
      points.splice(index, 1, data)
    },

    clickPointHandle(item) {
      this.activePoint = item;
    },

    saveAction() {
      console.log('saveAction doc:', JSON.stringify(this.doc))
    },
    initScene() {
      const scene = new THREE.Scene();
      this.scene = scene;
    },
    initRenderer(element) {
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(element.clientWidth, element.clientHeight)
      element.appendChild(renderer.domElement)
      this.renderer = renderer
    },

    initCamera(element, data) {
      const width = element.clientWidth;
      const height = element.clientHeight;
      const camera = new THREE.PerspectiveCamera(data.params.fov, width / height, data.params.near, data.params.far);
      camera.position.set(data.cameraPos.x, data.cameraPos.y, data.cameraPos.z)
      this.camera = camera;
    },

    initControls() {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls = controls;
    },

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
    resizeHandle() {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.renderer.setSize(width, height);
      //窗口宽高比
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    // 沙盘数据修改
    changeSandTableHandle(data) {
      this.doc.sandTable = data;
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
    markerItemDownHandle(e, item, i) {
      let startX = e.clientX;
      let startY = e.clientY;

      const mouseMove = (e) => {
        const x = e.clientX;
        const y = e.clientY;

        const diffX = x - startX;
        const diffY = y - startY;


        // TODO:边界条件判断
        item.pos.x += diffX;
        item.pos.y += diffY;

        startX = e.clientX;
        startY = e.clientY;
      }
      const moveUp = () => {
        if (this.activeMarkerIndex !== i) {
          this.activeMarkerIndex = i;
          // 切换场景
          const {index} = this.findTargetScene(item.sceneId);
          this.changeSceneHandle(index);
        }
        document.body.removeEventListener('mousemove', mouseMove)
        document.body.removeEventListener('mouseup', moveUp)
      }
      document.body.addEventListener('mousemove', mouseMove)
      document.body.addEventListener('mouseup', moveUp)
    },
    // 拖拽旋转
    pointMouseDownHandle(e, item, index) {
      const nodeList = this.$el.querySelectorAll('.marker-item');
      const dom = nodeList[index].querySelector('.marker-item__outline');
      const domRect = dom.getBoundingClientRect();

      const centerPos = {
        x: domRect.width / 2 + domRect.x,
        y: domRect.height / 2 + domRect.y,
      }
      let mouseMove = (e) => {
        const curMouse = {
          x: e.clientX,
          y: e.clientY,
        }
        // https://blog.csdn.net/wjlhanhan/article/details/109668342
        const radians = Math.atan2(curMouse.x - centerPos.x, curMouse.y - centerPos.y);
        let angle = (radians * (180 / Math.PI) * -1) + 180
        // 沙盘旋转角度转化到相机
        console.log('angle:', angle)
        item.angle = angle;


        this.doc.sandTable.markers[index].angle = angle;

        // this.rotate2cameraPos(angle)
      }

      let mouseUp = () => {
        console.log('mouseup')
        document.body.removeEventListener('mousemove', mouseMove)
        document.body.removeEventListener('mouseup', mouseUp)
      }

      document.body.addEventListener('mousemove', mouseMove)
      document.body.addEventListener('mouseup', mouseUp)
    },
    // 已知水平角度，转化成相机的坐标
    // https://www.wjceo.com/blog/threejs2/2018-12-05/181.html
    rotate2cameraPos(angle) {
      // 距离
      const r = this.controls.object.position.distanceTo(this.controls.target);
      // 垂直方向角度（y轴）
      const phi = this.controls.getPolarAngle();
      // 水平方向的角度（x轴）
      const theta = angle * Math.PI / 180;
      const controls = this.controls;
      const x = r * Math.cos(phi - Math.PI / 2) * Math.sin(theta) + controls.target.x;
      const y = r * Math.sin(phi + Math.PI / 2) + controls.target.y;
      const z = r * Math.cos(phi - Math.PI / 2) * Math.cos(theta) + controls.target.z;
      controls.object.position.set(x, y, z);
      controls.object.lookAt(controls.target);
      console.log('x:', x, 'y:', y, 'z:', z)
      this.doc.scenes[this.activeIndex].cameraPos = {x, y, z}
      controls.update();
    },

    changeMarkerIndexHandle(i, item) {
      this.activeMarkerIndex = i;
      //  切换场景
      const {index} = this.findTargetScene(item.sceneId);
      this.changeSceneHandle(index)
    }
  },
  mounted() {
    this.activeName = this.$route.name;
    this.params = this.doc.scenes[this.activeIndex].params;

    this.$nextTick(async () => {
      await this.init();

      const controlChangeHandle = () => {
        this.uniqueId = randomString()
        this.render();
        // 获取水平的角度
        const angleX = this.controls.getAzimuthalAngle() * 180 / Math.PI;

        if (this.activeMarkerIndex === -1) return
        const marker = this.doc.sandTable.markers[this.activeMarkerIndex];
        const {scene} = this.findTargetScene(marker.sceneId);
        marker.angle += (angleX - scene.angleX);
        marker.angle = marker.angle % 360;
        scene.angleX = angleX
        console.log('angleX：', angleX, marker.angle, 'this.initAngleX:', this.initAngleX, angleX)
      }
      this.controls.addEventListener('change', controlChangeHandle);
      window.addEventListener('resize', this.resizeHandle);
      // 生成场景缩略图
      this.createThumbnail();
    })
  },
}
</script>


<style scoped lang="scss">
.editor-3d {
  height: 100vh;
  overflow: hidden;
}

.header {
  height: 40px;
  border-bottom: 1px solid #eee;
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
    @include flex();
    flex-direction: column;

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

      border-radius: 5px;
      cursor: pointer;
      width: 80px;
      height: 80px;
      transform-origin: 50% 50%;
      pointer-events: auto;
      background-color: rgba(0, 0, 0, 0.1);

      &.is-active {
        border: 3px solid orange;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .point-item__label {
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        word-break: keep-all;
      }
    }
  }

  .wrapper {
    flex: auto;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .scene-list {
    width: 100%;
    height: 100px;
    @include flex();

    .scene-item {
      position: relative;
      width: 80px;
      height: 80px;
      border: 1px solid #eee;
      border-radius: 3px;
      margin-top: 10px;
      margin-right: 10px;
      cursor: pointer;

      &.is-active {
        border: 2px solid $--color-primary;
      }


      &.plus {
        @include flex(center, center);
        flex-direction: column;
        cursor: pointer;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &__name {
        position: absolute;
        width: 100%;
        height: 30px;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        text-align: center;
        padding-top: 5px;
      }
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

.sand-table-box {
  width: 200px;
  position: absolute;
  right: 10px;
  top: 10px;

  .img {
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    -webkit-user-drag: none;
    user-drag: none;
    user-select: none;
  }
}

.marker-item {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: blue;
  border: 2px solid #fff;

  &.is-active {
    background-color: orange;

    .marker-item__outline {
      display: block;
    }
  }

  &__outline {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid orange;
    border-radius: 50%;
    display: none;
  }

  &__circle {
    position: absolute;
    width: 2px;
    height: 15px;
    left: 50%;
    top: 0;
    background-color: transparent;
    transform-origin: 0 15px;
  }

  &__point {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: ew-resize;
  }
}
</style>

