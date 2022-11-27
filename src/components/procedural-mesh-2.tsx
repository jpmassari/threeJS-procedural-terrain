import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

import { Container } from './canvas-loader';
import { useEffectOnce } from './hooks/UseEffectOnce';

let cols = 0;
let rows = 0;
const scale = 5;
const w = 400;
const h = 400;
let count = 0;
let flying = 0;

const map_range = (value:number, low1:number, high1:number, low2:number, high2:number)  => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

const ProceduralMesh2: React.FC = () => {
  const refContainer = useRef<HTMLCanvasElement>();
  const refRenderer = useRef<THREE.WebGLRenderer>();

  const handleWindowResize = useCallback(() => {
    const { current: container } = refContainer;
    const { current: renderer } = refRenderer;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      renderer.setSize(scW, scH);
    }
  },[])

  useEffectOnce(() => {
    const { current: container } = refContainer;
    const { current: renderer } = refRenderer;
    cols = w/scale;
    rows = h/scale;
    count = rows*cols

    if(container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.25;
      renderer.outputEncoding = THREE.sRGBEncoding;

      //Updating the DOM with plain JavaScript
      container.appendChild(renderer.domElement);
      refRenderer.current = renderer;

      const scene = new THREE.Scene();
      const pmremGenerator = new THREE.PMREMGenerator( renderer );
      scene.background = new THREE.Color( 0x000000 );
			scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

      const camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.z = 200;
      scene.add( camera );
      /* camera.lookAt(target) */

      /* const ambientLight = new THREE.AmbientLight( 0x000000 );
			scene.add( ambientLight );
      
			const light1 = new THREE.PointLight( 0xffffff, 1, 0);
			light1.position.set( -10, 0, 150 );
			scene.add( light1 );

			const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
			light2.position.set( 100, 200, 100 );
			scene.add( light2 );

			const light3 = new THREE.PointLight( 0xffffff, 1, 0 );
			light3.position.set( - 100, - 200, - 100 );
			scene.add( light3 ); */

    /*   const material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF, 
        wireframe: true,
      });
       */
      
      const geometry = new THREE.PlaneGeometry( w, h, cols, rows );
      geometry.rotateX(Math.PI/2);

      /* geometry.rotateY(-Math.PI/4 + 20); */
      /* const geometry = new THREE.SphereGeometry( 80, 64, 32 ); */
      const textureLoader = new THREE.TextureLoader();

      const normalMap2 = textureLoader.load( 'Water_1_M_Normal.jpg' );
      const texture = textureLoader.load( '/joaop1gmail_golden_texture_8631bb40-c49a-4ba8-a71e-fafded33d670.png' );
      const clearcoatNormalMap = textureLoader.load( 'Scratched_gold_01_1K_Normal.png' );

      const material = new THREE.MeshPhysicalMaterial({ 
        clearcoat: 1.0,
        metalness: 1.0,
        color: 0xff0000,
        side: THREE.DoubleSide,
        normalMap: normalMap2,
        normalScale: new THREE.Vector2( 0.15, 0.15 ),
        clearcoatNormalMap: clearcoatNormalMap,
        // y scale is negated to compensate for normal map handedness.
        clearcoatNormalScale: new THREE.Vector2( 2.0, - 2.0 )
      })
      

      const mesh = new THREE.Mesh( geometry, material );
      mesh.rotateX(Math.PI/2)
      /* mesh.rotateZ(0.1);
      mesh.rotateX(0.1); */
      scene.add( mesh );    
   
      let req = null as unknown | number;
      const animate = () => {
        req = requestAnimationFrame(animate);
        render(geometry);
        renderer.render(scene, camera);
      }
      animate();
      return () => {
        cancelAnimationFrame(req as number);
        renderer.domElement.remove();
        renderer.dispose();
      }
    }
  });
  const render = (geometry: THREE.PlaneBufferGeometry) => {
    const time = Date.now() * 0.0001;
    const perlin = new ImprovedNoise(), z = time;
    const position = geometry.attributes.position;
    
    flying += 0.001;
    if(position) {
      let xoff = Math.sin( time / 4 );
      let yoff = Math.sin( time / 2) + flying;
        for(let i = 0; i < position.count; i++) {
          position.setY(i, map_range(perlin.noise(xoff, yoff, 30), 0, 10, -100, 100));
          xoff += Math.sin(0.2);
          yoff += 0.2;
        }
      geometry.computeVertexNormals();
      position.needsUpdate = true;
    }
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [handleWindowResize]);

  return (
      <Container ref={refContainer}></Container>
  )
}

export default ProceduralMesh2;