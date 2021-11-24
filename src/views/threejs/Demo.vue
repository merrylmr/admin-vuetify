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


      function renderByBox() {
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
      }

      function renderBySphere() {
        const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
        sphereGeometry.scale(1, 1, -1);

        const texture = new THREE.TextureLoader().load('3d/images/scene.jpeg');
        const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere)
      }

      let shape = 'sphere';
      if (shape === 'box') {
        renderByBox();
      } else {
        renderBySphere()
      }
      window.addEventListener('resize', onWindowResize);

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

      }


      function animate() {

        requestAnimationFrame(animate);

        controls.update(); // required when damping is enabled

        renderer.render(scene, camera);

      }

      animate()

      return {scene, camera, container}
    }
  },
  mounted() {
    this.$nextTick(() => {
      const {camera, scene, container} = this.init();

      function renderPoints() {
        const hotPoints = [{
          position: {
            x: 0,
            y: 0,
            z: -0.2
          },
          detail: {
            "title": "信息点1"
          }
        },
          {
            position: {
              x: -0.2,
              y: -0.05,
              z: 0.2
            },
            detail: {
              "title": "信息点2"
            }
          }]
        const pointTexture = new THREE.TextureLoader().load('3d/images/hot.png');
        const material = new THREE.SpriteMaterial({map: pointTexture});

        let poiObjects = [];
        for (let i = 0; i < hotPoints.length; i++) {
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(0.1, 0.1, 0.1);
          const position = hotPoints[i].position
          console.log('position', position)
          sprite.position.set(position.x, position.y, position.z)

          scene.add(sprite);

          sprite.detail = hotPoints[i].detail;
          poiObjects.push(sprite);
        }
        return poiObjects
      }

      const poiObjects = renderPoints();
      container.addEventListener('click', function (event) {
        console.log('container click1111');
        event.preventDefault();

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / document.body.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / document.body.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(poiObjects);

        if (intersects.length > 0) {
          alert('点击了热点' + intersects[0].object.detail.title)
        }
      })
    })
  }
}
</script>