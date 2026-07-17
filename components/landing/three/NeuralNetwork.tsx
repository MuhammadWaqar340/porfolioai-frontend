"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Points,
  PointsMaterial,
  Vector3,
} from "three";

interface NeuralNetworkProps {
  /** Number of nodes. Scale down on weaker tiers. */
  count?: number;
  /** Half-extent of the roaming region. */
  spread?: number;
  /** Max distance at which two nodes are linked. */
  connectDist?: number;
  /** Number of signal pulses travelling along edges. */
  signals?: number;
}

/** Soft round glowing sprite for nodes/pulses (avoids square GL points). */
function makeDotTexture(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(216,180,254,0.85)");
  g.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/**
 * A living neural-network background: nodes drift and repel from the cursor,
 * nearby nodes link with distance-faded lines, and bright pulses travel along
 * edges like signals firing — an unmistakable "AI" motif. All rendered with a
 * few buffer objects (points + line segments) for a low, stable draw cost.
 */
export function NeuralNetwork({
  count = 70,
  spread = 7,
  connectDist = 2.3,
  signals = 16,
}: NeuralNetworkProps) {
  const { viewport } = useThree();
  const pointerWorld = useRef(new Vector3());
  const groupRef = useRef<Group>(null);
  const dot = useMemo(makeDotTexture, []);
  const maxSeg = count * 8;
  const ACTIVATION_RADIUS = 2.6;

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const nodeColors = new Float32Array(count * 3);
    const velocities: Vector3[] = [];
    const purple = new Color("#a855f7");
    const violet = new Color("#c4b5fd");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = MathUtils.randFloatSpread(spread * 2);
      positions[i * 3 + 1] = MathUtils.randFloatSpread(spread * 1.4);
      positions[i * 3 + 2] = MathUtils.randFloatSpread(spread * 0.8);
      velocities.push(
        new Vector3(
          MathUtils.randFloatSpread(0.5),
          MathUtils.randFloatSpread(0.5),
          MathUtils.randFloatSpread(0.25),
        ),
      );
      const col = i % 2 ? violet : purple;
      nodeColors[i * 3] = col.r;
      nodeColors[i * 3 + 1] = col.g;
      nodeColors[i * 3 + 2] = col.b;
    }
    return { positions, nodeColors, velocities };
  }, [count, spread]);

  const objects = useMemo(() => {
    const nodeGeom = new BufferGeometry();
    // Live color buffer, refreshed each frame from the base colours so nodes can
    // brighten near the cursor without mutating the base palette.
    const nodeLiveCol = data.nodeColors.slice();
    nodeGeom.setAttribute("position", new BufferAttribute(data.positions, 3));
    nodeGeom.setAttribute("color", new BufferAttribute(nodeLiveCol, 3));
    const nodeMat = new PointsMaterial({
      size: 0.2,
      map: dot,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    });
    const nodePoints = new Points(nodeGeom, nodeMat);
    nodePoints.frustumCulled = false;

    const linePos = new Float32Array(maxSeg * 2 * 3);
    const lineCol = new Float32Array(maxSeg * 2 * 3);
    const lineGeom = new BufferGeometry();
    lineGeom.setAttribute("position", new BufferAttribute(linePos, 3));
    lineGeom.setAttribute("color", new BufferAttribute(lineCol, 3));
    const lineMat = new LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    });
    const lines = new LineSegments(lineGeom, lineMat);
    lines.frustumCulled = false;

    const pulsePos = new Float32Array(signals * 3);
    const pulseGeom = new BufferGeometry();
    pulseGeom.setAttribute("position", new BufferAttribute(pulsePos, 3));
    const pulseMat = new PointsMaterial({
      size: 0.28,
      map: dot,
      color: new Color("#f0abfc"),
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    });
    const pulses = new Points(pulseGeom, pulseMat);
    pulses.frustumCulled = false;

    return {
      nodeGeom,
      nodeMat,
      nodePoints,
      nodeLiveCol,
      lineGeom,
      lineMat,
      lines,
      linePos,
      lineCol,
      pulseGeom,
      pulseMat,
      pulses,
      pulsePos,
    };
  }, [data, dot, maxSeg, signals]);

  // Each signal travels from node a → b, then re-targets a nearby node.
  const sig = useMemo(
    () =>
      Array.from({ length: signals }).map(() => ({
        a: Math.floor(Math.random() * count),
        b: Math.floor(Math.random() * count),
        t: Math.random(),
        speed: MathUtils.randFloat(0.4, 1.1),
      })),
    [signals, count],
  );

  useEffect(
    () => () => {
      objects.nodeGeom.dispose();
      objects.nodeMat.dispose();
      objects.lineGeom.dispose();
      objects.lineMat.dispose();
      objects.pulseGeom.dispose();
      objects.pulseMat.dispose();
      dot.dispose();
    },
    [objects, dot],
  );

  const pickNearby = (from: number, positions: Float32Array) => {
    // Sample a few candidates and prefer one within link range.
    let best = Math.floor(Math.random() * count);
    for (let n = 0; n < 6; n++) {
      const cand = Math.floor(Math.random() * count);
      if (cand === from) continue;
      const dx = positions[from * 3] - positions[cand * 3];
      const dy = positions[from * 3 + 1] - positions[cand * 3 + 1];
      const dz = positions[from * 3 + 2] - positions[cand * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < connectDist * connectDist * 2.25) {
        best = cand;
        break;
      }
    }
    return best;
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const { positions, velocities, nodeColors } = data;
    const { nodeLiveCol } = objects;
    pointerWorld.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0,
    );

    // Gentle oscillating drift of the whole network for depth.
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.18 + state.pointer.x * 0.06;
      groupRef.current.rotation.x = Math.cos(t * 0.045) * 0.1 - state.pointer.y * 0.04;
      // Map the pointer into the (rotated) group's local space so activation
      // stays aligned with the cursor as the network drifts.
      groupRef.current.updateMatrixWorld();
      groupRef.current.worldToLocal(pointerWorld.current);
    }

    const hx = spread;
    const hy = spread * 0.7;
    const hz = spread * 0.4;
    const actR2 = ACTIVATION_RADIUS * ACTIVATION_RADIUS;

    // Track the node closest to the cursor so pulses can fire from it.
    let hoveredNode = -1;
    let hoveredD2 = actR2;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      positions[ix] += velocities[i].x * dt;
      positions[ix + 1] += velocities[i].y * dt;
      positions[ix + 2] += velocities[i].z * dt;
      if (positions[ix] > hx || positions[ix] < -hx) velocities[i].x *= -1;
      if (positions[ix + 1] > hy || positions[ix + 1] < -hy) velocities[i].y *= -1;
      if (positions[ix + 2] > hz || positions[ix + 2] < -hz) velocities[i].z *= -1;

      const dx = positions[ix] - pointerWorld.current.x;
      const dy = positions[ix + 1] - pointerWorld.current.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 3) {
        const f = (1 - d2 / 3) * dt * 2.5;
        const inv = 1 / (Math.sqrt(d2) || 1);
        positions[ix] += dx * inv * f;
        positions[ix + 1] += dy * inv * f;
      }

      if (d2 < hoveredD2) {
        hoveredD2 = d2;
        hoveredNode = i;
      }

      // Activation glow: nodes near the cursor brighten toward white.
      const activation = d2 < actR2 ? 1 - Math.sqrt(d2) / ACTIVATION_RADIUS : 0;
      const boost = 1 + activation * 1.8;
      nodeLiveCol[ix] = Math.min(1.6, nodeColors[ix] * boost + activation * 0.4);
      nodeLiveCol[ix + 1] = Math.min(1.6, nodeColors[ix + 1] * boost + activation * 0.4);
      nodeLiveCol[ix + 2] = Math.min(1.6, nodeColors[ix + 2] * boost + activation * 0.4);
    }
    objects.nodeGeom.attributes.position.needsUpdate = true;
    objects.nodeGeom.attributes.color.needsUpdate = true;

    // Rebuild connection lines with distance-based (additive) fade.
    const { linePos, lineCol } = objects;
    let s = 0;
    const maxD2 = connectDist * connectDist;
    for (let i = 0; i < count && s < maxSeg; i++) {
      for (let j = i + 1; j < count && s < maxSeg; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < maxD2) {
          const alpha = 1 - Math.sqrt(d2) / connectDist;
          const o = s * 6;
          linePos[o] = positions[i * 3];
          linePos[o + 1] = positions[i * 3 + 1];
          linePos[o + 2] = positions[i * 3 + 2];
          linePos[o + 3] = positions[j * 3];
          linePos[o + 4] = positions[j * 3 + 1];
          linePos[o + 5] = positions[j * 3 + 2];

          // Links near the cursor light up brighter (edge "activation").
          const mx = (positions[i * 3] + positions[j * 3]) * 0.5 - pointerWorld.current.x;
          const my = (positions[i * 3 + 1] + positions[j * 3 + 1]) * 0.5 - pointerWorld.current.y;
          const md2 = mx * mx + my * my;
          const near = md2 < actR2 ? 1 - Math.sqrt(md2) / ACTIVATION_RADIUS : 0;
          const boost = 1 + near * 1.6;
          const r = 0.45 * alpha * boost;
          const g = 0.3 * alpha * boost;
          const b = 0.9 * alpha * boost;
          lineCol[o] = r;
          lineCol[o + 1] = g;
          lineCol[o + 2] = b;
          lineCol[o + 3] = r;
          lineCol[o + 4] = g;
          lineCol[o + 5] = b;
          s++;
        }
      }
    }
    objects.lineGeom.setDrawRange(0, s * 2);
    objects.lineGeom.attributes.position.needsUpdate = true;
    objects.lineGeom.attributes.color.needsUpdate = true;

    // Advance signal pulses along their current edge.
    const { pulsePos } = objects;
    for (let k = 0; k < signals; k++) {
      const p = sig[k];
      p.t += p.speed * dt;
      if (p.t >= 1) {
        // When hovering a node, most new pulses fire outward from it so the
        // network visibly reacts to the cursor.
        if (hoveredNode >= 0 && Math.random() < 0.7) {
          p.a = hoveredNode;
        } else {
          p.a = p.b;
        }
        p.b = pickNearby(p.a, positions);
        p.t = 0;
        p.speed = MathUtils.randFloat(0.4, 1.1);
      }
      const a = p.a * 3;
      const b = p.b * 3;
      pulsePos[k * 3] = positions[a] + (positions[b] - positions[a]) * p.t;
      pulsePos[k * 3 + 1] = positions[a + 1] + (positions[b + 1] - positions[a + 1]) * p.t;
      pulsePos[k * 3 + 2] = positions[a + 2] + (positions[b + 2] - positions[a + 2]) * p.t;
    }
    objects.pulseGeom.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <primitive object={objects.lines} />
      <primitive object={objects.nodePoints} />
      <primitive object={objects.pulses} />
    </group>
  );
}
