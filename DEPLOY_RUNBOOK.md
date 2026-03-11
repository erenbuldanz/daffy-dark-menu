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
CORS_ORIGIN=https://menu.example.com
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=10
SESSION_TTL_HOURS=24
```

> İlk açılışta `ADMIN_PASSWORD` ile giriş yapılır. Şifre panelden değiştirildiğinde hash `server/db.json` içine yazılır.


## 2.1) Güvenlik varsayılanları (bu sürümde eklendi)
- `POST /api/admin/login` için IP bazlı rate limit
- Temel security header’ları (nosniff, frame deny, referrer policy, HSTS-if-https)
- Merkezi error handler
- Basit audit log (`[AUDIT] ...`)

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
- Login endpoint’ine art arda başarısız isteklerde `429 Too Many Requests` alınmalı
- Login sonrası admin panelden ürün/kategori kaydı başarılı
- API loglarında `[AUDIT]` satırları görünmeli

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
