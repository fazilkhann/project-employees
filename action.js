fetchData();

function fetchData() {
    try{
    fetch(`http://localhost:3000/employees`)
        .then(response =>
            {
                if (!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);             
            } 
            return response.json()
        })

        .then(data => {
            console.log(data);
            fetchedData = data.reverse();
            display();
            document.getElementById("total_employees").innerHTML = `${fetchedData.length}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Error fetching data: ${error.message}`,
            });
        });
}
 catch (error) {
    console.error('Unexpected error:', error);
    
}
 
}



var fetchedData = [];
var filteredData = [];
var currentPage = 1;
var empPerPage = 5;



// to  search input

document.getElementById('searchinput').addEventListener("input", function () {
    display();
});

//  for changing table size

document.getElementById('table_size').addEventListener('change', function () {
    empPerPage = parseInt(this.value);
    display();
});


// display table and pagination

function display() {
    filterData();
    displayTable();
    displayPagination();
}

// filter data

function filterData() {
    var searchQuery = document.getElementById('searchinput').value.toLowerCase();
    filteredData = fetchedData.filter(values =>
        values.salutation.toLowerCase().includes(searchQuery) ||   
        values.firstName.toLowerCase().includes(searchQuery) ||
        values.lastName.toLowerCase().includes(searchQuery) ||
        values.email.toLowerCase().includes(searchQuery) ||
        values.phone.toLowerCase().includes(searchQuery) ||
        values.gender.toLowerCase().includes(searchQuery) ||
        values.dob.toLowerCase().includes(searchQuery) ||
        values.country.toLowerCase().includes(searchQuery)
    );
    currentPage=1;
}


// Display table data

function displayTable() {
    var start = (currentPage - 1) * empPerPage;
    var end = start + empPerPage;
    var tableBody = document.getElementById("tablebody");

    var tableData = filteredData.slice(start, end).map((value) => {
        return `<tr>
        <th scope="row">#0${++start}</th>
        <td><img class="uploading" src="http://localhost:3000/employees/${value.id}/avatar"> ${value.salutation} ${value.firstName} ${value.lastName}</td>
        <td>${value.email}</td>
        <td>${value.phone}</td>
        <td>${value.gender}</td>
        <td>${value.dob}</td>
        <td>${value.country}</td>
        <td>
        <div class="dropdown">
        <button class="btn"  type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa-solid fa-ellipsis"></i>
          
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
          <li onclick="view_employee('${value.id}')"><a class="dropdown-item" href="view.html?id=${value.id}"><i class="fa-regular fa-eye"></i> View Details</a></li>
          <li onclick= "edit_employee('${value.id}')"><a  class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit </a> </li>
          <li onclick="delete_Employee('${value.id}')"><a class="dropdown-item" href="#"><i class="fa-regular fa-trash-can"></i> Delete </a></li>
        </ul>
      </div>
        </td>
       
      </tr>`;
    }).join('');

    tableBody.innerHTML = tableData;
}

// Display pagination buttons

