/**
 * Catálogo de Produtos - Gadgets Tech
 * Atividade Prática 4º Bimestre - Desenvolvimento Web Avançado
 * Alunos: Alexandre, Pedro Franchim, Marcus e Julio
 * Professor: Danilo Bezerra
 */

const products = [
  {
    id: 1,
    name: "VisionAR Glass",
    category: "Wearables",
    description: "Exibição de GPS e tradução de idiomas em tempo real nas lentes.",
    price: 3499.00,
    image: "assets/img/visionar-glass.svg",
    features: ["HUD Integrado", "Tradução Simultânea", "GPS em Tempo Real"],
    rating: 4.9
  },
  {
    id: 2,
    name: "PulseTouch Pro",
    category: "Wearables",
    description: "Pulseira com feedback tátil e vibrações direcionais para games.",
    price: 1299.00,
    image: "assets/img/pulsetouch-pro.svg",
    features: ["Motor Háptico 4.8G", "Vibração 360°", "Baixa Latência 2ms"],
    rating: 4.8
  },
  {
    id: 3,
    name: "AuraRing Control",
    category: "Wearables",
    description: "Anel inteligente para controle por gestos no ar.",
    price: 1899.00,
    image: "assets/img/auraring-control.svg",
    features: ["Sensores Espaciais 6-Eixos", "Titanium Grade 5", "Bateria de 7 dias"],
    rating: 4.7
  },
  {
    id: 4,
    name: "HoloDesk AI",
    category: "Casa Inteligente",
    description: "Assistente de mesa com projeção holográfica 3D interativa.",
    price: 4799.00,
    image: "assets/img/holodesk-ai.svg",
    features: ["Projeção 3D Volumétrica", "Comandos de Voz IA", "Conexão IoT Total"],
    rating: 5.0
  },
  {
    id: 5,
    name: "HydroSmart",
    category: "Casa Inteligente",
    description: "Garrafa com esterilização UV-C e lembrete de hidratação.",
    price: 549.00,
    image: "assets/img/hydrosmart.svg",
    features: ["LED UV-C Antibacteriano", "Display OLED Touch", "Isolamento Térmico 24h"],
    rating: 4.6
  },
  {
    id: 6,
    name: "Orbital Sound",
    category: "Áudio Avançado",
    description: "Caixa de som flutuante com levitação magnética e indução.",
    price: 2199.00,
    image: "assets/img/orbital-sound.svg",
    features: ["Levitação Magnética Real", "Carregamento Sem Fio", "Som Espacial 360°"],
    rating: 4.9
  }
];

// Helper para formatar valores em Real (BRL)
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
