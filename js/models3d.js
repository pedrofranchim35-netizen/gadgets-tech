/**
 * Modelos 3D de Alta Precisão Industrial e Detalhes Sofisticados
 * Three.js • PBR Shaders • Studio Lighting • Micro-engenharia
 * Atividade Prática 4º Bimestre - Desenvolvimento Web Avançado
 * Alunos: Alexandre, Pedro Franchim, Marcus e Julio
 * Professor: Danilo Bezerra
 */

// Gerenciador Central de Modelos 3D
const Gadget3DManager = {
  sharedEnvMap: null,
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
// 1. Texturas Procedurais de Ultra-Definição (Telas, Grelhas e HUDs)
// ==========================================================================

// Sombra de Contato Fotorrealista para a Base
function createRadialShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Textura de Tela OLED do Smartwatch (PulseTouch Pro) com Micro-detalhes
function createSmartwatchScreenCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  function draw(time = 0) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 512, 512);

    // Barra de Status Superior
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText('10:45', 36, 48);

    // Ícone de Bateria Detalhado
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(390, 28, 64, 28);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(394, 32, 50, 20);
    ctx.fillRect(456, 36, 5, 12);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText('98%', 340, 48);

    // Escala de Frequência e Linhas de Grade de Engenharia
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    for (let y = 120; y <= 300; y += 45) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(482, y);
      ctx.stroke();
    }

    // Linha de Onda de Frequência Háptica (Osciloscópio Dinâmico)
    ctx.beginPath();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 16;

    const centerY = 210;
    for (let x = 30; x < 482; x += 3) {
      const f1 = Math.sin((x * 0.045) + (time * 8.5));
      const f2 = Math.cos((x * 0.018) + (time * 3.2));
      const y = centerY + (f1 * f2 * 68);
      if (x === 30) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Métricas do Motor Háptico & Sensores
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 42px -apple-system, sans-serif';
    ctx.fillText('4.8G ACT', 36, 365);

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('DUAL HAPTIC CORE', 36, 400);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText('FREQ: 240Hz • LATÊNCIA: 1.8ms', 36, 435);
    ctx.fillText('HR: 72 BPM • SpO2: 99%', 36, 465);

    // Ponto de Status Biométrico Pulsante
    const alpha = 0.5 + Math.sin(time * 6) * 0.5;
    ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
    ctx.beginPath();
    ctx.arc(450, 365, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  draw(0);
  const texture = new THREE.CanvasTexture(canvas);
  return { texture, canvas, draw };
}

// Textura do HUD Holográfico dos Óculos (VisionAR Glass)
function createHUDCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  function draw(time = 0) {
    ctx.clearRect(0, 0, 512, 256);

    // Horizonte Artificial e Bússola Superior
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(170, 35); ctx.lineTo(342, 35);
    ctx.moveTo(256, 20); ctx.lineTo(256, 35);
    ctx.stroke();

    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N 028° • ALT: 742m • 24 KM/H', 256, 60);

    // Mira Tática Central / Retículo
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.beginPath();
    ctx.arc(256, 130, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(256, 100); ctx.lineTo(256, 110);
    ctx.moveTo(256, 150); ctx.lineTo(256, 160);
    ctx.moveTo(226, 130); ctx.lineTo(236, 130);
    ctx.moveTo(276, 130); ctx.lineTo(286, 130);
    ctx.stroke();

    // Painel de Tradução e Navegação GPS
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(30, 95, 452, 70, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 17px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('GPS AR ➔ RUA DA INOVAÇÃO, 200m', 48, 122);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '15px -apple-system, sans-serif';
    ctx.fillText('EN ➔ PT: "Turn right at the tech hub"', 48, 148);

    // Status do Sensor e Wi-Fi
    const alpha = 0.5 + Math.sin(time * 5) * 0.5;
    ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
    ctx.beginPath();
    ctx.arc(456, 122, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  draw(0);
  const texture = new THREE.CanvasTexture(canvas);
  return { texture, canvas, draw };
}

// Textura de Micro-grelha Acústica
function createMicroGrilleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#090d16';
  for (let y = 3; y < 128; y += 6) {
    for (let x = 3; x < 128; x += 6) {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 3);
  return texture;
}

// Textura OLED da Garrafa (HydroSmart)
function createBottleOLEDTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 256, 256);

  // Anel Circular Graduado de Meta
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(128, 128, 98, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(128, 128, 98, -Math.PI / 2, Math.PI * 0.95);
  ctx.stroke();

  // Dados
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 44px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('21°C', 128, 122);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px -apple-system, sans-serif';
  ctx.fillText('99.9% PURA', 128, 158);

  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillText('UV-C ESTERILIZADO', 128, 184);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ==========================================================================
// 2. Iluminação de Estúdio Fotorrealista (Studio Environment Map)
// ==========================================================================

function getOrCreateStudioEnvironment(renderer) {
  if (Gadget3DManager.sharedEnvMap) return Gadget3DManager.sharedEnvMap;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
  bgGrad.addColorStop(0, '#111827');
  bgGrad.addColorStop(0.5, '#0b0f19');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 256);

  // Softbox de Teto Principal
  const softbox1 = ctx.createRadialGradient(256, 35, 5, 256, 35, 120);
  softbox1.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  softbox1.addColorStop(0.5, 'rgba(224, 242, 254, 0.5)');
  softbox1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = softbox1;
  ctx.fillRect(100, 0, 312, 110);

  // Softbox Lateral Ciano
  const softbox2 = ctx.createRadialGradient(60, 100, 2, 60, 100, 80);
  softbox2.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
  softbox2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = softbox2;
  ctx.fillRect(0, 30, 140, 140);

  // Softbox Lateral Violeta
  const softbox3 = ctx.createRadialGradient(450, 100, 2, 450, 100, 80);
  softbox3.addColorStop(0, 'rgba(192, 132, 252, 0.85)');
  softbox3.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = softbox3;
  ctx.fillRect(370, 30, 142, 140);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, 128, 512, 2);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.mapping = THREE.EquirectangularReflectionMapping;

  const envMap = pmremGenerator.fromEquirectangular(canvasTexture).texture;
  Gadget3DManager.sharedEnvMap = envMap;
  pmremGenerator.dispose();
  return envMap;
}

// Materiais Físicos (PBR) com Micro-detalhes de Manufatura
function createRealisticPBRMaterials() {
  return {
    brushedTitaniumDark: new THREE.MeshStandardMaterial({
      color: 0x1e2433,
      metalness: 0.92,
      roughness: 0.25
    }),
    polishedTitanium: new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.98,
      roughness: 0.08
    }),
    polishedChrome: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.99,
      roughness: 0.04
    }),
    gold24k: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15
    }),
    anodizedAluminum: new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.88,
      roughness: 0.35
    }),
    sapphireGlass: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.05,
      roughness: 0.03,
      transmission: 0.92,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.54
    }),
    siliconeClear: new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      transmission: 0.8,
      transparent: true,
      opacity: 0.75,
      ior: 1.4
    }),
    matteRubber: new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.1,
      roughness: 0.75
    }),
    blackOLEDGlass: new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.85,
      roughness: 0.08
    }),
    neonCyan: new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 2.2,
      roughness: 0.1
    }),
    neonOrange: new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 2.2,
      roughness: 0.1
    }),
    neonPurple: new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 2.0,
      roughness: 0.1
    }),
    neonGreen: new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 1.8
    })
  };
}

