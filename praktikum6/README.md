# Praktikum 6: Validasi Formulir Pendaftaran

## Deskripsi & Tujuan
Praktikum ini bertujuan untuk memahami dan mempraktikkan proses validasi formulir interaktif di sisi klien (*client-side form validation*) sebelum data dikirimkan, meliputi:
1. Menangani event pengiriman formulir (`submit`) dan mencegah aksi bawaan peramban menggunakan metode `event.preventDefault()`.
2. Menonaktifkan validasi bawaan HTML5 menggunakan atribut `novalidate` untuk membangun sistem validasi mandiri yang terkustomisasi dan konsisten.
3. Menerapkan pengujian pola teks menggunakan ekspresi reguler (*Regular Expressions* / RegEx) untuk validasi format digit angka (NIM) dan alamat email.
4. Memberikan umpan balik visual (*visual feedback*) seketika kepada pengguna melalui manipulasi kelas CSS border (`input.error` dan `input.valid`) serta penyisipan pesan kesalahan spesifik per kolom masukan via `nextElementSibling`.
5. Memahami pentingnya arsitektur keamanan ganda (*defense-in-depth*) antara validasi sisi klien dan sisi server.

---

## Struktur Berkas
- **`index.html`**: Halaman antarmuka yang memuat formulir pendaftaran UKM Programming (`#formDaftar`) lengkap dengan label, input, penampung pesan kesalahan (`<small class="pesan">`), tombol submit, dan wadah status pendaftaran sukses (`#sukses`).
- **`style.css`**: Lembar gaya visual CSS untuk tata letak kartu formulir, styling kolom input, visual border merah untuk kesalahan (`input.error`), visual border hijau untuk masukan valid (`input.valid`), teks pesan error, dan tombol pendaftaran.
- **`script.js`**: Berkas logika JavaScript yang mengelola fungsi pembantu `setError` dan `setValid`, logika evaluasi `validasi()`, verifikasi regex, dan penanganan event `submit`.
- **`README.md`**: Dokumentasi praktikum berisi pembahasan kode terperinci, tabel hasil uji skenario, dan pembahasan pertanyaan analisis.

---

## Pembahasan Kode

### 1. Antarmuka Formulir (`index.html`)
- **Atribut `novalidate`**:
  ```html
  <form id="formDaftar" novalidate>
  ```
  Atribut boolean ini menginstruksikan browser agar tidak menjalankan validasi bawaan HTML5 (seperti tooltip bawaan peramban ketika email tidak valid), sehingga logika validasi JavaScript kita dapat berjalan secara penuh dan konsisten.
- **Struktur Kolom Berpasangan**:
  Setiap kolom formulir dirancang memiliki struktur hierarki bersaudara (*sibling*):
  ```html
  <label for="nama">Nama Lengkap</label>
  <input type="text" id="nama">
  <small class="pesan"></small>
  ```
  Elemen `<small class="pesan">` diletakkan tepat setelah elemen `<input>`. Struktur ini memudahkan JavaScript menemukan tempat meletakkan pesan kesalahan menggunakan properti navigasi DOM `input.nextElementSibling`.

### 2. Penataan Gaya Visual CSS (`style.css`)
- **Indikator Visual Kesalahan dan Keberhasilan**:
  ```css
  input.error { border-color: #ef4444; } /* Border merah saat tidak valid */
  input.valid { border-color: #22c55e; } /* Border hijau saat valid */
  ```
  Perubahan warna border memberikan umpan balik visual yang langsung dipahami pengguna.
- **Wadah Pesan Kesalahan**:
  ```css
  .pesan { color: #ef4444; min-height: 16px; display: block; }
  ```
  Penetapan `min-height: 16px;` memastikan tata letak form tidak bergeser atau meloncat-loncat (*layout shift*) ketika pesan kesalahan muncul atau hilang.

### 3. Logika Pemrograman JavaScript (`script.js`)

#### A. Fungsi Pembantu `setError()` dan `setValid()`
```javascript
function setError(input, pesan) {
    input.classList.add("error");
    input.classList.remove("valid");
    input.nextElementSibling.textContent = pesan;
}

function setValid(input) {
    input.classList.add("valid");
    input.classList.remove("error");
    input.nextElementSibling.textContent = "";
}
```
- **`setError(input, pesan)`**:
  - Menambahkan kelas `"error"` untuk mewarnai border input menjadi merah.
  - Menghapus kelas `"valid"`.
  - Mengisi elemen `<small class="pesan">` yang berada tepat di samping input (`nextElementSibling`) dengan pesan kesalahan teks.
- **`setValid(input)`**:
  - Menambahkan kelas `"valid"` untuk mewarnai border input menjadi hijau.
  - Menghapus kelas `"error"`.
  - Mengosongkan teks pesan kesalahan (`textContent = ""`).

