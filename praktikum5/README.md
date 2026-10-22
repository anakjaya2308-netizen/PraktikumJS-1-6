# Praktikum 5: Aplikasi Daftar Tugas (To-Do List)

## Deskripsi & Tujuan
Praktikum ini bertujuan untuk menerapkan manipulasi Document Object Model (DOM) tingkat lanjut dalam membuat aplikasi interaktif pengelolaan tugas (*To-Do List*), meliputi:
1. Melakukan operasi CRUD (*Create, Read, Update, Delete*) data pada sisi klien secara dinamis tanpa memuat ulang (*reload*) halaman.
2. Membentuk dan menyusun elemen-elemen DOM baru secara terprogram menggunakan metode `document.createElement()` dan `appendChild()`.
3. Memastikan keamanan antarmuka dari celah kerentanan *Cross-Site Scripting* (XSS) dengan memprioritaskan pemakaian `textContent`.
4. Menyimpan dan membaca data lokal di peramban web secara persisten menggunakan Web Storage API (`localStorage`) serta serialisasi objek JSON (`JSON.stringify` dan `JSON.parse`).
5. Menggunakan array method modern (`forEach`, `filter`, `splice`, `push`) dalam pengelolaan status data aplikasi.

---

## Struktur Berkas
- **`index.html`**: Antarmuka pengguna yang menyediakan form penambahan tugas, wadah daftar tugas dinamis (`<ul id="daftar">`), serta ringkasan sisa tugas (`<p id="info">`).
- **`style.css`**: Lembar gaya visual CSS untuk tata letak kartu To-Do List, form masukan flexbox, gaya tombol tambah/hapus, dan efek teks tugas selesai tercoret (`li.selesai span`).
- **`script.js`**: Berkas logika JavaScript yang mengontrol alur data aplikasi, penambahan tugas, perubahan status selesai/belum, penghapusan tugas per item, serta sinkronisasi data ke `localStorage`.
- **`README.md`**: Dokumentasi praktikum berisi pembahasan kode terperinci, panduan pengujian fitur, dan pembahasan pertanyaan analisis.

---

## Pembahasan Kode

### 1. Antarmuka Formulir dan Kontainer (`index.html`)
- Menggunakan kontainer `<div class="todo">` sebagai pembungkus utama aplikasi.
- **Formulir Input**:
  ```html
  <form id="formTugas">
      <input type="text" id="inputTugas" placeholder="Tulis tugas baru...">
      <button type="submit">Tambah</button>
  </form>
  ```
  Formulir ini memanfaatkan event `submit` sehingga penambahan tugas dapat dipicu baik dengan mengklik tombol **Tambah** maupun dengan menekan tombol **Enter** pada keyboard saat berada di kolom input.
- **Daftar Tugas dan Info**:
  `<ul id="daftar"></ul>` merupakan wadah kosong yang akan diisi elemen baris `<li>` secara dinamis oleh JavaScript, disertai elemen paragraf `<p id="info"></p>` untuk menampilkan statistik jumlah tugas yang belum selesai.

### 2. Penataan Gaya CSS (`style.css`)
- **Tata Letak Flexbox**:
  - `form { display: flex; gap: 8px; }`: Mengatur input teks dan tombol berdampingan dengan jarak spasi seragam.
  - `li { display: flex; justify-content: space-between; align-items: center; ... }`: Memisahkan teks tugas di sisi kiri dan tombol "Hapus" di sisi kanan secara rapi.
- **Efek Coret Tugas Selesai**:
  ```css
  li.selesai span {
      text-decoration: line-through;
      color: #94a3b8;
  }
  ```
  Memberikan efek garis coret mendatar dan warna teks abu-abu redup ketika tugas ditandai selesai.

### 3. Logika Pemrograman JavaScript (`script.js`)

#### A. Inisialisasi dan Persistensi Data (`localStorage`)
```javascript
// Ambil data tersimpan dari localStorage, atau gunakan array kosong bila belum ada
let tugas = JSON.parse(localStorage.getItem("tugas")) || [];

function simpan() {
    localStorage.setItem("tugas", JSON.stringify(tugas));
}
```
- **`localStorage.getItem("tugas")`**: Mengambil string JSON yang tersimpan pada kunci `"tugas"`.
- **`JSON.parse(...) || []`**: Mendukung nilai bawaan (*fallback*); jika data belum pernah disimpan di browser (`null`), variabel `tugas` akan diinisialisasi sebagai array kosong `[]`.
- **`JSON.stringify(tugas)`**: Mengubah array of objects JavaScript menjadi format teks string JSON sebelum disimpan ke penyimpanan lokal browser.

