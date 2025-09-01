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
});
