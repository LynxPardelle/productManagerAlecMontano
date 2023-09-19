const logout = document.getElementById("logout");
if (!!logout) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("logout");
    fetch("http://localhost:8080/api/sessions/logout").then((res) => {
      console.log(res);
      if (res.ok) return (window.location = "/login");
    });
  });
}
