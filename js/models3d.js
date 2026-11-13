/**
 * Modelos 3D de Ultra-Precisão Industrial - Revisão de Engenharia Completa
 * Three.js r128 • PBR Physical Materials • Studio HDRI • Micro-Engenharia
 * Gadgets Tech - 4º Bimestre
 * Alunos: Alexandre, Pedro Franchim, Marcus e Julio
 * Professor: Danilo Bezerra
 */

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

// ═══════════════════════════════════════════════════════════════════
// 1. TEXTURAS PROCEDURAIS DE ULTRA-DEFINIÇÃO
// ═══════════════════════════════════════════════════════════════════

function createRadialShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(256, 256, 20, 256, 256, 240);
  g.addColorStop(0, 'rgba(0,0,0,0.8)');
  g.addColorStop(0.25, 'rgba(0,0,0,0.5)');
  g.addColorStop(0.6, 'rgba(0,0,0,0.18)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(c);
}

// Textura de Escovação Radial (Para titânio escovado)
function createBrushedMetalNormal() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#8080ff';
  x.fillRect(0, 0, 256, 256);
  x.strokeStyle = 'rgba(128,128,255,0.6)';
  for (let i = 0; i < 200; i++) {
    x.lineWidth = 0.3 + Math.random() * 0.8;
    x.beginPath();
    const y = Math.random() * 256;
    x.moveTo(0, y);
    x.lineTo(256, y + (Math.random() - 0.5) * 4);
    x.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// HUD AR dos Óculos com Retículo Tático e Dados de Telemetria
function createHUDCanvas() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const x = c.getContext('2d');

  function draw(t = 0) {
    x.clearRect(0, 0, 512, 256);

    // Bússola e Horizonte Artificial
    x.strokeStyle = 'rgba(56,189,248,0.6)';
    x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(130, 32); x.lineTo(382, 32); x.stroke();
    // Marcas de Grau na Bússola
    for (let d = 0; d < 8; d++) {
      const px = 145 + d * 30 + Math.sin(t * 0.3) * 10;
      x.fillStyle = 'rgba(56,189,248,0.5)';
      x.fillRect(px, 28, 1, 8);
    }
    x.beginPath(); x.moveTo(256, 18); x.lineTo(256, 32); x.stroke();
    x.fillStyle = '#00f2fe';
    x.font = 'bold 14px monospace';
    x.textAlign = 'center';
    x.fillText('N 028°', 256, 52);

    // Dados de Velocidade e Altitude
    x.font = '11px monospace';
    x.fillStyle = 'rgba(148,163,184,0.8)';
    x.textAlign = 'left';
    x.fillText('ALT 742m', 35, 52);
    x.textAlign = 'right';
    x.fillText('24 km/h', 477, 52);

    // Retículo Tático Central
    x.strokeStyle = 'rgba(0,242,254,0.35)';
    x.lineWidth = 1;
    x.beginPath(); x.arc(256, 128, 20, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(256, 128, 10, 0, Math.PI * 2); x.stroke();
    // Cruz do Retículo
    const cl = 28;
    x.beginPath();
    x.moveTo(256 - cl, 128); x.lineTo(256 - 12, 128);
    x.moveTo(256 + 12, 128); x.lineTo(256 + cl, 128);
    x.moveTo(256, 128 - cl); x.lineTo(256, 128 - 12);
    x.moveTo(256, 128 + 12); x.lineTo(256, 128 + cl);
    x.stroke();

    // Painel de Tradução/GPS
    x.fillStyle = 'rgba(15,23,42,0.8)';
    x.strokeStyle = 'rgba(0,242,254,0.5)';
    x.lineWidth = 1.5;
    x.beginPath(); x.roundRect(30, 165, 452, 55, 6); x.fill(); x.stroke();

    // Cantos iluminados do painel
    x.fillStyle = '#00f2fe';
    x.fillRect(32, 167, 8, 2);
    x.fillRect(32, 167, 2, 8);
    x.fillRect(472, 167, 8, 2);
    x.fillRect(480, 167, 2, 8);

    x.fillStyle = '#38bdf8';
    x.font = 'bold 13px -apple-system, sans-serif';
    x.textAlign = 'left';
    x.fillText('NAV ➔ RUA DA INOVAÇÃO, 200m', 48, 188);
    x.fillStyle = '#e2e8f0';
    x.font = '12px -apple-system, sans-serif';
    x.fillText('EN ➔ PT: "Turn right at the tech hub"', 48, 208);

    // Indicador de sinal pulsante
    const a = 0.4 + Math.sin(t * 5) * 0.6;
    x.fillStyle = `rgba(34,197,94,${a})`;
    x.beginPath(); x.arc(462, 192, 5, 0, Math.PI * 2); x.fill();

    // Barras de Sinal Wi-Fi
    x.strokeStyle = `rgba(34,197,94,${0.5 + a * 0.5})`;
    x.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      x.beginPath();
      x.arc(462, 192, 10 + i * 5, -Math.PI * 0.75, -Math.PI * 0.25);
      x.stroke();
    }
  }

  draw(0);
  const tex = new THREE.CanvasTexture(c);
  return { texture: tex, canvas: c, draw };
}

// Tela OLED do PulseTouch Pro com EKG e Dados Biométricos
function createSmartwatchScreenCanvas() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const x = c.getContext('2d');

  function draw(t = 0) {
    x.fillStyle = '#020617';
    x.fillRect(0, 0, 512, 512);

    // Status Bar
    x.fillStyle = '#94a3b8';
    x.font = 'bold 22px -apple-system, sans-serif';
    x.fillText('10:45', 32, 44);
    x.font = '14px -apple-system, sans-serif';
    x.fillText('SEX', 110, 44);

    // Ícones de Status
    x.strokeStyle = '#38bdf8'; x.lineWidth = 2;
    x.strokeRect(420, 26, 52, 24);
    x.fillStyle = '#22c55e';
    x.fillRect(424, 30, 40, 16);
    x.fillRect(474, 33, 4, 10);

    // Bluetooth e NFC badges
    x.fillStyle = '#38bdf8';
    x.font = 'bold 12px sans-serif';
    x.fillText('BT', 370, 44);
    x.fillText('NFC', 398, 44);

    // Separador
    x.strokeStyle = 'rgba(56,189,248,0.2)';
    x.lineWidth = 1;
    x.beginPath(); x.moveTo(30, 60); x.lineTo(482, 60); x.stroke();

    // Cardiograma / EKG Realístico
    x.strokeStyle = 'rgba(56,189,248,0.12)';
    for (let y = 100; y <= 280; y += 45) {
      x.beginPath(); x.moveTo(30, y); x.lineTo(482, y); x.stroke();
    }

    x.beginPath();
    x.strokeStyle = '#f97316';
    x.lineWidth = 4;
    x.shadowColor = '#f97316';
    x.shadowBlur = 12;

    const cy = 190;
    for (let px = 30; px < 482; px += 2) {
      const phase = ((px - 30) / 452) * Math.PI * 6 + t * 8;
      const mod = Math.sin(phase * 0.15);
      // QRS complex spike pattern
      let val = Math.sin(phase) * 15 * mod;
      const qrs = phase % (Math.PI * 2);
      if (qrs > 2.8 && qrs < 3.0) val = -65;
      else if (qrs > 3.0 && qrs < 3.15) val = 80;
      else if (qrs > 3.15 && qrs < 3.35) val = -30;

      const y = cy + val;
      if (px === 30) x.moveTo(px, y);
      else x.lineTo(px, y);
    }
    x.stroke();
    x.shadowBlur = 0;

    // HR Reading
    x.fillStyle = '#f8fafc';
    x.font = 'bold 48px -apple-system, sans-serif';
    const bpm = 72 + Math.round(Math.sin(t * 2) * 3);
    x.fillText(`${bpm}`, 32, 350);
    x.fillStyle = '#f97316';
    x.font = 'bold 18px -apple-system, sans-serif';
    x.fillText('BPM', 140, 350);

    // Ícone de coração pulsante
    const hScale = 1 + Math.sin(t * 6) * 0.15;
    x.fillStyle = '#ef4444';
    x.font = `${Math.round(22 * hScale)}px sans-serif`;
    x.fillText('♥', 150, 330);

    // Dados Hápticos
    x.fillStyle = '#94a3b8';
    x.font = '16px monospace';
    x.fillText('HAPTIC  4.8G  240Hz  1.8ms', 32, 395);

    // SpO2 e Temperatura
    x.fillStyle = '#38bdf8';
    x.font = 'bold 16px -apple-system, sans-serif';
    x.fillText('SpO2: 99%', 32, 430);
    x.fillText('TEMP: 36.5°C', 32, 455);

    // Indicador de status
    x.fillStyle = `rgba(34,197,94,${0.5 + Math.sin(t * 6) * 0.5})`;
    x.beginPath(); x.arc(460, 340, 8, 0, Math.PI * 2); x.fill();

    // Progress ring para calorias
    x.strokeStyle = 'rgba(249,115,22,0.2)';
    x.lineWidth = 8;
    x.beginPath(); x.arc(430, 430, 36, 0, Math.PI * 2); x.stroke();
    x.strokeStyle = '#f97316';
    x.lineCap = 'round';
    x.beginPath(); x.arc(430, 430, 36, -Math.PI / 2, Math.PI * 1.2); x.stroke();
    x.fillStyle = '#f8fafc';
    x.font = 'bold 14px -apple-system, sans-serif';
    x.textAlign = 'center';
    x.fillText('CAL', 430, 428);
    x.fillText('486', 430, 446);
    x.textAlign = 'left';
  }

  draw(0);
  const tex = new THREE.CanvasTexture(c);
  return { texture: tex, canvas: c, draw };
}

