import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

import { Container } from './canvas-loader';
import { useEffectOnce } from './hooks/UseEffectOnce';

let cols = 0;
let rows = 0;
const scale = 25;
const w = 400;
const h = 400;
let count = 0;
let flying = 0;

const map_range = (value:number, low1:number, high1:number, low2:number, high2:number)  => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

const GoldenMesh: React.FC = () => {
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
      renderer.outputEncoding = THREE.sRGBEncoding;
      //Updating the DOM with plain JavaScript
      container.appendChild(renderer.domElement);
      refRenderer.current = renderer;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color( 0x000000 );

      const camera = new THREE.PerspectiveCamera(75, scW / scH, 0.1, 1000);
      camera.position.setZ(600);
      camera.position.setX(-300);
      /* camera.lookAt(target) */

    /*   const material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF, 
        wireframe: true,
      });
       */
      
      const geometry = new THREE.PlaneGeometry( w, h, cols, rows );
      geometry.rotateX(Math.PI/2);
      geometry.rotateY(-Math.PI/4 + 20);

      const texture = new THREE.TextureLoader().load( '/joaop1gmail_golden_texture_8631bb40-c49a-4ba8-a71e-fafded33d670.png' );

      const material = new THREE.MeshBasicMaterial({ 
        map: texture
      })
      const mesh = new THREE.Mesh( geometry, material );
      mesh.rotateZ(0.1);
      mesh.rotateX(0.1);
      scene.add( mesh );    

      let req = null as unknown | number;
      const animate = () => {
        req = requestAnimationFrame(animate);
        /* render(geometry); */
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
  const render = (geometry:THREE.PlaneGeometry) => {
 		const time = Date.now() * 0.0001;
    const perlin = new ImprovedNoise(), z = time;
    const position = geometry.attributes.position;
    flying += 0.001;
    if(position) {
      let xoff = Math.sin( time / 4 );
      let yoff = Math.sin( time / 2) + flying;
        for(let i = 0; i < position.count; i++) {
          /* const y = 35 * Math.sin( i / 5 + ( time + i ) / 7 ); */
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

export default GoldenMesh;