#### B. Rendering Elemen DOM secara Dinamis (`tampilkan()`)
```javascript
function tampilkan() {
    daftar.innerHTML = ""; // kosongkan daftar lama

    tugas.forEach(function (item, index) {
        const li = document.createElement("li");
        if (item.selesai) li.classList.add("selesai");

        const teks = document.createElement("span");
        teks.textContent = item.judul; // aman dari serangan XSS

        const btnHapus = document.createElement("button");
        btnHapus.textContent = "Hapus";
        btnHapus.className = "hapus";

        // Klik teks: tandai selesai / belum selesai
        teks.addEventListener("click", function () {
            tugas[index].selesai = !tugas[index].selesai;
            simpan();
            tampilkan();
        });

        // Klik tombol: hapus satu tugas
        btnHapus.addEventListener("click", function () {
            tugas.splice(index, 1);
            simpan();
            tampilkan();
        });

        li.appendChild(teks);
        li.appendChild(btnHapus);
        daftar.appendChild(li);
    });

    const sisa = tugas.filter(t => !t.selesai).length;
    info.textContent = `${sisa} dari ${tugas.length} tugas belum selesai`;
}
```
- **`document.createElement()`**: Membuat elemen baru di memori browser tanpa menyentuh parser HTML secara langsung.
- **Proteksi Celah XSS**: Menggunakan `teks.textContent = item.judul` memastikan karakter HTML berbahaya (seperti `<script>alert(1)</script>`) dirender murni sebagai teks string biasa dan tidak akan dieksekusi.
- **Toggle Status Selesai**: Mengubah nilai boolean `tugas[index].selesai = !tugas[index].selesai`, lalu memanggil `simpan()` dan merender ulang antarmuka lewat `tampilkan()`.
- **Hapus Item (`splice`)**: Metode `tugas.splice(index, 1)` menghapus tepat satu elemen pada posisi indeks yang bersangkutan.
- **Akumulasi Statistik**: `tugas.filter(t => !t.selesai).length` menghitung jumlah tugas yang properti `selesai`-nya bernilai `false`.

#### C. Penanganan Penambahan Tugas Baru
```javascript
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const judul = input.value.trim();

    if (judul === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }

    tugas.push({ judul: judul, selesai: false });
    simpan();
    tampilkan();
    input.value = "";
    input.focus();
});
```
- **`event.preventDefault()`**: Menghentikan perilaku default formulir HTML agar halaman tidak melakukan refresh saat tombol submit ditekan.
- **`input.value.trim()`**: Menghapus spasi di awal dan akhir input untuk mencegah masuknya tugas berupa spasi kosong.
- **`tugas.push(...)`**: Menambahkan objek tugas baru ke array dengan status awal `selesai: false`.
- **Reset dan Fokus**: Mengosongkan isian kolom dengan `input.value = ""` dan mengembalikan kursor pengetikan ke kolom dengan `input.focus()`.
---

## Panduan Pengujian Fitur
1. **Menambah Tugas**: Masukkan judul tugas (misal: "Belajar JavaScript"), lalu tekan tombol **Tambah** atau tekan tombol `Enter`.
2. **Menandai Tugas Selesai**: Klik pada teks judul tugas. Teks akan diberi garis coret (*line-through*) dan warnanya berubah menjadi abu-abu redup.
3. **Menghapus Satu Tugas**: Klik tombol **Hapus** berwarna merah di sebelah kanan tugas.
4. **Uji Persistensi Data**: Tekan `F5` (*refresh* halaman) atau tutup dan buka kembali browser. Semua data tugas dan statusnya akan tetap tersimpan secara utuh.
5. **Melihat Data di Browser**:
   - Tekan `F12` (atau klik kanan → *Inspect*).
   - Buka tab **Application** (pada Google Chrome / Microsoft Edge).
   - Pada panel sebelah kiri, pilih **Storage** → **Local Storage** → pilih origin halaman Anda.
   - Anda akan melihat kunci (*key*) `"tugas"` dengan nilai (*value*) berupa string array JSON.

---

## Jawaban dan Penjelasan Pertanyaan Analisis

### Pertanyaan 1
> **Mengapa data perlu diubah dengan `JSON.stringify` sebelum disimpan ke `localStorage`?**

