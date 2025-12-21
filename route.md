## 🎨 Key Pages

### Seller Dashboard

- `/dashboard` - Overview with stats
- `/dashboard/products` - Product management
- `/dashboard/orders` - Order tracking
- `/dashboard/analytics` - Performance metrics
- `/dashboard/storefront` - Branding & templates
- `/dashboard/settings` - Account settings
- `/dashboard/subscription` - Billing & upgrades

### Public Storefront

- `/{storeSlug}` - Store homepage
- `/{storeSlug}/{productId}` - Product detail
- `/{storeSlug}/report` - Report store

## 🔐 Authentication Flow

1. User registers → Email verification
2. Login → JWT token in httpOnly cookie
3. Access dashboard → Token validated
4. Auto refresh on 401 error

## 📊 Analytics Tracked

- Store visits (unique)
- Product views
- Buy button clicks
- Device breakdown
- Top products

## 🎯 SEO Optimization

- Dynamic metadata per page
- JSON-LD structured data
- Open Graph tags
- Twitter cards
- Sitemap generation
- robots.txt

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Recommended: Deploy on Vercel for optimal Next.js performance.

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Built with ❤️ for Nigerian sellers

---

**Happy Selling! 🎊**
