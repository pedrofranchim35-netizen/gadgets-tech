/**
 * Modelos 3D Interativos dos Gadgets com Three.js
 * Atividade Prática 4º Bimestre - Desenvolvimento Web Avançado
 * Alunos: Alexandre, Pedro Franchim, Marcus e Julio
 * Professor: Danilo Bezerra
 */

// Objeto para gerenciar visualizadores 3D
const Gadget3DManager = {
  activeCardRenderers: new Map(),
  modalScene: null,
  modalCamera: null,
  modalRenderer: null,
  modalControls: null,
  modalCurrentModel: null,
  modalCurrentId: null,
  modalAnimFrame: null,
  isSpecialEffectActive: true,
  isAutoRotate: true
};

// ==========================================================================
// 1. Construtores de Modelos 3D Procedurais de Alta Fidelidade
// ==========================================================================

// Helper para criar materiais comuns
function createMaterials() {
  return {
    titaniumDark: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    }),
    titaniumLight: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.15
    }),
    carbonFiber: new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.5,
      roughness: 0.4
    }),
    glassCyan: new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.85,
      transparent: true,
      opacity: 0.8,
      reflectivity: 0.9
    }),
    glowCyan: new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 1.5,
      roughness: 0.2
    }),
    glowOrange: new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 1.6,
      roughness: 0.2
    }),
    glowPurple: new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 1.5,
      roughness: 0.2
    }),
    glowGreen: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.2
    }),
    blackGloss: new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.9,
      roughness: 0.1
    }),
    matteRubber: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.1,
      roughness: 0.8
    })
  };
}

// --------------------------------------------------------------------------
// PRODUTO 1: VisionAR Glass (Wearables)
// --------------------------------------------------------------------------
function buildVisionARModel() {
  const group = new THREE.Group();
  const mat = createMaterials();

  // Armação Principal (Front Frame)
  const frameShape = new THREE.Shape();
  // Curva superior elegante dos óculos
  frameShape.moveTo(-2.8, 0.4);
  frameShape.quadraticCurveTo(0, 0.7, 2.8, 0.4);
  frameShape.lineTo(2.7, -0.6);
  frameShape.quadraticCurveTo(1.5, -1.2, 0.3, -0.7);
  frameShape.quadraticCurveTo(0, -0.4, -0.3, -0.7);
  frameShape.quadraticCurveTo(-1.5, -1.2, -2.7, -0.6);
  frameShape.closePath();

  const extrudeSettings = { depth: 0.25, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
  const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
  const frameMesh = new THREE.Mesh(frameGeo, mat.titaniumDark);
  frameMesh.castShadow = true;
  group.add(frameMesh);

  // Lente Esquerda
  const lensLeftGeo = new THREE.BoxGeometry(2.1, 1.2, 0.08);
  const lensLeft = new THREE.Mesh(lensLeftGeo, mat.glassCyan);
  lensLeft.position.set(-1.45, -0.2, 0.12);
  group.add(lensLeft);

  // Lente Direita
  const lensRightGeo = new THREE.BoxGeometry(2.1, 1.2, 0.08);
  const lensRight = new THREE.Mesh(lensRightGeo, mat.glassCyan);
  lensRight.position.set(1.45, -0.2, 0.12);
  group.add(lensRight);

  // HUD Holográfico Interno na Lente Direita
  const hudGroup = new THREE.Group();
  
  // Seta de navegação GPS 3D
  const arrowGeo = new THREE.ConeGeometry(0.18, 0.45, 3);
  arrowGeo.rotateX(Math.PI / 2);
  const arrowMesh = new THREE.Mesh(arrowGeo, mat.glowGreen);
  arrowMesh.position.set(1.4, -0.1, 0.18);
  hudGroup.add(arrowMesh);

  // Linhas HUD de dados
  const hudGridGeo = new THREE.PlaneGeometry(0.8, 0.4, 4, 2);
  const hudGridMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.6 });
  const hudGrid = new THREE.Mesh(hudGridGeo, hudGridMat);
  hudGrid.position.set(2.0, 0.05, 0.18);
  hudGroup.add(hudGrid);

  // Ponto de tradução na lente esquerda
  const dotGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const dotMesh = new THREE.Mesh(dotGeo, mat.glowCyan);
  dotMesh.position.set(-1.8, 0.15, 0.18);
  hudGroup.add(dotMesh);

  group.add(hudGroup);

  // Hastes Laterais (Temples)
  const templeGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.2, 16);
  templeGeo.rotateX(Math.PI / 2);

  const leftTemple = new THREE.Mesh(templeGeo, mat.carbonFiber);
  leftTemple.position.set(-2.7, 0.2, -1.6);
  leftTemple.rotation.y = 0.08;
  group.add(leftTemple);

  const rightTemple = new THREE.Mesh(templeGeo, mat.carbonFiber);
  rightTemple.position.set(2.7, 0.2, -1.6);
  rightTemple.rotation.y = -0.08;
  group.add(rightTemple);

  // Câmera Central / Sensor de Profundidade
  const camGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.3, 16);
  camGeo.rotateX(Math.PI / 2);
  const camMesh = new THREE.Mesh(camGeo, mat.blackGloss);
  camMesh.position.set(0, 0.45, 0.15);
  group.add(camMesh);

  // Atualização de animação
  return {
    group,
    cameraPos: [0, 0.5, 5.2],
    update: (time, isSpecial) => {
      // Flutuação suave
      group.position.y = Math.sin(time * 2) * 0.08;
      // Pulso do HUD
      if (hudGroup && isSpecial) {
        hudGroup.visible = true;
        arrowMesh.rotation.z = Math.sin(time * 3) * 0.3;
        hudGridMat.opacity = 0.4 + Math.sin(time * 4) * 0.3;
      } else {
        hudGroup.visible = false;
      }
    }
  };
}