function displayPagination() {
    var totalPages = Math.ceil(filteredData.length / empPerPage);
    var paginationButtons = '';

    // Start Page button
    if (currentPage > 1) {
        paginationButtons += `<button onclick="gotoPage(1)"><<</button>`;
    } else {
        paginationButtons += `<button disabled><<</button>`;
    }

    // Previous button   
    if (currentPage > 1) {
        paginationButtons += `<button onclick="gotoPage(${currentPage - 1})"><</button>`;
    } else {
        paginationButtons += `<button disabled><</button>`;
    }

    // Page buttons
    for (var i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationButtons += `<button class="selected-page" onclick="gotoPage(${i})">${i}</button>`;
        } else {
            paginationButtons += `<button onclick="gotoPage(${i})">${i}</button>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationButtons += `<button onclick="gotoPage(${currentPage + 1})">></button>`;
    } else {
        paginationButtons += `<button disabled>></button>`;
    }

    // End Page button
    if (currentPage < totalPages) {
        paginationButtons += `<button onclick="gotoPage(${totalPages})">>></button>`;
    } else {
        paginationButtons += `<button disabled>>></button>`;
    }

    document.getElementById("pagination").innerHTML = paginationButtons;
}

// Go to specified page

function gotoPage(page) {
    if (page >= 1 && page <= Math.ceil(filteredData.length / empPerPage)) {
        currentPage = page;
        displayTable();
        displayPagination();
    }
}


// add_employee...............>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

let overlay = document.getElementById("Addoverlay")

// display add employee form

const addemployeebtn =document.getElementById("add");
addemployeebtn.addEventListener('click',() =>{
addbtn();
addFormclear();
})


function addbtn() {
    document.getElementById("addemployee").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    
  
}
const addcancel=document.getElementById("cancelfunc");
addcancel.addEventListener('click',()=>{
    cancelx();
  
    addFormclear();
})

function cancelx() {
    document.getElementById("addemployee").style.display = "none";
    document.getElementById("overlay").style.display = "none"
   
}
function cancelfunc() {
    document.getElementById("addemployee").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    
}
function overlayback() {
    document.getElementById("addemployee").style.display = "none"
    document.getElementById("overlay").style.display = "none"
    document.getElementById("editemployee").style.display = "none"
    document.getElementById("delete").style.display = "none";
    addFormclear();
}


//add employee

const add_employeeBtn = document.getElementById('addemp');
add_employeeBtn.addEventListener('click', () => {
    const validation = addValidation();
    if (!validation) {
        return;
    }
    else {
        add_employee();

    }
})

function add_employee() {
    const salutation = document.getElementById("salutation").value
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const email = document.getElementById("Email").value
    const phone = document.getElementById("phone").value
    const gender = document.querySelector('input[name="gender"]:checked').value
    const qualifications = document.getElementById("Qualifications").value
    const address = document.getElementById("Address").value
    const country = document.getElementById("country").value
    const state = document.getElementById("state").value
    const city = document.getElementById("city").value
    const zip = document.getElementById("Zip").value
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const originalDatestring = document.getElementById('date').value

    //split the date string

    let dateparts = originalDatestring.split("-");
    let year = dateparts[0];
    let month = dateparts[1];
    let day = dateparts[2];

    //format the date 

    let formatedDate = `${day}-${month}-${year}`;
    console.log(formatedDate);
    const date = formatedDate;

    // object creation

    const newData = {
        salutation,
        firstName,
        lastName,
        email,
        phone,
        gender,
        qualifications,
        address,
        country,
        city,
        zip,
        state,
        username,
        password,
        dob: date

    }

    console.log(newData);
    add_data(newData)
}


function add_data(newData) {
    fetch("http://localhost:3000/employees", {

        method: 'POST',
        headers:
        {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData)

    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log("Data Saved Successfully!", data);
            newid=data.id;
            newData['id']=newid;

            const inputfile = document.getElementById("input_File");
            var formData = new FormData()

            formData.append("avatar", inputfile.files[0]);
            fetch(`http://localhost:3000/employees/${data.id}/avatar`, {
                method: "POST",
                body: formData,
            })
        })
        .then(() => {
            fetchedData.unshift(newData)
        display();
        document.getElementById("total_employees").innerHTML = `${fetchedData.length}`;
        cancelx()
        })

        .then(
            Swal.fire({
                title: "Data added!",
                text: "Good job!",
                icon: "success"
              })
        )
    
}



// add_image

let profilepic = document.getElementById("upload_img");
let inputfile = document.getElementById("input_File");

inputfile.onchange = function () {
    profilepic.src = URL.createObjectURL(inputfile.files[0]);
}

// add  validation

