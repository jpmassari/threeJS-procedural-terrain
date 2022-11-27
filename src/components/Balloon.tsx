import { useRef, useEffect, useState, useCallback  } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

import { useEffectOnce } from './hooks/UseEffectOnce';
import { Container } from './canvas-loader';
import { loadGLTFModel } from '../lib/model';

const easeOutCirc = (x: number) => {
  return Math.sqrt(1 - Math.pow(x - 1, 4));
}

const Balloon: React.FC = () => {
  const refContainer = useRef<HTMLCanvasElement>();
  const refRenderer = useRef<THREE.WebGLRenderer>();

  const handleWindowResize = useCallback(() => {
    const { current: container } = refContainer;
    const { current: renderer } = refRenderer;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      renderer.setSize(scW, scH)
    }
  },[])

  useEffectOnce(() => {
    const { current: container } = refContainer;
    const { current: renderer } = refRenderer;
    if (container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;


      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
      refRenderer.current = renderer;
      
      const scene = new THREE.Scene();
      const pmremGenerator = new THREE.PMREMGenerator( renderer );
      /* scene.background = new THREE.Color( 0xffffff ); */
			scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
      //640 -> 240
      //8 -> 6
      const scale = scH * 0.005 + 192;
      console.log(scale);
      const initialCameraPosition = new THREE.Vector3(
        20 * Math.sin(0.2 * Math.PI),
        0,
        20 * Math.cos(0.2 * Math.PI)
      )
      const target = new THREE.Vector3(-0.5, 1.2, 0);
      const camera = new THREE.OrthographicCamera(-scale, scale-100, scale, -scale, 0.01, 50000);
      camera.position.copy(initialCameraPosition);
      camera.lookAt(target);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.target = target;

      loadGLTFModel(scene, '/scene.glb',{
        receiveShadow: false,
        castShadow: true
      }).then(() => {
        animate();
      })

      let req = null as unknown | number;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);

        frame = frame <= 100 ? (
          frame + 1
         ) : (
          frame
        )
        if (frame <= 100) {
          const p = initialCameraPosition;
          const rotSpeed = -easeOutCirc(frame/120) * Math.PI * 20;

          /* camera.position.y = 10; */
          camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
          camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
          camera.lookAt(target);
        } else {
          controls.update();
        }
        renderer.render(scene, camera);
      }
      return () => {
        cancelAnimationFrame(req as number);
        renderer.domElement.remove();
        renderer.dispose()
      }
    }
  })
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false);
    return () => (
      window.removeEventListener('resize', handleWindowResize, false)
    )
  }, [handleWindowResize])
  return (
    <Container ref={refContainer}></Container>
  )
}

export default Balloon;