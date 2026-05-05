# Cikarawang Farm — Next.js App

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

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
