# Daffy Dark Menü (QR Menü)

Daffy Dark için geliştirilen QR menü + admin panel projesi.

## Stack
- **Frontend:** React + TypeScript + Vite
- **Admin:** Aynı frontend içinde `/admin`
- **Backend API:** Express (`server/index.mjs`)
- **Veri:** Basit JSON dosyası (`server/db.json`)

## Özellikler
- Menü ve kategorileri görüntüleme
- Admin panelden ürün/kategori yönetimi
- API üzerinden veri okuma/yazma
- İlk çalıştırmada default menü verisi ile otomatik bootstrap

## Kurulum
```bash
npm install
```

## Geliştirme
### Sadece frontend
```bash
npm run dev
```

### Sadece API
```bash
npm run dev:api
```

### Full-stack (önerilen)
```bash
npm run dev:full
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000/api`

## Build
```bash
npm run build
```

## API uçları
- `GET /api/health`
- `GET /api/menu`
- `POST /api/bootstrap`
- `PUT /api/categories`
- `PUT /api/menu-items`

## Ortam değişkeni
Frontend farklı API adresine bağlanacaksa:

```bash
VITE_API_URL=http://localhost:4000/api
```

## Not
Bu sürüm lokal geliştirme odaklıdır. Canlıya çıkmadan önce:
- JSON yerine veritabanı
- Auth hardening
- Rate limit / logging
- Yedekleme
adımları önerilir.