#### Penjelasan:
1. **Batasan Format Penyimpanan `localStorage`**:
   - `localStorage` dirancang oleh spesifikasi web browser hanya untuk menyimpan data dalam format **string teks primitif** (pasangan *key-value* bertipe string).
2. **Apa yang Terjadi Jika Tanpa `JSON.stringify`**:
   - Jika kita langsung memasukkan variabel objek atau array JavaScript, misalnya:
     ```javascript
     localStorage.setItem("tugas", tugas);
     ```
     JavaScript akan memanggil metode konversi bawaan `.toString()`. Hasil konversi array of objects tersebut ke string adalah:
     ```text
     "[object Object],[object Object]"
     ```
     Akibatnya, seluruh struktur data internal (seperti nama properti `judul`, status boolean `selesai`, dan nilainya) **hilang permanen** dan tidak dapat dibaca kembali.
3. **Peran `JSON.stringify()` dan `JSON.parse()`**:
   - `JSON.stringify(tugas)` melakukan proses **serialisasi**, yaitu mengubah struktur objek/array JavaScript menjadi string teks berformat JSON baku (contoh: `[{"judul":"Tugas 1","selesai":false}]`).
   - Saat halaman dibuka kembali, `JSON.parse(localStorage.getItem("tugas"))` melakukan proses **deserialisasi**, yaitu merekonstruksi kembali string teks JSON tersebut menjadi array objek JavaScript asli yang siap dimanipulasi.

---

### Pertanyaan 2
> **Apa fungsi `trim()` pada input?**

#### Penjelasan:
Metode `trim()` merupakan fungsi bawaan pada tipe data String di JavaScript yang berfungsi untuk **menghapus karakter spasi kosong (*whitespace*)** di awal dan di akhir string (termasuk spasi biasa, tab `\t`, dan karakter baris baru `\n`).

#### Fungsinya dalam Aplikasi:
1. **Mencegah Masukan Kosong Palsu (*Empty Whitespace Validation*)**:
   - Jika pengguna hanya mengetikkan spasi berkali-kali (misalnya `"   "`) lalu menekan tombol Tambah, properti `input.value` akan bernilai `"   "` (panjang karakter > 0).
   - Dengan `input.value.trim()`, string `"   "` dipangkas menjadi string kosong `""`.
   - Hal ini membuat pengecekan validasi:
     ```javascript
     if (judul === "") {
         alert("Tugas tidak boleh kosong!");
         return;
     }
     ```
     dapat mendeteksi dan menolak masukan kosong tersebut secara akurat.
2. **Kerapian Data Masukan (*Data Sanitization*)**:
   - Menghapus spasi yang tidak disengaja di awal atau akhir teks (misalnya masukan `"  Tugas Web  "` dirapikan menjadi `"Tugas Web"`).

---

### Pertanyaan 3
> **Tambahkan tombol Hapus Semua yang mengosongkan daftar setelah meminta `confirm()`.**

#### 1. Elemen HTML pada `index.html`:
```html
<button id="btnHapusSemua" class="hapus-semua">Hapus Semua</button>
```

#### 2. Kode JavaScript pada `script.js`:
```javascript
const btnHapusSemua = document.getElementById("btnHapusSemua");

if (btnHapusSemua) {
    btnHapusSemua.addEventListener("click", function () {
        // Cek jika daftar sudah kosong
        if (tugas.length === 0) {
            alert("Daftar tugas sudah kosong!");
            return;
        }

        // Tampilkan kotak dialog konfirmasi bawaan browser
        const yakin = confirm("Apakah Anda yakin ingin menghapus semua tugas?");
        if (yakin) {
            tugas = []; // Mengosongkan array tugas
            simpan();   // Simpan array kosong ke localStorage
            tampilkan(); // Perbarui tampilan antarmuka
        }
    });
}
```

#### Penjelasan:
- Fungsi `confirm("pesan")` menampilkan jendela dialog pop-up dengan opsi dua tombol: **OK** dan **Cancel/Batal**.
- Jika pengguna menekan tombol **OK**, fungsi mengembalikan nilai boolean `true`. Blok kode di dalam `if (yakin)` akan dieksekusi: array `tugas` dikosongkan (`tugas = []`), data `localStorage` diperbarui lewat `simpan()`, dan elemen antarmuka diperbarui secara instan lewat `tampilkan()`.
- Jika pengguna menekan tombol **Cancel**, fungsi mengembalikan nilai `false` dan proses penghapusan dibatalkan tanpa mengubah data apapun.
