document.addEventListener("DOMContentLoaded", () => {
    const keranjangList = document.getElementById("keranjangList");
    const totalHargaEl = document.getElementById("totalHarga");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const modal = document.getElementById("checkoutModal");
    const closeModal = document.querySelector(".modal .close");
    const checkoutForm = document.getElementById("checkoutForm");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    let totalHarga = 0;

    async function loadKeranjang() {
        const user = JSON.parse(localStorage.getItem("user"));
        totalHarga = 0;

        try {
            const res = await fetch(`/api/keranjang?user_id=${user.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Gagal mengambil data keranjang");

            const cartItems = await res.json();
            keranjangList.innerHTML = "";

            if (cartItems.length === 0) {
                keranjangList.innerHTML = "<p style='text-align:center;'>Keranjang kosong</p>";
                totalHargaEl.textContent = "Rp0";
                return;
            }

            cartItems.forEach(item => {
                const jumlah = parseInt(item.jumlah) || 0;
                const harga = parseFloat(item.harga) || 0;
                const subtotal = jumlah * harga;
                totalHarga += subtotal;

                keranjangList.innerHTML += `
                    <div class="item">
                        <img src="${item.foto ? '/uploads/' + item.foto : '/img/no-image.png'}" width="80">
                        <h3>${item.nama_produk}</h3>
                        <p>Kategori: ${item.kategori}</p>
                        <p>Harga: Rp${harga.toLocaleString()}</p>
                        <p>Jumlah: ${jumlah}</p>
                        <p>Subtotal: Rp${subtotal.toLocaleString()}</p>
                        <button class="hapus-btn" data-id="${item.id}">Hapus</button>
                    </div>
                `;
            });

            totalHargaEl.textContent = "Rp" + totalHarga.toLocaleString();

            // Tombol hapus
            document.querySelectorAll(".hapus-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.dataset.id;
                    if (!confirm("Yakin ingin menghapus barang ini?")) return;

                    try {
                        const res = await fetch(`/api/keranjang/${id}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (!res.ok) throw new Error("Gagal menghapus");
                        loadKeranjang();
                    } catch (err) {
                        alert("Gagal menghapus barang");
                    }
                });
            });

        } catch (err) {
            console.error(err);
            keranjangList.innerHTML = "<p style='text-align:center;'>Gagal memuat keranjang</p>";
        }
    }

    // Checkout modal
    checkoutBtn.addEventListener("click", () => {
        if (totalHarga <= 0) {
            alert("Keranjang kosong, tidak bisa checkout!");
            return;
        }
        checkoutForm.reset();
        checkoutForm.order_id.value = 'ORD' + Date.now();
        modal.style.display = "block";
    });

    if (closeModal) {
        closeModal.addEventListener("click", () => modal.style.display = "none");
    }
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    loadKeranjang();

    // Submit form checkout
checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user")); // ✅ tambahkan ini
    const formData = new FormData(checkoutForm);
    const data = Object.fromEntries(formData.entries());

    // Tambahkan field wajib backend
    data.user_id = user.id;
    data.total_amount = totalHarga;
    data.payment_method = data.payment_method || "COD"; // default jika kosong


    console.log("Token yg dikirim:", token);
    console.log("Data checkout:", data);

    try {
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal checkout");

        // tampilkan info checkout
        document.getElementById('resiText').textContent = result.resi;
        document.getElementById('metodeText').textContent = result.payment_method;
        const adminLink = document.getElementById('adminPhoneLink');
        adminLink.textContent = result.admin_no;
        adminLink.href = `https://wa.me/${result.admin_no.replace(/\D/g,'')}`;

        document.getElementById('checkoutResult').style.display = 'block';
        modal.style.display = "none";

        // refresh keranjang
        loadKeranjang();
        alert("Pesanan berhasil! Resi: " + result.resi + "\nHubungi admin: " + result.admin_no);

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat checkout: " + err.message);
    }
});


});
