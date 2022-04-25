<template>
  <v-dialog
      max-width="800px"
      width="800px"
      :fullscreen="false"
      :value="visible"
      :overlay-opacity="0.8"
      @click:outside="closeHandle">
    <v-card>
      <!--      <v-card-title>作品预览</v-card-title>-->
      <div id="preview"
      >
      </div>
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
      poiObjects: []
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
    changeScene(data) {
      console.log('changeScene data', data)
      if (data.sphere) {
        this.sphere.material = data.sphere;
        // 相机位置更新
        const cameraPos = data.cameraPos;
        this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
        this.controls.update();
      } else {
        // TODO:切换场景这里，可增加动画过渡（https://juejin.cn/post/7047709128600322056#heading-13）
        // gsap.to
        const texture = new THREE.TextureLoader().load(data.url, () => {
          const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
          this.sphere.material = sphereMaterial;
          data.sphere = sphereMaterial;
          // 相机位置
          const cameraPos = data.cameraPos;
          this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
          // important:通过参数更新相机位置，必须调用controls的update才会生效
          this.controls.update();

        });


      }
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
            data.sphere = sphereMaterial;
            resolve(sphere)
          });
        })

      }

      const sphere = await renderModel(data.url);

      function render() {
        renderer.render(scene, camera);
        //  获取当前视觉的坐标（x,y,z）
      }

      controls.addEventListener('change', render);


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
        // sprite.scale.set(scaleX, scaleY, 0.1);
        const position = hotPoints[i].pos
        sprite.position.set(position.x, position.y, position.z)

        sprite.detail = item
        poiObjects.push(sprite);
        scene.add(sprite);
      }

      return poiObjects
    },
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

      function render() {
        renderer.render(scene, camera);
      }

      render();
      controls.addEventListener('change', render);


    },
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
              this.changeScene(scene);
              console.log('this.poiObjects', this.poiObjects)
            }
          }
            break;
          default:
            break;
        }
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
#preview {
  width: 100%;
  height: 400px;
}
</style>