// Micro-grelha Acústica Ultra-Definição
function createMicroGrilleTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#1a2744';
  x.fillRect(0, 0, 256, 256);
  x.fillStyle = '#060a12';
  for (let y = 2; y < 256; y += 5) {
    for (let cx = 2; cx < 256; cx += 5) {
      x.beginPath();
      x.arc(cx + (y % 10 === 2 ? 2.5 : 0), y, 1.6, 0, Math.PI * 2);
      x.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 4);
  return tex;
}

// OLED da Garrafa HydroSmart
function createBottleOLEDTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#020617';
  x.fillRect(0, 0, 256, 256);

  // Ring gauge
  x.strokeStyle = 'rgba(56,189,248,0.15)';
  x.lineWidth = 12;
  x.beginPath(); x.arc(128, 128, 100, 0, Math.PI * 2); x.stroke();
  x.strokeStyle = '#00f2fe';
  x.lineWidth = 12;
  x.lineCap = 'round';
  x.beginPath(); x.arc(128, 128, 100, -Math.PI / 2, Math.PI * 0.92); x.stroke();

  // Tick marks
  x.strokeStyle = 'rgba(56,189,248,0.3)';
  x.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    x.beginPath();
    x.moveTo(128 + Math.cos(a) * 88, 128 + Math.sin(a) * 88);
    x.lineTo(128 + Math.cos(a) * 94, 128 + Math.sin(a) * 94);
    x.stroke();
  }

  x.fillStyle = '#f8fafc';
  x.font = 'bold 40px -apple-system, sans-serif';
  x.textAlign = 'center';
  x.fillText('21°C', 128, 118);
  x.fillStyle = '#38bdf8';
  x.font = 'bold 17px -apple-system, sans-serif';
  x.fillText('99.9% PURA', 128, 152);
  x.fillStyle = '#a855f7';
  x.font = 'bold 13px -apple-system, sans-serif';
  x.fillText('UV-C ESTERILIZADO', 128, 178);

  // Ícone gota de água
  x.fillStyle = '#38bdf8';
  x.font = '16px sans-serif';
  x.fillText('💧 1.8L / 2.5L', 128, 205);

  return new THREE.CanvasTexture(c);
}

// Textura de Logo "GT" Gravada
function createLogoEngravingTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 64;
  const x = c.getContext('2d');
  x.fillStyle = 'rgba(0,0,0,0)';
  x.fillRect(0, 0, 128, 64);
  x.fillStyle = 'rgba(56,189,248,0.5)';
  x.font = 'bold 28px -apple-system, sans-serif';
  x.textAlign = 'center';
  x.fillText('GT', 64, 40);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// ═══════════════════════════════════════════════════════════════════
// 2. STUDIO ENVIRONMENT MAP & MATERIAIS PBR AVANÇADOS
// ═══════════════════════════════════════════════════════════════════

function getOrCreateStudioEnvironment(renderer) {
  if (Gadget3DManager.sharedEnvMap) return Gadget3DManager.sharedEnvMap;

  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const x = c.getContext('2d');

  // Background escuro de estúdio
  const bg = x.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#0e1525');
  bg.addColorStop(0.5, '#080c16');
  bg.addColorStop(1, '#030712');
  x.fillStyle = bg;
  x.fillRect(0, 0, 1024, 512);

  // Softbox principal superior (grande, difusa, branca)
  const s1 = x.createRadialGradient(512, 60, 10, 512, 60, 200);
  s1.addColorStop(0, 'rgba(255,255,255,0.98)');
  s1.addColorStop(0.4, 'rgba(240,249,255,0.6)');
  s1.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = s1;
  x.fillRect(200, 0, 624, 180);

  // Key light lateral ciano (esquerda)
  const s2 = x.createRadialGradient(100, 200, 5, 100, 200, 130);
  s2.addColorStop(0, 'rgba(56,189,248,0.95)');
  s2.addColorStop(0.6, 'rgba(14,165,233,0.4)');
  s2.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = s2;
  x.fillRect(0, 70, 250, 260);

  // Rim light violeta (direita)
  const s3 = x.createRadialGradient(920, 200, 5, 920, 200, 130);
  s3.addColorStop(0, 'rgba(192,132,252,0.9)');
  s3.addColorStop(0.6, 'rgba(168,85,247,0.35)');
  s3.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = s3;
  x.fillRect(774, 70, 250, 260);

  // Fill light inferior (quente)
  const s4 = x.createRadialGradient(512, 460, 10, 512, 460, 160);
  s4.addColorStop(0, 'rgba(251,191,36,0.25)');
  s4.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = s4;
  x.fillRect(300, 340, 424, 172);

  // Reflexo de horizonte
  x.fillStyle = 'rgba(255,255,255,0.12)';
  x.fillRect(0, 255, 1024, 3);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const ct = new THREE.CanvasTexture(c);
  ct.mapping = THREE.EquirectangularReflectionMapping;
  const envMap = pmrem.fromEquirectangular(ct).texture;
  Gadget3DManager.sharedEnvMap = envMap;
  pmrem.dispose();
  return envMap;
}