// --------------------------------------------------------------------------
// PRODUTO 2: PulseTouch Pro (Wearables)
// --------------------------------------------------------------------------
function buildPulseTouchModel() {
  const group = new THREE.Group();
  const mat = createMaterials();

  // Pulseira Curvada (Torus segmentado / Bracelete)
  const bandGeo = new THREE.TorusGeometry(1.9, 0.38, 20, 60, Math.PI * 1.85);
  bandGeo.rotateX(Math.PI / 2);
  bandGeo.rotateZ(Math.PI * 0.07);
  const bandMesh = new THREE.Mesh(bandGeo, mat.matteRubber);
  bandMesh.castShadow = true;
  group.add(bandMesh);

  // Módulo Central Háptico (Corpo de Titânio)
  const coreGeo = new THREE.BoxGeometry(1.6, 2.2, 0.55);
  const coreMesh = new THREE.Mesh(coreGeo, mat.titaniumDark);
  coreMesh.position.set(0, 0, 1.85);
  coreMesh.castShadow = true;
  group.add(coreMesh);

  // Tela Curva OLED
  const screenGeo = new THREE.BoxGeometry(1.3, 1.8, 0.1);
  const screenMesh = new THREE.Mesh(screenGeo, mat.blackGloss);
  screenMesh.position.set(0, 0, 2.14);
  group.add(screenMesh);

  // Linhas de Onda Háptica na Tela
  const waveGroup = new THREE.Group();
  const waveMat = mat.glowOrange;
  
  for (let i = -3; i <= 3; i++) {
    const barGeo = new THREE.BoxGeometry(0.12, 0.4 + Math.abs(i) * 0.15, 0.05);
    const bar = new THREE.Mesh(barGeo, waveMat);
    bar.position.set(i * 0.16, 0, 2.2);
    waveGroup.add(bar);
  }
  group.add(waveGroup);

  // Atuadores de Vibração Lateral (Pistões Hápticos)
  const pistonGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 16);
  pistonGeo.rotateZ(Math.PI / 2);
  
  const leftPiston = new THREE.Mesh(pistonGeo, mat.glowOrange);
  leftPiston.position.set(-0.85, 0, 1.85);
  group.add(leftPiston);

  const rightPiston = new THREE.Mesh(pistonGeo, mat.glowOrange);
  rightPiston.position.set(0.85, 0, 1.85);
  group.add(rightPiston);

  // Sensores Biométricos Traseiros
  const sensorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  sensorGeo.rotateX(Math.PI / 2);
  const sensorMesh = new THREE.Mesh(sensorGeo, mat.glowGreen);
  sensorMesh.position.set(0, 0, 1.55);
  group.add(sensorMesh);

  return {
    group,
    cameraPos: [0, 1.5, 5.5],
    update: (time, isSpecial) => {
      group.position.y = Math.sin(time * 2.2) * 0.05;
      if (isSpecial) {
        // Efeito de vibração háptica tátil
        const hapticShake = Math.sin(time * 35) * 0.02;
        coreMesh.position.x = hapticShake;
        
        // Pulsação das barras de onda
        waveGroup.children.forEach((child, idx) => {
          child.scale.y = 0.5 + Math.abs(Math.sin(time * 8 + idx * 0.5)) * 1.5;
        });

        // Pulso luminoso
        leftPiston.scale.setScalar(1 + Math.sin(time * 12) * 0.18);
        rightPiston.scale.setScalar(1 + Math.sin(time * 12) * 0.18);
      }
    }
  };
}

