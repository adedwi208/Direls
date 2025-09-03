document.addEventListener("DOMContentLoaded", () => {
  const userRaw = localStorage.getItem("user");
  if (!userRaw) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userRaw);

  // ✅ Tampilkan profil user
  const namaEl = document.getElementById("profilNama");
  const emailEl = document.getElementById("profilEmail");
  const nomorHpEl = document.getElementById("profilNomorHp");

  if (namaEl) namaEl.textContent = user.nama || "-";
  if (emailEl) emailEl.textContent = user.email || "-";
  if (nomorHpEl) nomorHpEl.textContent = user.no_hp || user.nohp || "-";

  // ✅ Ambil tombol riwayat
  const btnRiwayat = document.getElementById("btnRiwayat");
  const section = document.getElementById("riwayatSection");
  const list = document.getElementById("riwayatList");

  if (btnRiwayat) {
    btnRiwayat.addEventListener("click", async () => {
      // toggle tampil / sembunyi
      if (section.style.display === "block") {
        section.style.display = "none";
        return;
      }
      section.style.display = "block";

      try {
        const res = await fetch(`/api/pesanan/riwayat/${user.id}`);
        if (!res.ok) throw new Error("Gagal ambil data riwayat");

        const riwayat = await res.json();
        list.innerHTML = "";

        if (!riwayat || riwayat.length === 0) {
          list.innerHTML = "<p>Belum ada riwayat pesanan.</p>";
        } else {
          riwayat.forEach(item => {
            const li = document.createElement("li");
            li.classList.add("card");
            li.innerHTML = `
              <h3>${item.nama_produk} (x${item.jumlah})</h3>
              <p>Total: Rp${item.total_harga}</p>
              <p>Pembayaran: ${item.metode_pembayaran}</p>
              <p>Status: ${item.status}</p>
              <small>Tanggal: ${new Date(item.created_at).toLocaleString()}</small>
            `;
            list.appendChild(li);
          });
        }
      } catch (err) {
        console.error("❌ Error load riwayat:", err);
        list.innerHTML = "<p style='color:red;'>Gagal memuat riwayat pesanan.</p>";
      }
    });
  }
});
