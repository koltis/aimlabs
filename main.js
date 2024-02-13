import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import Stats from "three/examples/jsm/libs/stats.module";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  document.querySelector(".left").style.display = "none";
  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.01;
  const far = 300;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 20);
  camera.lookAt(0, 2, 0);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  const loader = new THREE.TextureLoader();
  const controls = new PointerLockControls(camera, canvas);
  const menuPanel = document.getElementById("menuPanel");
  const startButton = document.getElementById("startButton");
  document.querySelector(".left").display = "none";
  startButton.addEventListener(
    "click",
    function () {
      controls.lock();
    },
    false
  );
  controls.addEventListener("lock", () => {
    menuPanel.style.display = "none";
    document.querySelector(".left").style.display = "block";
  });
  controls.addEventListener("unlock", () => {
    menuPanel.style.display = "block";
    document.querySelector(".left").style.display = "none";
  });

  const stats = new Stats();
  document.body.appendChild(stats.dom);
  {
    const planeSize = 40;

    const texture = loader.load(
      "https://threejs.org/manual/examples/resources/images/checker.png"
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  {
    const planeSize = 30;

    const texture = loader.load(
      "https://threejs.org/manual/examples/resources/images/checker.png"
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(40, planeSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);

    scene.add(mesh);
  }
  {
    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    );

    const planeSize = 1;

    const numSpheres = 3;
    for (let i = 0; i < numSpheres; ++i) {
      // make a base for the shadow and the sphere.
      // so they move together.
      const base = new THREE.Object3D();
      scene.add(base);

      const u = i / numSpheres;
      const x = THREE.MathUtils.lerp(-12, 12, Math.random());
      const y = THREE.MathUtils.lerp(1, 10, Math.random());
      // add the shadow to the base
      // note: we make a new material for each sphere
      // so we can set that sphere's material transparency
      // separately.

      // add the sphere to the base

      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(u, 1, 0.75);
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(x, y, 1);
      base.add(sphereMesh);

      // remember all 3 plus the y position
    }
  }

  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 0.75;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xffffff;
    const intensity = 2.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }
  const raycaster = new THREE.Raycaster();

  window.addEventListener("click", () => {
    const rect = canvas.getBoundingClientRect();
    const center = document.querySelector(".left").getBoundingClientRect();
    console.log(center);
    const pickPosition = {
      x: ((center.left - rect.left) / canvas.width) * 2 - 1,
      y: ((center.top - rect.top) / canvas.height) * -2 + 1,
    };
    console.log(pickPosition);
    raycaster.setFromCamera(pickPosition, camera);
    const intersectedObjects = raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      const object = intersectedObjects[0].object;
      if (object.parent.type !== "Scene") {
        object.position.x = THREE.MathUtils.lerp(-12, 12, Math.random());
        object.position.y = THREE.MathUtils.lerp(1, 10, Math.random());
      }
    }
  });
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  function render(time) {
    time *= 0.001; // convert to seconds

    resizeRendererToDisplaySize(renderer);
    stats.update();
    {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
