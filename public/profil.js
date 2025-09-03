document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    const namaEl = document.getElementById("profilNama");
    const emailEl = document.getElementById("profilEmail");
    const nomorHpEl = document.getElementById("profilNomorHp");

    // ✅ sesuaikan dengan field yang ada di database
    if (namaEl) {
        namaEl.textContent = user.nama;
    }
    if (emailEl) {
        emailEl.textContent = user.email;
    }
    if (nomorHpEl) {
        nomorHpEl.textContent = user.nohp;
    }


    document.addEventListener("DOMContentLoaded", async () => {
  const userRaw = localStorage.getItem("user");
  if (!userRaw) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userRaw);

  // Tampilkan profil user
  document.getElementById("profilNama").textContent = user.nama || "-";
  document.getElementById("profilEmail").textContent = user.email || "-";
  document.getElementById("profilNomorHp").textContent = user.no_hp || "-";

  // Ambil riwayat pesanan
  try {
    const res = await fetch(`/api/pesanan/riwayat/${user.id}`);
    const riwayat = await res.json();

    const list = document.getElementById("riwayatList");
    list.innerHTML = "";

    if (riwayat.length === 0) {
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
    console.error("❌ Gagal load riwayat user:", err);
  }
});

});
