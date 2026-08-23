'use client';

import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Returns a mutable ref that always holds the cursor's world-space position
 * projected onto the z=0 plane. Safe to read every frame in useFrame without
 * causing any React re-renders.
 */
export function useCursorWorld() {
  const cursor = useRef(new THREE.Vector3(9999, 9999, 0));
  const { camera } = useThree();

  useEffect(() => {
    const tmpVec = new THREE.Vector3();
    const dir    = new THREE.Vector3();

    const onMove = (e: MouseEvent) => {
      // NDC
      const nx = (e.clientX / window.innerWidth)  *  2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);

      // Unproject → world-space ray → intersect z=0 plane
      tmpVec.set(nx, ny, 0.5).unproject(camera);
      dir.copy(tmpVec).sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      cursor.current.copy(camera.position).addScaledVector(dir, t);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [camera]);

  return cursor;
}

/**
 * Fires a callback with the cursor world-space position on every click.
 */
export function useClickWorld(onClickWorld: (pos: THREE.Vector3) => void) {
  const { camera } = useThree();

  useEffect(() => {
    const tmpVec = new THREE.Vector3();
    const dir    = new THREE.Vector3();

    const onClick = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth)  *  2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      tmpVec.set(nx, ny, 0.5).unproject(camera);
      dir.copy(tmpVec).sub(camera.position).normalize();
      const t  = -camera.position.z / dir.z;
      const wp = new THREE.Vector3().copy(camera.position).addScaledVector(dir, t);
      onClickWorld(wp);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [camera, onClickWorld]);
}
