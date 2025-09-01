document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const produkList = document.querySelector("#produk-section .produk-list");

  const tabProduk = document.getElementById("tab-produk");
  const tabKemasan = document.getElementById("tab-kemasan");
  const produkSection = document.getElementById("produk-section");
  const kemasanSection = document.getElementById("kemasan-section");

  // Fungsi render produk
async function renderProduk() {
  const produkContainer = document.querySelector("#produk-section .produk-list");
  const kemasanContainer = document.querySelector("#kemasan-section .produk-list");

  produkContainer.innerHTML = "<p>Memuat produk...</p>";
  kemasanContainer.innerHTML = "<p>Memuat kemasan...</p>";

  try {
    const res = await fetch("/api/produk", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Gagal mengambil produk");
    const produkData = await res.json();

    // Kosongkan dulu
    produkContainer.innerHTML = "";
    kemasanContainer.innerHTML = "";

    if (produkData.length === 0) {
      produkContainer.innerHTML = "<p>Tidak ada produk tersedia.</p>";
      kemasanContainer.innerHTML = "<p>Tidak ada kemasan tersedia.</p>";
      return;
    }

    produkData.forEach(p => {
      const cardHTML = `
        <div class="produk-card" id="produk-${p.id}">
          <img src="${p.foto ? '/uploads/' + p.foto : '/img/no-image.png'}" width="120">
          <h3>${p.nama}</h3>
          <p>Kategori: ${p.kategori}</p>
          <p>Harga: Rp${parseFloat(p.harga).toLocaleString()}</p>
          <label>Jumlah: <input type="number" id="qty-${p.id}" value="1" min="1"></label>
          <button class="add-to-cart-btn" data-id="${p.id}">Tambah ke Keranjang</button>
        </div>
      `;

      if (p.kategori.toLowerCase() === "kemasan") {
        kemasanContainer.innerHTML += cardHTML;
      } else {
        produkContainer.innerHTML += cardHTML;
      }
    });

  } catch(err) {
    console.error(err);
    produkContainer.innerHTML = "<p>Gagal memuat produk. Silakan coba lagi nanti.</p>";
    kemasanContainer.innerHTML = "<p>Gagal memuat kemasan. Silakan coba lagi nanti.</p>";
  }
}


  // Event listener tombol tambah ke keranjang
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const produkId = e.target.dataset.id;
      const qtyEl = document.getElementById(`qty-${produkId}`);
      const kemasanEl = document.getElementById(`kemasan-${produkId}`);

      const data = {
        user_id: user.id,
        produk_id: parseInt(produkId),
        jumlah: qtyEl ? parseInt(qtyEl.value) : 1,
        kemasan: kemasanEl ? kemasanEl.value : null
      };

      console.log("Data dikirim ke backend:", data);

      try {
        const res = await fetch("/api/keranjang", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Gagal tambah keranjang");

        alert("Berhasil ditambahkan ke keranjang!");
      } catch(err) {
        console.error(err);
        alert("Gagal tambah keranjang");
      }
    }
  });

  // Tab produk
  tabProduk.addEventListener("click", (e) => {
    e.preventDefault();
    tabProduk.classList.add("active");
    tabKemasan.classList.remove("active");
    produkSection.classList.remove("hidden");
    kemasanSection.classList.add("hidden");
    renderProduk();
  });

  // Tab kemasan
  tabKemasan.addEventListener("click", (e) => {
    e.preventDefault();
    tabKemasan.classList.add("active");
    tabProduk.classList.remove("active");
    kemasanSection.classList.remove("hidden");
    produkSection.classList.add("hidden");
    // Bisa ditambahkan fungsi render kemasan nanti
  });

  // Render produk pertama kali
  renderProduk();
});
