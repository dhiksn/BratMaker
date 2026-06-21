# BRAT Maker

REST API dan web app untuk generate gambar dan video dengan style BRAT album cover (Charli XCX).

## Demo

Deploy ke Vercel dan akses langsung lewat browser untuk menggunakan web interface-nya.

---

## Endpoints

### `GET /api`
Menampilkan informasi API.

**Response:**
```json
{
  "name": "BratMaker REST API",
  "version": "1.0.0",
  "description": "REST API wrapper for BratMaker",
  "endpoints": { ... }
}
```

---

### `GET /api/brat`
Generate gambar BRAT dari teks.

**Query Parameters:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `text`    | string | ✅ Yes   | Teks yang akan dirender |

**Contoh Request:**
```
GET /api/brat?text=brat
```

**Response:** Binary image (`image/jpeg` atau sesuai content-type dari upstream)

---

### `GET /api/bratvid`
Generate video animasi BRAT dari teks.

**Query Parameters:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `text`    | string | ✅ Yes   | Teks yang akan dirender |

**Contoh Request:**
```
GET /api/bratvid?text=brat
```

**Response:** Binary video (`video/mp4` atau sesuai content-type dari upstream)

---

## Deploy ke Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Untuk production deployment:
```bash
vercel --prod
```

### Atau lewat Vercel Dashboard

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project**
3. Import repository
4. Vercel otomatis detect konfigurasi dari `vercel.json`
5. Klik **Deploy**

---

## Jalankan Lokal

```bash
# Install dependencies
npm install

# Jalankan server
npm start
```

Server berjalan di `http://localhost:3000`

---

## Struktur Project

```
bratmaker/
├── index.js        # Express REST API
├── index.html      # Web interface
├── script.js       # Frontend JavaScript
├── styles.css      # Styling
├── vercel.json     # Konfigurasi Vercel
└── package.json
```

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **HTTP Client:** Axios
- **Deployment:** Vercel (Serverless)
