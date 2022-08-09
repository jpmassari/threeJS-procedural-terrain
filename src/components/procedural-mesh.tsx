import { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { MeshContainer } from './procedural-mesh-loader';
import { useEffectOnce } from './hooks/UseEffectOnce';
import { DoubleSide, FlatShading, WireframeGeometry } from 'three';


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

const ProceduralMesh: React.FC = () => {
  const refContainer = useRef<HTMLCanvasElement>();
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ renderer, setRenderer ] = useState<THREE.WebGLRenderer>();
  const [ camera, setCamera ] = useState<THREE.PerspectiveCamera>();
  const [ target ]  = useState<THREE.Vector3>(new THREE.Vector3(-0.5, 1.2, 0));
  const [ scene ] = useState<THREE.Scene>(new THREE.Scene());

  const handleWindowResize = useCallback(() => {
    const { current: container } = refContainer;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      renderer.setSize(scW, scH);
    }
  }, [renderer])

/*   const generatePlane = () => {
    geometry.geometry.dispose()
    geometry.geometry = new THREE.PlaneGeometry()
  }  
 */
  useEffectOnce(() => {
    const { current: container } = refContainer;
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

      const pmremGenerator = new THREE.PMREMGenerator( renderer );
      scene.background = new THREE.Color( 0x000000 );
			scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

      //Updating the DOM with plain JavaScript
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const camera = new THREE.PerspectiveCamera(75, scW / scH, 0.1, 1000);
      camera.position.setZ(800);
      camera.position.setX(-300);
      setCamera(camera);

      const ambientLight = new THREE.AmbientLight( 0x000000 );
			scene.add( ambientLight );
      
			const light1 = new THREE.PointLight( 0xffffff, 1, 0);
			light1.position.set( -10, 0, 150 );
			scene.add( light1 );

			const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
			light2.position.set( 100, 200, 100 );
			scene.add( light2 );

			const light3 = new THREE.PointLight( 0xffffff, 1, 0 );
			light3.position.set( - 100, - 200, - 100 );
			scene.add( light3 );

    /*   const material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF, 
        wireframe: true,
      });
       */
      
      const geometry = new THREE.PlaneGeometry( w, h, cols, rows );
      geometry.rotateX(Math.PI/2);
      geometry.rotateY(-Math.PI/4 + 20);
      const material = new THREE.MeshPhysicalMaterial({ 
        color: 0x049EF4,
        reflectivity: 0,
        transmission: 1,
        roughness: 0,
        metalness: 1,
        clearcoat: 0.25,
        clearcoatRoughness: 0,
        ior: 0.5,
        side: DoubleSide,
        wireframe: false,
        flatShading: true
      })
      const mesh = new THREE.Mesh( geometry, material );
      mesh.rotateZ(0.1);
      mesh.rotateX(0.1);
      scene.add( mesh );

      let req = null as unknown | number;
      const animate = () => {
        req = requestAnimationFrame(animate);
        render(geometry);
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
    renderer?.render( scene,  camera as THREE.PerspectiveCamera );
  }
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