document.addEventListener("DOMContentLoaded", () => {
  const userRaw = localStorage.getItem("user");
  if (!userRaw) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }

  let user;
  try { 
    user = JSON.parse(userRaw); 
  } catch (e) { 
    localStorage.removeItem("user"); 
    window.location.href = "login.html"; 
    return; 
  }

  if (user.role !== "admin") {
    alert("Anda tidak memiliki akses ke halaman admin!");
    window.location.href = "produk.html";
    return;
  }

  console.log("✅ Admin terverifikasi:", user.email || user.nama_lengkap);

  // helper: ambil token
  function getToken() {
    return localStorage.getItem("token") || "";
  }

  // Sidebar menu behaviour
  document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".menu-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // hide all sections
      document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));

      // show target
      const target = link.dataset.target;
      document.getElementById(target).classList.remove("hidden");

      // load data when section opened
      if (target === "riwayat") loadRiwayat();
      if (target === "pesanan") loadPesananMasuk();
      if (target === "pelanggan") loadPelanggan();
    });
  });

  // preview image sebelum upload
  const fotoInput = document.getElementById("foto");
  const previewWrap = document.getElementById("previewWrap");
  const previewImg = document.getElementById("previewImg");
  if (fotoInput) {
    fotoInput.addEventListener("change", () => {
      const f = fotoInput.files[0];
      if (!f) { 
        previewWrap.classList.add("hidden"); 
        previewImg.src = ""; 
        return; 
      }
      const url = URL.createObjectURL(f);
      previewImg.src = url;
      previewWrap.classList.remove("hidden");
    });
  }

  // Handle submit tambah barang
  const tambahForm = document.getElementById("tambahBarangForm");
  if (tambahForm) {
    tambahForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const kategori = document.getElementById("kategori").value;
      const nama = document.getElementById("nama").value.trim();
      const deskripsi = document.getElementById("deskripsi").value.trim();
      const harga = document.getElementById("harga").value;
      const foto = document.getElementById("foto").files[0];

      const fd = new FormData();
      fd.append("kategori", kategori);
      fd.append("nama", nama);
      fd.append("deskripsi", deskripsi);
      fd.append("harga", harga);
      if (foto) fd.append("foto", foto);

      // Logic for variants
      if (kategori === "produk") {
        const checked = [...document.querySelectorAll('input[name="varian"]:checked')].map(c => c.value);
        let varian = [];
        if (checked.includes("ukuran_baju")) ["S", "M", "L", "XL"].forEach(v => varian.push({ jenis: "ukuran_baju", nilai: v }));
        if (checked.includes("ukuran_sepatu")) ["39", "40", "41", "42", "43", "44"].forEach(v => varian.push({ jenis: "ukuran_sepatu", nilai: v }));
        if (checked.includes("warna")) ["Hitam", "Putih", "Merah", "Biru"].forEach(v => varian.push({ jenis: "warna", nilai: v }));
        
        fd.append("varian", JSON.stringify(varian));
      }

      try {
        const res = await fetch("/api/admin/produk", {
          method: "POST",
          headers: { "Authorization": `Bearer ${getToken()}` },
          body: fd,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal menambahkan barang.');

        alert("Barang berhasil ditambahkan!");
        tambahForm.reset();
      } catch (err) {
        console.error("Error:", err);
        alert("Gagal menambahkan barang: " + (err.message || ""));
      }
    });
  }

  // load riwayat pesanan
  async function loadRiwayat() {
    const wrap = document.getElementById("riwayatContainer");
    wrap.innerHTML = '<p class="small">Memuat riwayat pesanan...</p>';
    try {
      const res = await fetch("/api/admin/riwayat", { 
        headers: { Authorization: `Bearer ${getToken()}` } 
      });
      const rows = await res.json();
      if (!res.ok) throw new Error(rows.message || 'Gagal');
      if (!rows.length) { wrap.innerHTML = '<p class="small">Belum ada riwayat pesanan.</p>'; return; }

      let html = `<table><thead><tr><th>ID</th><th>Pelanggan</th><th>Produk</th><th>Jumlah</th><th>Total</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>`;
      rows.forEach(r => html += `<tr><td>${r.id}</td><td>${r.pelanggan}</td><td>${r.produk}</td><td>${r.jumlah}</td><td>${r.total}</td><td>${r.status}</td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`);
      html += `</tbody></table>`;
      wrap.innerHTML = html;
    } catch (err) {
      console.error(err);
      wrap.innerHTML = `<p class="small">Error: ${err.message || 'Gagal ambil data'}</p>`;
    }
  }

  // load pesanan masuk
  async function loadPesananMasuk() {
  const wrap = document.getElementById("pesananContainer");
  wrap.innerHTML = '<p class="small">Memuat pesanan masuk...</p>';
  try {
    const res = await fetch("/api/admin/pesanan-masuk", { 
      headers: { Authorization: `Bearer ${getToken()}` } 
    });
    const rows = await res.json();
    if (!res.ok) throw new Error(rows.message || 'Gagal');
    if (!rows.length) { wrap.innerHTML = '<p class="small">Tidak ada pesanan masuk.</p>'; return; }

    let html = `<table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>No HP</th>
          <th>Email</th>
          <th>Alamat</th>
          <th>Catatan</th>
          <th>Metode</th>
          <th>Total</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead><tbody>`;

    rows.forEach(r => {
      html += `<tr>
        <td>${r.id}</td>
        <td>${r.nama}</td>
        <td>${r.no_hp}</td>
        <td>${r.email}</td>
        <td>${r.alamat}</td>
        <td>${r.catatan || '-'}</td>
        <td>${r.metode_pembayaran}</td>
        <td>Rp ${parseFloat(r.total_harga).toLocaleString('id-ID')}</td>
        <td>${r.status}</td>
        <td><button data-id="${r.id}" class="prosesBtn">Proses</button></td>
      </tr>`;
    });

    html += `</tbody></table>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll('.prosesBtn').forEach(btn => btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('Proses pesanan #' + id + '?')) return;
      try {
        const res2 = await fetch(`/api/admin/pesanan/${id}/proses`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const d2 = await res2.json();
        if (!res2.ok) throw new Error(d2.message || 'Gagal proses');
        alert('Pesanan diproses');
        loadPesananMasuk();
      } catch (err) {
        alert('Error: ' + (err.message||''));
      }
    }));

  } catch (err) {
    console.error(err);
    wrap.innerHTML = `<p class="small">Error: ${err.message || 'Gagal ambil data'}</p>`;
  }
}

  // load pelanggan
  async function loadPelanggan() {
    const wrap = document.getElementById("pelangganContainer");
    wrap.innerHTML = '<p class="small">Memuat data pelanggan...</p>';
    try {
      const res = await fetch("/api/admin/pelanggan", { 
        headers: { Authorization: `Bearer ${getToken()}` } 
      });
      const rows = await res.json();
      if (!res.ok) throw new Error(rows.message || 'Gagal');
      if (!rows.length) { wrap.innerHTML = '<p class="small">Belum ada pelanggan.</p>'; return; }

      let html = `<table><thead><tr><th>ID</th><th>Nama</th><th>Email</th><th>No HP</th><th>Role</th><th>Terdaftar</th></tr></thead><tbody>`;
      rows.forEach(r => html += `<tr><td>${r.id}</td><td>${r.nama_lengkap}</td><td>${r.email}</td><td>${r.nomor_hp || '-'}</td><td>${r.role}</td><td>${new Date(r.created_at).toLocaleString()}</td></tr>`);
      html += `</tbody></table>`;
      wrap.innerHTML = html;
    } catch (err) {
      console.error(err);
      wrap.innerHTML = `<p class="small">Error: ${err.message || 'Gagal ambil data'}</p>`;
    }
  }

  // default: show dashboard
  document.getElementById('dashboard').classList.remove('hidden');
});
