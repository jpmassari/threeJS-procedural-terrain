import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { useRef, useEffect, useState } from 'react';

import { MeshContainer } from './procedural-mesh-loader';
import { useEffectOnce } from './hooks/UseEffectOnce';

const PerformanceUI: React.FC = () => {
  const refContainer = useRef<HTMLCanvasElement>();
  const [renderer, setRenderer] = useState<THREE.WebGL1Renderer>() 

  /* eslint-disable react-hooks/exhaustive-deps */ 
  useEffectOnce(() => {
    const { current: container } = refContainer;
    if(container && !renderer) {
      const stats = Stats();
      container.appendChild(stats.domElement)
      const renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias:true
       });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);
      const animate = () => {
        requestAnimationFrame(animate)
        stats.update();
      }
      animate();
    }
  });

  return (
      <MeshContainer ref={refContainer}></MeshContainer>
  )
}

export default PerformanceUI;




