// 1. Deklarasi variabel
const nama = "A.Candra Augwancha Msh";
const nim = "05301425104";
let semester = 3;
const aktif = true;
const hobi = ["Modifikasi Motor", "Badminton", "Speeding"];

// 2. Output ke Console
console.log("Nama:", nama);
console.log("Tipe data semester:", typeof semester);
console.log("Tipe data aktif:", typeof aktif);
console.log("Hobi pertama:", hobi[0]);

// 3. Output ke halaman
document.getElementById("nama").textContent = nama;
document.getElementById("detail").innerHTML = `
    NIM: ${nim}<br>
    Semester: ${semester}<br>
    Status: ${aktif ? "Aktif" : "Cuti"}<br>
    Hobi: ${hobi.join(", ")}
`;
