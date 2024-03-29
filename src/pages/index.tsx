import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const LazyProceduralMesh = dynamic(() => import('../components/procedural-mesh'), { //future performance TEST: try without lazy loading
  ssr: false,
  suspense: true,
})
const LazyProceduralMesh2 = dynamic(() => import('../components/procedural-mesh-2'), { //future performance TEST: try without lazy loading
  ssr: false,
  suspense: true,
})
const LazyPerformanceUI = dynamic(() => import('../components/PerformanceUI'), {
  ssr: false,
  suspense: true,
})

  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Three.js JP portfolio</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LazyProceduralMesh />
      <LazyPerformanceUI />
    </>
  );
};

export default Home;