// Adicionar Sombra de Contato Suave
function addContactShadow(group, y = -1.8, radius = 2.4, opacity = 0.5) {
  const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
  const mat = new THREE.MeshBasicMaterial({
    map: createRadialShadowTexture(),
    transparent: true,
    opacity: opacity,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  group.add(mesh);
  return mesh;
}

// Micro-parafuso Torx / Pentalobe Mecânico
function createMicroScrew(mat) {
  const screwGroup = new THREE.Group();
  const headGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16);
  const head = new THREE.Mesh(headGeo, mat);
  screwGroup.add(head);

  // Ranhura da cabeça
  const slotGeo = new THREE.BoxGeometry(0.065, 0.015, 0.012);
  const slotMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const slot = new THREE.Mesh(slotGeo, slotMat);
  slot.position.y = 0.015;
  screwGroup.add(slot);

  return screwGroup;
}

// ==========================================================================
// 3. Modelos 3D com Micro-Detalhes de Luxo Industrial
// ==========================================================================

// --------------------------------------------------------------------------
// GADGET 1: VisionAR Glass (Óculos AR com Micro-parafusos, Nosepads e Câmeras)
// --------------------------------------------------------------------------
function buildVisionARModel() {
  const group = new THREE.Group();
  const mat = createRealisticPBRMaterials();
  const hudController = createHUDCanvas();

  // 1. Armação Superior Aerodinâmica com Bisel Duplo
  const browShape = new THREE.Shape();
  browShape.moveTo(-3.0, 0.55);
  browShape.quadraticCurveTo(0, 0.9, 3.0, 0.55);
  browShape.lineTo(2.9, 0.15);
  browShape.quadraticCurveTo(0, 0.55, -2.9, 0.15);
  browShape.closePath();

  const browExtrude = { depth: 0.35, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.06, bevelThickness: 0.06 };
  const browGeo = new THREE.ExtrudeGeometry(browShape, browExtrude);
  const browMesh = new THREE.Mesh(browGeo, mat.brushedTitaniumDark);
  browMesh.castShadow = true;
  group.add(browMesh);

  // Friso Cromado de Destaque Superior
  const trimGeo = new THREE.TorusGeometry(2.95, 0.02, 12, 60, Math.PI * 0.9);
  trimGeo.rotateZ(Math.PI * 0.05);
  const trim = new THREE.Mesh(trimGeo, mat.polishedChrome);
  trim.position.set(0, 0.65, 0.35);
  group.add(trim);

  // 2. Pontilhão Central com Câmera Dupla Estereoscópica e LiDAR
  const bridgeGeo = new THREE.BoxGeometry(0.55, 0.38, 0.38);
  const bridge = new THREE.Mesh(bridgeGeo, mat.polishedTitanium);
  bridge.position.set(0, 0.45, 0.18);
  group.add(bridge);

  // Câmera Esquerda & Direita no Chassi
  for (let s of [-1, 1]) {
    // Aro Cromado da Câmera
    const camRingGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16);
    camRingGeo.rotateX(Math.PI / 2);
    const camRing = new THREE.Mesh(camRingGeo, mat.polishedChrome);
    camRing.position.set(s * 2.55, 0.35, 0.4);
    group.add(camRing);

    // Lente de Safira da Câmera
    const camLensGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const camLens = new THREE.Mesh(camLensGeo, mat.blackOLEDGlass);
    camLens.position.set(s * 2.55, 0.35, 0.44);
    group.add(camLens);

    // Microfone Estéreo Pinhole
    const micGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.05, 12);
    micGeo.rotateX(Math.PI / 2);
    const mic = new THREE.Mesh(micGeo, mat.blackOLEDGlass);
    mic.position.set(s * 0.4, 0.55, 0.38);
    group.add(mic);
  }

  // 3. Apoios Nasais Ergonômicos em Silicone com Braços de Titânio
  for (let s of [-1, 1]) {
    // Braço de arame de titânio
    const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12);
    const arm = new THREE.Mesh(armGeo, mat.polishedTitanium);
    arm.position.set(s * 0.35, 0.1, 0.05);
    arm.rotation.z = s * 0.35;
    group.add(arm);

    // Almofada de Silicone Translúcida
    const padGeo = new THREE.BoxGeometry(0.18, 0.32, 0.08);
    const pad = new THREE.Mesh(padGeo, mat.siliconeClear);
    pad.position.set(s * 0.45, -0.05, 0.05);
    pad.rotation.y = s * 0.25;
    group.add(pad);
  }

  // 4. Lentes Duplas Curvadas Envolventes com Refração
  const leftLensGeo = new THREE.BoxGeometry(2.35, 1.45, 0.08);
  const leftLens = new THREE.Mesh(leftLensGeo, mat.sapphireGlass);
  leftLens.position.set(-1.55, -0.3, 0.16);
  leftLens.rotation.y = 0.08;
  group.add(leftLens);

  const rightLensGeo = new THREE.BoxGeometry(2.35, 1.45, 0.08);
  const rightLens = new THREE.Mesh(rightLensGeo, mat.sapphireGlass);
  rightLens.position.set(1.55, -0.3, 0.16);
  rightLens.rotation.y = -0.08;
  group.add(rightLens);

  // Projeção HUD no Guia de Onda Interno
  const hudGeo = new THREE.PlaneGeometry(2.1, 1.05);
  const hudMat = new THREE.MeshBasicMaterial({
    map: hudController.texture,
    transparent: true,
    opacity: 0.95,
    depthWrite: false
  });
  const hudMesh = new THREE.Mesh(hudGeo, hudMat);
  hudMesh.position.set(1.55, -0.3, 0.22);
  hudMesh.rotation.y = -0.08;
  group.add(hudMesh);

  // 5. Dobradiças Articuladas com Micro-parafusos e Hastes Acústicas
  for (let side of [-1, 1]) {
    // Dobradiça Articulada
    const hingeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 16);
    const hinge = new THREE.Mesh(hingeGeo, mat.polishedTitanium);
    hinge.position.set(side * 2.9, 0.3, -0.05);
    group.add(hinge);

    // Micro-parafuso no Topo da Dobradiça
    const screw = createMicroScrew(mat.polishedChrome);
    screw.position.set(side * 2.9, 0.45, -0.05);
    group.add(screw);

    // Haste de Alumínio e Carbono
    const templeGeo = new THREE.CylinderGeometry(0.09, 0.14, 3.4, 20);
    templeGeo.rotateX(Math.PI / 2);
    const temple = new THREE.Mesh(templeGeo, mat.anodizedAluminum);
    temple.position.set(side * 2.85, 0.3, -1.75);
    temple.rotation.y = -side * 0.06;
    group.add(temple);

    // Transdutor de Áudio por Condução Óssea na Haste
    const audioPodGeo = new THREE.BoxGeometry(0.16, 0.22, 0.6);
    const audioPod = new THREE.Mesh(audioPodGeo, mat.brushedTitaniumDark);
    audioPod.position.set(side * 2.82, 0.3, -1.2);
    group.add(audioPod);

    // Ponteira Emborrachada Anatômica
    const tipGeo = new THREE.CylinderGeometry(0.08, 0.09, 1.0, 16);
    tipGeo.rotateX(Math.PI / 2.3);
    const tip = new THREE.Mesh(tipGeo, mat.matteRubber);
    tip.position.set(side * 2.75, 0.18, -3.8);
    group.add(tip);
  }

  // Sombra de chão
  addContactShadow(group, -1.4, 3.2, 0.4);

  return {
    group,
    cameraPos: [0, 0.2, 5.4],
    update: (time, isSpecial) => {
      group.position.y = Math.sin(time * 1.8) * 0.06;
      if (isSpecial) {
        hudMesh.visible = true;
        hudController.draw(time);
        hudController.texture.needsUpdate = true;
      } else {
        hudMesh.visible = false;
      }
    }
  };
}

