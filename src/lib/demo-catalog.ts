// Frontend-only showcase catalogue of skincare listings. The live backend only
// holds a handful of computer posts, so these give the marketplace realistic
// beauty inventory. IDs start at 900001 so they never clash with backend rows.
import type { ProductRecommendationDto } from "@/lib/api";

type Seed = {
  id: number;
  title: string;
  description: string;
  price: number;
  url: string;
  trust: number;
  note: string;
};

const seeds: Seed[] = [
  {
    id: 900001,
    title: "COSRX Advanced Snail 96 Mucin Power Essence 100ml",
    description:
      "Authentic Korean snail mucin essence for hydration, glass skin and acne scar fading. Skincare, serum, essence, moisturiser, K-beauty.",
    price: 42000,
    url: "https://facebook.com/glowlab/posts/1",
    trust: 94,
    note: "Seller verified for 14 months, 210 completed escrow orders, batch code matches distributor records.",
  },
  {
    id: 900002,
    title: "Anua Heartleaf 77% Soothing Toner 250ml",
    description:
      "Calming toner for sensitive and acne prone skin, alcohol free. Skincare, toner, sensitive skin, redness, K-beauty.",
    price: 38000,
    url: "https://facebook.com/glowlab/posts/2",
    trust: 91,
    note: "Original invoice photo attached, price sits within the normal market range.",
  },
  {
    id: 900003,
    title: "Beauty of Joseon Relief Sun SPF50+ PA++++",
    description:
      "Rice and probiotics sunscreen, no white cast, daily UV protection. Sunscreen, SPF, sun cream, skincare, face.",
    price: 26000,
    url: "https://tiktok.com/@glowlab/video/3",
    trust: 96,
    note: "Highest trust band: sealed stock, verified importer, zero disputes on 340 sales.",
  },
  {
    id: 900004,
    title: "La Roche-Posay Effaclar Duo+ M 40ml",
    description:
      "Pharmacy anti-blemish cream for oily skin, reduces acne marks and pores. Acne, blemish, cream, oily skin, treatment.",
    price: 58000,
    url: "https://facebook.com/pharmaglow/posts/4",
    trust: 88,
    note: "Pharmacy-sourced with expiry 2028, seller responds within an hour.",
  },
  {
    id: 900005,
    title: "The Ordinary Niacinamide 10% + Zinc 1% 30ml",
    description:
      "Oil control and blemish serum for enlarged pores and uneven tone. Serum, niacinamide, pores, oily skin, brightening.",
    price: 24000,
    url: "https://tiktok.com/@skinbarmm/video/5",
    trust: 83,
    note: "Genuine batch, but the seller ships only twice a week — plan for slower handover.",
  },
  {
    id: 900006,
    title: "CeraVe Foaming Facial Cleanser 473ml",
    description:
      "Ceramide cleanser for normal to oily skin, fragrance free, dermatologist favourite. Cleanser, face wash, ceramide, daily.",
    price: 46000,
    url: "https://facebook.com/pharmaglow/posts/6",
    trust: 90,
    note: "Large size verified against importer packaging, 96% positive buyer feedback.",
  },
  {
    id: 900007,
    title: "SKIN1004 Madagascar Centella Ampoule 100ml",
    description:
      "Centella asiatica ampoule for irritated, breakout-prone skin. Ampoule, centella, cica, soothing, hydration.",
    price: 35000,
    url: "https://facebook.com/cicahouse/posts/7",
    trust: 87,
    note: "Consistent listing history, photos are original rather than reposted stock images.",
  },
  {
    id: 900008,
    title: "Laneige Water Sleeping Mask 70ml",
    description:
      "Overnight hydrating mask for dry and dull skin. Night mask, sleeping pack, moisturiser, hydration, K-beauty.",
    price: 52000,
    url: "https://tiktok.com/@nightglow/video/8",
    trust: 79,
    note: "Legitimate seller but counterfeits are common for this item — inspect the seal at handover.",
  },
  {
    id: 900009,
    title: "Some By Mi AHA BHA PHA 30 Days Miracle Toner 150ml",
    description:
      "Exfoliating acid toner that clears blackheads and rough texture. Toner, exfoliant, AHA, BHA, acne.",
    price: 31000,
    url: "https://facebook.com/skinbarmm/posts/9",
    trust: 85,
    note: "Verified stock, 62 completed escrow orders with no disputes.",
  },
  {
    id: 900010,
    title: "Innisfree Green Tea Hyaluronic Serum 80ml",
    description:
      "Lightweight hydrating serum for combination skin. Serum, hyaluronic acid, hydration, green tea, daily.",
    price: 33000,
    url: "https://facebook.com/glowlab/posts/10",
    trust: 82,
    note: "Two buyers reported slow replies; escrow still protects the payment fully.",
  },
  {
    id: 900011,
    title: "Medicube Zero Pore Pad 2.0 (70 pads)",
    description:
      "Toner pads for pore care and sebum control on oily skin. Pads, pore, exfoliating, oily skin, toner.",
    price: 47000,
    url: "https://tiktok.com/@poreclinic/video/11",
    trust: 76,
    note: "Newer shop with only 9 sales — Guardian flags limited history, not fraud.",
  },
  {
    id: 900012,
    title: "Bioderma Sensibio H2O Micellar Water 500ml",
    description:
      "Gentle makeup remover for sensitive skin, no rinse needed. Cleanser, micellar water, makeup remover, sensitive.",
    price: 54000,
    url: "https://facebook.com/pharmaglow/posts/12",
    trust: 89,
    note: "Distributor sticker visible in the post photos, expiry 2029.",
  },
  {
    id: 900013,
    title: "Round Lab 1025 Dokdo Cleanser 150ml",
    description:
      "Mild low-pH cleanser with deep sea water for barrier care. Cleanser, low pH, barrier, sensitive, hydration.",
    price: 29000,
    url: "https://facebook.com/cicahouse/posts/13",
    trust: 84,
    note: "Steady seller, all handovers completed within 48 hours.",
  },
  {
    id: 900014,
    title: "Torriden DIVE-IN Low Molecular Hyaluronic Serum 50ml",
    description:
      "Deep hydration serum for dehydrated and tight skin. Serum, hyaluronic, hydration, lightweight, vegan.",
    price: 36000,
    url: "https://tiktok.com/@nightglow/video/14",
    trust: 86,
    note: "Photos and price consistent with genuine retail stock.",
  },
  {
    id: 900015,
    title: "Vitamin C 20% Brightening Serum 30ml (unbranded refill)",
    description:
      "Decanted vitamin C serum for dark spots and dullness. Serum, vitamin C, brightening, dark spot, whitening.",
    price: 9000,
    url: "https://facebook.com/quickdeals/posts/15",
    trust: 38,
    note: "High risk: unbranded decant, price far below market, seller asks to chat off-platform.",
  },
  {
    id: 900016,
    title: "Whitening cream — 7 days guaranteed result",
    description:
      "Fast whitening cream claiming instant results in one week. Whitening, bleaching, cream, face.",
    price: 12000,
    url: "https://facebook.com/quickdeals/posts/16",
    trust: 29,
    note: "Guardian warning: unrealistic claims, no ingredient list, pattern matches mercury-cream scams.",
  },
  {
    id: 900017,
    title: "Skin1004 Poremizing Clear Pad + Cleanser bundle",
    description:
      "Bundle set for oily and acne prone skin, pads plus gel cleanser. Bundle, set, acne, pores, oily skin.",
    price: 62000,
    url: "https://facebook.com/cicahouse/posts/17",
    trust: 81,
    note: "Bundle value checks out; seller has one open dispute from last month.",
  },
  {
    id: 900018,
    title: "Dr.G Red Blemish Clear Soothing Cream 70ml",
    description:
      "Cica cream for redness, irritation and post-acne repair. Cream, moisturiser, cica, redness, sensitive skin.",
    price: 49000,
    url: "https://tiktok.com/@cicahouse/video/18",
    trust: 92,
    note: "Verified importer, 128 escrow orders completed, zero refunds.",
  },
];

export const demoProducts: ProductRecommendationDto[] = seeds.map((s) => ({
  productId: s.id,
  title: s.title,
  description: s.description,
  price: s.price,
  socialPostUrl: s.url,
  trustScore: s.trust,
  isVerifiedSafe: s.trust >= 75,
  fitScore: 60,
  compatibilityInsight: null,
  explanation: s.note,
}));

export function getDemoProduct(id: number): ProductRecommendationDto | null {
  return demoProducts.find((p) => p.productId === id) ?? null;
}
