import { useRef, useMemo } from "react"
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber"
import { Text, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface CertItem {
  title: string
  issuer: string
  description: string
  skills: string[]
}

interface Cert {
  id: number
  year: string
  credential: string
  transIdx: number
}

function CertificateFrame({
  item,
  year,
  index,
  total,
  onClick,
  isSelected,
}: {
  item: CertItem
  year: string
  index: number
  total: number
  onClick: (cert: Cert) => void
  isSelected: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angle = (index / total) * Math.PI * 1.6 - Math.PI * 0.8
  const radius = 3.8
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius - 0.5
  const y = Math.sin(angle * 1.5) * 0.4

  useFrame((state) => {
    if (!meshRef.current || isSelected) return
    meshRef.current.position.y = y + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.08
  })

  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick({ id: index + 1, year, credential: "", transIdx: index }) }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer" }}
        onPointerOut={() => { document.body.style.cursor = "default" }}
      >
        <planeGeometry args={[2.4, 3.2]} />
        <MeshDistortMaterial
          color={isSelected ? "#d4a574" : "#1a1a1a"}
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          distort={0.05}
        />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.2, 3.0]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      <group position={[0, 0, 0.02]}>
        <Text position={[0, 1.1, 0]} fontSize={0.14} color="#d4a574" anchorX="center" anchorY="middle" maxWidth={2.0}>
          {item.title}
        </Text>
        <Text position={[0, 0.6, 0]} fontSize={0.09} color="#888888" anchorX="center" anchorY="middle" maxWidth={2.0}>
          {item.issuer}
        </Text>
        <Text position={[0, -0.2, 0]} fontSize={0.25} color="#d4a574" anchorX="center" anchorY="middle">
          {year}
        </Text>

        <mesh position={[0, 0.35, 0]}>
          <planeGeometry args={[1.2, 0.005]} />
          <meshBasicMaterial color="#d4a574" opacity={0.3} transparent />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <planeGeometry args={[1.2, 0.005]} />
          <meshBasicMaterial color="#d4a574" opacity={0.3} transparent />
        </mesh>

        {[[-1.05, 1.5], [1.05, 1.5], [-1.05, -1.5], [1.05, -1.5]].map(([px, py]) => (
          <group key={`${px}-${py}`}>
            <mesh position={[px, py, 0]}><planeGeometry args={[0.2, 0.005]} /><meshBasicMaterial color="#d4a574" opacity={0.5} transparent /></mesh>
            <mesh position={[px, py, 0]}><planeGeometry args={[0.005, 0.2]} /><meshBasicMaterial color="#d4a574" opacity={0.5} transparent /></mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

function Stars({ count = 300 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [count])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.04} color="#d4a574" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function SceneContent({
  items,
  onSelectCert,
  selectedId,
}: {
  items: CertItem[]
  onSelectCert: (cert: Cert) => void
  selectedId: number | null
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current && selectedId === null) {
      groupRef.current.rotation.y += delta * 0.12
    }
  })

  const years = useMemo(() => {
    const yearsList: string[] = []
    for (let i = 0; i < items.length; i++) {
      yearsList.push(String(2024 - (i % 2 === 0 ? 0 : 1)))
    }
    return yearsList
  }, [items.length])

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <CertificateFrame
          key={i}
          item={item}
          year={years[i]}
          index={i}
          total={items.length}
          onClick={onSelectCert}
          isSelected={selectedId === i + 1}
        />
      ))}
    </group>
  )
}

export function Certificates3DScene({
  items,
  onSelectCert,
  selectedId,
}: {
  items: CertItem[]
  onSelectCert: (cert: Cert) => void
  selectedId: number | null
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#d4a574" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#6366f1" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#d4a574" />
      <SceneContent items={items} onSelectCert={onSelectCert} selectedId={selectedId} />
      <Stars />
    </Canvas>
  )
}