// --------------------------------------------------------------------------
// PRODUTO 3: AuraRing Control (Wearables)
// --------------------------------------------------------------------------
function buildAuraRingModel() {
  const group = new THREE.Group();
  const mat = createMaterials();

  // Corpo do Anel (Titânio Grade 5 Polido)
  const ringGeo = new THREE.TorusGeometry(1.6, 0.38, 30, 80);
  const ringMesh = new THREE.Mesh(ringGeo, mat.titaniumLight);
  ringMesh.castShadow = true;
  group.add(ringMesh);

  // Friso Interno com Sensores Biométricos
  const innerSleeveGeo = new THREE.TorusGeometry(1.48, 0.16, 20, 60);
  const innerSleeve = new THREE.Mesh(innerSleeveGeo, mat.carbonFiber);
  group.add(innerSleeve);

  // 4 Nódulos Sensores Ópticos Internos
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const diodeGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const diodeMat = (i % 2 === 0) ? mat.glowGreen : mat.glowPurple;
    const diode = new THREE.Mesh(diodeGeo, diodeMat);
    diode.position.set(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0);
    group.add(diode);
  }

  // Faixa de Gestos Espaciais 3D (Glowing Inlay)
  const stripGeo = new THREE.TorusGeometry(1.64, 0.08, 16, 80);
  const stripMesh = new THREE.Mesh(stripGeo, mat.glowPurple);
  group.add(stripMesh);

  // Ondas de Projeção Espacial 3D Externas
  const waveRings = [];
  for (let i = 0; i < 3; i++) {
    const wGeo = new THREE.TorusGeometry(2.1 + i * 0.45, 0.02, 12, 60);
    const wMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.4 - i * 0.1 });
    const wMesh = new THREE.Mesh(wGeo, wMat);
    wMesh.rotation.x = Math.PI / 4;
    group.add(wMesh);
    waveRings.push(wMesh);
  }

  return {
    group,
    cameraPos: [0, 0, 5.0],
    update: (time, isSpecial) => {
      // Rotação suave em 3 eixos simulando controle por gestos no ar
      group.rotation.x = time * 0.6;
      group.rotation.y = time * 0.8;

      if (isSpecial) {
        waveRings.forEach((r, idx) => {
          r.visible = true;
          r.rotation.z += 0.01 * (idx + 1);
          r.scale.setScalar(1 + Math.sin(time * 4 + idx) * 0.15);
        });
      } else {
        waveRings.forEach(r => r.visible = false);
      }
    }
  };
}

