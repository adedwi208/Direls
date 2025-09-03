document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");

  // Awalnya hanya tampil login
  registerForm.style.display = "none";

  // Toggle ke form register
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  // Toggle ke form login
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // === Event submit login ===
  // === Event submit login ===
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Email & password wajib diisi!");
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login gagal!");
      return;
    }

    // simpan token, role, dan data user
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    // simpan user (supaya profil bisa baca)
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login berhasil!");
    if (data.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "produk.html";
    }
  } catch (err) {
    console.error(err);
    alert("Gagal terhubung ke server");
  }
});


  // === Event submit register ===
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nama = document.getElementById("registerName").value.trim();
    const nohp = document.getElementById("registerPhone").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!nama || !nohp || !email || !password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nohp, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Register gagal!");
        return;
      }

      alert("Register berhasil, silakan login!");
      registerForm.reset();
      registerForm.style.display = "none";
      loginForm.style.display = "block";
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke server");
    }
  });
});
