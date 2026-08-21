// Frontend-only showcase catalogue. The live backend currently only holds a few
// computer listings, so these demo posts give the marketplace realistic variety
// across categories. IDs start at 900001 so they never clash with backend rows.
import type { ProductRecommendationDto } from "@/lib/api";

type Seed = {
  id: number;
  title: string;
  description: string;
  price: number;
  url: string;
  trust: number;
  safe?: boolean;
};

const seeds: Seed[] = [
  {
    id: 900001,
    title: "iPhone 13 128GB — battery 91%",
    description:
      "Used iPhone 13 in midnight blue, 128GB, battery health 91%, no scratches, box and cable included. Phone, mobile, smartphone.",
    price: 1250000,
    url: "https://facebook.com/mobilehub/posts/1",
    trust: 88,
  },
  {
    id: 900002,
    title: "Samsung Galaxy A55 (new, sealed)",
    description:
      "Brand new sealed Samsung Galaxy A55 8/256GB, one year Myanmar warranty. Phone, smartphone, android.",
    price: 980000,
    url: "https://facebook.com/mobilehub/posts/2",
    trust: 93,
  },
  {
    id: 900003,
    title: "Sony WH-1000XM4 headphones",
    description:
      "Noise cancelling wireless headphones, great for study and travel. Audio, headphone, earphone, music.",
    price: 420000,
    url: "https://tiktok.com/@soundlab/video/3",
    trust: 84,
  },
  {
    id: 900004,
    title: "Canon EOS M50 Mark II + 15-45mm",
    description:
      "Mirrorless camera kit for vlogging, interviews and indoor video. Camera, photography, vlog, content creator.",
    price: 1450000,
    url: "https://facebook.com/lenshouse/posts/4",
    trust: 90,
  },
  {
    id: 900005,
    title: "Ergonomic office chair with lumbar support",
    description:
      "Mesh office chair, adjustable armrest and headrest, perfect for long desk work. Furniture, home, chair, office.",
    price: 265000,
    url: "https://facebook.com/homefit/posts/5",
    trust: 81,
  },
  {
    id: 900006,
    title: "Uniqlo-style linen shirt (unisex, M/L/XL)",
    description:
      "Breathable linen shirt for hot weather, three sizes, four colours. Fashion, clothing, shirt, men, women.",
    price: 32000,
    url: "https://tiktok.com/@wearlight/video/6",
    trust: 76,
  },
  {
    id: 900007,
    title: "Korean skincare set — cleanser, toner, serum",
    description:
      "Full routine set for oily and acne prone skin, authentic Korean beauty products. Skincare, beauty, cosmetics, sunscreen.",
    price: 78000,
    url: "https://facebook.com/glowlab/posts/7",
    trust: 87,
  },
  {
    id: 900008,
    title: "Nike Air Zoom Pegasus 40 (size 41-44)",
    description:
      "Running shoes, lightly used, great cushioning for daily runs. Shoes, sneaker, sport, running, fitness.",
    price: 210000,
    url: "https://facebook.com/soleplug/posts/8",
    trust: 79,
  },
  {
    id: 900009,
    title: "Yonex badminton racket + 3 shuttles",
    description:
      "Lightweight racket for intermediate players, includes grip tape and shuttles. Sport, badminton, fitness, outdoor.",
    price: 96000,
    url: "https://tiktok.com/@courtside/video/9",
    trust: 82,
  },
  {
    id: 900010,
    title: "Baby stroller, foldable travel system",
    description:
      "Compact foldable stroller with sun canopy and storage basket. Baby, kids, stroller, family, mother care.",
    price: 185000,
    url: "https://facebook.com/tinysteps/posts/10",
    trust: 85,
  },
  {
    id: 900011,
    title: "Rice cooker 1.8L with steamer tray",
    description:
      "Family size rice cooker, non-stick pot and steamer basket. Kitchen, home appliance, cooking.",
    price: 74000,
    url: "https://facebook.com/homefit/posts/11",
    trust: 80,
  },
  {
    id: 900012,
    title: "Xiaomi Mi Band 8 fitness tracker",
    description:
      "Heart rate, sleep and step tracking with 14-day battery. Wearable, watch, fitness, health, sport.",
    price: 68000,
    url: "https://tiktok.com/@gadgetgo/video/12",
    trust: 89,
  },
  {
    id: 900013,
    title: "Acoustic guitar, beginner bundle",
    description:
      "38-inch acoustic guitar with bag, strap, picks and spare strings. Music, instrument, guitar, hobby.",
    price: 145000,
    url: "https://facebook.com/melodyshop/posts/13",
    trust: 77,
  },
  {
    id: 900014,
    title: "Study desk lamp with wireless charging",
    description:
      "LED desk lamp, three colour modes, built-in phone wireless charger. Home, study, lamp, light, desk.",
    price: 42000,
    url: "https://tiktok.com/@lampline/video/14",
    trust: 83,
  },
  {
    id: 900015,
    title: "Anker 20000mAh power bank 65W",
    description:
      "Fast charging power bank for phone and laptop, USB-C PD. Accessory, charger, travel, battery.",
    price: 88000,
    url: "https://facebook.com/gadgetgo/posts/15",
    trust: 91,
  },
  {
    id: 900016,
    title: "Handmade rattan handbag",
    description:
      "Locally handmade rattan bag, fits phone, wallet and small umbrella. Fashion, bag, handbag, women, accessory.",
    price: 39000,
    url: "https://facebook.com/craftmm/posts/16",
    trust: 74,
  },
  {
    id: 900017,
    title: "Gaming laptop — Ryzen 7, RTX 4060, 16GB",
    description:
      "144Hz gaming laptop with upgrade room, warranty until 2027. Laptop, computer, gaming, PC.",
    price: 3150000,
    url: "https://facebook.com/technest/posts/17",
    trust: 92,
  },
  {
    id: 900018,
    title: "Air fryer 5.5L digital",
    description:
      "Digital air fryer with 8 presets, oil-free cooking for family meals. Kitchen, appliance, cooking, home.",
    price: 115000,
    url: "https://tiktok.com/@kitchenmm/video/18",
    trust: 86,
  },
];

export const demoProducts: ProductRecommendationDto[] = seeds.map((s) => ({
  productId: s.id,
  title: s.title,
  description: s.description,
  price: s.price,
  socialPostUrl: s.url,
  trustScore: s.trust,
  isVerifiedSafe: s.safe ?? s.trust >= 75,
  fitScore: 60,
  compatibilityInsight: null,
  explanation: null,
}));

export function getDemoProduct(id: number): ProductRecommendationDto | null {
  return demoProducts.find((p) => p.productId === id) ?? null;
}
