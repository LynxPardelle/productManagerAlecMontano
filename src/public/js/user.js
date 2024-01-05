/* Get user from query id from api/users/user/:id and put the information in user div */
const userElement = document.getElementById("user");
const uid = new URLSearchParams(window.location.search).get("id");
let user = {};
const getUser = async () => {
  try {
    const res = await fetch(`/api/users/user/${uid}`);
    console.log(res);
    if (res.status === 404) throw new Error("User not found");
    const userData = await res.json();
    console.log(userData);
    user = userData.data;
    console.log(user);
    let template = `
      <div class="card mt-2">
        <div class="card-header">
          <h3 class="text-center">${user.first_name} ${user.last_name}</h3>
        </div>
        <div class="card-body">
          <p>Email: ${user.email}</p>
          <p>Id ${user.id}</p>
          <p>Role: ${user.role}</p>
          <p>Age: ${user.age}</p>
          <p>Last Connection: ${user.last_connection || Date.now()}</p>
          <button class="btn btn-dark btn-block" id="edit-role-${
            user._id
          }">Edit Role</button>
          <button class="btn btn-danger btn-block" id="delete-${
            user._id
          }">Delete</button>
        </div>
      </div>
      ${
        !!user.documents && user.documents.length > 0
          ? `<h3>Documents</h3>${user.documents.map((document) => {
              return `<div class="card mt-2">
          <div class="card-header">
            <img src="${document.reference}" alt="${document.name}" />
            <h3 class="text-center">${document.name}</h3>
          </div>
          <div class="card-body">
            <p>Reference: ${document.reference}</p>
          </div>
        </div>`;
            })}`
          : ""
      }
      `;
    userElement.innerHTML = template;
    const EditRoleButton = document.getElementById("edit-role-" + user._id);
    EditRoleButton.addEventListener("click", async () => {
      try {
        const res = await fetch(`/api/users/premium/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: "premium" }),
        });
        console.log(res);
        if (res.status === 404) throw new Error("User not found");
        const userUpdated = await res.json();
        console.log(userUpdated);
        window.location.href = "/users";
      } catch (error) {
        console.log(error);
        userElement.innerHTML += `<div class="alert alert-danger" role="alert">
          ${error.message}
        </div>`;
      }
    });
    const DeleteButton = document.getElementById("delete-" + user._id);
    DeleteButton.addEventListener("click", async () => {
      try {
        const res = await fetch(`/api/users/user/${user._id}`, {
          method: "DELETE",
        });
        console.log(res);
        if (res.status === 404) throw new Error("User not found");
        const userDeleted = await res.json();
        console.log(userDeleted);
        window.location.href = "/users";
      } catch (error) {
        console.log(error);
        userElement.innerHTML += `<div class="alert alert-danger" role="alert">
          ${error.message}
        </div>`;
      }
    });
  } catch (error) {
    console.log(error);
    userElement.innerHTML = `<div class="alert alert-danger" role="alert">
      ${error.message}
    </div>`;
  }
};
getUser();