// --------------------------------------------------------------------------
// GADGET 2: PulseTouch Pro (Bracelete com Micro-parafusos, Pinos Ouro e Coroas)
// --------------------------------------------------------------------------
function buildPulseTouchModel() {
  const group = new THREE.Group();
  const mat = createRealisticPBRMaterials();
  const screenController = createSmartwatchScreenCanvas();

  // 1. Pulseira de Fluororrubina com Fendas de Ventilação Aerodinâmicas
  const strapGeo = new THREE.TorusGeometry(1.95, 0.42, 24, 72, Math.PI * 1.85);
  strapGeo.rotateX(Math.PI / 2);
  strapGeo.rotateZ(Math.PI * 0.07);
  const strap = new THREE.Mesh(strapGeo, mat.matteRubber);
  strap.castShadow = true;
  group.add(strap);

  // Fivelas de Ventilação na Pulseira
  for (let a = -1.2; a <= 1.2; a += 0.4) {
    if (Math.abs(a) < 0.3) continue; // Pula sob a caixa
    const ventGeo = new THREE.BoxGeometry(0.3, 0.08, 0.1);
    const vent = new THREE.Mesh(ventGeo, mat.blackOLEDGlass);
    vent.position.set(Math.sin(a) * 1.95, 0, Math.cos(a) * 1.95);
    vent.rotation.y = a;
    group.add(vent);
  }

  // Fecho Metálico Gravado
  const buckleGeo = new THREE.BoxGeometry(0.9, 0.5, 0.3);
  const buckle = new THREE.Mesh(buckleGeo, mat.polishedTitanium);
  buckle.position.set(0, -0.05, -1.95);
  group.add(buckle);

  // 2. Caixa Unibody em Titânio com 4 Parafusos Torx nos Cantos
  const caseGeo = new THREE.BoxGeometry(1.85, 2.35, 0.65);
  const caseMesh = new THREE.Mesh(caseGeo, mat.brushedTitaniumDark);
  caseMesh.position.set(0, 0, 1.95);
  caseMesh.castShadow = true;
  group.add(caseMesh);

  // 4 Micro-parafusos Torx nos Cantos da Caixa
  const cornerOffsets = [
    [-0.8, 1.05], [0.8, 1.05],
    [-0.8, -1.05], [0.8, -1.05]
  ];
  cornerOffsets.forEach(([cx, cy]) => {
    const screw = createMicroScrew(mat.polishedChrome);
    screw.position.set(cx, cy, 2.3);
    group.add(screw);
  });

  // Bisel de Titânio Polido Chanfrado
  const bezelGeo = new THREE.BoxGeometry(1.75, 2.25, 0.08);
  const bezelMesh = new THREE.Mesh(bezelGeo, mat.polishedTitanium);
  bezelMesh.position.set(0, 0, 2.3);
  group.add(bezelMesh);

  // 3. Tela OLED Curva e Cristal de Safira
  const screenGeo = new THREE.PlaneGeometry(1.58, 2.05);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenController.texture });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, 2.35);
  group.add(screenMesh);

  const glassGeo = new THREE.BoxGeometry(1.65, 2.15, 0.06);
  const glassMesh = new THREE.Mesh(glassGeo, mat.sapphireGlass);
  glassMesh.position.set(0, 0, 2.39);
  group.add(glassMesh);

  // 4. Lado Direito: Coroa Digital Recartilhada com Eixo Duplo
  const crownGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 24);
  crownGeo.rotateZ(Math.PI / 2);
  const crown = new THREE.Mesh(crownGeo, mat.polishedTitanium);
  crown.position.set(1.05, 0.45, 1.95);
  group.add(crown);

  const crownRingGeo = new THREE.TorusGeometry(0.24, 0.04, 16, 24);
  crownRingGeo.rotateY(Math.PI / 2);
  const crownRing = new THREE.Mesh(crownRingGeo, mat.neonOrange);
  crownRing.position.set(1.15, 0.45, 1.95);
  group.add(crownRing);

  // Botão Secundário Lateral Direito
  const secBtnGeo = new THREE.BoxGeometry(0.18, 0.5, 0.22);
  const secBtn = new THREE.Mesh(secBtnGeo, mat.polishedTitanium);
  secBtn.position.set(0.98, -0.45, 1.95);
  group.add(secBtn);

  // Lado Esquerdo: Botão de Ação Laranja Anodizado com Estrias
  const actionBtnGeo = new THREE.BoxGeometry(0.18, 0.65, 0.26);
  const actionBtn = new THREE.Mesh(actionBtnGeo, mat.neonOrange);
  actionBtn.position.set(-0.98, 0.2, 1.95);
  group.add(actionBtn);

  // 5. Traseira Cerâmica: 4 Pinos Pogo Banhados a Ouro 24k e Matriz Óptica
  const sensorDomeGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.12, 24);
  sensorDomeGeo.rotateX(Math.PI / 2);
  const sensorDome = new THREE.Mesh(sensorDomeGeo, mat.blackOLEDGlass);
  sensorDome.position.set(0, 0, 1.6);
  group.add(sensorDome);

  // 4 Pinos Pogo de Carga em Ouro 24k
  for (let p = -0.24; p <= 0.24; p += 0.16) {
    const pinGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 12);
    pinGeo.rotateX(Math.PI / 2);
    const pin = new THREE.Mesh(pinGeo, mat.gold24k);
    pin.position.set(p, 0.4, 1.58);
    group.add(pin);
  }

  // Matriz de 4 Fotodiodos Biométricos Verdes e Vermelhos
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2;
    const diodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const diodeMat = (i % 2 === 0) ? mat.neonGreen : mat.neonOrange;
    const diode = new THREE.Mesh(diodeGeo, diodeMat);
    diode.position.set(Math.cos(ang) * 0.25, Math.sin(ang) * 0.25, 1.54);
    group.add(diode);
  }

  // Sombra de chão
  addContactShadow(group, -1.8, 2.6, 0.45);

  return {
    group,
    cameraPos: [0, 1.2, 5.6],
    update: (time, isSpecial) => {
      group.position.y = Math.sin(time * 2.0) * 0.05;

      if (isSpecial) {
        caseMesh.position.x = Math.sin(time * 40) * 0.015;
        screenController.draw(time);
        screenController.texture.needsUpdate = true;
      }
    }
  };
}

