import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as CANNON from "cannon-es";
import { CANNONEvent } from "types";

export default async function Dice() {
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  const canvas = document.createElement("canvas");
  terrain.appendChild(canvas);
  const threeData = await setup(terrain);
  // HELPERS(threeData);
  const attackText = document.createElement("p");
  attackText.innerHTML = GameInstance.state === "attack" ? "You attack!" : "You defend!";
  attackText.classList.add("actionText");
  terrain.appendChild(attackText);
  throwDice(threeData.dice);
}

async function setup(terrain: HTMLDivElement) {
  const computed = getComputedStyle(terrain);
  const paddingWidth = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
  const paddingHeight = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
  const width = terrain.clientWidth - paddingWidth;
  const height = terrain.clientHeight - paddingHeight;
  const canva = document.querySelector("#terrain canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
  camera.position.y = 20; //default: 20
  camera.lookAt(0, 0, 0);
  const lights = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(lights);
  const renderer = new THREE.WebGLRenderer({ canvas: canva, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

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
  addWalls(scene, world);
  function animate() {
    requestAnimationFrame(animate);
    updatePosition(scene, ground.groundBody, ground.id);
    updatePosition(scene, dice.diceBody, dice.id);
    world.fixedStep();
    renderer.render(scene, camera);
  }
  animate();
  return { scene, camera, renderer, dice };
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
  const diceSize = 1;
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
  diceBody.position.set(0, 0, 0);

  diceBody.addEventListener("sleepy", getDiceValue);
  diceBody.addEventListener("sleep", getDiceValue);

  return { dice, diceBody, id };
}

async function addGround(
  scene: THREE.Scene,
  world: CANNON.World,
  contactMaterial: CANNON.ContactMaterial
) {
  const geo = new THREE.PlaneGeometry(1000, 1000);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
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
  groundBody.position.set(0, 0, 0);
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
  renderer,
  dice
}: {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  dice: {
    dice: THREE.Group;
    diceBody: CANNON.Body;
    id: number;
  };
}) {
  // const controls = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);
  const diceAxesHelper = new THREE.AxesHelper(5);
  if (dice) {
    dice.dice.add(diceAxesHelper);
  }
}

function updatePosition(scene: THREE.Scene, body: CANNON.Body, objectId: number) {
  const mesh = scene.getObjectById(objectId) as THREE.Mesh;
  // @ts-ignore
  mesh.position.copy(body.position);
  // @ts-ignore
  mesh.quaternion.copy(body.quaternion);
}

function throwDice(dice: { diceBody: CANNON.Body; id: number; dice: THREE.Group } | CANNON.Body) {
  const x = Math.random() * 2 - 1;
  const z = Math.random() * 2 - 1;
  if (dice instanceof CANNON.Body) {
    dice.applyImpulse(new CANNON.Vec3(10, 10, 10), new CANNON.Vec3(x, -1, z));
    return;
  }
  dice.diceBody.applyImpulse(new CANNON.Vec3(10, 10, 10), new CANNON.Vec3(x, -1, z));
}
function getDiceValue(e: CANNONEvent) {
  const dice = e.target;
  dice.allowSleep = false;
  GameInstance = globalThis.GameInstance;
  const euler = new CANNON.Vec3();
  dice.quaternion.toEuler(euler);

  const eps = 0.1;
  let isZero = (angle: number) => Math.abs(angle) < eps;
  let isHalfPi = (angle: number) => Math.abs(angle - 0.5 * Math.PI) < eps;
  let isMinusHalfPi = (angle: number) => Math.abs(0.5 * Math.PI + angle) < eps;
  let isPiOrMinusPi = (angle: number) =>
    Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;
  if (isZero(euler.z)) {
    if (isZero(euler.x)) {
      GameInstance.state === "attack" ? GameInstance.attack(2) : GameInstance.defend(2);
    } else if (isHalfPi(euler.x)) {
      GameInstance.state === "attack" ? GameInstance.attack(4) : GameInstance.defend(4);
    } else if (isMinusHalfPi(euler.x)) {
      GameInstance.state === "attack" ? GameInstance.attack(3) : GameInstance.defend(3);
    } else if (isPiOrMinusPi(euler.x)) {
      GameInstance.state === "attack" ? GameInstance.attack(5) : GameInstance.defend(5);
    } else {
      // landed on edge => wait to fall on side and fire the event again
      dice.allowSleep = true;
      throwDice(dice);
    }
  } else if (isHalfPi(euler.z)) {
    GameInstance.state === "attack" ? GameInstance.attack(1) : GameInstance.defend(1);
  } else if (isMinusHalfPi(euler.z)) {
    GameInstance.state === "attack" ? GameInstance.attack(6) : GameInstance.defend(6);
  } else {
    // landed on edge => wait to fall on side and fire the event again
    dice.allowSleep = true;
    throwDice(dice);
  }
}

function addDebugDot(
  elem: {
    dice: THREE.Group;
    diceBody: CANNON.Body;
    id: number;
  },
  pos: { x: number; y: number; z: number }
) {
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  dot.position.set(pos.x, pos.y, pos.z);
  elem.dice.add(dot);
}

function addWalls(scene: THREE.Scene, world: CANNON.World) {
  const color = 0x999999;
  const wallLeft = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC
  });
  world.addBody(wallLeft);
  wallLeft.position.set(-10, 0, 0);
  wallLeft.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);

  const wallLeftMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100),
    new THREE.MeshBasicMaterial({ color })
  );
  //@ts-ignore
  wallLeftMesh.position.copy(wallLeft.position);
  //@ts-ignore
  wallLeftMesh.quaternion.copy(wallLeft.quaternion);
  scene.add(wallLeftMesh);

  const wallRight = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC
  });
  world.addBody(wallRight);
  wallRight.position.set(10, 0, 0);
  wallRight.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);

  const wallRightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color })
  );
  //@ts-ignore
  wallRightMesh.position.copy(wallRight.position);
  //@ts-ignore
  wallRightMesh.quaternion.copy(wallRight.quaternion);
  scene.add(wallRightMesh);

  const wallTop = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC
  });
  world.addBody(wallTop);
  wallTop.position.set(0, 0, -5);
  wallTop.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -Math.PI / 2);

  const wallTopMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color })
  );
  //@ts-ignore
  wallTopMesh.position.copy(wallTop.position);
  //@ts-ignore
  wallTopMesh.quaternion.copy(wallTop.quaternion);
  scene.add(wallTopMesh);

  const wallBottom = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC
  });
  world.addBody(wallBottom);
  wallBottom.position.set(0, 0, 5);
  wallBottom.quaternion.setFromEuler(0, Math.PI, 0);

  const wallBottomMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color })
  );
  //@ts-ignore
  wallBottomMesh.position.copy(wallBottom.position);
  //@ts-ignore
  wallBottomMesh.rotation.set(Math.PI, 0, Math.PI);
  scene.add(wallBottomMesh);
}