function createPBRMaterials() {
  const brushedNorm = createBrushedMetalNormal();

  return {
    // Titânio Escovado Espacial (Chassis)
    titaniumDark: new THREE.MeshPhysicalMaterial({
      color: 0x1c2535,
      metalness: 0.94,
      roughness: 0.22,
      clearcoat: 0.3,
      clearcoatRoughness: 0.15,
      normalMap: brushedNorm,
      normalScale: new THREE.Vector2(0.15, 0.15)
    }),
    // Titânio Polido Espelhado (Biseis e Anéis)
    titaniumPolished: new THREE.MeshPhysicalMaterial({
      color: 0xd4d8de,
      metalness: 0.99,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1
    }),
    // Cromo Espelhado Puro
    chrome: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      reflectivity: 1
    }),
    // Ouro 24k Polido
    gold: new THREE.MeshPhysicalMaterial({
      color: 0xf5a623,
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 0.8,
      clearcoatRoughness: 0.05
    }),
    // Alumínio Anodizado Espacial
    aluminum: new THREE.MeshPhysicalMaterial({
      color: 0x0e1629,
      metalness: 0.9,
      roughness: 0.32,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1
    }),
    // Vidro de Safira Fotorrealista
    sapphire: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.05,
      roughness: 0.03,
      transparent: true,
      opacity: 0.72,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.95,
      depthWrite: true
    }),
    // Lentes AR Fumê com Revestimento Anti-Reflexo e Refração
    arLens: new THREE.MeshPhysicalMaterial({
      color: 0x061826,
      metalness: 0.12,
      roughness: 0.04,
      transparent: true,
      opacity: 0.84,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.98,
      depthWrite: true
    }),
    // Vidro Transparente Puro
    glassClear: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.02,
      transmission: 0.95,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      ior: 1.52
    }),
    // Silicone Médico Translúcido
    silicone: new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      transmission: 0.75,
      transparent: true,
      opacity: 0.7,
      ior: 1.4
    }),
    // Fluorelastômero Fosco (Pulseiras)
    rubber: new THREE.MeshPhysicalMaterial({
      color: 0x0d1117,
      metalness: 0.05,
      roughness: 0.72,
      clearcoat: 0.05
    }),
    // Cerâmica Zircônia (Traseira Smartwatch)
    ceramic: new THREE.MeshPhysicalMaterial({
      color: 0x0a0f1a,
      metalness: 0.3,
      roughness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.04
    }),
    // OLED Profundo (Telas desligadas)
    oledBlack: new THREE.MeshPhysicalMaterial({
      color: 0x010309,
      metalness: 0.7,
      roughness: 0.06,
      clearcoat: 0.8,
      clearcoatRoughness: 0.03
    }),
    // Emissores Luminosos
    neonCyan: new THREE.MeshStandardMaterial({
      color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 2.4, roughness: 0.1
    }),
    neonOrange: new THREE.MeshStandardMaterial({
      color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 2.4, roughness: 0.1
    }),
    neonPurple: new THREE.MeshStandardMaterial({
      color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 2.0, roughness: 0.1
    }),
    neonGreen: new THREE.MeshStandardMaterial({
      color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 2.0
    }),
    neonRed: new THREE.MeshStandardMaterial({
      color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 1.8
    }),
    // Gap/Junção Escura (Linhas de Painel)
    panelGap: new THREE.MeshBasicMaterial({ color: 0x000000 })
  };
}

function addContactShadow(grp, y = -1.8, r = 2.4, op = 0.5) {
  const g = new THREE.PlaneGeometry(r * 2, r * 2);
  const m = new THREE.MeshBasicMaterial({
    map: createRadialShadowTexture(),
    transparent: true, opacity: op, depthWrite: false
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  grp.add(mesh);
}

// Micro-parafuso Torx com Ranhura em Estrela
function makeScrew(mat) {
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.025, 16), mat);
  g.add(head);
  // Ranhura em +
  const sl = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.01, 0.01), sl);
  s1.position.y = 0.013;
  g.add(s1);
  const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.055), sl);
  s2.position.y = 0.013;
  g.add(s2);
  return g;
}

// Linha de Painel / Junta entre Componentes
function makePanelLine(w, h, d) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: 0x020408 }));
}