// --------------------------------------------------------------------------
// GADGET 3: AuraRing Control (Anel de Titânio com Eletrodos Ouro e Micro-entalhes)
// --------------------------------------------------------------------------
function buildAuraRingModel() {
  const group = new THREE.Group();
  const mat = createRealisticPBRMaterials();

  // 1. Corpo do Anel em Torus com Ranhuras Duplas de Usinagem
  const ringGeo = new THREE.TorusGeometry(1.65, 0.38, 36, 100);
  const ringMesh = new THREE.Mesh(ringGeo, mat.polishedTitanium);
  ringMesh.castShadow = true;
  group.add(ringMesh);

  // Ranhura Esquerda e Direita de Contraste Espelhado
  for (let s of [-1, 1]) {
    const grooveGeo = new THREE.TorusGeometry(1.66, 0.02, 16, 100);
    const groove = new THREE.Mesh(grooveGeo, mat.polishedChrome);
    groove.position.z = s * 0.22;
    group.add(groove);
  }

  // 2. Faceta Plana Ergonômica Superior com Micro-entalhe Sensorial
  const sensorPadGeo = new THREE.BoxGeometry(0.9, 0.18, 0.45);
  const sensorPad = new THREE.Mesh(sensorPadGeo, mat.brushedTitaniumDark);
  sensorPad.position.set(0, 1.95, 0);
  group.add(sensorPad);

  // Micro-LED de Notificação Central (0.3mm)
  const ledDotGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const ledDot = new THREE.Mesh(ledDotGeo, mat.neonCyan);
  ledDot.position.set(0, 2.05, 0);
  group.add(ledDot);

  // 3. Faixa Perimetral Luminescente de Gestos 3D
  const inlayGeo = new THREE.TorusGeometry(1.69, 0.05, 20, 100);
  const inlayMesh = new THREE.Mesh(inlayGeo, mat.neonPurple);
  group.add(inlayMesh);

  // 4. Manga Interna em Resina Biocompatível com Eletrodos em Ouro 24k
  const innerResinGeo = new THREE.TorusGeometry(1.5, 0.16, 24, 80);
  const innerResin = new THREE.Mesh(innerResinGeo, mat.sapphireGlass);
  group.add(innerResin);

  // 2 Eletrodos de Carga em Ouro 24k Flush-Mount
  for (let s of [-0.22, 0.22]) {
    const goldPlateGeo = new THREE.BoxGeometry(0.2, 0.08, 0.12);
    const goldPlate = new THREE.Mesh(goldPlateGeo, mat.gold24k);
    goldPlate.position.set(s, -1.35, 0.25);
    group.add(goldPlate);
  }

  // 3 Nódulos Sensores Ópticos com Domos de Lente Micro-usinados
  const sensorPositions = [-0.6, 0, 0.6];
  const sensorColors = [mat.neonGreen, mat.neonPurple, mat.neonCyan];

  sensorPositions.forEach((pos, idx) => {
    const diodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const diode = new THREE.Mesh(diodeGeo, sensorColors[idx]);
    diode.position.set(pos, -1.35, 0);
    group.add(diode);
  });

  // 5. Ondas e Micro-partículas Espaciais de Interação
  const spatialWaves = [];
  for (let i = 0; i < 3; i++) {
    const waveGeo = new THREE.TorusGeometry(2.15 + (i * 0.45), 0.02, 16, 80);
    const waveMat = new THREE.MeshBasicMaterial({
      color: (i % 2 === 0 ? 0x00f2fe : 0xc084fc),
      transparent: true,
      opacity: 0.35 - (i * 0.08)
    });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.rotation.x = Math.PI / 3;
    group.add(wave);
    spatialWaves.push(wave);
  }

  // Sombra de chão
  addContactShadow(group, -1.7, 2.5, 0.35);

  return {
    group,
    cameraPos: [0, 0.3, 5.2],
    update: (time, isSpecial) => {
      group.rotation.x = time * 0.5;
      group.rotation.y = time * 0.7;

      if (isSpecial) {
        spatialWaves.forEach((w, idx) => {
          w.visible = true;
          w.rotation.z += 0.015 * (idx + 1);
          const s = 1 + Math.sin(time * 3 + idx) * 0.12;
          w.scale.set(s, s, s);
        });
      } else {
        spatialWaves.forEach(w => w.visible = false);
      }
    }
  };
}

