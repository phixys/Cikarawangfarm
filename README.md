# Cikarawang Farm — Next.js App
Cikarawang Farm adalah platform berbasis web yang menyediakan layanan pemesanan ternak dan paket aqiqah secara online. Website ini dirancang untuk memudahkan pelanggan dalam melihat katalog ternak, memilih paket aqiqah, serta memperoleh informasi pemesanan melalui antarmuka yang responsif dan mudah digunakan.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript

## Features

- Landing Page Responsif
- Katalog Ternak
- Paket Aqiqah
- Informasi Cara Pemesanan
- Navigasi Interaktif
- UI Modern dengan Tailwind CSS
- Responsive Design untuk Desktop dan Mobile

## Getting Started

```bash
npm install
npm run dev
```
## Live Demo 
https://cikarawangfarm.vercel.app

## File Structure

```
├── app/
│   ├── globals.css        # Poppins import + Tailwind base
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Beranda (Landing Page)
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── CaraPemesananSection.tsx
│   │   ├── KatalogTernakSection.tsx
│   │   └── PaketAqiqahSection.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── AnimalCard.tsx
│       └── AqiqahCard.tsx
│
├── public/
│   ├── logo.png           ← PUT YOUR LOGO HERE
│   ├── logo-hero.png      ← PUT YOUR LARGE HERO LOGO HERE
│   └── hero-bg.jpg        ← PUT YOUR HERO BACKGROUND IMAGE HERE
│
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
└── tsconfig.json
```

## Assets to Replace

Place these files in the `/public` folder:

| File | Usage |
|------|-------|
| `/public/logo.png` | Navbar & Footer logo (36×36) |
| `/public/logo-hero.png` | Hero section large logo (130×130) |
| `/public/hero-bg.jpg` | Hero background image (full-width) |

Animal card images (optional): pass `imageSrc="/animals/your-image.jpg"` prop to `<AnimalCard>`.

## Color Tokens (tailwind.config.js)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-dark` | `#2D6A4F` | Navbar, footer, buttons, headings |
| `primary-medium` | `#40916C` | Accent text, hover states |
| `primary-light` | `#74C69D` | Card image gradients, secondary |
| `primary-tint` | `#F0FFF4` | Section backgrounds, ghost buttons |
| `primary-tint2` | `#D8F3DC` | Ghost button hover |
| `danger` | `#EF4444` | Danger/cancel actions |

## Team 
- Apta Adi Nur Fiansah M0403241003
- Nazwa Nadya Rahma M0403241060 
- Muhammad Farhan Assafari M0403241176

## License
This project is developed for educational purposes.