#### B. Logika Validasi Terpusat (`validasi()`)
```javascript
function validasi() {
    let benar = true;
    const nama = document.getElementById("nama");
    const nim = document.getElementById("nim");
    const email = document.getElementById("email");
    const sandi = document.getElementById("sandi");
    const ulang = document.getElementById("ulang");

    // 1. Nama: wajib, minimal 3 huruf
    if (nama.value.trim().length < 3) {
        setError(nama, "Nama minimal 3 karakter");
        benar = false;
    } else setValid(nama);

    // 2. NIM: harus angka 8-12 digit
    if (!/^[0-9]{8,12}$/.test(nim.value.trim())) {
        setError(nim, "NIM harus berupa 8-12 digit angka");
        benar = false;
    } else setValid(nim);

    // 3. Email: format sederhana nama@domain.ekstensi
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError(email, "Format email tidak valid");
        benar = false;
    } else setValid(email);

    // 4. Kata sandi: minimal 8 karakter dan mengandung angka
    if (sandi.value.length < 8 || !/[0-9]/.test(sandi.value)) {
        setError(sandi, "Minimal 8 karakter dan mengandung angka");
        benar = false;
    } else setValid(sandi);

    // 5. Konfirmasi kata sandi
    if (ulang.value === "" || ulang.value !== sandi.value) {
        setError(ulang, "Kata sandi tidak sama");
        benar = false;
    } else setValid(ulang);

    return benar;
}
```
- Variabel penanda `benar` diinisialisasi bernilai `true`. Jika ada salah satu kolom yang melanggar aturan, variabel diubah menjadi `false`.
- **Ekspresi Reguler (RegEx)**:
  - `/^[0-9]{8,12}$/`: Memastikan masukan hanya berisi digit angka dengan panjang 8 hingga 12 karakter.
  - `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`: Memeriksa adanya karakter sebelum tanda `@`, adanya domain setelah `@`, diikuti tanda titik `.`, dan nama ekstensi domain.
  - `/[0-9]/.test(sandi.value)`: Menguji apakah kata sandi mengandung minimal satu digit angka.
- **Konfirmasi Kata Sandi**: Memastikan kolom ulangi kata sandi tidak kosong dan memiliki nilai yang identik dengan kolom kata sandi.

#### C. Penanganan Event Submit
```javascript
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const sukses = document.getElementById("sukses");

    if (validasi()) {
        const nama = document.getElementById("nama").value.trim();
        sukses.textContent = `Terima kasih, ${nama}. Pendaftaran berhasil!`;
        form.reset();
        form.querySelectorAll("input").forEach(i => i.classList.remove("valid"));
    } else {
        sukses.textContent = "";
    }
});
```
- **`event.preventDefault()`**: Menghentikan reload halaman otomatis saat form dikirim.
- Jika fungsi `validasi()` mengembalikan `true`:
  - Menampilkan pesan konfirmasi sukses berwarna hijau.
  - Mengosongkan kembali semua isian form menggunakan metode bawaan `form.reset()`.
  - Membersihkan kelas visual `.valid` dari semua elemen input.
- Jika `validasi()` mengembalikan `false`, pesan sukses dikosongkan.

---

## Tabel Hasil Uji Skenario Formulir

Berdasarkan langkah pengujian yang ditentukan di modul praktikum:

| Skenario | Isian Pengujian | Hasil yang Diharapkan & Diperoleh |
| :--- | :--- | :--- |
| **Semua kosong** | *(Semua kolom dibiarkan kosong)* | Lima pesan kesalahan muncul secara bersamaan, semua kolom masukan bergaris tepi merah. |
| **NIM berisi huruf** | `2025abc1` | Muncul pesan kesalahan *"NIM harus berupa 8-12 digit angka"* pada kolom NIM. |
| **Email tanpa @** | `budi.gmail.com` | Muncul pesan kesalahan *"Format email tidak valid"* pada kolom Email. |
| **Sandi tanpa angka** | `rahasiaku` | Muncul pesan kesalahan *"Minimal 8 karakter dan mengandung angka"* pada kolom Kata Sandi. |
| **Semua benar** | Data valid sesuai seluruh kriteria | Muncul pesan sukses berwarna hijau *"Terima kasih, [Nama]. Pendaftaran berhasil!"*, form dikosongkan otomatis. |

---

## Jawaban dan Penjelasan Pertanyaan Analisis

### Pertanyaan 1
> **Apa fungsi atribut `novalidate` pada tag form? Apa yang terjadi bila dihapus?**

