# Archival Ink Gallery - Headless Shopify Storefront

A beautiful, high-performance art gallery website powered by **Manus** design and **Shopify** commerce.

## ✨ Features

- 🎨 **Beautiful UI/UX** - Cosmic theme with glass morphism and smooth animations
- 🛍️ **Shopify Integration** - Full e-commerce powered by Shopify Storefront API
- 🚀 **Blazing Fast** - Built with Vite + React for optimal performance
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🎭 **Artist Collections** - Showcase multiple artists with dedicated pages
- 💫 **Smooth Animations** - Framer Motion animations throughout
- 🛒 **Cart & Checkout** - Seamless cart experience with Shopify checkout
- ⭐ **Wishlist** - Save favorites with local storage
- 🔍 **Search & Filter** - Find artworks by artist, category, price
- 🖼️ **Lightbox View** - Detailed artwork view with zoom
- 🌟 **Star Field** - Animated cosmic background with shooting stars

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Shopify credentials:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Run Development Server

```bash
pnpm run dev
```

Visit `http://localhost:5000`

### 4. Build for Production

```bash
pnpm run build
```

## 📚 Documentation

- **[Shopify Setup Guide](./SHOPIFY-SETUP-GUIDE.md)** - Complete Shopify configuration
- **[Data Mapping](./DATA-MAPPING.md)** - How Manus components map to Shopify
- **[API Reference](./API-REFERENCE.md)** - All Shopify API queries and mutations

## 🏗️ Project Structure

```
archival-ink-gallery/
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Cart, Favorites, Theme)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and Shopify client
│   │   │   ├── shopify.ts              # Shopify API client
│   │   │   └── shopify-transform.ts    # Data transformations
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Global styles
│   └── public/              # Static assets
├── .env.example             # Environment variables template
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies and scripts
```

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Routing**: Wouter
- **Commerce**: Shopify Storefront API
- **Deployment**: Vercel

## 🛍️ Shopify Integration

### What Shopify Manages

✅ Products, inventory, pricing  
✅ Collections (artists)  
✅ Cart and checkout  
✅ Payment processing  
✅ Order management  
✅ Customer accounts  
✅ Shipping and fulfillment  

### What This Website Handles

✅ Beautiful UI/UX  
✅ Product browsing and filtering  
✅ Wishlist/favorites  
✅ Gallery views  
✅ Artist pages  
✅ Lightbox product view  
✅ Animations and interactions  

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See [SHOPIFY-SETUP-GUIDE.md](./SHOPIFY-SETUP-GUIDE.md#6-deployment-to-vercel) for detailed instructions.

## 🎨 Managing Your Store

### Add New Artwork

1. Go to Shopify Admin → Products → Add product
2. Fill in details (title, price, images, artist)
3. Save

**Changes appear immediately** on your website!

### Manage Artists

1. Go to Products → Collections
2. Create collection for each artist
3. Add products to collection

### Process Orders

All orders appear in Shopify Admin → Orders

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SHOPIFY_STORE_DOMAIN` | Your Shopify store domain | `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API token | `shpat_xxxxx` |

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build |
| `pnpm run lint` | Run ESLint |

## 🐛 Troubleshooting

### Products Not Loading

- Check environment variables are set correctly
- Verify Storefront API token has correct scopes
- Check browser console for errors

### Cart Not Working

- Verify `unauthenticated_write_checkouts` scope is enabled
- Check browser console for API errors
- Clear localStorage and try again

See [SHOPIFY-SETUP-GUIDE.md](./SHOPIFY-SETUP-GUIDE.md#-troubleshooting) for more help.

## 📄 License

All rights reserved.

## 🙏 Credits

- **Design**: Manus AI
- **Commerce**: Shopify
- **Deployment**: Vercel

---

**Built with ❤️ using Manus and Shopify** 🎨🛍️🛍️
Updated: Jan 15, 2026 5:18PM
