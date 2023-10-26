const categoryBtn = document.getElementById("categoryBtn");
const subCategoryBtn = document.getElementById("SubCategoryBtn");

categoryBtn.addEventListener("click", () => {
  document.getElementById("subCategory").style.display = "none";
  subCategoryBtn.className = "btn btn-secondary";
  document.getElementById("Category").style.display = "block";
  categoryBtn.className = "btn btn-primary";
});
subCategoryBtn.addEventListener("click", () => {
  document.getElementById("Category").style.display = "none";
  categoryBtn.className = "btn btn-secondary";
  document.getElementById("subCategory").style.display = "block";
  subCategoryBtn.className = "btn btn-primary";
});

// Category Selecton

// fetching category list
fetch("https://b2b-node.vercel.app/api/category/get", {
  method: "GET",
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
    data["data"].forEach((user) => {
      const markup = `<option value="${user._id}">  ${user.name}</option>`;

      document
        .getElementById("parent-category")
        .insertAdjacentHTML("beforeend", markup);
    });
  })
  .catch((error) => console.log(error));

//sending add category details
const categoryDetails = document.getElementById("category_details");
categoryDetails.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log(
    document.getElementById("name-s").value,
    document.getElementById("name").value
  );
  const formData = {
    name:
      document.getElementById("name").value == ""
        ? document.getElementById("name-s").value
        : document.getElementById("name").value,
    image:
      document.getElementById("image").value == ""
        ? document.getElementById("image-s").value
        : document.getElementById("image").value,
    parent_category_id: document.querySelector("#parent-category").value,
  };

  console.log(formData);
  if (
    (formData.name != "" && formData.image != "") ||
    formData.parent_category_id != ""
  ) {
    fetch("https://b2b-node.vercel.app/api/category/add", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (text) {
        console.log(text);

        alert(" Added Successfully!");
        location.reload();
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