// --------------------------------------------------------------------------
// GADGET 4: HoloDesk AI (Hub Acústico com Controles Touch e Núcleo Truncado)
// --------------------------------------------------------------------------
function buildHoloDeskModel() {
  const group = new THREE.Group();
  const mat = createRealisticPBRMaterials();
  const grilleTexture = createMicroGrilleTexture();

  // 1. Base Cilíndrica Maciça de Alumínio Acústico Anodizado
  const baseGeo = new THREE.CylinderGeometry(1.9, 2.25, 1.4, 48);
  const baseMesh = new THREE.Mesh(baseGeo, mat.anodizedAluminum);
  baseMesh.position.y = -1.1;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Anel de Borracha Antiderrapante no Fundo
  const footRingGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 48);
  footRingGeo.rotateX(Math.PI / 2);
  const footRing = new THREE.Mesh(footRingGeo, mat.matteRubber);
  footRing.position.y = -1.8;
  group.add(footRing);

  // Microperfurações Acústicas Usinadas a Laser
  const grilleMat = new THREE.MeshStandardMaterial({
    map: grilleTexture,
    metalness: 0.8,
    roughness: 0.3
  });
  const acousticRingGeo = new THREE.CylinderGeometry(1.92, 2.27, 0.65, 48);
  const acousticRing = new THREE.Mesh(acousticRingGeo, grilleMat);
  acousticRing.position.y = -1.1;
  group.add(acousticRing);

  // Placa Superior com Chanfro de Prata Espelhada
  const topPlateGeo = new THREE.CylinderGeometry(1.88, 1.9, 0.12, 48);
  const topPlate = new THREE.Mesh(topPlateGeo, mat.polishedChrome);
  topPlate.position.y = -0.38;
  group.add(topPlate);

  // Anel Touch Capacitivo no Topo com 4 Ícones Gravados
  const touchRingGeo = new THREE.RingGeometry(1.35, 1.85, 40);
  touchRingGeo.rotateX(-Math.PI / 2);
  const touchRing = new THREE.Mesh(touchRingGeo, mat.blackOLEDGlass);
  touchRing.position.y = -0.31;
  group.add(touchRing);

  // 4 Micro-pontos de LED dos Controles Touch (+, -, Mute, Power)
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2;
    const dotGeo = new THREE.CircleGeometry(0.045, 12);
    dotGeo.rotateX(-Math.PI / 2);
    const dot = new THREE.Mesh(dotGeo, mat.neonCyan);
    dot.position.set(Math.cos(ang) * 1.6, -0.3, Math.sin(ang) * 1.6);
    group.add(dot);
  }

  // Lente Óptica de Projeção Convexa e Cone Refletor
  const projectorLensGeo = new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.28);
  projectorLensGeo.rotateX(Math.PI);
  const projectorLens = new THREE.Mesh(projectorLensGeo, mat.sapphireGlass);
  projectorLens.position.y = -0.28;
  group.add(projectorLens);

  // Anel Emissor Laser Perimetral
  const emitterRingGeo = new THREE.TorusGeometry(1.32, 0.05, 16, 48);
  emitterRingGeo.rotateX(Math.PI / 2);
  const emitterRing = new THREE.Mesh(emitterRingGeo, mat.neonCyan);
  emitterRing.position.y = -0.32;
  group.add(emitterRing);

  // 2. Cone de Luz Volumétrica Coerente
  const coneGeo = new THREE.ConeGeometry(2.5, 3.2, 48, 1, true);
  coneGeo.rotateX(Math.PI);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const coneMesh = new THREE.Mesh(coneGeo, coneMat);
  coneMesh.position.y = 1.1;
  group.add(coneMesh);

  // 3. Projeção Holográfica 3D: Núcleo Neural de IA
  const holoGroup = new THREE.Group();
  holoGroup.position.y = 1.6;

  // Esfera de Energia Central
  const energyCoreGeo = new THREE.SphereGeometry(0.38, 24, 24);
  const energyCore = new THREE.Mesh(energyCoreGeo, mat.neonCyan);
  holoGroup.add(energyCore);

  // Poliedro Neural Wireframe
  const icoGeo = new THREE.IcosahedronGeometry(0.95, 0);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  holoGroup.add(icoMesh);

  // Octaedro Invertido
  const octGeo = new THREE.OctahedronGeometry(0.65, 0);
  const octMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true });
  const octMesh = new THREE.Mesh(octGeo, octMat);
  holoGroup.add(octMesh);

  // Anéis Orbitais com Nódulos de Dados
  const ring1Geo = new THREE.TorusGeometry(1.35, 0.03, 16, 48);
  const ring1 = new THREE.Mesh(ring1Geo, mat.neonCyan);
  holoGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(1.55, 0.025, 16, 48);
  ring2Geo.rotateX(Math.PI / 2.8);
  const ring2 = new THREE.Mesh(ring2Geo, mat.neonPurple);
  holoGroup.add(ring2);

  // Micro-partículas em Órbita
  const particleCount = 18;
  const particles = [];
  for (let p = 0; p < particleCount; p++) {
    const pGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const pMesh = new THREE.Mesh(pGeo, mat.neonCyan);
    const rad = 1.1 + Math.random() * 0.6;
    const ang = Math.random() * Math.PI * 2;
    pMesh.position.set(Math.cos(ang) * rad, (Math.random() - 0.5) * 0.8, Math.sin(ang) * rad);
    holoGroup.add(pMesh);
    particles.push(pMesh);
  }

  group.add(holoGroup);

  // Sombra de chão
  addContactShadow(group, -1.82, 3.0, 0.6);

  return {
    group,
    cameraPos: [0, 0.8, 6.4],
    update: (time, isSpecial) => {
      if (isSpecial) {
        holoGroup.visible = true;
        coneMesh.visible = true;

        icoMesh.rotation.x = time * 0.9;
        icoMesh.rotation.y = time * 1.3;
        octMesh.rotation.x = -time * 1.1;
        octMesh.rotation.z = time * 0.8;

        ring1.rotation.z = time * 1.0;
        ring2.rotation.y = -time * 1.2;

        const pulse = 1 + Math.sin(time * 5) * 0.16;
        energyCore.scale.set(pulse, pulse, pulse);
        holoGroup.position.y = 1.6 + Math.sin(time * 2.5) * 0.12;

        particles.forEach((p, i) => {
          p.position.y += Math.sin(time * 3 + i) * 0.005;
        });
      } else {
        holoGroup.visible = false;
        coneMesh.visible = false;
      }
    }
  };
}

