# 🎉 Whudey - Your Online Store Platform

A complete Next.js + TypeScript application for creating professional online storefronts in Nigeria.

## 🚀 Features

### For Sellers

- ✅ **Customizable Storefront** - Choose templates, colors, logo
- ✅ **Product Management** - Add up to 50 products (Pro tier)
- ✅ **Direct-to-Chat Sales** - WhatsApp, Instagram, Telegram integration
- ✅ **Order Tracking** - Manual order entry with receipts
- ✅ **Analytics Dashboard** - Track visits, views, top products
- ✅ **Subscription Tiers** - Free (10 products) & Professional (50 products)

### For Buyers

- ✅ **SEO Optimized** - Stores discoverable on Google
- ✅ **Mobile Responsive** - Perfect on all devices
- ✅ **Fast Loading** - Optimized images via Cloudinary
- ✅ **Easy Contact** - One-click buy on preferred platform

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit (API) + Zustand (UI)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **API**: REST with Axios
- **Authentication**: JWT + httpOnly Cookies

## 📦 Installation

```bash
# Clone repository
git clone <repo-url>
cd whudey-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

## 🌐 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📁 Project Structure