// ═══════════════════════════════════════════════════════════════════
// 3. MODELOS 3D DE ULTRA-PRECISÃO INDUSTRIAL
// ═══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// GADGET 1: VisionAR Glass
// ─────────────────────────────────────────────────────────────────
function buildVisionARModel() {
  const G = new THREE.Group();
  const M = createPBRMaterials();
  const hud = createHUDCanvas();

  // === Armação Frontal com Perfil Aerodinâmico ===
  const browShape = new THREE.Shape();
  browShape.moveTo(-3.1, 0.58);
  browShape.bezierCurveTo(-1.5, 1.0, 1.5, 1.0, 3.1, 0.58);
  browShape.lineTo(3.0, 0.12);
  browShape.bezierCurveTo(1.5, 0.58, -1.5, 0.58, -3.0, 0.12);
  browShape.closePath();
  const browGeo = new THREE.ExtrudeGeometry(browShape, {
    depth: 0.38, bevelEnabled: true, bevelSegments: 4,
    steps: 3, bevelSize: 0.06, bevelThickness: 0.06
  });
  G.add(new THREE.Mesh(browGeo, M.titaniumDark));

  // Friso Cromado Inferior da Armação
  const trimShape = new THREE.Shape();
  trimShape.moveTo(-2.9, 0.12);
  trimShape.bezierCurveTo(-1.4, 0.56, 1.4, 0.56, 2.9, 0.12);
  trimShape.lineTo(2.85, 0.08);
  trimShape.bezierCurveTo(1.3, 0.52, -1.3, 0.52, -2.85, 0.08);
  trimShape.closePath();
  const trimGeo = new THREE.ExtrudeGeometry(trimShape, {
    depth: 0.4, bevelEnabled: true, bevelSegments: 2,
    bevelSize: 0.02, bevelThickness: 0.02
  });
  G.add(new THREE.Mesh(trimGeo, M.chrome));

  // === Ponte Central com Sensor Array ===
  const bridgeGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.5, 20);
  bridgeGeo.rotateZ(Math.PI / 2);
  const bridge = new THREE.Mesh(bridgeGeo, M.titaniumPolished);
  bridge.position.set(0, 0.45, 0.2);
  G.add(bridge);

  // LiDAR Dome
  const lidarGeo = new THREE.SphereGeometry(0.1, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
  lidarGeo.rotateX(-Math.PI / 2);
  const lidar = new THREE.Mesh(lidarGeo, M.oledBlack);
  lidar.position.set(0, 0.5, 0.36);
  G.add(lidar);
  const lidarRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.015, 12, 24), M.chrome);
  lidarRing.position.copy(lidar.position);
  lidarRing.rotation.x = Math.PI / 2;
  G.add(lidarRing);

  // === Câmeras Estereoscópicas Frontais ===
  for (const s of [-1, 1]) {
    const camRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 12, 20), M.chrome);
    camRing.position.set(s * 2.6, 0.4, 0.42);
    camRing.rotation.x = Math.PI / 2;
    G.add(camRing);

    const camLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45),
      M.oledBlack
    );
    camLens.position.set(s * 2.6, 0.4, 0.44);
    camLens.rotation.x = -Math.PI / 2;
    G.add(camLens);

    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.04, 10), M.panelGap);
    mic.rotation.x = Math.PI / 2;
    mic.position.set(s * 0.45, 0.6, 0.38);
    G.add(mic);
  }

  // === Lentes de Precisão Óptica e Aros de Titânio ===
  function makeLensContour(w, h) {
    const s = new THREE.Shape();
    s.moveTo(-w + 0.25, h);
    s.lineTo(w - 0.25, h);
    s.quadraticCurveTo(w, h, w, h - 0.22);
    s.lineTo(w - 0.1, -h + 0.32);
    s.quadraticCurveTo(w - 0.16, -h, w - 0.45, -h);
    s.lineTo(-w + 0.45, -h);
    s.quadraticCurveTo(-w + 0.12, -h, -w, -h + 0.32);
    s.lineTo(-w, h - 0.22);
    s.quadraticCurveTo(-w, h, -w + 0.25, h);
    return s;
  }

  function makeRimContour(w, h, th) {
    const s = new THREE.Shape();
    const wo = w + th, ho = h + th;
    s.moveTo(-wo + 0.25, ho);
    s.lineTo(wo - 0.25, ho);
    s.quadraticCurveTo(wo, ho, wo, ho - 0.22);
    s.lineTo(wo - 0.1, -ho + 0.32);
    s.quadraticCurveTo(wo - 0.16, -ho, wo - 0.45, -ho);
    s.lineTo(-wo + 0.45, -ho);
    s.quadraticCurveTo(-wo + 0.12, -ho, -wo, -ho + 0.32);
    s.lineTo(-wo, ho - 0.22);
    s.quadraticCurveTo(-wo, ho, -wo + 0.25, ho);

    const hole = new THREE.Path();
    hole.moveTo(-w + 0.25, h);
    hole.lineTo(w - 0.25, h);
    hole.quadraticCurveTo(w, h, w, h - 0.22);
    hole.lineTo(w - 0.1, -h + 0.32);
    hole.quadraticCurveTo(w - 0.16, -h, w - 0.45, -h);
    hole.lineTo(-w + 0.45, -h);
    hole.quadraticCurveTo(-w + 0.12, -h, -w, -h + 0.32);
    hole.lineTo(-w, h - 0.22);
    hole.quadraticCurveTo(-w, h, -w + 0.25, h);

    s.holes.push(hole);
    return s;
  }

  const lensGeo = new THREE.ExtrudeGeometry(makeLensContour(1.05, 0.65), {
    depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3
  });
  const rimGeo = new THREE.ExtrudeGeometry(makeRimContour(1.05, 0.65, 0.055), {
    depth: 0.09, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2
  });

  for (const s of [-1, 1]) {
    // Aro usinado CNC em titânio
    const rim = new THREE.Mesh(rimGeo, M.titaniumDark);
    rim.position.set(s * 1.5, -0.32, 0.14);
    rim.rotation.y = -s * 0.06;
    G.add(rim);

    // Lente translúcida com PBR de alta definição
    const lens = new THREE.Mesh(lensGeo, M.arLens);
    lens.position.set(s * 1.5, -0.32, 0.155);
    lens.rotation.y = -s * 0.06;
    G.add(lens);

    // Micro-prisma óptico projetor no canto superior externo
    const prismGeo = new THREE.BoxGeometry(0.12, 0.1, 0.14);
    const prism = new THREE.Mesh(prismGeo, M.chrome);
    prism.position.set(s * 2.45, 0.22, 0.22);
    G.add(prism);
    const prismEmitter = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.02), M.neonCyan);
    prismEmitter.position.set(s * 2.4, 0.22, 0.28);
    G.add(prismEmitter);
  }

  // HUD Holográfico no interior da lente direita
  const hudPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.1),
    new THREE.MeshBasicMaterial({
      map: hud.texture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  hudPlane.position.set(1.5, -0.32, 0.22);
  hudPlane.rotation.y = -0.06;
  G.add(hudPlane);

  // === Nosepads em Silicone com Braços Articulados ===
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.35, 10), M.titaniumPolished);
    arm.position.set(s * 0.36, -0.02, 0.08);
    arm.rotation.z = s * 0.35;
    G.add(arm);

    const padShape = new THREE.Shape();
    padShape.moveTo(-0.07, -0.12);
    padShape.quadraticCurveTo(-0.09, 0, -0.05, 0.12);
    padShape.quadraticCurveTo(0, 0.14, 0.05, 0.12);
    padShape.quadraticCurveTo(0.09, 0, 0.07, -0.12);
    padShape.closePath();
    const padGeo = new THREE.ExtrudeGeometry(padShape, {
      depth: 0.05, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018, bevelSegments: 3
    });
    const pad = new THREE.Mesh(padGeo, M.silicone);
    pad.position.set(s * 0.46, -0.15, 0.05);
    pad.rotation.y = s * 0.3;
    G.add(pad);
  }

  // === Hastes com Dobradiças, Parafusos e Alto-falantes ===
  for (const s of [-1, 1]) {
    // Dobradiça
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 18), M.titaniumPolished);
    hinge.position.set(s * 2.92, 0.3, 0.0);
    G.add(hinge);

    // Micro-parafusos Torx na dobradiça
    for (const py of [0.4, 0.2]) {
      const scr = makeScrew(M.chrome);
      scr.position.set(s * 2.92, py, 0.0);
      G.add(scr);
    }

    // Haste principal
    const templeGeo = new THREE.CylinderGeometry(0.09, 0.13, 3.6, 20);
    templeGeo.rotateX(Math.PI / 2);
    const temple = new THREE.Mesh(templeGeo, M.aluminum);
    temple.position.set(s * 2.85, 0.3, -1.8);
    temple.rotation.y = -s * 0.06;
    G.add(temple);

    // Linha de antena
    const antennaLine = makePanelLine(0.008, 0.008, 1.5);
    antennaLine.position.set(s * 2.85, 0.4, -1.5);
    G.add(antennaLine);

    // Módulo de áudio por condução óssea
    const spkGeo = new THREE.BoxGeometry(0.18, 0.22, 0.65);
    const spk = new THREE.Mesh(spkGeo, M.titaniumDark);
    spk.position.set(s * 2.82, 0.3, -1.2);
    G.add(spk);
    const spkGrille = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.45),
      new THREE.MeshStandardMaterial({
        map: createMicroGrilleTexture(), metalness: 0.8, roughness: 0.3
      })
    );
    spkGrille.position.set(s * (2.82 + s * 0.1), 0.3, -1.2);
    spkGrille.rotation.y = s * Math.PI / 2;
    G.add(spkGrille);

    // Ponteira em borracha ergonômica
    const tipGeo = new THREE.CylinderGeometry(0.065, 0.09, 1.1, 16);
    tipGeo.rotateX(Math.PI / 2.3);
    G.add(new THREE.Mesh(tipGeo, M.rubber).translateX(s * 2.76).translateY(0.18).translateZ(-3.85));

    // LED de status
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), M.neonGreen);
    led.position.set(s * 2.85, 0.42, -0.4);
    G.add(led);
  }

  // Porta USB-C na ponta da haste direita
  const usbSlot = makePanelLine(0.2, 0.07, 0.05);
  usbSlot.position.set(2.74, 0.18, -3.3);
  G.add(usbSlot);

  addContactShadow(G, -1.35, 3.4, 0.45);

  return {
    group: G,
    cameraPos: [0, 0.15, 5.2],
    update(t, fx) {
      G.position.y = Math.sin(t * 1.8) * 0.04;
      if (fx) { hudPlane.visible = true; hud.draw(t); hud.texture.needsUpdate = true; }
      else { hudPlane.visible = false; }
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// GADGET 2: PulseTouch Pro
// ─────────────────────────────────────────────────────────────────
function buildPulseTouchModel() {
  const G = new THREE.Group();
  const M = createPBRMaterials();
  const screen = createSmartwatchScreenCanvas();

  // === Pulseira Esportiva de Precisão Ergonômica (Fluroelastômero) ===
  function createStrapHalf(isTop) {
    const dir = isTop ? 1 : -1;
    const shape = new THREE.Shape();
    const w = 0.8;
    const t = 0.075;
    shape.moveTo(-w + 0.05, -t);
    shape.lineTo(w - 0.05, -t);
    shape.quadraticCurveTo(w, -t, w, 0);
    shape.quadraticCurveTo(w, t, w - 0.05, t);
    shape.lineTo(-w + 0.05, t);
    shape.quadraticCurveTo(-w, t, -w, 0);
    shape.quadraticCurveTo(-w, -t, -w + 0.05, -t);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, dir * 1.25, 0.0),
      new THREE.Vector3(0, dir * 1.65, -0.35),
      new THREE.Vector3(0, dir * 1.55, -1.05),
      new THREE.Vector3(0, dir * 0.95, -1.55),
      new THREE.Vector3(0, dir * 0.25, -1.65)
    ]);

    return new THREE.ExtrudeGeometry(shape, { extrudePath: curve, steps: 36 });
  }

  // Metades superior e inferior da pulseira anatômica
  const topStrap = new THREE.Mesh(createStrapHalf(true), M.rubber);
  const botStrap = new THREE.Mesh(createStrapHalf(false), M.rubber);
  G.add(topStrap);
  G.add(botStrap);

  // Adaptadores de Lug em Titânio (conexão mecânica com a caixa)
  for (const sy of [-1, 1]) {
    const lugAdapter = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.18, 0.32), M.titaniumDark);
    lugAdapter.position.set(0, sy * 1.25, 0);
    G.add(lugAdapter);

    const lugTrim = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 0.34), M.titaniumPolished);
    lugTrim.position.set(0, sy * 1.25, 0);
    G.add(lugTrim);

    // Botões de liberação rápida da pulseira
    for (const sx of [-0.5, 0.5]) {
      const releaseBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), M.titaniumPolished);
      releaseBtn.rotation.x = Math.PI / 2;
      releaseBtn.position.set(sx, sy * 1.25, -0.16);
      G.add(releaseBtn);
    }
  }

  // Costelas ergonômicas transversais na pulseira superior
  for (let i = 0; i < 5; i++) {
    const a = 0.25 + i * 0.16;
    const py = 1.35 + Math.sin(a * 1.8) * 0.35;
    const pz = -0.15 - i * 0.28;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.025), M.titaniumDark);
    rib.position.set(0, py, pz);
    G.add(rib);
  }

  // Furos de ajuste na pulseira inferior
  for (let i = 0; i < 6; i++) {
    const py = -1.35 - Math.sin((0.2 + i * 0.14) * 1.8) * 0.32;
    const pz = -0.2 - i * 0.24;
    const pinHole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.03), M.panelGap);
    pinHole.position.set(0, py, pz);
    G.add(pinHole);
  }

  // Passadores da pulseira (Keepers)
  for (const pz of [-1.45, -1.58]) {
    const keeper = new THREE.Mesh(
      new THREE.BoxGeometry(1.72, 0.12, 0.26),
      M.rubber
    );
    keeper.position.set(0, -0.5, pz);
    G.add(keeper);
  }

  // Fecho Borboleta em Titânio Polido (Clasp)
  const claspGeo = new THREE.BoxGeometry(1.64, 0.45, 0.16);
  const clasp = new THREE.Mesh(claspGeo, M.titaniumPolished);
  clasp.position.set(0, 0, -1.65);
  G.add(clasp);

  // Botões laterais de liberação do fecho
  for (const sx of [-1, 1]) {
    const claspPusher = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.1), M.chrome);
    claspPusher.position.set(sx * 0.86, 0, -1.65);
    G.add(claspPusher);
  }

  // === Caixa Unibody Central de Titânio usinado CNC ===
  const caseGeo = new THREE.BoxGeometry(2.0, 2.4, 0.62);
  const caseBody = new THREE.Mesh(caseGeo, M.titaniumDark);
  caseBody.position.set(0, 0, 0);
  G.add(caseBody);

  // Bisel de Proteção Elevado com Chanfro em Titânio Polido
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.3, 0.06), M.titaniumPolished);
  bezel.position.set(0, 0, 0.32);
  G.add(bezel);

  // 4 Micro-Parafusos Torx nos Cantos do Bisel
  for (const [cx, cy] of [[-0.85, 1.05], [0.85, 1.05], [-0.85, -1.05], [0.85, -1.05]]) {
    const s = makeScrew(M.chrome);
    s.position.set(cx, cy, 0.35);
    G.add(s);
  }

  // Juntas de Painel CNC
  for (const cy of [-1.12, 1.12]) {
    G.add(makePanelLine(1.92, 0.008, 0.6).translateY(cy).translateZ(0));
  }

  // === Tela OLED Curva e Vidro de Safira ===
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.68, 2.08),
    new THREE.MeshBasicMaterial({ map: screen.texture })
  );
  screenMesh.position.set(0, 0, 0.36);
  G.add(screenMesh);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.78, 2.18, 0.05), M.glassClear);
  glass.position.set(0, 0, 0.38);
  G.add(glass);

  // === Coroa Digital Recartilhada (Digital Crown) ===
  const crownGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 24);
  crownGeo.rotateZ(Math.PI / 2);
  const crown = new THREE.Mesh(crownGeo, M.titaniumPolished);
  crown.position.set(1.15, 0.45, 0);
  G.add(crown);

  // Ranhuras de recartilhamento (Knurling)
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const knurl = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.34), M.panelGap);
    knurl.position.set(1.15 + 0.18, 0.45 + Math.cos(a) * 0.24, Math.sin(a) * 0.24);
    G.add(knurl);
  }
  // Anel de status laranja neon da coroa
  const crownRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.032, 14, 24), M.neonOrange);
  crownRing.rotation.y = Math.PI / 2;
  crownRing.position.set(1.34, 0.45, 0);
  G.add(crownRing);

  // Botão Secundário Lateral Direito
  const secBtn = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.22), M.titaniumPolished);
  secBtn.position.set(1.06, -0.42, 0);
  G.add(secBtn);

  // Botão de Ação Laranja Internacional (Lado Esquerdo)
  const actBtn = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.26), M.neonOrange);
  actBtn.position.set(-1.06, 0.25, 0);
  G.add(actBtn);

  // === Traseira Cerâmica: Pinos Pogo de Ouro 24k e Sensores PPG ===
  const sensorDome = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 0.1, 28), M.ceramic);
  sensorDome.rotation.x = Math.PI / 2;
  sensorDome.position.set(0, 0, -0.34);
  G.add(sensorDome);

  // 4 Pinos Pogo banhados a ouro 24k para carregamento
  for (const p of [-0.24, -0.08, 0.08, 0.24]) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 12), M.gold);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(p, 0.42, -0.38);
    G.add(pin);
  }

  // 4 Diodos ópticos PPG biométricos (Cardíaco / SpO2)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 12, 12),
      i % 2 === 0 ? M.neonGreen : M.neonRed
    );
    led.position.set(Math.cos(a) * 0.28, Math.sin(a) * 0.28, -0.38);
    G.add(led);
  }

  // Grelha de microfone e alto-falante lateral
  const spkGrille = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.08),
    new THREE.MeshStandardMaterial({ map: createMicroGrilleTexture(), metalness: 0.7, roughness: 0.3 })
  );
  spkGrille.rotation.y = -Math.PI / 2;
  spkGrille.position.set(-1.01, -0.45, 0);
  G.add(spkGrille);

  addContactShadow(G, -1.85, 3.2, 0.45);

  return {
    group: G,
    cameraPos: [0, 0.3, 5.0],
    update(t, fx) {
      G.position.y = Math.sin(t * 2) * 0.035;
      if (fx) {
        caseBody.position.x = Math.sin(t * 40) * 0.008;
        screen.draw(t);
        screen.texture.needsUpdate = true;
      }
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// GADGET 3: AuraRing Control
// ─────────────────────────────────────────────────────────────────
function buildAuraRingModel() {
  const G = new THREE.Group();
  const M = createPBRMaterials();

  // === Corpo do Anel com Perfil Toroidal Perfeito ===
  const ringGeo = new THREE.TorusGeometry(1.65, 0.4, 40, 120);
  G.add(new THREE.Mesh(ringGeo, M.titaniumPolished));

  // Ranhuras Duplas de Precisão Cromadas
  for (const dz of [-0.24, 0.24]) {
    const groove = new THREE.Mesh(
      new THREE.TorusGeometry(1.67, 0.018, 14, 120),
      M.chrome
    );
    groove.position.z = dz;
    G.add(groove);
  }

  // Sulco Equatorial Escuro
  const midGroove = new THREE.Mesh(
    new THREE.TorusGeometry(1.68, 0.012, 12, 120),
    M.panelGap
  );
  G.add(midGroove);

  // === Faceta Plana Horizon com Sensor Touch e Micro-LED ===
  const padGeo = new THREE.BoxGeometry(0.95, 0.16, 0.5);
  const pad = new THREE.Mesh(padGeo, M.titaniumDark);
  pad.position.set(0, 1.97, 0);
  G.add(pad);

  // Sensor touch capacitivo embutido
  const touchSensor = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.04, 0.3),
    M.oledBlack
  );
  touchSensor.position.set(0, 2.06, 0);
  G.add(touchSensor);

  // Micro-LED de notificação 0.3mm
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), M.neonCyan);
  led.position.set(0, 2.08, 0);
  G.add(led);

  // === Faixa Perimetral Luminescente ===
  const inlay = new THREE.Mesh(
    new THREE.TorusGeometry(1.72, 0.045, 18, 120),
    M.neonPurple
  );
  G.add(inlay);

  // === Interior: Resina Biocompatível com Eletrodos e Sensores ===
  const innerResin = new THREE.Mesh(
    new THREE.TorusGeometry(1.48, 0.18, 28, 90),
    M.silicone
  );
  G.add(innerResin);

  // 2 Eletrodos de Carga em Ouro 24k
  for (const dz of [-0.2, 0.2]) {
    const elec = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.06, 0.12),
      M.gold
    );
    elec.position.set(0, -1.38, dz);
    G.add(elec);
  }

  // 3 Nódulos Sensores Ópticos com Dome Lens
  const sColors = [M.neonGreen, M.neonPurple, M.neonCyan];
  for (let i = 0; i < 3; i++) {
    const diode = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), sColors[i]);
    diode.position.set((i - 1) * 0.55, -1.38, 0);
    G.add(diode);

    // Dome lens sobre o diodo
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.4),
      M.glassClear
    );
    dome.position.set((i - 1) * 0.55, -1.38, 0);
    dome.rotation.x = Math.PI;
    G.add(dome);
  }

  // === Ondas Espaciais de Controle Gestual ===
  const waves = [];
  for (let i = 0; i < 3; i++) {
    const wGeo = new THREE.TorusGeometry(2.2 + i * 0.5, 0.018, 14, 90);
    const wMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x00f2fe : 0xc084fc,
      transparent: true, opacity: 0.35 - i * 0.08
    });
    const w = new THREE.Mesh(wGeo, wMat);
    w.rotation.x = Math.PI / 3;
    G.add(w);
    waves.push(w);
  }

  addContactShadow(G, -1.7, 2.6, 0.35);

  return {
    group: G,
    cameraPos: [0, 0.3, 5.2],
    update(t, fx) {
      G.rotation.x = t * 0.5;
      G.rotation.y = t * 0.7;

      // Micro-LED pulsante
      led.scale.setScalar(0.8 + Math.sin(t * 4) * 0.4);

      if (fx) {
        waves.forEach((w, i) => {
          w.visible = true;
          w.rotation.z += 0.014 * (i + 1);
          const s = 1 + Math.sin(t * 3 + i) * 0.12;
          w.scale.set(s, s, s);
        });
      } else {
        waves.forEach(w => w.visible = false);
      }
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// GADGET 4: HoloDesk AI
// ─────────────────────────────────────────────────────────────────
function buildHoloDeskModel() {
  const G = new THREE.Group();
  const M = createPBRMaterials();
  const grilleTex = createMicroGrilleTexture();

  // === Base Cilíndrica Maciça ===
  const baseGeo = new THREE.CylinderGeometry(1.95, 2.3, 1.45, 52);
  const base = new THREE.Mesh(baseGeo, M.aluminum);
  base.position.y = -1.1;
  G.add(base);

  // Pé de Borracha Antiderrapante
  const footGeo = new THREE.TorusGeometry(2.15, 0.06, 14, 52);
  footGeo.rotateX(Math.PI / 2);
  G.add(new THREE.Mesh(footGeo, M.rubber).translateY(-1.83));

  // Grelha Acústica Ultra-HD
  const grilleGeo = new THREE.CylinderGeometry(1.97, 2.32, 0.7, 52, 1, true);
  const grilleMat = new THREE.MeshStandardMaterial({
    map: grilleTex, metalness: 0.82, roughness: 0.28
  });
  G.add(new THREE.Mesh(grilleGeo, grilleMat).translateY(-1.1));

  // Bisel Superior Cromado Espelhado
  const topPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.93, 1.95, 0.1, 52),
    M.chrome
  );
  topPlate.position.y = -0.36;
  G.add(topPlate);

  // === Anel Touch Capacitivo com LEDs de Controle ===
  const touchRing = new THREE.Mesh(
    new THREE.RingGeometry(1.35, 1.88, 48),
    M.oledBlack
  );
  touchRing.rotation.x = -Math.PI / 2;
  touchRing.position.y = -0.3;
  G.add(touchRing);

  // 4 LEDs de Controle (+, -, Mute, Power)
  const ctrlAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  ctrlAngles.forEach((a, i) => {
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.04, 12),
      i === 3 ? M.neonRed : M.neonCyan
    );
    dot.rotation.x = -Math.PI / 2;
    dot.position.set(Math.cos(a) * 1.62, -0.29, Math.sin(a) * 1.62);
    G.add(dot);
  });

  // Lente Óptica Convexa de Projeção
  const projLens = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.25),
    M.sapphire
  );
  projLens.rotation.x = Math.PI;
  projLens.position.y = -0.28;
  G.add(projLens);

  // Anel Emissor
  const emRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.05, 14, 52),
    M.neonCyan
  );
  emRing.rotation.x = Math.PI / 2;
  emRing.position.y = -0.32;
  G.add(emRing);

  // Porta USB-C na Base
  const usbPort = makePanelLine(0.24, 0.1, 0.06);
  usbPort.position.set(0, -1.4, 2.28);
  G.add(usbPort);

  // === Cone de Luz Volumétrica ===
  const coneGeo = new THREE.ConeGeometry(2.6, 3.4, 52, 1, true);
  coneGeo.rotateX(Math.PI);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe, transparent: true, opacity: 0.18,
    side: THREE.DoubleSide, depthWrite: false
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = 1.2;
  G.add(cone);

  // === Projeção Holográfica 3D ===
  const holo = new THREE.Group();
  holo.position.y = 1.65;

  // Esfera de Energia Central
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.4, 28, 28), M.neonCyan);
  holo.add(core);

  // Icosaedro Wireframe
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
  const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 0), icoMat);
  holo.add(ico);

  // Octaedro Interno
  const octMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true });
  const oct = new THREE.Mesh(new THREE.OctahedronGeometry(0.68, 0), octMat);
  holo.add(oct);

  // Dodecaedro Exterior Sutil
  const dodMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.3
  });
  const dod = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 0), dodMat);
  holo.add(dod);

  // Anéis Orbitais com Nódulos de Dados
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.025, 14, 52), M.neonCyan);
  holo.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 14, 52), M.neonPurple);
  ring2.rotation.x = Math.PI / 2.8;
  holo.add(ring2);

  // Micro-partículas Orbitais
  const particles = [];
  for (let i = 0; i < 24; i++) {
    const pGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const pMat = i % 3 === 0 ? M.neonCyan : (i % 3 === 1 ? M.neonPurple : M.neonGreen);
    const p = new THREE.Mesh(pGeo, pMat);
    const rad = 1.0 + Math.random() * 0.7;
    const ang = Math.random() * Math.PI * 2;
    p.position.set(Math.cos(ang) * rad, (Math.random() - 0.5) * 0.9, Math.sin(ang) * rad);
    holo.add(p);
    particles.push({ mesh: p, rad, speed: 0.5 + Math.random() * 1.5, offset: ang });
  }

  G.add(holo);

  addContactShadow(G, -1.85, 3.2, 0.6);

  return {
    group: G,
    cameraPos: [0, 0.8, 6.4],
    update(t, fx) {
      if (fx) {
        holo.visible = true;
        cone.visible = true;
        ico.rotation.x = t * 0.9; ico.rotation.y = t * 1.3;
        oct.rotation.x = -t * 1.1; oct.rotation.z = t * 0.8;
        dod.rotation.y = t * 0.4; dod.rotation.x = t * 0.3;
        ring1.rotation.z = t; ring2.rotation.y = -t * 1.2;
        core.scale.setScalar(1 + Math.sin(t * 5) * 0.16);
        holo.position.y = 1.65 + Math.sin(t * 2.5) * 0.1;
        particles.forEach(p => {
          const a = p.offset + t * p.speed;
          p.mesh.position.x = Math.cos(a) * p.rad;
          p.mesh.position.z = Math.sin(a) * p.rad;
        });
      } else {
        holo.visible = false;
        cone.visible = false;
      }
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// GADGET 5: HydroSmart
// ─────────────────────────────────────────────────────────────────
function buildHydroSmartModel() {
  const G = new THREE.Group();
  const M = createPBRMaterials();
  const oledTex = createBottleOLEDTexture();

  // === Corpo em Torno de Alta Resolução ===
  const pts = [
    [0, -1.85], [0.97, -1.85], [0.99, -1.65], [0.97, -1.5],
    [0.96, 0.65], [0.93, 1.0], [0.85, 1.3], [0.73, 1.6],
    [0.73, 1.98], [0.67, 1.98]
  ].map(([x, y]) => new THREE.Vector2(x, y));
  G.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 52), M.aluminum));

  // Copo Base de Proteção em Cromo Polido
  const baseBand = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.3, 52), M.chrome);
  baseBand.position.y = -1.68;
  G.add(baseBand);

  // Anel de Identificação Gravado no Corpo
  const logoRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.97, 0.015, 10, 52),
    M.titaniumPolished
  );
  logoRing.rotation.x = Math.PI / 2;
  logoRing.position.y = 0;
  G.add(logoRing);

  // Logo "GT" Engraved
  const logoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.25),
    new THREE.MeshBasicMaterial({
      map: createLogoEngravingTexture(),
      transparent: true, depthWrite: false
    })
  );
  logoPlane.position.set(0, 0, 0.99);
  G.add(logoPlane);

  // === Tampa Inteligente com Display ===
  const capGeo = new THREE.CylinderGeometry(0.77, 0.77, 0.68, 52);
  G.add(new THREE.Mesh(capGeo, M.titaniumDark).translateY(2.28));

  // Anel de empunhadura Diamond-Knurled
  const gripGeo = new THREE.CylinderGeometry(0.79, 0.79, 0.34, 52);
  G.add(new THREE.Mesh(gripGeo, M.rubber).translateY(2.28));

  // Friso cromado chanfrado na tampa
  for (const dy of [1.96, 2.62]) {
    const capTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.77, 0.025, 12, 52),
      M.chrome
    );
    capTrim.rotation.x = Math.PI / 2;
    capTrim.position.y = dy;
    G.add(capTrim);
  }

  // Display OLED Circular
  const oled = new THREE.Mesh(new THREE.CircleGeometry(0.64, 44), new THREE.MeshBasicMaterial({ map: oledTex }));
  oled.rotation.x = -Math.PI / 2;
  oled.position.y = 2.63;
  G.add(oled);

  // Vidro Protetor do Display
  const oledGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.66, 0.66, 0.04, 44),
    M.glassClear
  );
  oledGlass.position.y = 2.64;
  G.add(oledGlass);

  // === Anel LED UV-C ===
  const uvcRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.045, 14, 52),
    M.neonPurple
  );
  uvcRing.rotation.x = Math.PI / 2;
  uvcRing.position.y = 1.97;
  G.add(uvcRing);

  // === Medidor de Hidratação: 12 Segmentos de LED ===
  const segs = [];
  for (let i = 0; i < 12; i++) {
    const segGeo = new THREE.BoxGeometry(0.06, 0.14, 0.05);
    const isFilled = i < 9;
    const segMat = isFilled ? M.neonCyan : M.panelGap;
    const seg = new THREE.Mesh(segGeo, segMat);
    seg.position.set(0, -1.35 + i * 0.22, 0.99);
    G.add(seg);
    segs.push(seg);
  }

  // Porta USB-C Magnética
  const usbPort = makePanelLine(0.2, 0.08, 0.06);
  usbPort.position.set(0, -1.5, 0.98);
  G.add(usbPort);

  addContactShadow(G, -1.87, 2.5, 0.5);

  return {
    group: G,
    cameraPos: [0, 0.6, 5.8],
    update(t, fx) {
      G.position.y = Math.sin(t * 1.8) * 0.04;
      if (fx) {
        uvcRing.scale.setScalar(1 + Math.sin(t * 6) * 0.06);
        segs.forEach((s, i) => {
          if (i < 9) s.scale.x = 1 + Math.sin(t * 4 + i * 0.3) * 0.15;
        });
      }
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// GADGET 6: Orbital Sound
// ─────────────────────────────────────────────────────────────────
function buildOrbitalSoundModel() {
  const G = new THREE.Group();
  const M = createPBRMaterials();
  const grilleTex = createMicroGrilleTexture();

  // === Base Magnética Maciça com Chanfro CNC ===
  const baseGeo = new THREE.CylinderGeometry(2.45, 2.75, 0.65, 60);
  G.add(new THREE.Mesh(baseGeo, M.aluminum).translateY(-1.65));

  // Chanfro de 45° Cromado
  const chamferGeo = new THREE.TorusGeometry(2.45, 0.09, 14, 60);
  chamferGeo.rotateX(Math.PI / 2);
  G.add(new THREE.Mesh(chamferGeo, M.chrome).translateY(-1.32));

  // Pés de Borracha
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 12), M.rubber);
    foot.position.set(Math.cos(a) * 2.2, -1.98, Math.sin(a) * 2.2);
    G.add(foot);
  }

  // Botões Capacitivos Flush Frontais (Play, +, -, BT)
  for (let b = -0.45; b <= 0.45; b += 0.3) {
    const btn = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), M.neonCyan);
    btn.rotation.x = -Math.PI / 3;
    btn.position.set(b, -1.38, 2.38);
    G.add(btn);
  }

  // Bobinas Concêntricas de Indução Magnética
  const outerCoil = new THREE.Mesh(
    new THREE.TorusGeometry(1.85, 0.065, 14, 60),
    M.neonCyan
  );
  outerCoil.rotation.x = Math.PI / 2;
  outerCoil.position.y = -1.3;
  G.add(outerCoil);

  const innerCoil = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.045, 14, 60),
    M.neonCyan
  );
  innerCoil.rotation.x = Math.PI / 2;
  innerCoil.position.y = -1.3;
  G.add(innerCoil);

  // Porta USB-C e Conector de Energia
  G.add(makePanelLine(0.22, 0.08, 0.06).translateY(-1.5).translateZ(2.7));

  // === Esfera Acústica Flutuante ===
  const orb = new THREE.Group();
  orb.position.y = 0.8;

  // Hemisférios Superior e Inferior com Junção Central
  const topHemiGeo = new THREE.SphereGeometry(1.38, 52, 26, 0, Math.PI * 2, 0, Math.PI * 0.46);
  orb.add(new THREE.Mesh(topHemiGeo, M.titaniumDark));

  const botHemiGeo = new THREE.SphereGeometry(1.38, 52, 26, 0, Math.PI * 2, Math.PI * 0.54, Math.PI * 0.46);
  orb.add(new THREE.Mesh(botHemiGeo, M.titaniumDark));

  // Grelha Equatorial 360° Micro-perfurada
  const bandGeo = new THREE.CylinderGeometry(1.39, 1.39, 0.42, 52, 1, true);
  orb.add(new THREE.Mesh(bandGeo, new THREE.MeshStandardMaterial({
    map: grilleTex, metalness: 0.85, roughness: 0.22
  })));

  // Anel Neon Equatorial
  const soundRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.4, 0.04, 14, 60),
    M.neonCyan
  );
  soundRing.rotation.x = Math.PI / 2;
  orb.add(soundRing);

  // Radiador Passivo de Graves Superior e Inferior
  for (const s of [1, -1]) {
    const subGeo = new THREE.CylinderGeometry(0.78, 0.88, 0.14, 44);
    const sub = new THREE.Mesh(subGeo, M.chrome);
    sub.position.y = s * 1.34;
    orb.add(sub);

    // Anel de borracha do radiador
    const rubRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.88, 0.055, 14, 44),
      M.rubber
    );
    rubRing.rotation.x = Math.PI / 2;
    rubRing.position.y = s * 1.34;
    orb.add(rubRing);

    // Calota dome do radiador
    const domeGeo = new THREE.SphereGeometry(0.65, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.3);
    if (s < 0) domeGeo.rotateX(Math.PI);
    const dome = new THREE.Mesh(domeGeo, M.titaniumPolished);
    dome.position.y = s * 1.36;
    orb.add(dome);
  }

  // Logo "GT" Gravado na Esfera
  const orbLogo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.2),
    new THREE.MeshBasicMaterial({
      map: createLogoEngravingTexture(),
      transparent: true, depthWrite: false
    })
  );
  orbLogo.position.set(0, 0.7, 1.4);
  orbLogo.rotation.x = -0.35;
  orb.add(orbLogo);

  G.add(orb);

  // === Ondas Sonoras ===
  const waves = [];
  for (let i = 0; i < 2; i++) {
    const wGeo = new THREE.SphereGeometry(1.8 + i * 0.55, 24, 24);
    const wMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, wireframe: true, transparent: true,
      opacity: 0.2 - i * 0.08
    });
    const w = new THREE.Mesh(wGeo, wMat);
    orb.add(w);
    waves.push(w);
  }

  addContactShadow(G, -2.0, 3.5, 0.55);

  const subTop = orb.children.find((c, i) => i === 4); // Referência ao radiador superior
  const subBot = orb.children.find((c, i) => i === 7); // Referência ao radiador inferior

  return {
    group: G,
    cameraPos: [0, 0.4, 6.2],
    update(t, fx) {
      orb.position.y = 0.8 + Math.sin(t * 2.6) * 0.14;
      orb.rotation.y = t * 0.6;
      if (fx) {
        waves.forEach((w, i) => {
          w.visible = true;
          const s = 1 + (Math.sin(t * 6 + i * 1.5) + 1) * 0.1;
          w.scale.set(s, s, s);
        });
        outerCoil.scale.setScalar(1 + Math.sin(t * 4) * 0.04);
      } else {
        waves.forEach(w => w.visible = false);
      }
    }
  };
}

