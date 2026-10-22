const form = document.getElementById("formDaftar");

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

function validasi() {
    let benar = true;
    const nama = document.getElementById("nama");
    const nim = document.getElementById("nim");
    const email = document.getElementById("email");
    const sandi = document.getElementById("sandi");
    const ulang = document.getElementById("ulang");

    // Nama: wajib, minimal 3 huruf
    if (nama.value.trim().length < 3) {
        setError(nama, "Nama minimal 3 karakter");
        benar = false;
    } else setValid(nama);

    // NIM: harus angka 8-12 digit
    if (!/^[0-9]{8,12}$/.test(nim.value.trim())) {
        setError(nim, "NIM harus berupa 8-12 digit angka");
        benar = false;
    } else setValid(nim);

    // Email: format sederhana nama@domain.ekstensi
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError(email, "Format email tidak valid");
        benar = false;
    } else setValid(email);

    // Kata sandi: minimal 8 karakter dan mengandung angka
    if (sandi.value.length < 8 || !/[0-9]/.test(sandi.value)) {
        setError(sandi, "Minimal 8 karakter dan mengandung angka");
        benar = false;
    } else setValid(sandi);

    // Konfirmasi kata sandi
    if (ulang.value === "" || ulang.value !== sandi.value) {
        setError(ulang, "Kata sandi tidak sama");
        benar = false;
    } else setValid(ulang);

    return benar;
}

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