// --------------------------------------------------------------------------
// PRODUTO 4: HoloDesk AI (Casa Inteligente)
// --------------------------------------------------------------------------
function buildHoloDeskModel() {
  const group = new THREE.Group();
  const mat = createMaterials();

  // Base de Mesa (Cilindro elegante de alumínio anodizado)
  const baseCylinderGeo = new THREE.CylinderGeometry(1.8, 2.1, 1.2, 40);
  const baseMesh = new THREE.Mesh(baseCylinderGeo, mat.titaniumDark);
  baseMesh.position.y = -1.2;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Anel de Grelha Acústica
  const ringGeo = new THREE.TorusGeometry(1.95, 0.08, 16, 40);
  ringGeo.rotateX(Math.PI / 2);
  const ringMesh = new THREE.Mesh(ringGeo, mat.glowCyan);
  ringMesh.position.y = -1.2;
  group.add(ringMesh);

  // Lente de Projeção no Topo da Base
  const lensApertureGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32);
  const lensMesh = new THREE.Mesh(lensApertureGeo, mat.glowCyan);
  lensMesh.position.y = -0.55;
  group.add(lensMesh);

  // Cone de Luz Holográfica
  const coneGeo = new THREE.ConeGeometry(2.2, 2.6, 32, 1, true);
  coneGeo.rotateX(Math.PI);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide
  });
  const coneMesh = new THREE.Mesh(coneGeo, coneMat);
  coneMesh.position.y = 0.7;
  group.add(coneMesh);

  // Holograma Flutuante: Núcleo Neural de IA (Icosaedro wireframe + Esfera central)
  const holoGroup = new THREE.Group();
  holoGroup.position.y = 1.2;

  // Esfera de energia central
  const coreSphereGeo = new THREE.SphereGeometry(0.35, 20, 20);
  const coreSphere = new THREE.Mesh(coreSphereGeo, mat.glowCyan);
  holoGroup.add(coreSphere);

  // Icosaedro Wireframe externo
  const icoGeo = new THREE.IcosahedronGeometry(0.9, 0);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  holoGroup.add(icoMesh);

  // Anéis de Dados Orbitais
  const orbitRingGeo1 = new THREE.TorusGeometry(1.2, 0.03, 12, 40);
  const orbitRing1 = new THREE.Mesh(orbitRingGeo1, mat.glowCyan);
  holoGroup.add(orbitRing1);

  const orbitRingGeo2 = new THREE.TorusGeometry(1.4, 0.02, 12, 40);
  const orbitRing2 = new THREE.Mesh(orbitRingGeo2, mat.glowPurple);
  orbitRing2.rotation.x = Math.PI / 3;
  holoGroup.add(orbitRing2);

  group.add(holoGroup);

  return {
    group,
    cameraPos: [0, 0.6, 6.2],
    update: (time, isSpecial) => {
      // Rotação dos elementos holográficos
      if (isSpecial) {
        holoGroup.visible = true;
        coneMesh.visible = true;
        icoMesh.rotation.x = time * 0.8;
        icoMesh.rotation.y = time * 1.2;
        orbitRing1.rotation.z = time * 0.9;
        orbitRing2.rotation.y = -time * 1.1;
        coreSphere.scale.setScalar(1 + Math.sin(time * 6) * 0.18);
        holoGroup.position.y = 1.2 + Math.sin(time * 3) * 0.12;
      } else {
        holoGroup.visible = false;
        coneMesh.visible = false;
      }
    }
  };
}