function addValidation() {
    const salutation = document.getElementById("salutation").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("Email").value.trim();
    const phone = document.getElementById("phone").value.trim();


    // gender

    const gender = document.querySelector('input[name="gender"]:checked')
    const gender_addValidation = document.getElementById("gendererror")



    const qualifications = document.getElementById("Qualifications").value.trim();
    const address = document.getElementById("Address").value.trim();
    const country = document.getElementById("country").value.trim();
    const state = document.getElementById("state").value.trim();
    const city = document.getElementById("city").value.trim();
    const pin = document.getElementById("Zip").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // dob


    const dob = document.getElementById("date")
    const dob_addValidation = document.getElementById("doberror")
    const dob_value = dob.value.trim();

    // patterns

    const namePattern = /^[A-za-z]+$/
    const phonePattern = /^\d{10}$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const pinpattern = /^\d{6}$/

    let Valid = true;

    // validation of dob & gender

    if (gender) {
        gender_addValidation.textContent = ""

    }
    else {
        gender_addValidation.textContent = "gender is required"
        Valid = false;

    }

    if (dob_value === "") {
        dob_addValidation.textContent = "Date of Birth is required"
        Valid = false;
    }

    // validation of form ...

    if (salutation == "" || salutation == "select") {
        document.getElementById('salutationerror').textContent = "salutation is required";
        Valid = false;
    }

    if (!namePattern.test(firstName)) {
        document.getElementById('firstNameerror').textContent = "First Name is required"

    }

    if (!namePattern.test(lastName)) {
        document.getElementById('lastNameerror').textContent = "Last Name is required"
        Valid = false;
    }
    if (!emailPattern.test(email)) {
        document.getElementById('emailerror').textContent = "Email is required"
        Valid = false;
    }

    if (!phonePattern.test(phone)) {
        document.getElementById('phoneerror').textContent = "Phone is required"
        Valid = false;
    }
    if (!pinpattern.test(pin)) {
        document.getElementById('ziperror').textContent = "Pin is required"
        Valid = false;
    }


    if (qualifications == "") {
        document.getElementById('qualificationerror').textContent = "Qualifications are required"
        Valid = false;

    }

    if (address == "") {
        document.getElementById('addresserror').textContent = "Address is required"
        Valid = false;
    }

    if (country == "" || country == "select") {
        document.getElementById('countryerror').textContent = "Country is required"
        Valid = false;
    }
    if (state == "" || state == "select") {
        document.getElementById('stateerror').textContent = "State is required"
        Valid = false;
    }

    if (city == "") {
        document.getElementById('cityerror').textContent = "City is required"
        Valid = false;
    }


    if (username == "") {
        document.getElementById('usernameerror').textContent = "*Username is required"
        Valid = false;
    }

    if (password == "") {
        document.getElementById('passworderror').textContent = "Password is required"
        Valid = false;
    }


    // validation of gender

    const male = document.getElementById("maleId")
    const female = document.getElementById("femaleId")

    male.addEventListener("click", () => {
        document.getElementById("gendererror").textContent = "";
    })

    female.addEventListener("click", () => {
        document.getElementById("gendererror").textContent = "";
    })


    return Valid;
}
// clear error message
document.getElementById('addemployee').addEventListener('input', clearErrorMessage);

function clearErrorMessage(event) {
    const input = event.target;
    const errorElement = document.querySelector(`#${input.id} ~ .text-danger`);
    
    if (errorElement) {
        errorElement.textContent = ""; // Clear the error message
    }
}


function addFormclear() {
    var defaultImage = document.getElementById('upload_img');
    defaultImage.src='blank-profile-picture-973460_640.png';

    document.getElementById('salutationerror').textContent = "";
    document.getElementById('firstNameerror').textContent = "";
    document.getElementById('lastNameerror').textContent = "";
    document.getElementById('emailerror').textContent = "";
    document.getElementById('phoneerror').textContent = "";
    document.getElementById('qualificationerror').textContent = "";
    document.getElementById('addresserror').textContent = "";
    document.getElementById('countryerror').textContent = "";
    document.getElementById('stateerror').textContent = "";
    document.getElementById('cityerror').textContent = "";
    document.getElementById('ziperror').textContent = "";
    document.getElementById('usernameerror').textContent = "";
    document.getElementById('passworderror').textContent = "";
    document.getElementById('doberror').textContent = "";
    document.getElementById('gendererror').textContent = "";


    document.getElementById("salutation").value = "select";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("phone").value = "";
    const radiobuttons = document.querySelectorAll('input[name="gender"]:checked');
    document.getElementById("Qualifications").value = "";
    document.getElementById("Address").value = "";
    document.getElementById("country").value = "select";
    document.getElementById("state").value = "select";
    document.getElementById("city").value = "";
    document.getElementById("Zip").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById('date').value = "";
    radiobuttons.forEach(function (radiobuttons) {
        radiobuttons.checked = false;
    });

}


