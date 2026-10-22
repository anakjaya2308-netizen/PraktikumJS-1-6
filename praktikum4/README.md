# Praktikum 4: Pengubah Tema dan Penghitung Klik

## Deskripsi & Tujuan
Praktikum ini bertujuan untuk memahami dan mempraktikkan manipulasi Document Object Model (DOM) tingkat lanjut dalam JavaScript, meliputi:
1. Mengubah tema antarmuka (gelap/terang) dengan memanipulasi *class* CSS menggunakan metode `classList.toggle` dan `classList.contains`.
2. Mengelola status nilai (*state*) menggunakan variabel numerik dan memperbarui teks tampilan secara dinamis melalui penanganan *event* klik (`click`).
3. Menerapkan perubahan gaya berbasis kondisi logika (memberi warna merah jika angka penghitung bernilai negatif).
4. Menggunakan teknik *event binding* massal menggunakan `querySelectorAll` dan atribut kustom HTML5 (`data-*` / *dataset*) untuk memodifikasi properti gaya CSS elemen secara dinamis.
5. Menangani event klik ganda (`dblclick`) pada elemen antarmuka.

---

## Struktur Berkas
- **`index.html`**: Halaman antarmuka yang memuat panel interaktif (tombol pengubah tema, penghitung klik, kotak warna dinamis, dan tombol-tombol pemilih warna).
- **`style.css`**: Lembar gaya visual CSS untuk tata letak panel, efek transisi halus (`transition: .3s`), gaya teks angka negatif (`.angka.negatif`), dimensi kotak, serta tema gelap (`body.gelap`).
- **`script.js`**: Berkas logika JavaScript yang mengatur perubahan tema, logika counter angka, manipulasi warna latar kotak, dan event klik ganda.
- **`README.md`**: Dokumentasi pembahasan kode serta jawaban dan analisis lengkap atas pertanyaan praktikum.

---

## Pembahasan Kode

### 1. Struktur Antarmuka (`index.html`)
- Menggunakan kontainer `<div class="panel">` untuk menyatukan semua kontrol interaktif.
- **Bagian Pengubah Tema**: Tombol `<button id="btnTema">Mode Gelap</button>` untuk beralih mode.
- **Bagian Penghitung Klik**: Elemen penampil angka `<p id="angka" class="angka">0</p>` dan tiga tombol pengontrol: `<button id="kurang">−</button>`, `<button id="reset">Reset</button>`, dan `<button id="tambah">+</button>`.
- **Bagian Ganti Warna Kotak**: Elemen visual `<div id="kotak" class="kotak"></div>` dan tiga tombol warna dasar dengan *class* bersama `class="warna"` serta atribut data kustom `data-warna`:
  ```html
  <button class="warna" data-warna="#ef4444">Merah</button>
  <button class="warna" data-warna="#22c55e">Hijau</button>
  <button class="warna" data-warna="#3b82f6">Biru</button>
  ```

### 2. Penataan Gaya CSS (`style.css`)
- **Transisi Halus**:
  `transition: .3s;` diterapkan pada `body` dan `.kotak` sehingga perubahan warna latar belakang berjalan mulus (*smooth transition*).
- **Gaya Mode Gelap**:
  ```css
  body.gelap { background: #0f172a; color: #f1f5f9; }
  ```
  Ketika kelas `.gelap` aktif pada elemen `<body>`, seluruh latar belakang halaman berubah menjadi biru gelap pekat dan teks berubah menjadi putih keabuan.
- **Gaya Angka Negatif**:
  ```css
  .angka.negatif { color: #ef4444; }
  ```
  Warna teks angka berubah menjadi merah cerah saat nilai penghitung bernilai di bawah nol.

### 3. Logika Pemrograman JavaScript (`script.js`)

#### A. Mode Gelap dengan `classList.toggle`
```javascript
const btnTema = document.getElementById("btnTema");
btnTema.addEventListener("click", function () {
    document.body.classList.toggle("gelap");
    const gelap = document.body.classList.contains("gelap");
    btnTema.textContent = gelap ? "Mode Terang" : "Mode Gelap";
});
```
- **`classList.toggle("gelap")`**: Menambahkan kelas `"gelap"` ke tag `<body>` jika belum ada, atau menghapusnya jika sudah ada (bekerja layaknya saklar lampu).
- **`classList.contains("gelap")`**: Memeriksa apakah kelas `"gelap"` sedang aktif pada elemen `<body>`, menghasilkan nilai boolean (`true`/`false`).
- **Ternary Operator**: Mengubah teks tombol secara dinamis; jika sedang aktif mode gelap, tombol menampilkan `"Mode Terang"`, dan sebaliknya.

#### B. Logika Penghitung Klik
```javascript
let hitung = 0;
const tampil = document.getElementById("angka");

function perbarui() {
    tampil.textContent = hitung;
    if (hitung < 0) {
        tampil.classList.add("negatif");
    } else {
        tampil.classList.remove("negatif");
    }
}

document.getElementById("tambah").addEventListener("click", () => { hitung++; perbarui(); });
document.getElementById("kurang").addEventListener("click", () => { hitung--; perbarui(); });
document.getElementById("reset").addEventListener("click", () => { hitung = 0; perbarui(); });
```
- Variabel state `hitung` bertambah (`hitung++`), berkurang (`hitung--`), atau di-reset (`hitung = 0`).
- Fungsi sentral `perbarui()` bertanggung jawab memperbarui tampilan angka di layar lewat `.textContent`.
- Jika `hitung < 0`, kelas `"negatif"` ditambahkan sehingga angka otomatis berubah warna menjadi merah. Jika nilai kembali $\ge 0$, kelas tersebut dihapus.

