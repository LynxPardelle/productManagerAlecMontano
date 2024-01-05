const usersElement = document.getElementById("users");
const getUsers = async () => {
  try {
    const res = await fetch("/api/users/");
    console.log(res);
    if (res.status === 404) throw new Error("Users not found");
    const users = await res.json();
    console.log(users);
    let template = "";
    users.data.forEach((user) => {
      template += `
      <div class="card mt-2">
        <div class="card-header">
          <h3 class="text-center">${user.name}</h3>
        </div>
        <div class="card-body">
          <p>${user.email}</p>
          <p>${user.role}</p>
          <a href="/user/?id=${user.id}" class="btn btn-dark btn-block" _id="${user._id}">Detail View</a>
        </div>
      </div>
      `;
    });
    usersElement.innerHTML = template;
  } catch (error) {
    console.log(error);
    usersElement.innerHTML = `<div class="alert alert-danger" role="alert">
      ${error.message}
    </div>`;
  }
};
getUsers();
