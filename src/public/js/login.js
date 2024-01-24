async function onSubmit() {
  const formMessage = document.getElementById("form-message");
  try {
    console.log("onsubmit");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) throw new Error("Email and password are required");
    const user = { email, password };
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    if (data.status === "error") throw new Error(data.message);
    window.location.href = "/products";
  } catch (error) {
    console.error(error);
    if (formMessage) {
      formMessage.innerHTML = `
        <p class="text-danger" >
        Error al iniciar sesión
        </p>
        <p class="text-danger" >
        ${error.message}
        </p>
        `;
    }
  }
}
