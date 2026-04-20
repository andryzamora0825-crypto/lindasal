export interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: { user: string; text: string; date: string }[];
}

export const mockPosts: FeedPost[] = [
  {
    id: "1",
    author: { name: "Lindasal", avatar: "" },
    content: "🌊 ¡Nuestra Sal Marina 100% Orgánica ya está disponible! Extraída de las costas de Ecuador, rica en minerales y oligoelementos que fortalecen tu salud. ¡Pruébala hoy! 🧂✨",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=800&q=80",
    createdAt: "2026-04-12T14:30:00",
    likes: 45,
    comments: [
      { user: "María G.", text: "¡La mejor sal que he probado! 💯", date: "2026-04-12T15:00:00" },
      { user: "Carlos R.", text: "¿Hacen envíos a Quito?", date: "2026-04-12T15:30:00" },
    ],
  },
  {
    id: "2",
    author: { name: "Lindasal", avatar: "" },
    content: "💧 ¿Sabías que el Aguademar Quinton es agua de mar purificada con más de 78 minerales? Ideal para fortalecer tu sistema inmunológico y mejorar tu energía diaria. 🌿",
    createdAt: "2026-04-11T10:00:00",
    likes: 32,
    comments: [
      { user: "Ana P.", text: "¡Increíble producto! Lo uso todos los días", date: "2026-04-11T11:00:00" },
    ],
  },
  {
    id: "3",
    author: { name: "Lindasal", avatar: "" },
    content: "🎉 ¡PROMOCIÓN ESPECIAL! Por la compra de 2 bolsas de Sal Marina Lindasal, llévate un Aguademar Quinton GRATIS. 🎁 Válido hasta agotar stock. ¡No te lo pierdas!",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    createdAt: "2026-04-10T09:00:00",
    likes: 78,
    comments: [
      { user: "Pedro L.", text: "¡Excelente promo! Ya hice mi pedido 🛒", date: "2026-04-10T09:30:00" },
      { user: "Laura M.", text: "¿Hasta cuándo es la promoción?", date: "2026-04-10T10:00:00" },
      { user: "Lindasal", text: "¡Hasta agotar stock, Laura! No te quedes sin la tuya 😊", date: "2026-04-10T10:15:00" },
    ],
  },
  {
    id: "4",
    author: { name: "Lindasal", avatar: "" },
    content: "🏖️ De las cristalinas aguas de la costa ecuatoriana a tu mesa. Nuestro proceso artesanal preserva todos los minerales naturales que tu cuerpo necesita. ¡Sal Marina Lindasal, la flor de sal! 🌺",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    createdAt: "2026-04-09T16:00:00",
    likes: 56,
    comments: [],
  },
];
