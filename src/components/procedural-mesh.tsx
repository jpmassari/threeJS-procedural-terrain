import { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';

import { MeshContainer } from './procedural-mesh-loader';
import { useEffectOnce } from './hooks/UseEffectOnce';

let cols = 0;
let rows = 0;
const scale = 20;
const w = 1200;
const h = 800;
let terrain:any[] = [];
let flying = 0;
let count = 0;
const map_range = (value:number, low1:number, high1:number, low2:number, high2:number)  => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

const ProceduralMesh: React.FC = () => {
  const refContainer = useRef<HTMLCanvasElement>();
  const [loading, setLoading ] = useState<boolean>(true);
  const [ renderer, setRenderer ] = useState<THREE.WebGLRenderer>();
  const [ _camera, setCamera ] = useState<THREE.PerspectiveCamera>();
  const [ target]  = useState<THREE.Vector3>(new THREE.Vector3(-0.5, 1.2, 0));

  const [ scene ] = useState<THREE.Scene>(new THREE.Scene());

  const handleWindowResize = useCallback(() => {
    const { current: container } = refContainer;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      renderer.setSize(scW, scH);
    }
  }, [renderer])

/* eslint-disable react-hooks/exhaustive-deps */
  useEffectOnce(() => {
    const { current: container } = refContainer;
    cols = w/scale;
    rows = h/scale;
    count = rows*cols

    if(container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
/*       flying -= 0.1;
      let yoff = flying;
      const perlin = new ImprovedNoise(), z = Math.random() * 100; */
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      //Updating the DOM with plain JavaScript
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const camera = new THREE.PerspectiveCamera(75, scW / scH, 0.1, 1000);
      camera.position.setZ(30);
 /*      const camera = new THREE.PerspectiveCamera( 60, scW / scH, 0.1, 100 );
			camera.position.set( 10 * 0.9, 10 * 0.9, 10 * 0.9 );
      camera.position.setZ(2);
			camera.lookAt( 0, 0, 0 ); */
      setCamera(camera);

      const disposeArray = () => null
      
      /* geometry.translate(-w/2 , -h/2, 1) */
      const material = new THREE.MeshBasicMaterial({
        color: 0xFF6347, 
        wireframe: false
      });
      /* const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); */
      for(let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const geometry = new THREE.BufferGeometry();
          geometry.rotateX(Math.PI/2);
          const vertices = new Float32Array([
            -x*scale, -y*scale, 1.0,
            x*scale, -y*scale, 1.0,
            x*scale, y*scale, 1.0,

            x*scale, y*scale, 1.0,
            -x*scale, y*scale, 1.0,
            -x*scale, -y*scale, 1.0,
          ])
          geometry.setAttribute( 'position', new THREE.BufferAttribute(vertices, 3, false).onUpload(disposeArray));
          const mesh = new THREE.Mesh( geometry, material );
    /*       const edges = new THREE.EdgesGeometry( geometry );
          const line = new THREE.LineSegments( edges, lineMaterial ); */
          scene.add( mesh );
        }
      } 
      
    /*   const geometry = new THREE.PlaneGeometry( w, h, cols, rows );
      geometry.rotateX(Math.PI / 3);
      const vertices = geometry.attributes.position?.array; */
/*       for(let y = 0; y < rows; y++) {
          terrain.push([]);
          let xoff = 0;
          for(let x = 0; x < cols; x++) {
            terrain[y][x] = map_range(perlin.noise(xoff,yoff, z), 0, 5, -100, 100);
            xoff += 0.2;
          }
          yoff += 0.2;
      }
      for(let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols; x++) {
          geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( [x*scale, y*scale, terrain[y][x]] ), 3 ) );
          const edges = new THREE.EdgesGeometry( geometry );
          const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
        }
        p5.endShape();
      }  */
      let req = null as unknown | number;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
      return () => {
        console.log('unmount');
        cancelAnimationFrame(req as number);
        renderer.dispose();
      }
    }
  });

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [renderer, handleWindowResize]);

  return (
      <MeshContainer ref={refContainer}></MeshContainer>
  )
}

export default ProceduralMesh;