// editemployeee...........


function cancelx_edit() {
    document.getElementById("editemployee").style.display = "none"
    document.getElementById("overlay").style.display = "none"

}
function cancel_edit() {
    document.getElementById("editemployee").style.display = "none"
    document.getElementById("overlay").style.display = "none"

}
// // update image of edit.............


let edit_imagedp = document.getElementById('image_editUpload')
edit_imagedp.addEventListener('click', () => {

    let profilEditepic = document.getElementById("upload_editimage");
    let inputEditfile = document.getElementById("input_fileimg");
    inputEditfile.onchange = function () {
        profilEditepic.src = URL.createObjectURL(inputEditfile.files[0]);
    }

})

let initialData = {};

// Function to edit employee




function edit_employee(empid) {
    try{
    ClearEditform();
    console.log(empid);

    document.getElementById("editemployee").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    fetch(`http://localhost:3000/employees/${empid}`, {
        method: "GET",
        headers: { "content-type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            alert('Error fetching employee data');
        } else {
            return response.json();
        }
    })
    .then(data => {
        initialData = data;
        formDetails(initialData);
        setupImagePreview(empid);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Error fetching data: ${error.message}`,
        });
    });
}
catch (error) {
    console.error('Unexpected error:', error);
}
    const edit_employeeBtn = document.getElementById('updateEmployee');
    edit_employeeBtn.addEventListener('click', function clickHandler() {
        const validation = editValidation();
        if (!validation) {
            return;
        } else {
            if (changesMade()) {
                saveChange(empid);
            } else {
                cancel_edit();
            }
        }
    });
}

function formDetails(data) {
    document.getElementById("edit_salutation").value = data.salutation;
    document.getElementById("edit_fristname").value = data.firstName;
    document.getElementById("edit_lastname").value = data.lastName;
    document.getElementById("edit_email").value = data.email;
    document.getElementById("edit_phone").value = data.phone;
    document.getElementById("edit_quqlification").value = data.qualifications;
    document.getElementById("edit_address").value = data.address;
    document.getElementById("edit_city").value = data.city;
    document.getElementById("edit_state").value = data.state;
    document.getElementById("edit_country").value = data.country;
    document.getElementById("edit_zip").value = data.zip;
    document.getElementById("edit_username").value = data.username;
    document.getElementById("edit_password").value = data.password;
    document.getElementById("edit_gender").value = data.gender;
    const [day, month, year] = data.dob.split("-");
    const newDob = `${year}-${month}-${day}`;
    document.getElementById('edit_date').value = newDob;
    document.querySelector(`input[name='editgender'][value='${data.gender}']`).checked = true;
}

function setupImagePreview(empid) {
    document.getElementById("upload_editimage").src = `http://localhost:3000/employees/${empid}/avatar`;
    document.getElementById("input_fileimg").addEventListener('change', () => {
        const imgPreview = document.getElementById("upload_editimage");
        imgPreview.src = URL.createObjectURL(event.target.files[0]);
    });
}

function changesMade() {
    const currentData = getCurrentFormData();
    const imageChanged = document.getElementById("input_fileimg").files.length > 0;
    return Object.keys(currentData).some(key => currentData[key] !== initialData[key]) || imageChanged;
}

function getCurrentFormData() {
    let dateofBirth = document.getElementById("edit_date").value;
    let [year, month, day] = dateofBirth.split("-");
    let formateddate = `${day}-${month}-${year}`;

    return {
        salutation: document.getElementById("edit_salutation").value,
        firstName: document.getElementById("edit_fristname").value,
        lastName: document.getElementById("edit_lastname").value,
        email: document.getElementById("edit_email").value,
        phone: document.getElementById("edit_phone").value,
        qualifications: document.getElementById("edit_quqlification").value,
        address: document.getElementById("edit_address").value,
        city: document.getElementById("edit_city").value,
        state: document.getElementById("edit_state").value,
        country: document.getElementById("edit_country").value,
        zip: document.getElementById("edit_zip").value,
        username: document.getElementById("edit_username").value,
        password: document.getElementById("edit_password").value,
        dob: formateddate,
        gender: document.querySelector('input[name="editgender"]:checked').value,
    };
}

function saveChange(empid) {
    try{

    
    const currentData = getCurrentFormData();
    fetch(`http://localhost:3000/employees/${empid}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(currentData),
    })
    .then(response => {
        if (!response.ok) {
            throw new error(`Error saving employee data status:${response.status}`);
        } else {
            return response.json();
        }
    })
    .then(data => {
        console.log("Data Saved Successfully!", data);
        if (document.getElementById("input_fileimg").files.length > 0) {
            uploadAvatar(empid);
        }
        updateTabledata(empid, currentData);
        display();
        cancel_edit();
        Swal.fire({ title: "Data updated!", icon: "success" });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Error fetching data: ${error.message}`,
        });
    });
}
catch (error) {
    console.error('Unexpected error:', error);
}}

