# Cafe Ray - Aplikasi Pemesanan Kopi Online Premium

**Cafe Ray** adalah aplikasi web pemesanan kopi digital premium berkonsep Single Page Application (SPA). Aplikasi ini dirancang dengan estetika modern bergaya *glassmorphism*, perpaduan palet warna obsidian yang hangat dengan aksen kopi emas, tipografi elegan, serta animasi mikro interaktif yang mulus untuk memberikan kenyamanan pengalaman pengguna (*user experience*).

Aplikasi ini berjalan sepenuhnya secara client-side, menggunakan penyimpanan lokal peramban (`localStorage`) sebagai database internal untuk otentikasi user, saldo wallet, poin loyalitas, keranjang belanja, dan riwayat pesanan.

---

## 🌟 Fitur Utama

1. **Otentikasi & Sesi Persisten (Registrasi & Login)**
   * Sistem pendaftaran member baru dan masuk akun yang aman dengan penyimpanan lokal (`localStorage`).
   * Member baru secara otomatis mendapatkan saldo bonus **Rp150.000** di *Ray Wallet* dan **50 Poin Loyalitas** sebagai bentuk sambutan awal untuk memudahkan pengujian pembelian.

2. **Dashboard Interaktif**
   * Panel status finansial member yang menampilkan saldo *Ray Wallet* (lengkap dengan akses instan ke modal Top-Up) dan jumlah Poin Loyalitas.
   * Banner pahlawan (hero banner) eksklusif hasil kolaborasi desain kecerdasan buatan, serta kompilasi produk kopi terpopuler.

3. **Menu Kategori & Kustomisasi Produk**
   * Klasifikasi menu kopi terfilter (Espresso, Cold Brew, Non-Kopi, dan Cemilan) dengan fitur pencarian waktu-nyata (*real-time search*).
   * Modal kustomisasi pesanan kopi:
     * Pilihan ukuran cangkir (Regular, Medium, Large) dengan penyesuaian harga instan.
     * Pengaturan tingkat es dan kemanisan.
     * Topping tambahan (Extra shot espresso, whipped cream, coffee jelly, sirup karamel) yang dihitung secara dinamis ke harga produk.

4. **Drawer Keranjang Belanja Dinamis**
   * Sliding panel sebelah kanan untuk mengatur kuantitas, menghapus item pesanan, dan kalkulasi subtotal.

5. **Kupon & Sistem Kode Promo**
   * Halaman katalog kupon eksklusif (`RAYNEW`, `COFFEETIME`, `HEBAT30`) dengan fitur **Salin Kode** sekali klik ke clipboard.
   * Input kode kupon di halaman checkout dengan pengecekan kelayakan minimum pembelanjaan dan kalkulasi diskon otomatis.

6. **Integrasi Multi-Metode Pembayaran**
   * **Ray Wallet**: Pengurangan saldo instan disertai pengumpulan poin loyalitas (1 poin per Rp1.000 belanja).
   * **Simulasi Kartu Kredit**: Form input kartu kredit interaktif dengan animasi visual mockup kartu yang berputar (flip) 180 derajat saat pengguna memfokuskan kursor pada pengisian kode CVV.
   * **QRIS**: Menampilkan visual QR Code dinamis dilengkapi timer hitung mundur kedaluwarsa selama 3 menit.

7. **Simulasi Barista & Riwayat Pemesanan**
   * Setelah pembayaran terkonfirmasi, pesanan dicatat ke Riwayat dengan status awal *"Dalam Antrean"*.
   * Sistem simulasi barista akan memperbarui status secara bertahap: *"Sedang Dibuat"* setelah 15 detik, dan *"Siap Diambil"* setelah 30 detik.

8. **Pembaruan Profil Pengguna**
   * Halaman Akun untuk melengkapi nomor telepon, alamat pengiriman kopi, serta memperbarui nama lengkap atau mengubah kata sandi.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

* **Struktur Utama**: HTML5 (Semantic Elements)
* **Desain & Gaya**: Vanilla CSS3 (Variabel CSS, Grid/Flexbox Layout, Backdrop-filter, Keyframes Animation)
* **Logika Aplikasi**: JavaScript Modern (ES6+, DOM Manipulation, Client-Side routing, Local Storage State API)
* **Aset Desain**: AI Generated Premium Graphics & Inline Krispi SVG Icons

---

## 🚀 Cara Menjalankan Aplikasi di Komputer Lokal

Karena aplikasi ini dibangun tanpa memerlukan kerangka kerja (framework) atau proses kompilasi yang kompleks, Anda bisa langsung menjalankannya dengan mudah:

### Opsi A: Menggunakan Server Statis Node.js (Disarankan)
1. Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).
2. Unduh atau clone repositori ini:
   ```bash
   git clone https://github.com/Rcs-WebDev/coffee-shop.git
   ```
3. Masuk ke direktori proyek:
   ```bash
   cd coffee-shop
   ```
4. Jalankan server lokal (misalnya menggunakan paket `http-server` dengan parameter tanpa-cache):
   ```bash
   npx http-server -p 8080 -c-1
   ```
5. Buka peramban Anda dan akses alamat:
   **[http://127.0.0.1:8080](http://127.0.0.1:8080)**

### Opsi B: Membuka Berkas Secara Langsung
Cukup klik ganda berkas `index.html` di dalam folder proyek untuk membukanya secara langsung di peramban web favorit Anda. (Catatan: Beberapa fitur API peramban seperti penyalinan clipboard otomatis memerlukan koneksi protokol HTTPS atau localhost/127.0.0.1, sehingga Opsi A lebih disarankan).

---

## 📂 Struktur Berkas Proyek

```text
coffee-shop/
├── index.html        # Kerangka struktur Single Page Application (SPA)
├── styles.css        # Gaya desain sistem, tata letak, dan animasi
├── app.js            # Kontroller logika, data produk, dan simulasi pembayaran
├── README.md         # Dokumentasi proyek (berkas ini)
└── assets/           # Berkas gambar visual
    ├── hero-banner.png  # Banner visual dashboard utama
    └── latte.png        # Gambar produk lokal kopi Caffè Latte
```

---
*Dibuat dengan dedikasi untuk penyuka kopi dan pengembangan web modern.*
