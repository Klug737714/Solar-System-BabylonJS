/// <reference path='./vendor/babylon.d.ts' />

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas, true);
//intro
/* function createScene() {
  const scene = new BABYLON.Scene(engine);

  //const camera = new BABYLON.FreeCamera("camera",new BABYLON.Vector3(0, 0, -10),scene);

  //const camera=new BABYLON.UniversalCamera('camera',new BABYLON.Vector3(0,0,-5))
  const camera = new BABYLON.FollowCamera(
    "camera",
    new BABYLON.Vector3(0, 25, -25),
    scene
  );
  camera.radius = 2;
  camera.attachControl(canvas, true);

  //const light = new BABYLON.HemisphericLight("light",new BABYLON.Vector3(0, 1, 0),scene);
  const light = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(5, -1, 0),
    scene
  );

  const box = BABYLON.MeshBuilder.CreateBox(
    "box",
    {
      size: 1,
    },
    scene
  );
  box.rotation.x = 2;
  box.rotation.y = 3;
  camera.lockedTarget = box;

  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    {
      segments: 32,
      diameter: 2,
    },
    scene
  );
  sphere.position = new BABYLON.Vector3(3, 0, 0);
  sphere.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

  const plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene);
  plane.position = new BABYLON.Vector3(-3, 0, 0);

  const points = [
    new BABYLON.Vector3(2, 0, 0),
    new BABYLON.Vector3(2, 1, 1),
    new BABYLON.Vector3(2, 1, 0),
  ];
  const lines = BABYLON.MeshBuilder.CreateLines("lines", { points }, scene);

  const material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseColor = new BABYLON.Color3(1, 0, 0);
  material.emissiveColor = new BABYLON.Color3(0, 1, 0);
  box.material = material;

  const material2 = new BABYLON.StandardMaterial("material2", scene);
  material2.diffuseTexture = new BABYLON.Texture(
    "assets/images/dark_rock.png",
    scene
  );
  sphere.material = material2;

  return scene;
} */
//Solar System
function createCamera(scene) {
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    0,
    15,
    BABYLON.Vector3.Zero(),
    scene
  );
  //let user move out camera
  camera.attachControl(canvas);
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 20;
}
function createLight(scene) {
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.5;
  light.groundColor = new BABYLON.Color3(0, 0, 1);
}

function createSun(scene) {
  const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
  sunMaterial.emissiveTexture = new BABYLON.Texture(
    "assets/images/sun.jpg",
    scene
  );
  sunMaterial.diffuseColor = BABYLON.Color3.Black();
  sunMaterial.specularColor = BABYLON.Color3.Black();
  const sun = BABYLON.MeshBuilder.CreateSphere(
    "sun",
    {
      segments: 16,
      diameter: 4,
    },
    scene
  );
  sun.material = sunMaterial;

  const sunLight = new BABYLON.PointLight(
    "sunLight",
    BABYLON.Vector3.Zero(),
    scene
  );
  sunLight.intensity = 2;
}
function createPlanet(scene) {
  const planetMaterial = new BABYLON.StandardMaterial("planetMaterial", scene);
  planetMaterial.diffuseTexture = new BABYLON.Texture("assets/images/sand.png");
  planetMaterial.specularColor = BABYLON.Color3.Black();

  const speeds = [0.01, -0.01, 0.02, 0.005, -0.02, -0.03, 0.03, -0.05];
  for (let i = 0; i < 8; i++) {
    const planet = BABYLON.MeshBuilder.CreateSphere(
      `planet${i}`,
      { segments: 16, diameter: 1 / i },
      scene
    );
    planet.position.x = 2 * i + 4;
    planet.material = planetMaterial;

    planet.orbit = {
      radius: planet.position.x,
      speed: speeds[i],
      angle: 0,
      rotationSpeed: 0.1,
    };

    scene.registerBeforeRender(() => {
      planet.position.x = planet.orbit.radius * Math.sin(planet.orbit.angle);
      planet.position.z = planet.orbit.radius * Math.cos(planet.orbit.angle);
      planet.orbit.angle += planet.orbit.speed;
      planet.rotation.y += planet.orbit.rotationSpeed;
    });
  }
}
function createSkybox(scene) {
  const skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.specularColor = BABYLON.Color3.Black();
  skyboxMaterial.diffuseColor = BABYLON.Color3.Black();

  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "assets/images/skybox/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;

  skybox.infiniteDistance = true;
  skybox.material = skyboxMaterial;
}
function createShip(scene) {
  BABYLON.SceneLoader.ImportMesh(
    "",
    "/assets/models/",
    "spaceCraft1.obj",
    scene,
    (meshes) => {
      console.log(meshes);
      meshes.forEach((mesh) => {
        mesh.position = new BABYLON.Vector3(0, -5, 10);
        mesh.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
      });
    }
  );
}
function createScene() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();
  createCamera();

  createLight(scene);

  createSun(scene);

  createPlanet(scene);

  createSkybox(scene);

  createShip(scene);

  return scene;
}
const mainScene = createScene();

engine.runRenderLoop(() => {
  mainScene.render();
});
