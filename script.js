const getdata= async ()=>{
    const res =await fetch("http://localhost:3000/employees");
    const data = await res.json();
    console.log(data);
    let dataone = " ";
    let slno = 0;
    data.map((value)=>{
        dataone += `<tr>
        <th scope ="row">#${++slno}</th>
        <td>  ${value.salutation} ${value.firstName} ${value.lastName}</td>
        <td>${value.email}</td>
   <td>${value.phone}</td>
   <td>${value.gender}</td>
   <td>${value.dob}</td>
   <td>${value.country}</td>
   <td>
        
    <div class="dropdown">
    <button class="btn" type ="button" id="dropdownmenu2" data-bs-toggle="dropdown" aria-expanded="false">
    <i class="fa-solid fa-ellipsis"></i>
    
    </button>
    <ul class="dropdown-menu" arial-labelledby="dropdownMenu2">
    <li onclick="view_employee('${value.id}')"><a class="dropdown-item" href="view.html?id=${value.id}"><i class="fa-regular fa-eye"></i> View Details</a></li>
    <li onclick= "edit_employee('${value.id}')"><a  class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit </a> </li>
    <li onclick="delete_Employee('${value.id}')"><a class="dropdown-item" href="#"><i class="fa-regular fa-trash-can"></i> Delete </a></li>
     </ul>
    </div>
      </td>
     
    </tr>`
    })
    document.getElementById('tablebody').innerHTML = dataone;
};

getdata();


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

//   add employeee...
window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('addemp').addEventListener("click", (event) => {
     
    });
  });
  
function data_add() {
    let salutation = document.getElementById("salutation").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("Emai1").value;
    let phone = document.getElementById("phone").value;
    let dateofBirth = document.getElementById("date").value;
    let gender = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
    let qualifications = document.getElementById("Qualifications").value;
    let address = document.getElementById("Address").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let country = document.getElementById("country").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let zip = document.getElementById("Zip").value;
  
    let fulldate = dateofBirth.split("-");
    let formattedDate = `${fulldate[2]}-${fulldate[1]}-${fulldate[0]}`;
  
    let empData = {
      salutation,
      firstName,
      lastName,
      email,
      phone,
      dob: formattedDate,
      gender,
      qualifications,
      address,
      city,
      state,
      country,
      username,
      password,
      zip,
    };
  
    new_add_data(empData);
  }
  function new_add_data(empData) {
    fetch(`http://localhost:3000/employees`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(empData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("successfully saved", data);
        window.location.href = 'index.html'; // Redirect to index.html after saving
      });
  }
    