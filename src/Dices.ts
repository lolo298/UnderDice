import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as CANNON from "cannon-es";

export async function setupDice() {
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  const canvas = document.createElement("canvas");
  terrain.appendChild(canvas);
  const threeData = await setup(terrain);
  HELPERS(threeData);
}

async function setup(terrain: HTMLDivElement) {
  const computed = getComputedStyle(terrain);
  const paddingWidth = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
  const paddingHeight = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
  const width = terrain.clientWidth - paddingWidth;
  const height = terrain.clientHeight - paddingHeight;
  const canva = document.querySelector("#terrain canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
  camera.position.y = 1000;
  const lights = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(lights);
  const renderer = new THREE.WebGLRenderer({ canvas: canva });
  renderer.setSize(width, height);

  const world = setupPhysics();
  const contactMaterial = new CANNON.ContactMaterial(
    new CANNON.Material("ground"),
    new CANNON.Material("dice"),
    {
      restitution: 0.3
    }
  );
  world.addContactMaterial(contactMaterial);
  const ground = await addGround(scene, world, contactMaterial);
  const dice = await addDice(scene, world, contactMaterial);
  const btn = document.createElement("button");
  btn.innerHTML = "Add impulse";
  btn.addEventListener("click", () => {
    throwDice(dice.diceBody);
  });
  document.querySelector("#app")?.appendChild(btn);
  function animate() {
    requestAnimationFrame(animate);
    updatePosition(scene, ground.groundBody, ground.id);
    updatePosition(scene, dice.diceBody, dice.id);
    world.fixedStep();
    renderer.render(scene, camera);
  }
  animate();
  return { scene, camera, renderer };
}

function setupPhysics() {
  const world = new CANNON.World();
  world.gravity.set(0, -50, 0);
  world.allowSleep = true;
  return world;
}

async function addDice(
  scene: THREE.Scene,
  world: CANNON.World,
  contactMaterial: CANNON.ContactMaterial
) {
  //* setup dice model
  const dice = await loadGLTF("dice.glb");
  if (!dice) throw new Error("dice not loaded");
  const diceSize = 70;
  scene.add(dice);
  dice.position.set(0, 0, 0);
  dice.scale.set(diceSize, diceSize, diceSize);
  const id = dice.id;

  //* setup dice physics
  const diceBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(diceSize, diceSize, diceSize)),
    material: contactMaterial.materials[1],
    allowSleep: true,
    sleepSpeedLimit: 0.1,
    sleepTimeLimit: 1
  });
  world.addBody(diceBody);
  diceBody.position.set(-700, 700, 0);

  console.log("added dice");

  diceBody.addEventListener("sleepy", (e) => {
    console.log("sleepy", e);
  });

  dice.addEventListener("sleep", (e) => {
    console.log("sleep", e);
  });

  return { dice, diceBody, id };
}

async function addGround(
  scene: THREE.Scene,
  world: CANNON.World,
  contactMaterial: CANNON.ContactMaterial
) {
  const geo = new THREE.PlaneGeometry(1000, 1000);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const ground = new THREE.Mesh(geo, material);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const id = ground.id;

  const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: contactMaterial.materials[0],
    type: CANNON.Body.STATIC
  });
  world.addBody(groundBody);
  groundBody.position.set(0, -100, 0);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

  return { ground, groundBody, id };
}

async function loadGLTF(path: string) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(path);
  return gltf.scene;
}

function addDebugCube(scene: THREE.Scene) {
  const cube = new THREE.BoxGeometry(100, 100, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubeMesh = new THREE.Mesh(cube, material);
  scene.add(cubeMesh);
}

function HELPERS({
  scene,
  camera,
  renderer
}: {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}) {
  const controls = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);
}

function updatePosition(scene: THREE.Scene, body: CANNON.Body, objectId: number) {
  const mesh = scene.getObjectById(objectId) as THREE.Mesh;
  // @ts-ignore
  mesh.position.copy(body.position);
  // @ts-ignore
  mesh.quaternion.copy(body.quaternion);
}

function throwDice(dice: CANNON.Body) {
  console.log("throwing dice");
  //the dice have a mass of 0, so they are static. We need to give them a mass to be able to throw them
  dice.mass = 5;
  dice.updateMassProperties();
  console.log(dice.mass);
  dice.applyImpulse(new CANNON.Vec3(500, 0, 0), new CANNON.Vec3(0, 70, 50));
  // world.frictionGravity = new CANNON.Vec3(10, 10, 10);
}
