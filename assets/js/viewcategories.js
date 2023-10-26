const categoryTable = document.getElementById("category-table");

//update form
const updateForm = document.getElementById("update-subcategory");
//update form fields
const parentCategory = {
  elem: document.getElementById("parent-category"),
  isChange: false
};
const subCategory = {
  elem: document.getElementById("name-s"),
  isChange: false
};
const uploadImage = {
  elem: document.getElementById("updateBtn"),
  isChange: false
};

//URL
const local = "http://localhost:3000";
const beta = "https://b2b-node.vercel.app";
const updateCategoryUrl = `${beta}/api/category/update`;
const deleteCategoryUrl = "https://b2b-node.vercel.app/api/category/delete";

//handle events
parentCategory["elem"].onchange = function () {
  parentCategory["isChange"] = true;
  console.log(parentCategory.isChange);
};

subCategory["elem"].onchange = function () {
  subCategory["isChange"] = true;
  console.log(subCategory.isChange);
};

uploadImage["elem"].onchange = function () {
  uploadImage["isChange"] = true;
};
//handle events

//store data
const categoriesList = [];
const subCategoryList = [];

async function renderCategories() {
  categoryTable.innerHTML = "";

  const categories = await hitGetApi(
    "https://b2b-node.vercel.app/api/category/get"
  );
  let idCount = 1;
  categories["data"].forEach(async (category) => {
    categoriesList.push(category);
    const subCategoryItem = await hitGetApi(
      `https://b2b-node.vercel.app/api/category/getSubCategory?category_id=${category._id}`
    );

    subCategoryItem["data"].forEach((subcategory) => {
      subCategoryList.push(subcategory);

      if (!subcategory.isDeleted) {
        categoryTable.innerHTML += `
        <tr>
                            <td width=" 10%" >${idCount}</td>
                            <td  width = "10%"><img src="${
                              category.image == "imageUrl"
                                ? "#"
                                : category.image
                            }" class="categoryIcon" alt="Icon"></td>
                            <td width ="30%">${subcategory.name}</td>
                            <td  width ="30%">${category.name}</td>
                            <td width ="30%"><button  type="button" class ="updateBtn" data-parent="${
                              category._id
                            }" data-sub="${
          subcategory._id
        }" onClick="updateCategory(this)">Update</button> <button class="deleteBtn" data-key="${
          subcategory._id
        }" onClick="deleteCategory(this)">Delete</button></td>
                          </tr>`;
        idCount++;
      }
    });
  });
}
renderCategories();

updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(updateForm);
  console.log(uploadImage["elem"].files[0]);
  // deciding which category going to update.
  if (parentCategory["isChange"]) {
    formData.append("id", parentCategory["elem"].getAttribute("data-key"));
    formData.append("name", parentCategory["elem"].value);
  } else if (subCategory["isChange"]) {
    formData.append("id", subCategory["elem"].getAttribute("data-key"));
    formData.append("name", subCategory["elem"].value);
  }

  if (uploadImage["isChange"]) {
    formData.append("id", parentCategory["elem"].getAttribute("data-key"));
    formData.append("image", uploadImage["elem"].files[0]);
  }

  const data = await hitPostApi(updateCategoryUrl, formData);
  if (data.status == "success") {
    alert("update successful");
    renderCategories();
    updateForm.classList.remove("block");
    updateForm.classList.add("none");
    // location.reload();
  } else {
    alert("update failed");
  }
});

//fill update form data
function updateCategory(e) {
  updateForm.classList.remove("none");
  updateForm.classList.add("block");

  const parentId = e.getAttribute("data-parent");
  const subId = e.getAttribute("data-sub");
  const parent = categoriesList.filter((field) => field["_id"] == parentId);
  const child = subCategoryList.filter((field) => field["_id"] == subId);

  parentCategory["elem"].setAttribute("data-key", parentId);
  subCategory["elem"].setAttribute("data-key", subId);
  parentCategory["elem"].value = parent[0].name;
  subCategory["elem"].value = child[0].name;
}

//delete category
async function deleteCategory(e) {
  const id = e.getAttribute("data-key");

  const data = await hitGetApi(deleteCategoryUrl + "?id=" + id);

  if (data.status == "success") {
    alert("deleted successfully");
  } else {
    alert("delete failed");
  }
}

// utility function api hit.
async function hitGetApi(url) {
  const response = await fetch(url, { method: "GET" });
  const data = await response.json();

  return data;
}

async function hitPostApi(url, data) {
  const response = await fetch(url, {
    method: "POST",
    // headers: {
    //   "accepts": "*/*",
    //   "content-type": "multipart/form-data" //application/json",
    // },
    body: data //JSON.stringify(data),
  }).catch((err) => console.log(err));
  const responseData = await response.json();

  return responseData;
}