// ═══════════════════════════════════════════════════════════════════
// 4. FACTORY & INTEGRAÇÃO
// ═══════════════════════════════════════════════════════════════════

function createGadgetModel(id) {
  switch (id) {
    case 1: return buildVisionARModel();
    case 2: return buildPulseTouchModel();
    case 3: return buildAuraRingModel();
    case 4: return buildHoloDeskModel();
    case 5: return buildHydroSmartModel();
    case 6: return buildOrbitalSoundModel();
    default: return buildVisionARModel();
  }
}

// ═══════════════════════════════════════════════════════════════════
// 5. RENDERIZAÇÃO NOS CARDS DO CATÁLOGO
// ═══════════════════════════════════════════════════════════════════

function initCard3DViewers() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = parseInt(card.getAttribute('data-id'), 10);
    const container = card.querySelector('.product-3d-canvas-container');
    if (!container || container.getAttribute('data-init') === '1') return;
    container.setAttribute('data-init', '1');

    const w = container.clientWidth || 320, h = 230;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);

    const ren = new THREE.WebGLRenderer({
      antialias: true, alpha: true, powerPreference: 'high-performance'
    });
    ren.setSize(w, h);
    ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ren.toneMapping = THREE.ACESFilmicToneMapping;
    ren.toneMappingExposure = 1.2;
    ren.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(ren.domElement);

    scene.environment = getOrCreateStudioEnvironment(ren);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const k = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    k.position.set(5, 6, 5); scene.add(k);
    const f = new THREE.DirectionalLight(0x38bdf8, 1.4);
    f.position.set(-5, -2, -3); scene.add(f);
    scene.add(new THREE.DirectionalLight(0xc084fc, 1.0).translateY(-4).translateZ(4));

    const mdl = createGadgetModel(id);
    scene.add(mdl.group);
    const [cx, cy, cz] = mdl.cameraPos;
    cam.position.set(cx, cy, cz);
    cam.lookAt(0, 0, 0);

    let dragging = false, prevX = 0, prevY = 0, rotY = 0, rotX = 0, hovered = false;
    const dom = ren.domElement;
    dom.addEventListener('pointerenter', () => hovered = true);
    dom.addEventListener('pointerleave', () => { hovered = false; dragging = false; });
    dom.addEventListener('pointerdown', e => { dragging = true; prevX = e.clientX; prevY = e.clientY; dom.style.cursor = 'grabbing'; });
    window.addEventListener('pointerup', () => { dragging = false; dom.style.cursor = 'grab'; });
    window.addEventListener('pointermove', e => {
      if (!dragging) return;
      rotY += (e.clientX - prevX) * 0.012;
      rotX += (e.clientY - prevY) * 0.012;
      prevX = e.clientX; prevY = e.clientY;
    });

    let vis = true;
    new IntersectionObserver(en => vis = en[0].isIntersecting, { threshold: 0.1 }).observe(container);

    const clk = new THREE.Clock();
    (function loop() {
      requestAnimationFrame(loop);
      if (!vis) return;
      const t = clk.getElapsedTime();
      if (!dragging) rotY += hovered ? 0.014 : 0.007;
      mdl.group.rotation.y = rotY;
      mdl.group.rotation.x = rotX * 0.4;
      mdl.update(t, true);
      ren.render(scene, cam);
    })();
  });
}

