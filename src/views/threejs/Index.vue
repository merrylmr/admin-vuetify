<template>
  <div class="editor-3d">
    <div class="header">
      <div class="header-wrapper">
        <div class="sub-title">作品标题</div>
        <div class="right">
          <v-btn class="ma-2" small outlined color="success">保存</v-btn>
          <v-btn class="ma-2" small outlined color="indigo">预览</v-btn>
        </div>
      </div>

    </div>
    <div class="content">
      <div class="left-sidebar">left-sidebar</div>
      <div class="stage">
        <div class="view-area"
             id="container">
        </div>
        <!--   这里：需要动态去设置宽高     -->
        <div class="help-frame">
          <v-btn
              class="btn"
              color="primary"
              small>把当前视觉设置为初始视觉
          </v-btn>
        </div>
      </div>
      <div class="right-sidebar">
        <div class="section">
          <div class="section-title">
            当前初始视觉
          </div>
          <div class="section-content"></div>
        </div>
        <div class="section">
          <div class="section-title">视觉（FOV）范围设置</div>
          <v-range-slider
              :min="0"
              :max="180"
              :range="range"
          ></v-range-slider>
          <v-row>
            <v-col cols="4">
              <v-text-field label="最近"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="初始"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="最远"></v-text-field>
            </v-col>
          </v-row>
          <!--  垂直视角限制         -->
        </div>
        <div class="section">
          <div class="section-title">
            垂直视觉限制
          </div>
          <div class="section-content"></div>
        </div>
        <div class="section">
          <div class="section-title">
            水平视觉限制
          </div>
          <div class="section-content"></div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'editor-3d',
  data() {
    return {
      range: [70, 120]
    }
  },
  methods: {
    init() {
      const container = document.getElementById('container');

      const width = container.clientWidth;
      const height = container.clientHeight;
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height)
      container.appendChild(renderer.domElement)


      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 100);
      camera.position.z = 0.01;

      const controls = new OrbitControls(camera, renderer.domElement);


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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
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
    padding: 20px;
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
  }
}

</style>