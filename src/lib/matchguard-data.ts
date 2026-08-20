export type Listing = {
  slug: string;
  source: "FACEBOOK" | "TIKTOK";
  posted: string;
  title: string;
  price: string;
  sponsored?: boolean;
  verdict: string;
  match: number;
  seller: string;
  trust: number;
  city: string;
  description: string;
  meta: string;
  tags: string[];
  reviewBadge: string;
  pros: string[];
  cons: string[];
  note: string;
  specs: { label: string; value: string }[];
};

export const listings: Listing[] = [
  {
    slug: "rtx-4070-rig",
    source: "FACEBOOK",
    posted: "3H AGO",
    title: "Custom Gaming Rig — Ryzen 7 5700X + RTX 4070",
    price: "$1,180",
    sponsored: true,
    verdict: "Comfortably clears your 1440p / 144Hz target",
    match: 94,
    seller: "NightForge Builds",
    trust: 96,
    city: "Yangon",
    description:
      "Fully assembled tower, stress tested 12h. Includes original boxes and a 6-month shop warranty.",
    meta: "Yangon · Meetup or courier",
    tags: ["#TrustGuard", "#gamingpc", "#rtx4070"],
    reviewBadge: "Great fit",
    pros: [
      "RTX 4070 averages 120-160 FPS at 1440p high in your listed titles.",
      "750W Gold PSU leaves headroom for a future GPU upgrade.",
    ],
    cons: ["DDR4 platform — no upgrade path to next-gen CPUs."],
    note: "Priced 6% below the 30-day median for this exact build.",
    specs: [
      { label: "GPU", value: "RTX 4070 12GB" },
      { label: "CPU", value: "Ryzen 7 5700X" },
      { label: "RAM", value: "32GB DDR4 3600" },
      { label: "STORAGE", value: "1TB NVMe Gen4" },
      { label: "PSU", value: "750W 80+ Gold" },
    ],
  },
  {
    slug: "ipad-air-m2",
    source: "TIKTOK",
    posted: "5H AGO",
    title: 'iPad Air M2 11" 128GB + Pencil Pro',
    price: "$640",
    sponsored: true,
    verdict: "Ideal sketching companion, not a laptop replacement",
    match: 71,
    seller: "Loop Digital",
    trust: 93,
    city: "Naypyidaw",
    description:
      "Sealed Pencil Pro included, tablet is 4 months old with AppleCare until next spring.",
    meta: "Naypyidaw · Meetup only",
    tags: ["#TrustGuard", "#ipad", "#applepencil"],
    reviewBadge: "Partial fit",
    pros: [
      "M2 handles Procreate and Affinity layers without stutter.",
      "Pencil Pro bundled saves roughly $110 versus buying separately.",
    ],
    cons: ["128GB fills fast if you keep large project files on device."],
    note: "Priced in line with the 30-day median for this configuration.",
    specs: [
      { label: "CHIP", value: "Apple M2" },
      { label: "DISPLAY", value: '11" Liquid Retina' },
      { label: "STORAGE", value: "128GB" },
      { label: "EXTRAS", value: "Pencil Pro" },
    ],
  },
  {
    slug: "macbook-air-m3",
    source: "TIKTOK",
    posted: "YESTERDAY",
    title: 'MacBook Air M3 15" 16GB / 512GB — 94% battery',
    price: "$1,090",
    verdict: "Strong fit for editing, tight for heavy 4K color work",
    match: 88,
    seller: "Byte Bazaar",
    trust: 91,
    city: "Mandalay",
    description:
      "One owner, no dents, 94% battery health. Ships with original charger and box.",
    meta: "Mandalay · Meetup or courier",
    tags: ["#TrustGuard", "#macbook", "#m3"],
    reviewBadge: "Great fit",
    pros: [
      "16GB unified memory covers design school workloads comfortably.",
      "Fanless design stays silent through long study sessions.",
    ],
    cons: ["Sustained 4K exports throttle after roughly 10 minutes."],
    note: "Priced 4% below the 30-day median for this configuration.",
    specs: [
      { label: "CHIP", value: "Apple M3" },
      { label: "RAM", value: "16GB unified" },
      { label: "STORAGE", value: "512GB SSD" },
      { label: "BATTERY", value: "94% health" },
    ],
  },
  {
    slug: "sony-a7c",
    source: "FACEBOOK",
    posted: "2D AGO",
    title: "Sony A7C + 28-60mm kit, 8.4k shutter",
    price: "$1,450",
    verdict: "Great image quality, but rolling shutter may hurt fast pans",
    match: 76,
    seller: "Frame & Focus",
    trust: 87,
    city: "Yangon",
    description:
      "Low shutter count body with kit lens, two batteries and a cage included.",
    meta: "Yangon · Meetup or courier",
    tags: ["#TrustGuard", "#sony", "#a7c"],
    reviewBadge: "Partial fit",
    pros: [
      "Full-frame sensor gives clean indoor interview footage at ISO 3200.",
      "Compact body works well on a light tripod setup.",
    ],
    cons: ["Single card slot — no in-camera backup for paid shoots."],
    note: "Priced 3% above the 30-day median for this body and kit.",
    specs: [
      { label: "SENSOR", value: "24MP full-frame" },
      { label: "LENS", value: "28-60mm kit" },
      { label: "SHUTTER", value: "8,400 actuations" },
      { label: "SLOTS", value: "Single SD" },
    ],
  },
];

export const suggestions = [
  "1440p gaming PC under $1,300 with upgrade room",
  "Light laptop for design school, 16GB minimum",
  "Camera for indoor interviews, dual card slots",
];