// ═══════════════════════════════════════════════════════════════════
// 6. STUDIO 3D 360° FULLSCREEN
// ═══════════════════════════════════════════════════════════════════

function open3DModal(productId) {
  const modal = document.getElementById('modal-3d-viewer');
  const container = document.getElementById('modal-3d-canvas');
  const product = products.find(p => p.id === productId);
  if (!product || !modal || !container) return;

  document.getElementById('modal-3d-title').textContent = product.name;
  document.getElementById('modal-3d-category').textContent = product.category;
  document.getElementById('modal-3d-desc').textContent = product.description;
  document.getElementById('modal-3d-price').textContent = formatCurrency(product.price);
  document.getElementById('modal-3d-add-btn').onclick = () => addToCart(product.id);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  initModal3DScene(productId, container);
}

function close3DModal() {
  const modal = document.getElementById('modal-3d-viewer');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  if (Gadget3DManager.modalAnimFrame) cancelAnimationFrame(Gadget3DManager.modalAnimFrame);
}

function initModal3DScene(productId, container) {
  container.innerHTML = '';
  const w = container.clientWidth, h = container.clientHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050810, 0.04);
  const cam = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);

  const ren = new THREE.WebGLRenderer({ antialias: true });
  ren.setSize(w, h);
  ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  ren.setClearColor(0x050810, 1);
  ren.toneMapping = THREE.ACESFilmicToneMapping;
  ren.toneMappingExposure = 1.2;
  ren.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(ren.domElement);

  scene.environment = getOrCreateStudioEnvironment(ren);

  // Grid
  scene.add(new THREE.GridHelper(20, 36, 0x00f2fe, 0x162035).translateY(-2.1));

  // Luzes
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const s1 = new THREE.SpotLight(0xe0f2fe, 3.5, 30, Math.PI / 4, 0.3);
  s1.position.set(6, 8, 6); scene.add(s1);
  const s2 = new THREE.SpotLight(0xc084fc, 2.5, 30, Math.PI / 4, 0.3);
  s2.position.set(-6, 3, -6); scene.add(s2);
  scene.add(new THREE.PointLight(0x00f2fe, 2.0, 10).translateY(-2));

  const mdl = createGadgetModel(productId);
  scene.add(mdl.group);
  const [cx, cy, cz] = mdl.cameraPos;
  cam.position.set(cx, cy + 0.4, cz + 1.2);

  let ctrl;
  if (typeof THREE.OrbitControls !== 'undefined') {
    ctrl = new THREE.OrbitControls(cam, ren.domElement);
    ctrl.enableDamping = true; ctrl.dampingFactor = 0.05;
    ctrl.maxDistance = 14; ctrl.minDistance = 2.4;
    ctrl.target.set(0, 0, 0);
  }

  Object.assign(Gadget3DManager, {
    modalScene: scene, modalCamera: cam, modalRenderer: ren,
    modalControls: ctrl, modalCurrentModel: mdl, modalCurrentId: productId
  });

  window.addEventListener('resize', () => {
    const nw = container.clientWidth, nh = container.clientHeight;
    cam.aspect = nw / nh; cam.updateProjectionMatrix();
    ren.setSize(nw, nh);
  });

  const clk = new THREE.Clock();
  (function animate() {
    Gadget3DManager.modalAnimFrame = requestAnimationFrame(animate);
    const t = clk.getElapsedTime();
    if (ctrl) { if (Gadget3DManager.isAutoRotate) mdl.group.rotation.y += 0.006; ctrl.update(); }
    mdl.update(t, Gadget3DManager.isSpecialEffectActive);
    ren.render(scene, cam);
  })();
}

