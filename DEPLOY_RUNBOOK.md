# Daffy Dark Menü — Deploy Runbook

Bu doküman, projeyi local/stage/prod ortamına güvenli şekilde almak için kısa operasyon rehberidir.

## 1) Ön koşullar
- Node.js 20+
- npm 10+
- `.env` dosyası (örnek için `.env.example`)

## 2) Ortam değişkenleri
`.env`:

```bash
VITE_API_URL=http://localhost:4000/api
PORT=4000
ADMIN_PASSWORD=change_me
```

> İlk açılışta `ADMIN_PASSWORD` ile giriş yapılır. Şifre panelden değiştirildiğinde hash `server/db.json` içine yazılır.

## 3) Kurulum
```bash
npm install
cp .env.example .env
```

## 4) Başlatma / durdurma
```bash
./start.sh
./stop.sh
```

## 5) Yayın öncesi kalite kapısı
```bash
npm run lint
npm run build
```

Her iki komut da hatasız tamamlanmalı.

## 6) Hızlı smoke test
- `GET /api/health` -> `{"ok":true}`
- `GET /api/menu` -> kategori + ürün verisi dönüyor
- Admin login (`/#/admin/login`) başarılı
- Login olmadan `PUT /api/menu-items` -> `401 Unauthorized`
- Login sonrası admin panelden ürün/kategori kaydı başarılı

## 7) Operasyon notları
- `server/db.json` canlı veridir, düzenli yedek alın:
```bash
npm run backup:db
```
- Yedekleri `backups/` klasöründen harici depoya taşıyın.
- Üretimde ters proxy (Nginx/Caddy) + HTTPS arkasında çalıştırın.

## 8) Önerilen sonraki adımlar
- Session store’u memory yerine Redis’e taşıma
- Rate limiting (özellikle `/api/admin/login`)
- Audit log (kim/ne zaman hangi menü verisini değiştirdi)
