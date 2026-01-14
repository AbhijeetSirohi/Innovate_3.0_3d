import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function CampusModel() {
  const { scene } = useGLTF("/models/campus.glb");

  useEffect(() => {
    // Compute bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());

    // Recenter model
    scene.position.sub(center);
  }, [scene]);

  return <primitive object={scene} scale={0.2} />;
}

useGLTF.preload("/models/campus.glb");