// --------------------------------------------------------------------------
// GADGET 5: HydroSmart (Garrafa Torneada com Medidor Segmentado e Refletor UV)
// --------------------------------------------------------------------------
function buildHydroSmartModel() {
  const group = new THREE.Group();
  const mat = createRealisticPBRMaterials();
  const capOledTexture = createBottleOLEDTexture();

  // 1. Corpo em Torno (Lathe Geometry de Alta Resolução)
  const points = [];
  points.push(new THREE.Vector2(0, -1.8));
  points.push(new THREE.Vector2(0.96, -1.8));
  points.push(new THREE.Vector2(0.98, -1.6));
  points.push(new THREE.Vector2(0.96, 0.6));
  points.push(new THREE.Vector2(0.92, 1.2));
  points.push(new THREE.Vector2(0.72, 1.6));
  points.push(new THREE.Vector2(0.72, 1.95));
  points.push(new THREE.Vector2(0.66, 1.95));

  const bodyGeo = new THREE.LatheGeometry(points, 48);
  const bodyMesh = new THREE.Mesh(bodyGeo, mat.anodizedAluminum);
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Copo de Proteção Base em Aço Inox com Gravação
  const baseBandGeo = new THREE.CylinderGeometry(0.97, 0.97, 0.28, 48);
  const baseBand = new THREE.Mesh(baseBandGeo, mat.polishedChrome);
  baseBand.position.y = -1.65;
  group.add(baseBand);

  // 2. Tampa Inteligente com Anel de Silicone Estriado
  const capGeo = new THREE.CylinderGeometry(0.76, 0.76, 0.65, 48);
  const capMesh = new THREE.Mesh(capGeo, mat.brushedTitaniumDark);
  capMesh.position.y = 2.25;
  capMesh.castShadow = true;
  group.add(capMesh);

  // Anel Diamond-Knurled de Aderência
  const gripBandGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.32, 48);
  const gripBand = new THREE.Mesh(gripBandGeo, mat.matteRubber);
  gripBand.position.y = 2.25;
  group.add(gripBand);

  // Borda Polida Chanfrada na Tampa
  const capTrimGeo = new THREE.TorusGeometry(0.76, 0.03, 16, 48);
  capTrimGeo.rotateX(Math.PI / 2);
  const capTrim = new THREE.Mesh(capTrimGeo, mat.polishedChrome);
  capTrim.position.y = 2.58;
  group.add(capTrim);

  // Display OLED Touch no Topo
  const oledGeo = new THREE.CircleGeometry(0.62, 40);
  oledGeo.rotateX(-Math.PI / 2);
  const oledMat = new THREE.MeshBasicMaterial({ map: capOledTexture });
  const oledMesh = new THREE.Mesh(oledGeo, oledMat);
  oledMesh.position.y = 2.59;
  group.add(oledMesh);

  // Anel LED de Esterilização UV-C
  const uvcRingGeo = new THREE.TorusGeometry(0.75, 0.05, 16, 48);
  uvcRingGeo.rotateX(Math.PI / 2);
  const uvcRing = new THREE.Mesh(uvcRingGeo, mat.neonPurple);
  uvcRing.position.y = 1.95;
  group.add(uvcRing);

  // Medidor de Nível de Hidratação Vertical (10 Segmentos de LED Discretos)
  const segments = [];
  for (let s = 0; s < 10; s++) {
    const segGeo = new THREE.BoxGeometry(0.07, 0.16, 0.06);
    const segMat = (s < 8) ? mat.neonCyan : mat.matteRubber;
    const seg = new THREE.Mesh(segGeo, segMat);
    seg.position.set(0, -1.2 + (s * 0.2), 0.98);
    group.add(seg);
    segments.push(seg);
  }

  // Sombra de chão
  addContactShadow(group, -1.82, 2.4, 0.5);

  return {
    group,
    cameraPos: [0, 0.6, 5.8],
    update: (time, isSpecial) => {
      group.position.y = Math.sin(time * 1.8) * 0.05;
      if (isSpecial) {
        uvcRing.scale.setScalar(1 + Math.sin(time * 6) * 0.06);
        // Efeito de pulso suave no nível
        segments.forEach((seg, i) => {
          if (i < 8) {
            seg.scale.x = 1 + Math.sin(time * 4 + i * 0.3) * 0.15;
          }
        });
      }
    }
  };
}

