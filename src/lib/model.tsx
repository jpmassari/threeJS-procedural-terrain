
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function loadGLTFModel(scene: THREE.Scene, glbPath: string, options: { receiveShadow: boolean, castShadow: boolean }) {
  const { receiveShadow, castShadow } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbPath,
      gltf => {
        const obj = gltf.scene;
        obj.name = 'balloon'
        obj.position.y = 0
        obj.position.x = 0
        obj.position.z = 0
        obj.scale.x = 2
        obj.scale.y = 2
        obj.scale.z = 2
        obj.receiveShadow = receiveShadow
        obj.castShadow = castShadow
        scene.add(obj)

        obj.traverse(function (child) {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = castShadow
            child.receiveShadow = receiveShadow
          }
        })
        resolve(obj)
      },
      undefined,
      function (error) {
        reject(error)
      }
    )
  })
}