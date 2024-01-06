const logout = document.getElementById("logout");
if (!!logout) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("logout");
    fetch(window.location.origin + "/api/sessions/logout").then((res) => {
      console.log(res);
      if (res.ok || res.statusText === "Unauthorized")
        return (window.location = "/login");
    });
  });
}