#### 1. Fungsi Atribut `novalidate`:
- Berfungsi untuk **menonaktifkan validasi bawaan HTML5 (*native browser constraint validation*)**.
- Dengan menyematkan `novalidate`, browser tidak akan menampilkan balon pop-up (*tooltip*) standar bawaan sistem operasi/peramban, melainkan menyerahkan kendali validasi sepenuhnya kepada kode JavaScript yang kita rancang.
- Hal ini menjamin pengalaman pengguna (*user experience*) dan tampilan pesan kesalahan (seperti border merah dan teks error di bawah kolom) tampil seragam dan konsisten di seluruh jenis peramban (Chrome, Firefox, Safari, Edge).

#### 2. Apa yang Terjadi Bila Dihapus:
- Jika atribut `novalidate` dihapus, peramban akan menjalankan sistem validasi default-nya terlebih dahulu sebelum event listener JavaScript sempat mengevaluasi seluruh form.
- Misalnya, pada elemen `<input type="email">`, jika pengguna mengetik `budi.gmail.com` tanpa karakter `@`, peramban akan memblokir pengiriman formulir dan memunculkan pop-up tooltip bawaan browser (misal: *"Please include an '@' in the email address"*).
- Akibatnya, validasi JavaScript kustom dan pesan teks kesalahan di bawah kolom input tidak akan sempat ditampilkan.

---

### Pertanyaan 2
> **Jelaskan arti pola `/^[0-9]{8,12}$/` .**

Pola tersebut merupakan sebuah ekspresi reguler (*Regular Expression* / RegEx) dengan rincian komponen sebagai berikut:

- **`/ ... /`** : Karakter pembatas (*delimiters*) yang menandai awal dan akhir sebuah pola RegEx dalam JavaScript.
- **`^`** (*Caret*) : Penanda awal string (*start of line / string anchor*). Memastikan pencocokan dimulai tepat dari karakter pertama input.
- **`[0-9]`** : Himpunan karakter (*character set*) yang hanya mengizinkan digit angka dari 0 sampai 9 (setara dengan `\d`).
- **`{8,12}`** : Kuantifier rentang (*range quantifier*), yang menetapkan bahwa karakter angka sebelumnya harus berulang minimal 8 kali dan maksimal 12 kali.
- **`$`** (*Dollar*) : Penanda akhir string (*end of line / string anchor*). Memastikan tidak ada karakter lain setelah deretan angka tersebut.

> **Kesimpulan:** Pola ini memvalidasi bahwa masukan harus **murni berupa angka (0–9) dengan panjang tepat antara 8 hingga 12 digit**, tanpa boleh disisipi huruf, spasi, tanda minus, atau simbol lainnya.

---

### Pertanyaan 3
> **Validasi di browser dapat dilewati pengguna. Mengapa server tetap harus melakukan validasi ulang?**

#### Penjelasan:
Validasi pada peramban web (*client-side validation*) tidak boleh dijadikan satu-satunya benteng keamanan sistem. Server wajib melakukan validasi ulang (*server-side validation*) karena alasan-alasan krusial berikut:

1. **Lingkungan Browser Berada di Luar Kendali Pengembang (*Untrusted Client*)**:
   - Skrip JavaScript berjalan di perangkat komputer milik pengguna. Pengguna dapat dengan sangat mudah menonaktifkan JavaScript pada pengaturan browser mereka.
   - Pengguna teknis dapat menggunakan menu *Inspect Element* / *Developer Tools* (F12) untuk menghapus fungsi validasi, mengubah tipe input, atau menghapus atribut batasan form.
2. **Pengiriman Permintaan HTTP Langsung (*Direct HTTP Requests*)**:
   - Pengguna atau penyerang (*attacker*) tidak harus membuka halaman web melalui antarmuka browser. Mereka dapat mengirimkan data mentah langsung ke endpoint server menggunakan alat seperti **Postman, cURL, ekstensi peramban, atau skrip otomatis/bot**. Dalam skenario ini, seluruh validasi JavaScript di peramban dilewati 100%.
3. **Keamanan Sistem dan Basis Data (*Security Defense*)**:
   - Validasi di sisi server merupakan benteng pertahanan mutlak terhadap serangan siber berbahaya, seperti **SQL Injection (SQLi)**, **Cross-Site Scripting (XSS)**, dan **Command Injection**.
4. **Pembedaan Peran dan Tanggung Jawab**:
   - **Validasi Sisi Klien (*Client-Side*)**: Bertujuan untuk **Pengalaman Pengguna (*User Experience* / UX)**, memberikan umpan balik yang cepat dan interaktif secara lokal tanpa harus menunggu waktu respon jaringan (*network latency*).
   - **Validasi Sisi Server (*Server-Side*)**: Bertujuan untuk **Keamanan (*Security*) dan Integritas Data**, memastikan hanya data yang benar-benar sah dan aman yang disimpan ke dalam basis data aplikasi.