// --------------------------------------------------------------------------
// GADGET 6: Orbital Sound (Caixa de Som Flutuante com Radiador Duplo e Base CNC)
// --------------------------------------------------------------------------
function buildOrbitalSoundModel() {
  const group = new THREE.Group();
  const mat = createRealisticPBRMaterials();
  const grilleTexture = createMicroGrilleTexture();

  // 1. Base Magnética Circular Maciça com Chanfro de 45° Polido
  const baseDiscGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.6, 56);
  const baseMesh = new THREE.Mesh(baseDiscGeo, mat.anodizedAluminum);
  baseMesh.position.y = -1.65;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Borda Chanfrada Polida Espelhada na Base
  const baseBezelGeo = new THREE.TorusGeometry(2.4, 0.08, 16, 56);
  baseBezelGeo.rotateX(Math.PI / 2);
  const baseBezel = new THREE.Mesh(baseBezelGeo, mat.polishedChrome);
  baseBezel.position.y = -1.35;
  group.add(baseBezel);

  // Botões Capacitivos Flush na Borda Dianteira (+, -, Play, Bluetooth)
  for (let b = -0.4; b <= 0.4; b += 0.26) {
    const btnGeo = new THREE.CircleGeometry(0.04, 16);
    btnGeo.rotateX(-Math.PI / 3);
    const btn = new THREE.Mesh(btnGeo, mat.neonCyan);
    btn.position.set(b, -1.4, 2.3);
    group.add(btn);
  }

  // Bobinas Concêntricas de Indução Magnética Iluminadas
  const outerCoilGeo = new THREE.TorusGeometry(1.8, 0.07, 16, 56);
  outerCoilGeo.rotateX(Math.PI / 2);
  const outerCoil = new THREE.Mesh(outerCoilGeo, mat.neonCyan);
  outerCoil.position.y = -1.33;
  group.add(outerCoil);

  const innerCoilGeo = new THREE.TorusGeometry(1.0, 0.05, 16, 56);
  innerCoilGeo.rotateX(Math.PI / 2);
  const innerCoil = new THREE.Mesh(innerCoilGeo, mat.neonCyan);
  innerCoil.position.y = -1.33;
  group.add(innerCoil);

  // 2. Esfera Acústica Flutuante com Radiadores Passivos Opostos
  const orbGroup = new THREE.Group();
  orbGroup.position.y = 0.8;

  // Esfera Principal em Carbono Acetinado
  const orbSphereGeo = new THREE.SphereGeometry(1.35, 48, 48);
  const orbSphere = new THREE.Mesh(orbSphereGeo, mat.brushedTitaniumDark);
  orbSphere.castShadow = true;
  orbGroup.add(orbSphere);

  // Grelha Acústica Equatorial Micro-perfurada 360°
  const acousticBandGeo = new THREE.CylinderGeometry(1.37, 1.37, 0.4, 48, 1, true);
  const acousticBandMat = new THREE.MeshStandardMaterial({
    map: grilleTexture,
    metalness: 0.85,
    roughness: 0.25
  });
  const acousticBand = new THREE.Mesh(acousticBandGeo, acousticBandMat);
  orbGroup.add(acousticBand);

  // Anel de Luz Neon da Linha Equatorial de Som
  const soundRingGeo = new THREE.TorusGeometry(1.38, 0.04, 16, 56);
  soundRingGeo.rotateX(Math.PI / 2);
  const soundRing = new THREE.Mesh(soundRingGeo, mat.neonCyan);
  orbGroup.add(soundRing);

  // Radiador de Graves Superior: Cone de Alumínio e Borda de Borracha
  const subTopGeo = new THREE.CylinderGeometry(0.75, 0.85, 0.16, 40);
  const subTop = new THREE.Mesh(subTopGeo, mat.polishedChrome);
  subTop.position.y = 1.32;
  orbGroup.add(subTop);

  const subRollGeo = new THREE.TorusGeometry(0.85, 0.06, 16, 40);
  subRollGeo.rotateX(Math.PI / 2);
  const subRoll = new THREE.Mesh(subRollGeo, mat.matteRubber);
  subRoll.position.y = 1.32;
  orbGroup.add(subRoll);

  // Radiador de Graves Inferior Oposto (Equilíbrio Físico)
  const subBottomGeo = new THREE.CylinderGeometry(0.85, 0.75, 0.16, 40);
  const subBottom = new THREE.Mesh(subBottomGeo, mat.polishedChrome);
  subBottom.position.y = -1.32;
  orbGroup.add(subBottom);

  group.add(orbGroup);

  // 3. Ondas Sonoras Expansivas Esféricas em Wireframe
  const waveList = [];
  for (let i = 0; i < 2; i++) {
    const waveGeo = new THREE.SphereGeometry(1.75 + (i * 0.5), 24, 24);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22 - (i * 0.09)
    });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    orbGroup.add(wave);
    waveList.push(wave);
  }

  // Sombra de chão suave sob a base magnética
  addContactShadow(group, -1.95, 3.4, 0.55);

  return {
    group,
    cameraPos: [0, 0.4, 6.2],
    update: (time, isSpecial) => {
      orbGroup.position.y = 0.8 + Math.sin(time * 2.6) * 0.14;
      orbGroup.rotation.y = time * 0.6;

      if (isSpecial) {
        waveList.forEach((w, idx) => {
          w.visible = true;
          const s = 1 + (Math.sin(time * 6 + idx * 1.5) + 1) * 0.1;
          w.scale.set(s, s, s);
        });
        outerCoil.scale.setScalar(1 + Math.sin(time * 4) * 0.04);
        // Vibração física dos radiadores de graves opostos
        subTop.position.y = 1.32 + Math.sin(time * 12) * 0.02;
        subBottom.position.y = -1.32 - Math.sin(time * 12) * 0.02;
      } else {
        waveList.forEach(w => w.visible = false);
      }
    }
  };
}

