import Head from 'next/head';
import dynamic from 'next/dynamic';

import ProceduralMeshLoader from '../procedural-mesh-loader';
import { JSXElementConstructor } from 'react';

const LazyProceduralMesh = dynamic(() => import('../procedural-mesh'), {
  ssr: false,
  suspense: true,
})
interface IWindowSize {
  children: any,
  routes: any
}
const Main  = ({ children:any, routes: any}) => {
  return (
    <main>
      <div>
        <LazyProceduralMesh />
        {children}
      </div>
      
    </main>

  )
}

export default Main;