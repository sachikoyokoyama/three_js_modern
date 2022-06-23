import './style.css'
import * as THREE from 'three';
import * as dat from 'lil-gui';

// UIデバッグを実装
const gui = new dat.GUI();

// キャンバスの取得
const canvas = document.querySelector('.webgl');

console.log(THREE);

// 必須の三要素

const scene = new THREE.Scene();

// size設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas, // これだけだと画面真っ暗
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


// obj
// material 
const material = new THREE.MeshPhysicalMaterial({ // 金属光沢だせるやーつ
  color: "#8ba9c1",
  metalness: 0.693, // 金属光沢
  roughness: 0.37, // 粗さ
  flatShading: true, // falseだとツルツルな表面になる
});

gui.addColor(material, 'color');
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

// ジオメトリ　=> 一気にメッシュしちゃう
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);// ドーナツ型
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), 
  material
  );
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);
scene.add(mesh1, mesh2, mesh3, mesh4);

// 回転用に配置
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

// -> 上記meshたちを配列に。
const meshes = [mesh1, mesh2, mesh3, mesh4];

// ライトを追加（平行光源）-> デフォルトは上から光が当たる
const directionalLight = new THREE.DirectionalLight("fff", 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

// ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // カメラのアスペクト比をアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); // お作法として呼び出す必要あり

  // レンダラーのアプデ
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);

});

// ホイールを実装
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (event) => {
  // console.log('ホイールされました');
  speed += event.deltaY * 0.0002; // eventの中にWheelというオブジェクトが入ってる
  console.log(event.deltaY);
  // ホイールを上に上げたのか、下げたのかdeltaYで調整できる
})

function rot() {
  rotation += speed;
  speed * 0.93;
  mesh1.position.x = rotation;
  window.requestAnimationFrame(rot);
}
rot();

// animation
const clock = new THREE.Clock();
const animate = () => {
  renderer.render(scene, camera);

  let getDelta = clock.getDelta(); //  フレーム単位を取得する

  // meshを回転させる
  // mesh1.rotation.x += 0.01; // x軸を基点にくるくる回る
  // mesh1.rotation.y += 0.01; // y軸を基点にくるくる回る、数字の部分で速度調整
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDelta;
    mesh.rotation.y += 0.12 * getDelta;
  }


  window.requestAnimationFrame(animate); //　マイフレームごとanimate()呼ぶ
  // pcのスペックによって回転速度が変わったりする-> getDeltaをかけて調節？
}

animate();