// Factory de Criação de Modelo por ID
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
// 4. Integração nos Cards do Catálogo (Preview Interativo 3D a 60 FPS)
// ==========================================================================

function initCard3DViewers() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    const productId = parseInt(card.getAttribute('data-id'), 10);
    const container = card.querySelector('.product-3d-canvas-container');
    if (!container || container.getAttribute('data-initialized') === 'true') return;

    container.setAttribute('data-initialized', 'true');

    const width = container.clientWidth || 320;
    const height = 230;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const envMap = getOrCreateStudioEnvironment(renderer);
    scene.environment = envMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.2);
    rimLight.position.set(0, -4, 4);
    scene.add(rimLight);

    const modelData = createGadgetModel(productId);
    scene.add(modelData.group);

    const [cx, cy, cz] = modelData.cameraPos;
    camera.position.set(cx, cy, cz);
    camera.lookAt(0, 0, 0);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotY = 0;
    let rotX = 0;
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
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      rotY += dx * 0.012;
      rotX += dy * 0.012;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    let clock = new THREE.Clock();

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        rotY += isHovered ? 0.014 : 0.007;
      }

      modelData.group.rotation.y = rotY;
      modelData.group.rotation.x = rotX * 0.4;

      modelData.update(elapsedTime, true);
      renderer.render(scene, camera);
    }

    renderLoop();
  });
}

// ==========================================================================
// 5. Studio 3D 360° Fullscreen Modal
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
  container.innerHTML = '';

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060a12, 0.05);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x060a12, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const envMap = getOrCreateStudioEnvironment(renderer);
  scene.environment = envMap;

  // Grade de Chão de Estúdio Cyberpunk
  const gridHelper = new THREE.GridHelper(18, 32, 0x00f2fe, 0x1e293b);
  gridHelper.position.y = -2.1;
  scene.add(gridHelper);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const spot1 = new THREE.SpotLight(0xe0f2fe, 3.5, 30, Math.PI / 4, 0.3);
  spot1.position.set(6, 8, 6);
  scene.add(spot1);

  const spot2 = new THREE.SpotLight(0xc084fc, 2.5, 30, Math.PI / 4, 0.3);
  spot2.position.set(-6, 3, -6);
  scene.add(spot2);

  const neonUnder = new THREE.PointLight(0x00f2fe, 2.0, 10);
  neonUnder.position.set(0, -2.0, 0);
  scene.add(neonUnder);

  const modelData = createGadgetModel(productId);
  scene.add(modelData.group);

  const [cx, cy, cz] = modelData.cameraPos;
  camera.position.set(cx, cy + 0.4, cz + 1.2);

  let controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 2.4;
    controls.target.set(0, 0, 0);
  }

  Gadget3DManager.modalScene = scene;
  Gadget3DManager.modalCamera = camera;
  Gadget3DManager.modalRenderer = renderer;
  Gadget3DManager.modalControls = controls;
  Gadget3DManager.modalCurrentModel = modelData;
  Gadget3DManager.modalCurrentId = productId;

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
        modelData.group.rotation.y += 0.007;
      }
      controls.update();
    }

    modelData.update(elapsedTime, Gadget3DManager.isSpecialEffectActive);
    renderer.render(scene, camera);
  }

  animateModal();
}

function toggleAutoRotate() {
  Gadget3DManager.isAutoRotate = !Gadget3DManager.isAutoRotate;
  const btn = document.getElementById('btn-toggle-rotate');
  if (btn) {
    btn.classList.toggle('active', Gadget3DManager.isAutoRotate);
    btn.innerHTML = Gadget3DManager.isAutoRotate ? '🔄 Rotação: Ligada' : '⏸️ Rotação: Pausada';
  }
}

function toggleSpecialEffect() {
  Gadget3DManager.isSpecialEffectActive = !Gadget3DManager.isSpecialEffectActive;
  const btn = document.getElementById('btn-toggle-fx');
  if (btn) {
    btn.classList.toggle('active', Gadget3DManager.isSpecialEffectActive);
    btn.innerHTML = Gadget3DManager.isSpecialEffectActive ? '⚡ Efeitos Especiais: Ligados' : '⚪ Efeitos: Desligados';
  }
}

function reset3DCamera() {
  if (Gadget3DManager.modalCurrentModel && Gadget3DManager.modalCamera && Gadget3DManager.modalControls) {
    const [cx, cy, cz] = Gadget3DManager.modalCurrentModel.cameraPos;
    Gadget3DManager.modalCamera.position.set(cx, cy + 0.4, cz + 1.2);
    Gadget3DManager.modalControls.target.set(0, 0, 0);
    Gadget3DManager.modalCurrentModel.group.rotation.set(0, 0, 0);
  }
}
