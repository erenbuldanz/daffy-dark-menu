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
cp .env.example .env
```

## Hızlı Başlatma (önerilen)
```bash
./start.sh
```

## Durdurma
```bash
./stop.sh
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

### Full-stack
```bash
npm run dev:full
```

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5173/#/admin/login`
- API: `http://localhost:4000/api`

## Build
```bash
npm run build
```

## Lint
```bash
npm run lint
```


## Admin güvenliği
- Admin giriş doğrulaması artık **API tarafında** yapılır (`/api/admin/login`).
- Menü ve kategori güncelleme uçları (`PUT /api/categories`, `PUT /api/menu-items`) **Bearer token** ister.
- Varsayılan şifre `.env` içindeki `ADMIN_PASSWORD` ile belirlenir (ilk kurulum/fallback).
- Şifre değişimi `POST /api/admin/change-password` ile yapılır ve hash olarak `server/db.json` içinde saklanır.

## API uçları
- `GET /api/health`
- `GET /api/menu`
- `POST /api/bootstrap`
- `POST /api/admin/login`
- `POST /api/admin/change-password`
- `PUT /api/categories` (auth gerekli)
- `PUT /api/menu-items` (auth gerekli)

## Yedekleme / Export
Menü verisinin (`server/db.json`) zaman damgalı bir yedeğini alır:

```bash
npm run backup:db
```

Yedek dosyaları `backups/` klasörüne oluşturulur.

## Ortam değişkenleri
`.env.example` üzerinden yönetilir:

```bash
VITE_API_URL=http://localhost:4000/api
PORT=4000
ADMIN_PASSWORD=change_me
```

> Not: Sadece `VITE_*` değişkenleri client bundle içine girer. Admin şifresi için `ADMIN_PASSWORD` kullanın.

## Not
Bu sürüm lokal geliştirme odaklıdır. Canlıya çıkmadan önce:
- JSON yerine veritabanı
- Rate limit / logging
- Düzenli yedekleme
adımları önerilir.