// --------------------------------------------------------------------------
// PRODUTO 5: HydroSmart (Casa Inteligente)
// --------------------------------------------------------------------------
function buildHydroSmartModel() {
  const group = new THREE.Group();
  const mat = createMaterials();

  // Corpo Principal da Garrafa Térmica (Aço Escovado Slate)
  const bodyGeo = new THREE.CylinderGeometry(0.95, 0.95, 3.2, 32);
  const bodyMesh = new THREE.Mesh(bodyGeo, mat.titaniumDark);
  bodyMesh.position.y = -0.3;
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Gargalo Curvo
  const neckGeo = new THREE.CylinderGeometry(0.68, 0.95, 0.8, 32);
  const neckMesh = new THREE.Mesh(neckGeo, mat.titaniumLight);
  neckMesh.position.y = 1.7;
  group.add(neckMesh);

  // Tampa Inteligente com Display Touch
  const capGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.6, 32);
  const capMesh = new THREE.Mesh(capGeo, mat.blackGloss);
  capMesh.position.y = 2.3;
  capMesh.castShadow = true;
  group.add(capMesh);

  // Anel LED de Esterilização UV-C na Tampa
  const uvcRingGeo = new THREE.TorusGeometry(0.73, 0.05, 16, 32);
  uvcRingGeo.rotateX(Math.PI / 2);
  const uvcRingMesh = new THREE.Mesh(uvcRingGeo, mat.glowPurple);
  uvcRingMesh.position.y = 2.05;
  group.add(uvcRingMesh);

  // Display OLED no Topo da Tampa
  const oledGeo = new THREE.CircleGeometry(0.55, 32);
  oledGeo.rotateX(-Math.PI / 2);
  const oledMesh = new THREE.Mesh(oledGeo, mat.glowCyan);
  oledMesh.position.y = 2.61;
  group.add(oledMesh);

  // Faixa Vertical LED Indicadora de Hidratação
  const ledStripGeo = new THREE.BoxGeometry(0.08, 2.2, 0.06);
  const ledStripMesh = new THREE.Mesh(ledStripGeo, mat.glowGreen);
  ledStripMesh.position.set(0, -0.3, 0.97);
  group.add(ledStripMesh);

  // Feixe Interno UV-C (Visível como feixe de esterilização)
  const uvCoreGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.0, 16);
  const uvCoreMesh = new THREE.Mesh(uvCoreGeo, mat.glowPurple);
  uvCoreMesh.position.set(0, 0, 0);
  group.add(uvCoreMesh);

  return {
    group,
    cameraPos: [0, 0.8, 5.5],
    update: (time, isSpecial) => {
      group.position.y = Math.sin(time * 2) * 0.06;
      if (isSpecial) {
        uvcRingMesh.scale.setScalar(1 + Math.sin(time * 5) * 0.08);
        ledStripMesh.scale.y = 0.8 + Math.sin(time * 3) * 0.2;
      }
    }
  };
}

// --------------------------------------------------------------------------
// PRODUTO 6: Orbital Sound (Áudio Avançado)
// --------------------------------------------------------------------------
function buildOrbitalSoundModel() {
  const group = new THREE.Group();
  const mat = createMaterials();

  // Base Magnética Inferior (Prato de Indução Eletromagnética)
  const baseDiscGeo = new THREE.CylinderGeometry(2.3, 2.6, 0.55, 48);
  const baseMesh = new THREE.Mesh(baseDiscGeo, mat.titaniumDark);
  baseMesh.position.y = -1.6;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Bobina Eletromagnética Concêntrica Brilhante na Base
  const magCoilGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 48);
  magCoilGeo.rotateX(Math.PI / 2);
  const magCoilMesh = new THREE.Mesh(magCoilGeo, mat.glowCyan);
  magCoilMesh.position.y = -1.3;
  group.add(magCoilMesh);

  const innerCoilGeo = new THREE.TorusGeometry(0.9, 0.05, 16, 48);
  innerCoilGeo.rotateX(Math.PI / 2);
  const innerCoilMesh = new THREE.Mesh(innerCoilGeo, mat.glowCyan);
  innerCoilMesh.position.y = -1.3;
  group.add(innerCoilMesh);

  // Esfera Flutuante de Som (Levitando no ar!)
  const orbGroup = new THREE.Group();
  orbGroup.position.y = 0.7; // Flutuando claramente acima da base

  // Corpo Esférico Principal
  const sphereGeo = new THREE.SphereGeometry(1.3, 36, 36);
  const sphereMesh = new THREE.Mesh(sphereGeo, mat.carbonFiber);
  sphereMesh.castShadow = true;
  orbGroup.add(sphereMesh);

  // Grelha Equatorial de Áudio 360° (Anel acústico)
  const grillGeo = new THREE.TorusGeometry(1.32, 0.12, 20, 48);
  const grillMesh = new THREE.Mesh(grillGeo, mat.glowCyan);
  orbGroup.add(grillMesh);

  // Radiador Passivo de Graves no Topo
  const subGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.2, 32);
  const subMesh = new THREE.Mesh(subGeo, mat.titaniumLight);
  subMesh.position.y = 1.25;
  orbGroup.add(subMesh);

  group.add(orbGroup);

  // Ondas Sonoras Esféricas Expansivas
  const soundWaves = [];
  for (let i = 0; i < 2; i++) {
    const swGeo = new THREE.SphereGeometry(1.7 + i * 0.5, 16, 16);
    const swMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.25 - i * 0.1 });
    const swMesh = new THREE.Mesh(swGeo, swMat);
    orbGroup.add(swMesh);
    soundWaves.push(swMesh);
  }

  return {
    group,
    cameraPos: [0, 0.4, 6.0],
    update: (time, isSpecial) => {
      // Simulação física de levitação magnética real
      orbGroup.position.y = 0.7 + Math.sin(time * 2.5) * 0.15;
      orbGroup.rotation.y = time * 0.6;

      // Pulsação das ondas sonoras
      if (isSpecial) {
        soundWaves.forEach((w, idx) => {
          w.visible = true;
          const s = 1 + (Math.sin(time * 6 + idx * 1.5) + 1) * 0.12;
          w.scale.set(s, s, s);
        });
        magCoilMesh.scale.setScalar(1 + Math.sin(time * 5) * 0.05);
      } else {
        soundWaves.forEach(w => w.visible = false);
      }
    }
  };
}

