import {
  Color,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

import World from "./classes/World";
import Player from "./classes/Player";
import Camera from "./classes/Camera";
import Lights from "./classes/Lights";
import Ray from "./classes/Ray";

const scene = new Scene();
scene.background = new Color(0x78c9f2);

const renderer = new WebGLRenderer({ antialiasing: true });

const stats = new Stats();
const callPanel = stats.addPanel(new Stats.Panel("Calls", "#ff8", "#221"));
const geometryPanel = stats.addPanel(
  new Stats.Panel("Geometries", "#ff8", "#221")
);
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0";
document.body.appendChild(stats.domElement);

const mouse = new Vector2();
mouse.isPressed = false;

const world = new World();

// Third person view
const player = new Player(world);
const camera = new Camera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const lights = new Lights(camera);
lights.add(scene);

const raycaster = new Ray();

// const controls = new THREE.OrbitControls(camera);

export function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.gammaOutput = true;
  document.body.appendChild(renderer.domElement);

  scene.add(player.mesh);
  world.addTo(scene);
}

export function animate() {
  requestAnimationFrame(animate);

  // Third person controls
  raycaster.setFromCamera(mouse, camera);
  const distance = raycaster.getDistance(scene, player);

  if (mouse.isPressed) {
    player.move(distance);
    player.updateHeight(world);
  }

  camera.update(player.mesh.position);
  world.update(player.mesh.position, scene);

  // controls.update();
  callPanel.update(renderer.info.render.calls, 460);
  geometryPanel.update(renderer.info.memory.geometries, 460);
  stats.update();
  renderer.render(scene, camera);
}

function moveMouse(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function handleClick() {
  mouse.isPressed = !mouse.isPressed;
}

window.addEventListener("mousemove", moveMouse);
window.addEventListener("mousedown", handleClick);
window.addEventListener("mouseup", handleClick);
window.addEventListener("touchstart", handleClick);
window.addEventListener("touchend", handleClick);
window.addEventListener("touchmove", moveMouse);