function uploadAvatar(empid) {
    const inputfile = document.getElementById('input_fileimg');
    var formdata = new FormData();
    formdata.append("avatar", inputfile.files[0]);
    fetch(`http://localhost:3000/employees/${empid}/avatar`, {
        method: "POST",
        body: formdata,
    })
    .then(response => {
        if (!response.ok) {
            console.log("Avatar image upload failed");
        } else {
            console.log("Avatar upload success");
        }
    })
    .catch(error => console.error(error));
}

function updateTabledata(empid, currentData) {
    fetchedData = fetchedData.map(element => element.id === empid ? { ...element, ...currentData, id: empid } : element);
}

function cancel_edit() {
    document.getElementById("editemployee").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Input file change event 
let flag = 0;
document.getElementById("input_fileimg").addEventListener('change', () => {
    flag = 1;
});


// validation of.edit


function editValidation() {
    const salutation = document.getElementById("edit_salutation").value.trim();
    const firstName = document.getElementById("edit_fristname").value.trim();
    const lastName = document.getElementById("edit_lastname").value.trim();
    const email = document.getElementById("edit_email").value.trim();
    const phone = document.getElementById("edit_phone").value.trim();


    // gender

    const gender = document.querySelector('input[name="editgender"]:checked')
    const gender_editValidation = document.getElementById("edit_gendererror")



    const qualifications = document.getElementById("edit_quqlification").value.trim();
    const address = document.getElementById("edit_address").value.trim();
    const country = document.getElementById("edit_country").value.trim();
    const state = document.getElementById("edit_state").value.trim();
    const city = document.getElementById("edit_city").value.trim();
    const zip = document.getElementById("edit_zip").value.trim();
    const username = document.getElementById("edit_username").value.trim();
    const password = document.getElementById("edit_password").value.trim();

    // dob


    const dob = document.getElementById("date")
    const dob_editValidation = document.getElementById("edit_dateerror")
    const dob_value = dob.value.trim();

    // pattern

    const namePattern = /^[A-za-z]+$/
    const phonePattern = /^\d{10}$/
    const pinpattern = /^\d{6}$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    let Valid = true;

    // validation of dob & gender

    if (gender) {
        gender_editValidation.textContent = ""

    }
    else {
        gender_editValidation.textContent = "gender is required"
        Valid = false;

    }

    

    if (salutation == "" || salutation == "select") {
        document.getElementById('edit_salutationerror').textContent = "salutation is required";
        Valid = false;
    }

    if (!namePattern.test(firstName)) {
        document.getElementById('edit_fristnameerror').textContent = "First Name is required"

    }

    if (!namePattern.test(lastName)) {
        document.getElementById('edit_lastnameerror').textContent = "Last Name is required"
        Valid = false;
    }
    if (!emailPattern.test(email)) {
        document.getElementById('edit_emailerror').textContent = "Email is required"
        Valid = false;
    }

    if (!phonePattern.test(phone)) {
        document.getElementById('edit_phoneerror').textContent = "Phone is required"
        Valid = false;
    }
    if (!pinpattern.test(zip)) {
        document.getElementById('edit_ziperror').textContent = "Pin is required"
        Valid = false;
    }


    if (qualifications == "") {
        document.getElementById('edit_qualificationerror').textContent = "Qualifications are required"
        Valid = false;

    }

    if (address == "") {
        document.getElementById('edit_addresserror').textContent = "Address is required"
        Valid = false;
    }

    if (country == "" || edit_country == "select") {
        document.getElementById('edit_countryerror').textContent = "Country is required"
        Valid = false;
    }
    if (state == "" || edit_state == "select") {
        document.getElementById('edit_stateerror').textContent = "State is required"
        Valid = false;
    }

    if (city == "") {
        document.getElementById('edit_cityerror').textContent = "City is required"
        Valid = false;
    }


    if (username == "") {
        document.getElementById('edit_usernameeror').textContent = "*Username is required"
        Valid = false;
    }

    if (password == "") {
        document.getElementById('edit_passworderror').textContent = "Password is required"
        Valid = false;
    }


    // validation of gender

    const male = document.getElementById("maleId")
    const female = document.getElementById("femaleId")

    male.addEventListener("click", () => {
        document.getElementById("edit_gendererror").textContent = "";
    })

    female.addEventListener("click", () => {
        document.getElementById("edit_gendererror").textContent = "";
    })


    return Valid;
}

// Clear the error message whenj type

document.getElementById('editemployee').addEventListener('input', () => {
    const containers = document.querySelectorAll('#editemployee div');
    containers.forEach(container => {
        const input = container.querySelector('input');
        const errorElement = container.querySelector('.text-danger');
        if (input && errorElement && input === document.activeElement) {
            errorElement.textContent = ""; 
        }
    });
});


function ClearEditform() {
    
    document.getElementById('edit_salutationerror').textContent = "";
    document.getElementById('edit_fristnameerror').textContent = "";
    document.getElementById('edit_lastnameerror').textContent = "";
    document.getElementById('edit_emailerror').textContent = "";
    document.getElementById('edit_phoneerror').textContent = "";
    document.getElementById('edit_qualificationerror').textContent = "";
    document.getElementById('edit_addresserror').textContent = "";
    document.getElementById('edit_countryerror').textContent = "";
    document.getElementById('edit_stateerror').textContent = "";
    document.getElementById('edit_cityerror').textContent = "";
    document.getElementById('edit_ziperror').textContent = "";
    document.getElementById('edit_usernameeror').textContent = "";
    document.getElementById('edit_passworderror').textContent = "";
    document.getElementById('edit_dateerror').textContent = "";
    document.getElementById('edit_gendererror').textContent = "";


}




//  delete_Employe


function Deleteclosefunction() {
    document.getElementById("delete").style.display = "none"
    document.getElementById("overlay").style.display = "none"

}
function delete_close() {
    document.getElementById("delete").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function delete_Employee(empid) {
    document.getElementById("delete").style.display = "block"
    document.getElementById("overlay").style.display = "block"


    const deleteEmployee = document.getElementById('deleteData')
    deleteEmployee.addEventListener('click', () => {
        deleteFunction(empid);
    })

}
function delete_cancel() {
    document.getElementById("delete").style.display = "none";
    document.getElementById("overlay").style.display = "none";

}
function Deletecancelfunction() {
    document.getElementById("delete").style.display = "none"
    document.getElementById("overlay").style.display = "none"

}

function deleteFunction(empid) {
    fetch(`http://localhost:3000/employees/${empid}`, {

        method: 'DELETE',

    })

        .then(response => {
            return response.json();
        })
        .then(() => {
            console.log("Data Deleted!",);
            fetchedData.filter((element, index) => {
                if (empid == element.id) {
                    fetchedData.splice(index, 1)
                    Deleteclosefunction()
                    display()
                    document.getElementById("total_employees").innerHTML = `${fetchedData.length}`;

                }
            })


        })
        .then(
            Swal.fire({
                title: "Data deleted!",
                // text: "Good job!",
                icon: "success"
              })
            )

}


// document.getElementById("delete_cancel").onclick = function () {
//     Deletecancelfunction()
// }

// document.getElementById("Deleteoverlay").onclick = function () {
//     Deletecancelfunction()
// }



function Deletecancelfunction() {
    document.getElementById("delete").style.display = "none"
    document.getElementById("overlay").style.display = "none"

}