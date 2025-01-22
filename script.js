document.addEventListener('DOMContentLoaded', muatTugas);

const form = document.getElementById('FormTugas'); // Perbaikan di sini
const inputTugas = document.getElementById('InputTugas');
const listTugas = document.getElementById('ListTugas');

let tugas = [];
let idTugasEdit = null; // Menyimpan ID tugas yang sedang diedit

// Mengambil data dari JSON Server
function muatTugas() {
    axios.get("http://localhost:3000/tugas")
        .then((response) => {
            tugas = response.data; // Mengambil tugas dari JSON Server
            renderTugas();
        })
        .catch((error) => {
            console.error("Error:", error);
            listTugas.innerHTML = `<tr><td colspan="3">Gagal memuat data: ${error.message}</td></tr>`;
        });
}

// Menyimpan atau memperbarui tugas
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const tugasBaru = inputTugas.value;
    const tanggal = new Date().toLocaleDateString('id-ID'); // Mendapatkan tanggal saat ini

    const tugasBaruObj = { task: tugasBaru, date: tanggal }; // Menambahkan properti tanggal

    if (idTugasEdit) {
        // Jika ada ID tugas yang sedang diedit, lakukan update
        axios.put(`http://localhost:3000/tugas/${idTugasEdit}`, tugasBaruObj)
            .then(() => {
                inputTugas.value = ''; // Reset input
                idTugasEdit = null; // Reset ID tugas yang sedang diedit
                muatTugas(); // Muat ulang tugas
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        // Jika tidak ada ID tugas yang sedang diedit, lakukan penambahan
        axios.post("http://localhost:3000/tugas", tugasBaruObj)
            .then(() => {
                inputTugas.value = ''; // Reset input
                muatTugas(); // Muat ulang tugas
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
});

// Merender daftar tugas
function renderTugas() {
    listTugas.innerHTML = ''; // Pastikan listTugas tidak null
    tugas.forEach(item => {
        const tr = document.createElement('tr'); // Menggunakan elemen <tr>
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.task}</td>
            <td>
                <button class="edit-button" onclick="editTugas('${item.id}')">Edit</button>
                <button onclick="hapusTugas('${item.id}')">Hapus</button>
            </td>
        `;
        listTugas.appendChild(tr); // Menambahkan baris ke dalam tabel
    });
}

// Menghapus tugas dengan konfirmasi
function hapusTugas(id) {
    if (confirm("Anda yakin Tugas ini akan dihapus?")) { // Menampilkan konfirmasi
        axios.delete(`http://localhost:3000/tugas/${id}`)
            .then(() => {
                muatTugas(); // Muat ulang tugas
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        alert("Penghapusan tugas dibatalkan."); // Menampilkan pesan jika dibatalkan
    }
}

// Mengedit tugas
function editTugas(id) {
    const item = tugas.find(item => item.id === id);
    inputTugas.value = item.task; // Mengisi input dengan tugas yang akan diedit
    idTugasEdit = id; // Menyimpan ID tugas yang sedang diedit
}