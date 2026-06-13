import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const { theme, accent } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.style.display = 'none';
      return;
    }

    const isLowEnd = (
      (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4 ||
      navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4 ||
      window.innerWidth < 768
    );

    if (isLowEnd) {
      el.style.display = 'none';
      return;
    }

    const SEPARATION = 150;
    const AMOUNTX = 20;
    const AMOUNTY = 30;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(theme === 'dark' ? 0x0a0a0a : 0xf5f5f5, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setAnimationLoop(null);

    el.appendChild(renderer.domElement);

    const total = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);
    const c = new THREE.Color(accent.accent);

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const idx = (ix * AMOUNTY + iy) * 3;
        positions[idx] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[idx + 1] = 0;
        positions[idx + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        colors[idx] = c.r;
        colors[idx + 1] = c.g;
        colors[idx + 2] = c.b;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 6,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = requestAnimationFrame(function animate() {
      animationId = requestAnimationFrame(animate);

      const pos = geometry.attributes.position.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const idx = i * 3;
          pos[idx + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.06;
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [theme, accent]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0', className)}
      {...props}
    />
  );
}
