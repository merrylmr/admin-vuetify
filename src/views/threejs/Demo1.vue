<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

export default {
  name: 'threejs-demo1',
  mounted() {
    this.$nextTick(() => {
      var scene, camera, renderer, allTexture = {};

      function init() {
        let width = document.body.clientWidth;
        let height = document.body.clientHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 20, 100);
        renderer = new THREE.WebGLRenderer({
          // 反边缘锯齿
          antialias: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 1); //设置背景颜色
        document.getElementById('container').appendChild(renderer.domElement);

        new OrbitControls(camera, renderer.domElement)

        // 光源
        var point = new THREE.PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        scene.add(point); //点光源添加到场景中


        // var point2 = new THREE.PointLight(0xffffff);
        // point2.position.set(-400, -200, -300); //点光源位置
        // scene.add(point2); //点光源添加到场景中
        // 环境光
        var ambient = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambient);
        // // 方向光1
        // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        // directionalLight.position.set(400, 200, 300);
        // scene.add(directionalLight);
        // 方向光2
        // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        // directionalLight.position.set(-400, -200, -300);
        // scene.add(directionalLight);


        loadAllTexture();
        loadModel()
        console.log('allTexture', allTexture)
        loop();
      }

      function loadModel() {
        console.log('GLTFLoader', GLTFLoader)
        const loader = new GLTFLoader();
        loader.load(
            '3d/model.gltf',
            function (gltf) {
              scene.add(gltf.scene);
              console.log(gltf.scene.children[0].children);
              addMaterial(gltf.scene.children[0].children)
            },
            function (xhr) {
              //侦听模型加载进度
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function () {
              //加载出错时的回调
              console.log('An error happened');
            }
        );
      }

      function loadAllTexture(cb) {
        var loadIndex = 0;
        var textures = [1, 2, 3, 4];

        function loadNextTexture() {
          var textureName = textures[loadIndex];
          console.log('textureName', textureName);
          loadTexture('3d/textures/' + textureName + '.jpg',
              function (texture) {
                console.log('texture', texture)
                if (loadIndex < textures.length - 1) {
                  allTexture[textureName] = {
                    texture: texture
                  };
                  loadIndex++;
                  loadNextTexture()
                } else {
                  if (cb) cb();
                }
              });
        }

        loadNextTexture()
      }


      function loadTexture(filePath, cb) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(filePath, cb)
      }

      function loop() {
        requestAnimationFrame(loop);
        renderer.render(scene, camera);
      }

      function addMaterial(children) {
        for (let i = 0; i < children.length; i++) {
          const item = children[i];

          const red = ['Object011',
            'Object005',
            'bonnet',
            'Object010',
            'Object028',
            'Object007',
            'Object008',
            'Object004',
            'Object076',
            'Object001']
          if (red.includes(item.name)) {
            console.log('bonnet', allTexture['1'])
            item.material = new THREE.MeshStandardMaterial();
            item.material.map = allTexture["1"].texture;
          }
          const black = [
            'Object013',
            'Object032',
            'Object029',
            'Object030',
            'Object006',
            'Object054',
            'Object050',
            'Object056',
            'Object059',
            'Text001',
            'Object017',
            'Object018',
            'Object027',
            'Plane008',
            'Object014',
            'Text003',
            'Object012']
          if (black.includes(item.name)) {
            item.material = new THREE.MeshStandardMaterial();
            item.material.map = allTexture["3"].texture;
          }
          const opacityBlack = ['Object067', 'Object068'];
          if (opacityBlack.includes(item.name)) {
            item.material = new THREE.MeshStandardMaterial();
            item.material.map = allTexture["1"].texture;

            item.material.transparent = true;
            item.material.opacity = .6;
          }
          const gray = ['Object048', 'Object044'];
          if (gray.includes(item.name)) {
            item.material = new THREE.MeshStandardMaterial();
            item.material.map = allTexture["2"].texture;
            // item.material = new THREE.MeshPhongMaterial();
            // item.material.color = new THREE.Color(0x000);
            item.material.transparent = true;
            item.material.opacity = .9;
          }
          const white = ['Plane006']
          const yellow = ['Plane009']
          if (white.includes(item.name)) {
            item.material.color = new THREE.Color(0xffffff);
            // item.material = new THREE.MeshStandardMaterial();
            // item.material.map = allTexture["2"].texture;
          } else if (yellow.includes(item.name)) {
            item.material.color = new THREE.Color(0xffe300);
          }
        }
      }

      init()
    })
  }
}
</script>
<style scoped lang="scss">
#container {
  width: 100%;
  height: 768px;
}
</style>