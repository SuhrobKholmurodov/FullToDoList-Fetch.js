let api = " http://localhost:3000/data";
let tbody = document.querySelector(".box");
let addNewUser = document.querySelector(".addNewUser");
let form = document.querySelector(".form");
let modal = document.querySelector(".modal");
let close = document.querySelector(".close");
let deleteModal = document.querySelector(".deleteModal");
let yes = document.querySelector(".yes");
let no = document.querySelector(".no");
let showInfo = document.querySelector(".showInfo");
let information = document.querySelector(".information");
let closeInfo = document.querySelector(".closeInfo");
let closeEdit = document.querySelector(".closeEdit");

// SELECT BY STATUS
let selectForStatus = document.querySelector(".selectForStatus");
selectForStatus.oninput = async () => {
  try {
    let searchValue = selectForStatus.value;
    if (searchValue == 0) {
      let searches = await fetch(`${api}`);
      let info = await searches.json();
      get(info);
    } else {
      let searches = await fetch(`${api}?status=${searchValue}`);
      let info = await searches.json();
      get(info);
    }
  } catch (error) {
    console.log(error);
  }
};

// SORT BY TITLE
{
  let sort = document.querySelector(".sort");
  async function sortUsers() {
    try {
      const response = await fetch("db.json");
      const data = await response.json();
      if (data.data) {
        const sorted = data.data.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
        console.log(data.data);
        get(sorted);
      } else {
        console.log("no users found");
      }
    } catch (error) {
      console.log(error);
    }
  }
  sort.onclick = () => {
    sortUsers();
  };
} 

// REMOVE DUPLICATE BY TITLE
{
  let remove = document.querySelector(".remove");

  async function removeDuplicate() {
    try {
      const response = await fetch(api);
      const data = await response.json();

      const filteredArr = [];

      data.filter((item) => {
        const i = filteredArr.findIndex((x) => x.title == item.title);
        if (i <= -1) {
          filteredArr.push(item);
        }
        return null;
      });

      get(filteredArr);

      if (filteredArr.length) return;

      let c = await fetch(`${api}/${filteredArr[0].id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Duplacate removed");
    } catch (error) {
      console.log(error);
    }
  }
  remove.onclick = () => {
    removeDuplicate();
    {
      alert("Duplicate Deleted :)");
    }
  };
}

// SEARCH
let search = document.querySelector(".name1");
search.oninput = async () => {
  try {
    let searches = await fetch(`${api}?q=${search.value}`);
    let info = await searches.json();
    get(info);
  } catch (error) {
    console.log(error);
  }
};

// ADD USERS
addNewUser.onclick = () => {
  modal.showModal();
  close.onclick = () => {
    modal.close();
  };
};
async function postUser(user) {
  try {
    let response = await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    getData();
  } catch (error) {
    console.log(error);
  }
}
form.onsubmit = (event) => {
  event.preventDefault();
  let user = {
    title: form["title"].value,
    email: form["email"].value,
    status: false,
  };
  postUser(user);
  form.reset();
  modal.close();
};

// EDIT
closeEdit.onclick = () => {
  dialogEdit.close();
};
let form1 = document.querySelector(".form1");
let dialogEdit = document.querySelector(".dialogEdit");

form1.onsubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${api}/${idx}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form1["title"].value,
        email: form1["email"].value,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};
function editOpenMOdal(el) {
  dialogEdit.showModal();
  idx = el.id;
  form1["title"].value = el.title;
  form1["email"].value = el.email;
}

// DELETE
async function deleteUser(id) {
  try {
    const response = await fetch(`${api}/${id}`, {
      method: "DELETE",
    });
    get();
  } catch (error) {
    console.log(error);
  }
}

// COMPLETED
async function completedUser(id, user) {
  try {
    const response = await fetch(`${api}/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// GET
  async function getData() {
    try {
      const response = await fetch(api);
      const data = await response.json();
      get(data);
    } catch (error) {
      console.log(error);
    }
  }
getData();

// GET DATA FROM db.json
function get(newData) {
  tbody.innerHTML = "";
  newData.forEach((el) => {
    let tr = document.createElement("tr");

    let tdId = document.createElement("td");
    tdId.innerHTML = el.id;
    tdId.classList.add("id");

    let tdName = document.createElement("td");
    tdName.innerHTML = el.title;
    tdName.classList.add("imya");

    let tdEmail = document.createElement("td");
    tdEmail.innerHTML = el.email;
    tdEmail.classList.add("email");

    let tdStatus = document.createElement("td");
    tdStatus.innerHTML = el.status ? "Active" : "Inactive";
    tdStatus.classList.add("statusi");

    if (el.status == true) {
      tdName.classList.add("status");
      tdStatus.classList.add("col");
      tdStatus.style.backgroundColor = "green";
      tdStatus.style.color = "wheat";
    } else {
      tdStatus.style.backgroundColor = "red";
      tdStatus.style.color = "white";
    }

    let obshiy = document.createElement("td");
    obshiy.classList.add("obshiy");
    let btnShow = document.createElement("button");
    btnShow.innerHTML = "Show";
    btnShow.classList.add("btnShow");

    closeInfo.onclick = () => {
      showInfo.close();
    };
    btnShow.onclick = () => {
      information.innerHTML = "";
      showInfo.showModal();
      let tdIdSecond = document.createElement("td");
      tdIdSecond.innerHTML = el.id;
      tdIdSecond.classList.add("id2");

      let tdNameSecond = document.createElement("td");
      tdNameSecond.innerHTML = el.title;
      tdNameSecond.classList.add("imya2");

      let tdEmailSecond = document.createElement("td");
      tdEmailSecond.innerHTML = el.email;
      tdEmailSecond.classList.add("email2");
      information.append(tdIdSecond, tdNameSecond, tdEmailSecond);
    };

    let btnEdit = document.createElement("button");
    btnEdit.innerHTML = "Edit";
    btnEdit.classList.add("btnEdit");
    btnEdit.onclick = () => {
      editOpenMOdal(el);
    };
    let btnDelete = document.createElement("button");
    btnDelete.innerHTML = "Delete";
    btnDelete.classList.add("btnDelete");
    btnDelete.onclick = () => {
      deleteModal.showModal();
      yes.onclick = () => {
        deleteUser(el.id);
      };
      no.onclick = () => {
        deleteModal.close();
      };
    };
    let check = document.createElement("input");
    check.type = "checkbox";
    check.checked = el.status;
    check.classList.add("check");
    check.onclick = () => {
      el.status = !el.status;
      completedUser(el.id, el);
    };
    if (el.status == true) {
      tdName.style.textDecorationLine = "line-through";
    }
    obshiy.append(btnShow, btnEdit, btnDelete, check);
    tr.append(tdId, tdName, tdEmail, tdStatus, obshiy);
    tbody.appendChild(tr);
  });
}