function toggleAutoRotate() {
  Gadget3DManager.isAutoRotate = !Gadget3DManager.isAutoRotate;
  const b = document.getElementById('btn-toggle-rotate');
  if (b) { b.classList.toggle('active', Gadget3DManager.isAutoRotate); b.innerHTML = Gadget3DManager.isAutoRotate ? '🔄 Rotação: Ligada' : '⏸️ Rotação: Pausada'; }
}
function toggleSpecialEffect() {
  Gadget3DManager.isSpecialEffectActive = !Gadget3DManager.isSpecialEffectActive;
  const b = document.getElementById('btn-toggle-fx');
  if (b) { b.classList.toggle('active', Gadget3DManager.isSpecialEffectActive); b.innerHTML = Gadget3DManager.isSpecialEffectActive ? '⚡ Efeitos Especiais: Ligados' : '⚪ Efeitos: Desligados'; }
}
function reset3DCamera() {
  if (Gadget3DManager.modalCurrentModel && Gadget3DManager.modalCamera && Gadget3DManager.modalControls) {
    const [cx, cy, cz] = Gadget3DManager.modalCurrentModel.cameraPos;
    Gadget3DManager.modalCamera.position.set(cx, cy + 0.4, cz + 1.2);
    Gadget3DManager.modalControls.target.set(0, 0, 0);
    Gadget3DManager.modalCurrentModel.group.rotation.set(0, 0, 0);
  }
}
