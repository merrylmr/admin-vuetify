<template>
  <div class="two">
    <div id="container">

    </div>
  </div>
</template>


<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {
  methods: {
    init() {
      const scene = new THREE.Scene();
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        50, 0, 0,
        0, 100, 0,
        0, 0, 10,
        0, 0, 100,
        50, 0, 10
      ])
      const attribute = new THREE.BufferAttribute(vertices, 3);
      geometry.attributes.position = attribute;

      const colors = new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        1, 1, 0,
        0, 1, 1,
        1, 0, 1
      ])

      geometry.attributes.color = new THREE.BufferAttribute(colors, 3)


      function mesh() {
        const material = new THREE.MeshBasicMaterial({
          vertexColors: THREE.VertexColors,
          side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      }


      function point() {
        const material = new THREE.PointsMaterial({
          vertexColors: THREE.VertexColors,
          size: 10.0
        })
        const points = new THREE.Points(geometry, material)

        scene.add(points);
      }


      function line() {
        const material = new THREE.LineBasicMaterial({
          vertexColors: THREE.VertexColors,
        })
        const line = new THREE.Line(geometry, material);//线条模型对象
        scene.add(line);
      }


      function geometryX() {
        const geometry1 = new THREE.BoxGeometry(100, 100, 100);
        console.log('geometry1.faces', geometry1, geometry1.faces);


        geometry1.faces.forEach(face => {
          face.vertexColors = [
            new THREE.Color(0xffff00),
            new THREE.Color(0xff00ff),
            new THREE.Color(0x00ffff),
          ]
        });
        const material = new THREE.MeshBasicMaterial({
          vertexColors: THREE.FaceColors
        })
        const mesh = new THREE.Mesh(geometry1, material)
        scene.add(mesh)
      }


      function shadow() {
        const geometry = new THREE.BoxGeometry(40, 100, 40);
        const material = new THREE.MeshLambertMaterial({
          color: 0x0000ff
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 设置产生投影的网格模型
        mesh.castShadow = true;

        const planeGeometry = new THREE.PlaneGeometry(300, 200);
        const planMaterial = new THREE.MeshLambertMaterial({
          color: 0x999999
        });
        // 平面网格模型作为投影面
        const planeMesh = new THREE.Mesh(planeGeometry, planMaterial);
        scene.add(planeMesh);

        planeMesh.rotateX(-Math.PI / 2);
        planeMesh.position.y = -50;
        // 设置接收阴影的投影面
        planeMesh.receiveShadow = true;

        //   方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(60, 100, 40);
        scene.add(directionalLight);

        //   设置用于计算阴影的光源对象
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 300;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.rigth = 50;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -100;
        // directionalLight.shadow.mapSize.set(1024,1024)

        // 聚光光源
        const spotLight = new THREE.SpotLight(0xffffff);
        // 设置聚光光源位置
        spotLight.position.set(50, 90, 50);
        // 设置聚光光源发散角度
        spotLight.angle = Math.PI / 6
        scene.add(spotLight); //光对象添加到scene场景中
        // 设置用于计算阴影的光源对象
        spotLight.castShadow = true;
        // 设置计算阴影的区域，注意包裹对象的周围
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 300;
        spotLight.shadow.camera.fov = 20;
      }

      const mode = 'shadow'
      switch (mode) {
        case 'point':
          point()
          break;
        case 'mesh':
          mesh();
          break;
        case 'line':
          line();
          break;
        case 'geometry':
          geometryX();
          break;
        case 'shadow':
          shadow()
          break;
        default:
          break;
      }

      //   环境光
      const ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);

      //  相机设置
      const width = window.innerWidth;
      const height = window.innerHeight;
      const k = width / height;
      const s = 200;

      const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      camera.position.set(250, 300, 200);
      camera.lookAt(scene.position)

      //  创建渲染器对象
      const renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setClearColor(0xb9d3ff, 1);
      const container = document.getElementById('container');
      container.appendChild(renderer.domElement);

      function render() {
        renderer.render(scene, camera)
      }

      render()
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', render)

      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      const axisHelper = new THREE.AxisHelper(250);
      scene.add(axisHelper);
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log('two init');
      this.init()
    })
  }
}
</script>