#### C. Ganti Warna dengan `querySelectorAll` dan Atribut `data-*`
```javascript
const kotak = document.getElementById("kotak");

document.querySelectorAll(".warna").forEach(function (tombol) {
    tombol.addEventListener("click", function () {
        kotak.style.backgroundColor = tombol.dataset.warna;
    });
});
```
- **`document.querySelectorAll(".warna")`**: Menyeleksi seluruh tombol pemilih warna yang memiliki kelas `.warna` dan mengembalikan koleksi `NodeList`.
- **`.forEach()`**: Memasang event listener `click` ke masing-masing tombol secara otomatis.
- **`tombol.dataset.warna`**: Membaca nilai kode warna heksadesimal yang tersimpan pada atribut `data-warna` masing-masing elemen HTML, lalu langsung menerapkannya ke properti `kotak.style.backgroundColor`.

---

## Jawaban dan Penjelasan Pertanyaan Analisis

### Pertanyaan 1
> **Apa kelebihan memakai `classList.toggle` dibanding mengubah style satu per satu?**

#### Penjelasan:
1. **Pemisahan Logika dan Tampilan (*Separation of Concerns*)**:
   - Dengan `classList.toggle`, seluruh aturan visual (warna latar, warna teks, bayangan, border, transisi) tetap berada rapi di berkas CSS (`style.css`), sementara JavaScript hanya bertanggung jawab menyalakan atau mematikan nama *class* (`gelap`).
   - Sebaliknya, jika mengubah style satu per satu via JS (`document.body.style.backgroundColor = ...`, `document.body.style.color = ...`), aturan visual akan bercampur ke dalam kode logika JavaScript sehingga sulit dirawat.
2. **Ringkas, Efisien, dan Mudah Dirawat (*Maintainability*)**:
   - Cukup **satu baris kode** (`document.body.classList.toggle("gelap")`) untuk mengubah puluhan properti gaya sekaligus.
   - Jika di kemudian hari ingin mengubah nuansa warna tema gelap, Anda hanya perlu mengubah file CSS tanpa perlu menyentuh file JavaScript.
3. **Logika Saklar Otomatis (*Built-in Toggle Logic*)**:
   - Metode `toggle()` secara otomatis memeriksa apakah kelas sudah ada atau belum: jika ada akan dihapus, jika belum ada akan ditambahkan. Hal ini menghemat kode karena kita tidak perlu menulis blok `if-else` pengecekan manual.
4. **Optimasi Performa Peramban (*Browser Performance*)**:
   - Mengubah beberapa properti `style` satu per satu dapat memicu proses *re-layout* (*reflow*) dan *repaint* berkali-kali pada browser. Mengganti nama *class* memungkinkan browser memproses pembaruan gaya secara serentak (*batch*).

---

### Pertanyaan 2
> **Tambahkan tombol warna keempat (kuning) tanpa mengubah kode JavaScript. Mengapa hal itu bisa dilakukan?**

#### 1. Kode yang Ditambahkan pada `index.html`:
```html
<button class="warna" data-warna="#eab308">Kuning</button>
```

#### 2. Mengapa Hal Ini Bisa Dilakukan Tanpa Mengubah JavaScript?
Hal ini bisa terjadi berkat kombinasi dua konsep modern pada JavaScript dan HTML5:
1. **Seleksi Dinamis dengan `document.querySelectorAll(".warna")`**:
   - Kode JavaScript tidak mengikat (*bind*) event listener pada ID tombol yang kaku (misalnya bukan `btnMerah`, `btnHijau`), melainkan menyeleksi **semua elemen** yang memiliki class `warna`.
   - Berapa pun jumlah tombol dengan class `warna` yang ada di HTML, fungsi `.forEach()` akan secara otomatis memasang event listener ke setiap tombol tersebut saat halaman dimuat.
2. **Pemanfaatan Atribut Kustom HTML5 (`data-*` / *Dataset*)**:
   - Nilai warna tidak ditulis secara *hardcoded* di dalam fungsi JavaScript, melainkan disimpan pada atribut HTML elemen tombol itu sendiri: `data-warna="#eab308"`.
   - Saat tombol diklik, JavaScript hanya membaca nilai yang disediakan tombol tersebut lewat properti `tombol.dataset.warna`.

> **Kesimpulan:** Arsitektur kode ini menerapkan prinsip *Data-Driven UI*. Kode JavaScript bersifat generik (*reusable*), sedangkan data spesifik (warna) didelegasikan sepenuhnya ke atribut HTML.

---

### Pertanyaan 3
> **Tambahkan event `dblclick` pada kotak agar warnanya kembali abu-abu.**

#### 1. Kode JavaScript yang Ditambahkan pada `script.js`:
```javascript
// Event dblclick untuk mengembalikan warna kotak menjadi abu-abu semula
kotak.addEventListener("dblclick", function () {
    kotak.style.backgroundColor = "#94a3b8";
});
```

#### 2. Penjelasan:
- **Event `dblclick` (*double click*)**: Merupakan event bawaan peramban yang terpicu ketika pengguna melakukan dua kali klik cepat secara berturut-turut pada elemen yang sama.
- Ketika event `dblclick` terjadi pada elemen `#kotak`, fungsi callback akan dijalankan dan menetapkan kembali nilai properti `backgroundColor` elemen kotak ke warna abu-abu default (`#94a3b8`), sesuai warna awal yang ditentukan pada CSS.
