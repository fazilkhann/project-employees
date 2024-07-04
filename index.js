



function getdata() {
    fetch(`http://localhost:3000/employees`)
        .then(response => response.json())
        .then(data => {
            fetchedData = data.reverse();
            displayTable();
            displayPagination();
            document.getElementById("total_employees").innerHTML =` ${fetchedData.length}`;
        })
        .catch(error => console.error('Error fetching data:', error));
}
getdata();

var fetchedData = [];
var currentPage =1;
var empPerPage= 5;
function displayTable() {
  var start = (currentPage - 1) * empPerPage;
  var end = start + empPerPage;
  var tableBody = document.getElementById("tablebody");

  var tableData = fetchedData.slice(start, end).map((value) => {
         return `<tr>
       <th scope="row">#0${++start}</th>
       <td> <img class="upload" src="http://localhost:3000/employees/${value.id}/avatar">${value.salutation} ${value.firstName} ${value.lastName}</td>
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
      
     </tr>`
  }).join('');

  tableBody.innerHTML = tableData;
}

// display pagination buttons

function displayPagination() {
  var totalPages = Math.ceil(fetchedData.length / empPerPage);
  var paginationButtons = '';

  // Previous button

  if (currentPage > 1) {
      paginationButtons +=`<button   onclick="gotoPage(${currentPage - 1})"><<<</button>`;
  } else {
      paginationButtons += `<button  disabled><<<</button>`;
  }

  // Page buttons

  for (var i = 1; i <= totalPages; i++) {
      paginationButtons += `<button onclick="gotoPage(${i})">${i}</button>`;
  }

  // next button

  if (currentPage < totalPages) {
      paginationButtons += `<button onclick="gotoPage(${currentPage + 1})">>>></button>`;
  } else {
      paginationButtons += `<button disabled>>>></button>`;
  }

  document.getElementById("pagination").innerHTML = paginationButtons;
}

// Go to specified page

function gotoPage(page) {
  if (page >= 1 && page <= Math.ceil(fetchedData.length / empPerPage)) {
      currentPage = page;
      displayTable();
      displayPagination();
  }
}





function add() {
  document.getElementById("addemployee").style.display = "block";
  document.getElementById("overlay").style.display = "block"
}
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

}


//add employee
    const add_employeeBtn = document.getElementById('addemp');
    add_employeeBtn.addEventListener('click', () => {
      const validation = addValidation();
      if (!validation) {
        return;
      } else {
        add_employee();
      }
    });


//add img
let profilepic = document.getElementById("upload_addimg");
let inputfile = document.getElementById("input_fileimg");

inputfile.onchange = function () {
  profilepic.src = URL.createObjectURL(inputfile.files[0]);
} 

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
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData)
})
.then(response => {
    // Ensure the response is returned and parsed
    return response.json();
})
.then((resdata) => {
    console.log("datais ", resdata.id);
    
    const inputfile = document.getElementById("input_fileimg");
    const formdata = new FormData();
    formdata.append("avatar", inputfile.files[0]);

    // Return the fetch promise
    return fetch(`http://localhost:3000/employees/${resdata.id}/avatar`, {
        method: "POST",
        body: formdata,
    });
})
.then(res => {
    // Parse the JSON response from the avatar upload
    return res.json();
})
.then((avatarData) => {
    console.log("Avatar uploaded successfully!", avatarData);
   
    // Redirect or perform any other actions after successful data addition
    window.location.href = 'index.html';
})
.catch(error => {
    console.error("Error:", error);
});

      
          

    
      // .then(() => {
      //     fetchedData.unshift(newData)
      //     Addcancelfunction()
      //     display()
      // })
      // .then(() => {
      //     swal(" EMPLOYEE ADDED SUCCESSFULLY!");

      // })


}
// let flaG = 0;
// document.getElementById("input_fileimg").addEventListener('change', () => {
//   flaG = 1;
// })