// Factory para criar modelo por ID
function createGadgetModel(productId) {
  switch (productId) {
    case 1: return buildVisionARModel();
    case 2: return buildPulseTouchModel();
    case 3: return buildAuraRingModel();
    case 4: return buildHoloDeskModel();
    case 5: return buildHydroSmartModel();
    case 6: return buildOrbitalSoundModel();
    default: return buildVisionARModel();
  }
}

// ==========================================================================
// 2. Renderização 3D Direta nos Cards do Catálogo (Preview Interativo)
// ==========================================================================

function initCard3DViewers() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    const productId = parseInt(card.getAttribute('data-id'), 10);
    const container = card.querySelector('.product-3d-canvas-container');
    if (!container || container.getAttribute('data-initialized') === 'true') return;

    container.setAttribute('data-initialized', 'true');

    // Configuração de Cena, Câmera e Renderer do Card
    const width = container.clientWidth || 320;
    const height = 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Iluminação de Estúdio Cyberpunk
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.4);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Criar o Modelo 3D
    const modelData = createGadgetModel(productId);
    scene.add(modelData.group);

    const [cx, cy, cz] = modelData.cameraPos;
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);

    // Variáveis de Interatividade Manual (Mouse / Touch no Card)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let manualRotY = 0;
    let manualRotX = 0;
    let isHovered = false;

    const dom = renderer.domElement;

    dom.addEventListener('pointerenter', () => { isHovered = true; });
    dom.addEventListener('pointerleave', () => { isHovered = false; isDragging = false; });

    dom.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      dom.style.cursor = 'grabbing';
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
      dom.style.cursor = 'grab';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      manualRotY += deltaX * 0.015;
      manualRotX += deltaY * 0.015;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    // Loop de Animação com IntersectionObserver (Otimização Máxima)
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    let clock = new THREE.Clock();

    function animateCard() {
      requestAnimationFrame(animateCard);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Rotação suave baseada em hover ou arraste
      if (!isDragging) {
        manualRotY += (isHovered ? 0.015 : 0.008);
      }

      modelData.group.rotation.y = manualRotY;
      modelData.group.rotation.x = manualRotX * 0.5;

      modelData.update(elapsedTime, true);
      renderer.render(scene, camera);
    }

    animateCard();

    // Guardar referência para limpeza se necessário
    Gadget3DManager.activeCardRenderers.set(productId, { renderer, scene, container });
  });
}

// ==========================================================================
// 3. Modal Studio 360° Fullscreen / Inspecionar Produto em 3D
// ==========================================================================

function open3DModal(productId) {
  const modal = document.getElementById('modal-3d-viewer');
  const container = document.getElementById('modal-3d-canvas');
  const titleEl = document.getElementById('modal-3d-title');
  const catEl = document.getElementById('modal-3d-category');
  const descEl = document.getElementById('modal-3d-desc');
  const priceEl = document.getElementById('modal-3d-price');
  const addBtn = document.getElementById('modal-3d-add-btn');

  const product = products.find(p => p.id === productId);
  if (!product || !modal || !container) return;

  // Atualizar dados no painel flutuante do modal
  titleEl.textContent = product.name;
  catEl.textContent = product.category;
  descEl.textContent = product.description;
  priceEl.textContent = formatCurrency(product.price);
  addBtn.onclick = () => {
    addToCart(product.id);
  };

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  initModal3DScene(productId, container);
}

