const form = document.getElementById("formTugas");
const input = document.getElementById("inputTugas");
const daftar = document.getElementById("daftar");
const info = document.getElementById("info");

// Ambil data tersimpan, atau array kosong bila belum ada
let tugas = JSON.parse(localStorage.getItem("tugas")) || [];

function simpan() {
    localStorage.setItem("tugas", JSON.stringify(tugas));
}

function tampilkan() {
    daftar.innerHTML = ""; // kosongkan daftar lama
    tugas.forEach(function (item, index) {
        const li = document.createElement("li");
        if (item.selesai) li.classList.add("selesai");

        const teks = document.createElement("span");
        teks.textContent = item.judul; // aman dari XSS

        const btnHapus = document.createElement("button");
        btnHapus.textContent = "Hapus";
        btnHapus.className = "hapus";

        // Klik teks: tandai selesai / belum
        teks.addEventListener("click", function () {
            tugas[index].selesai = !tugas[index].selesai;
            simpan();
            tampilkan();
        });

        // Klik tombol: hapus tugas
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

tampilkan();
