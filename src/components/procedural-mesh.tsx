import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';

import { MeshContainer } from './procedural-mesh-loader';

const ProceduralMesh: React.FC = () => {
  const refContainer = useRef<HTMLCanvasElement>()
  const [loading, setLoading] = useState<boolean>(true)
  const [renderer, setRenderer] = useState<THREE.WebGL1Renderer>()
  const [_camera, setCamera] = useState<THREE.PerspectiveCamera>()
  const [target] = useState<THREE.Vector3>(new THREE.Vector3(-0.5, 1.2, 0))

  const [scene] = useState<THREE.Scene>(new THREE.Scene())

  const handleWindowResize = useCallback(() => {
    const { current: container } = refContainer;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;

      renderer.setSize(scW, scH);
    }
  }, [renderer])

/* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    console.log("oi");
    const { current: container } = refContainer;
    if(container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      const renderer = new THREE.WebGL1Renderer({
        antialias: true,
      })
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      //Updating the DOM with plain JavaScript
      container.appendChild(renderer.domElement);
      setRenderer(renderer);
      const camera = new THREE.PerspectiveCamera(75, scW / scH, 0.1, 1000);
      camera.position.setZ(30);
      setCamera(camera);
      const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
      const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true });
      const torus = new THREE.Mesh(geometry, material);
      scene.add(torus)
      
      let req = null as unknown | number;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();
/*       return () => {
        console.log('unmount');
        cancelAnimationFrame(req as number);
        renderer.dispose();
      } */
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [renderer, handleWindowResize])

  return (
      <MeshContainer ref={refContainer}></MeshContainer>
  )
}

export default ProceduralMesh;