// add_image


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
    const pinpattern =/^\d{6}$/

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
        dob_addValidation.textContent ="Date of Birth is required"
        Valid = false;
    }

    // validation of form ...

    if (salutation == "" || salutation == "select") {
        document.getElementById('salutationerror').textContent = "salutation is required";
        Valid=false;
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
        Valid =false;
    }


    if (qualifications == "") {
        document.getElementById('qualificationerror').textContent = "Qualifications are required"
        Valid =false;

    }

    if (address == "") {
        document.getElementById('addresserror').textContent = "Address is required"
        Valid =false;
    }

    if (country == "" || country == "select") {
        document.getElementById('countryerror').textContent = "Country is required"
        Valid =false;
    }
    if (state == "" || state == "select") {
        document.getElementById('stateerror').textContent ="State is required"
        Valid =false;
    }

    if (city == "") {
        document.getElementById('cityerror').textContent = "City is required"
        Valid =false;
    }

    
    if (username == "") {
        document.getElementById('usernameerror').textContent = "*Username is required"
        Valid =false;
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
document.getElementById('addemployee').addEventListener('input', () => {
  const containers = document.querySelectorAll('#addemployee div');
  containers.forEach(container => {
    const input = container.querySelector('input');
    const errorElement = container.querySelector('.text-danger');
    if (input && errorElement && input === document.activeElement) {
      errorElement.textContent = ""; // Clear the error message
    }
  });
});


function ClearAddform() {
    var defaultImage =document.getElementById('upload_img');
    defaultImage.src='images/avatardp.jpg';

    document.getElementById('salutationerror').textContent = "";
    document.getElementById('FirstNameerror').textContent = "";
    document.getElementById('LastNameerror').textContent = "";
    document.getElementById('Emailerror').textContent = "";
    document.getElementById('Mobilenumbererror').textContent = "";
    document.getElementById('Qualificationerror').textContent = "";
    document.getElementById('Addresserror').textContent = "";
    document.getElementById('Countryerror').textContent = "";
    document.getElementById('Stateerror').textContent = "";
    document.getElementById('Cityerror').textContent = "";
    document.getElementById('Pinerror').textContent = "";
    document.getElementById('Usernameerror').textContent = "";
    document.getElementById('Passworderror').textContent = "";
    document.getElementById('doberror').textContent = "";
    document.getElementById('gendererror').textContent = "";


    document.getElementById("salutation").value = "select";
    document.getElementById("FirstName").value = "";
    document.getElementById("LastName").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Mobilenumber").value = "";
    const radiobuttons = document.querySelectorAll('input[name="gender"]:checked');
    document.getElementById("Qualification").value = "";
    document.getElementById("Address").value = "";
    document.getElementById("Country").value = "Select";
    document.getElementById("State").value = "Select";
    document.getElementById("City").value = "";
    document.getElementById("Pin").value = "";
    document.getElementById("Username").value = "";
    document.getElementById("Password").value = "";
    document.getElementById('date').value = "";
    radiobuttons.forEach(function (radiobuttons) {
        radiobuttons.checked = false;
    });

}
//edit employee.......
function cancelx_edit() {
  document.getElementById("editemployee").style.display = "none"
  document.getElementById("overlay").style.display = "none"

}
function cancel_edit() {
  document.getElementById("editemployee").style.display = "none"
  document.getElementById("overlay").style.display = "none"

}
// update image of edit.............


let edit_imagedp = document.getElementById('image_editUpload')
edit_imagedp.addEventListener('click', () => {

    let profilEditepic = document.getElementById("upload_editimage");
    let inputEditfile = document.getElementById("input_fileimg");
    inputEditfile.onchange = function () {
        profilEditepic.src = URL.createObjectURL(inputEditfile.files[0]);
    }

})
function edit_employee(empid) {
  document.getElementById("editemployee").style.display = "block"
  document.getElementById("overlay").style.display = "block"

  fetch(`http://localhost:3000/employees/${empid}`, {
    method: 'GET',
    headers:
    {
      'Content-type': 'application/json',
    },
 
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data saved successfully", data);

      console.log(data)
      var img = document.getElementById("upload_editimage");
      img.src = `http://localhost:3000/employees/${empid}/avatar`;
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

      //date formate change............. 
      let [day, month, year] = data.dob.split("-");
      let newdob = `${year}-${month}-${day}`;
      document.getElementById('edit_date').value = newdob;



      //gender............
      document.querySelector(`input[name='editgender'][value='${data.gender}']`).checked = true;

    })
  const updatedEmployee = document.getElementById('updateEmployee')
  updatedEmployee.addEventListener('click', () => {
const updatedvalidation = editvalidation();
if(!updatedvalidation){
 return;
}
else{
  savechanges(empid);
}
    
  })
}
function image_preview(){
  const imgPreview = document.getElementById("input_fileimg");
  imgPreview.src = URL.createObjectURL(event.target.files[0]);
}

function savechanges(empid) {


  let salutation = document.getElementById("edit_salutation").value
  let firstName = document.getElementById("edit_fristname").value
  let lastName = document.getElementById("edit_lastname").value
  let email = document.getElementById("edit_email").value
  let phone = document.getElementById("edit_phone").value
  let qualifications = document.getElementById("edit_quqlification").value
  let address = document.getElementById("edit_address").value
  let country = document.getElementById("edit_country").value
  let state = document.getElementById("edit_state").value
  let city = document.getElementById("edit_city").value
  let zip = document.getElementById("edit_zip").value
  let username = document.getElementById("edit_username").value
  let password = document.getElementById("edit_password").value
  let dateofBirth = document.getElementById("edit_date").value
  let gender = document.getElementById("edit_gender").value

  let [year, month, day] = dateofBirth.split("-");
  // let year = fulldate[0];
  // let month = fulldate[1];
  // let day = fulldate[2];

  let formateddate = `${day}-${month}-${year}`;

  let empdata_add = {
    salutation,
    firstName,
    lastName,
    email,
    phone, 
    dob: formateddate,
    gender,
    qualifications,
    address,
    city,
    state,
    country,
    username,
    password,
    zip,
  }
  fetch(`http://localhost:3000/employees/${empid}`, {
    method: "PUT",
    headers: {

      "content-type": "application/json"
    },
    body: JSON.stringify(empdata_add),
  })
    .then((res) => {
      return res.json();
    })
    // .then(()=>{
    //  
    // })
    .then((data) => {
      console.log("successfully saved", data);
      const inputfile = document.getElementById("input_fileimg");
        let formdata = new FormData()
        formdata.append("avatar", inputfile.files[0]);
        fetch(`http://localhost:3000/employees/${empid}/avatar`, {
            method: "POST",
            body: formdata,
        });
    

      window.location.href = 'index.html'
    })

}
function editvalidation(){
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

  // patterns

  const namePattern = /^[A-za-z]+$/
  const phonePattern = /^\d{10}$/
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const pinpattern =/^\d{6}$/

  let Valid = true;
  
    // validation of dob & gender

    if (gender) {
      gender_editValidation.textContent = ""

  }
  else {
      gender_editValidation.textContent = "gender is required"
      Valid = false;

  }

  // if (dob_value === "") {
  //     dob_editValidation.textContent ="Date of Birth is required"
  //     Valid = false;
  // }

  if (salutation == "" ||salutation == "select") {
    document.getElementById('edit_salutationerror').textContent = "salutation is required";
    Valid=false;
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
    Valid =false;
}


if (qualifications == "") {
    document.getElementById('edit_qualificationerror').textContent = "Qualifications are required"
    Valid =false;

}

if (address == "") {
    document.getElementById('edit_addresserror').textContent = "Address is required"
    Valid =false;
}

if (country == "" || edit_country == "select") {
    document.getElementById('edit_countryerror').textContent = "Country is required"
    Valid =false;
}
if (state == "" || edit_state == "select") {
    document.getElementById('edit_stateerror').textContent ="State is required"
    Valid =false;
}

if (city == "") {
    document.getElementById('edit_cityerror').textContent = "City is required"
    Valid =false;
}


if (username == "") {
    document.getElementById('edit_usernameeror').textContent = "*Username is required"
    Valid =false;
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

document.getElementById('editemployee').addEventListener('input', () => {
  const containers = document.querySelectorAll('#editemployee div');
  containers.forEach(container => {
    const input = container.querySelector('input');
    const errorElement = container.querySelector('.text-danger');
    if (input && errorElement && input === document.activeElement) {
      errorElement.textContent = ""; // Clear the error message
    }
  });
});


function ClearAddform() {
    var defaultImage =document.getElementById('upload_img');
    defaultImage.src='images/avatardp.jpg';

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
//  delete_Employe.........................


// let de = document.getElementById("delete_close")
// de.addEventListener('click', () => {
//   Deleteclosefunction()
// })

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
    deletefunction(empid);
  })

}
function delete_cancel() {
  document.getElementById("delete").style.display = "none";
  document.getElementById("overlay").style.display = "none";

}

function deletefunction(empid) {
  fetch(`http://localhost:3000/employees/${empid}`, {

    method: 'DELETE',

  })

    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log("Data Deleted!", data);

      Deleteclosefunction()
      window.location.href = 'index.html'

    })
}


// document.getElementById("delete_cancel").onclick = function () {
//   Deletecancelfunction()
// }


function Deletecancelfunction() {
  document.getElementById("delete").style.display = "none"
  document.getElementById("overlay").style.display = "none"

}

//search bar....
function searchdata() {
  let filter = document.getElementById('searchinput').value.toUpperCase();
  let tabledata = document.getElementById('tabledata')
  let tr = tabledata.getElementsByTagName('tr')
  for (let i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName('td')[0];
    if (td) {
      let txtvalue = td.textContent || td.innerHTML
      if (txtvalue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""

      }
      else {
        tr[i].style.display = "none"
      }
    }
  }
}
// clear message while input...



// document.getElementById('add_form').addEventListener('input',(event)=>{
//   inputid= event.target.id;
//   const errorid =`${inputid}error`;

// })












