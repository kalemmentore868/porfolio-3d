import { GLTFLoader } from "./GLTFLoader.js";
import { OrbitControls } from "./OrbitControls.js";

const makeSceneCameraLight = (canvasId) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.setZ(30);
  camera.position.setX(-3);

  const pointLight = new THREE.PointLight(0xfffff);
  pointLight.position.set(-5, 0, 20);

  //add ambient lighting
  const ambientLight = new THREE.AmbientLight(0xffffff);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(canvasId),
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(400, 150);

  renderer.render(scene, camera);

  scene.add(camera, pointLight, ambientLight);

  return [scene, camera, pointLight, ambientLight, renderer];
};

const iconMaker = (scene, logoPath, xcord) => {
  const iconTexture = new THREE.TextureLoader().load(logoPath);
  const geometry = new THREE.BoxGeometry(7, 7, 7);
  const material = new THREE.MeshBasicMaterial({ map: iconTexture });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.setX(xcord);

  scene.add(sphere);

  return sphere;
};

const spinObject = (Obj) => {
  Obj.rotation.x += 0.01;
  Obj.rotation.y += 0.005;
  Obj.rotation.z += 0.01;
};

const makeIconLink = (mesh, url) => {
  THREEx.Linkify(domEvents, mesh, url, true);
};

const propicStuff = makeSceneCameraLight("#propic");

//load mi face
const loader = new GLTFLoader();

loader.load(
  // resource URL
  "./me.glb",
  // called when the resource is loaded
  function (gltf) {
    propicStuff[0].add(gltf.scene);
    gltf.scene.scale.setScalar(10);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

const mediaIcons = makeSceneCameraLight("#media-links");

const githubIcon = iconMaker(mediaIcons[0], "img/githublogo.png", -10);
const linkedInLogo = iconMaker(mediaIcons[0], "img/linkedinlogo.jpg", 10);
const instaLogo = iconMaker(mediaIcons[0], "img/instalogo.jpg", -30);

//add event listeners to 3D objects

const domEvents = new THREEx.DomEvents(mediaIcons[1], mediaIcons[4].domElement);

// domEvents.addEventListener(githubIcon, "mouseover", event => {
//     githubIcon.scale.setScalar(2)
// })

makeIconLink(githubIcon, "https://github.com/kalemmentore868");
makeIconLink(
  linkedInLogo,
  "https://www.linkedin.com/in/kalem-mentore-6319b121a/"
);
makeIconLink(instaLogo, "https://www.instagram.com/blank_868/");

const controls = new OrbitControls(propicStuff[1], propicStuff[4].domElement);

propicStuff[1].position.set(-3, 0, 30);
controls.update();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  spinObject(githubIcon);
  spinObject(linkedInLogo);
  spinObject(instaLogo);

  mediaIcons[4].render(mediaIcons[0], mediaIcons[1]);
  propicStuff[4].render(propicStuff[0], propicStuff[1]);
}

animate();