function close3DModal() {
  const modal = document.getElementById('modal-3d-viewer');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';

  if (Gadget3DManager.modalAnimFrame) {
    cancelAnimationFrame(Gadget3DManager.modalAnimFrame);
  }
}

function initModal3DScene(productId, container) {
  // Limpar anterior
  container.innerHTML = '';

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  // Fundo com sutil gradiente espacial
  scene.fog = new THREE.FogExp2(0x0a0e17, 0.06);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0e17, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Grade de Chão Holográfico Futurista
  const gridHelper = new THREE.GridHelper(16, 24, 0x00f2fe, 0x1e293b);
  gridHelper.position.y = -2.2;
  scene.add(gridHelper);

  // Sistema de Luzes do Estúdio 3D
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.SpotLight(0x38bdf8, 3.5, 30, Math.PI / 4, 0.3);
  keyLight.position.set(6, 8, 6);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.SpotLight(0xc084fc, 3.0, 30, Math.PI / 4, 0.3);
  rimLight.position.set(-6, 3, -6);
  scene.add(rimLight);

  const bottomNeon = new THREE.PointLight(0x00f2fe, 1.8, 10);
  bottomNeon.position.set(0, -2.0, 0);
  scene.add(bottomNeon);

  // Modelo do Gadget
  const modelData = createGadgetModel(productId);
  scene.add(modelData.group);

  const [cx, cy, cz] = modelData.cameraPos;
  camera.position.set(cx, cy + 0.5, cz + 1.2);

  // OrbitControls para rotação, zoom e pan 360° perfeitos
  let controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 2.5;
    controls.target.set(0, 0, 0);
  }

  Gadget3DManager.modalScene = scene;
  Gadget3DManager.modalCamera = camera;
  Gadget3DManager.modalRenderer = renderer;
  Gadget3DManager.modalControls = controls;
  Gadget3DManager.modalCurrentModel = modelData;
  Gadget3DManager.modalCurrentId = productId;

  // Redimensionamento de janela
  const handleResize = () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);

  let clock = new THREE.Clock();

  function animateModal() {
    Gadget3DManager.modalAnimFrame = requestAnimationFrame(animateModal);

    const elapsedTime = clock.getElapsedTime();

    if (controls) {
      if (Gadget3DManager.isAutoRotate) {
        modelData.group.rotation.y += 0.008;
      }
      controls.update();
    }

    modelData.update(elapsedTime, Gadget3DManager.isSpecialEffectActive);
    renderer.render(scene, camera);
  }

  animateModal();
}

// Alternar Auto-Rotação no Studio Modal
function toggleAutoRotate() {
  Gadget3DManager.isAutoRotate = !Gadget3DManager.isAutoRotate;
  const btn = document.getElementById('btn-toggle-rotate');
  if (btn) {
    btn.classList.toggle('active', Gadget3DManager.isAutoRotate);
    btn.innerHTML = Gadget3DManager.isAutoRotate ? '🔄 Rotação: Ligada' : '⏸️ Rotação: Pausada';
  }
}

// Alternar Efeitos Especiais (Holograma, Háptico, UV, Levitação)
function toggleSpecialEffect() {
  Gadget3DManager.isSpecialEffectActive = !Gadget3DManager.isSpecialEffectActive;
  const btn = document.getElementById('btn-toggle-fx');
  if (btn) {
    btn.classList.toggle('active', Gadget3DManager.isSpecialEffectActive);
    btn.innerHTML = Gadget3DManager.isSpecialEffectActive ? '⚡ Efeitos Especiais: Ligados' : '⚪ Efeitos: Desligados';
  }
}

// Resetar Câmera no Studio Modal
function reset3DCamera() {
  if (Gadget3DManager.modalCurrentModel && Gadget3DManager.modalCamera && Gadget3DManager.modalControls) {
    const [cx, cy, cz] = Gadget3DManager.modalCurrentModel.cameraPos;
    Gadget3DManager.modalCamera.position.set(cx, cy + 0.5, cz + 1.2);
    Gadget3DManager.modalControls.target.set(0, 0, 0);
    Gadget3DManager.modalCurrentModel.group.rotation.set(0, 0, 0);
  }
}
