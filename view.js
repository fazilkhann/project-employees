function overlayback() {
    document.getElementById("overlay").style.display = "none"
    document.getElementById("editemployee_view").style.display = "none"
    document.getElementById("view_delete").style.display = "none";
}
let initialEditData = {};

// Fetch employee data on page



document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    console.log("received", id);    
    view_employee(id);
});

// Fetch and display employee data.......

function view_employee(id) {
    fetch(`http://localhost:3000/employees/${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            initialEditData = { ...data };

            let name = `${data.salutation} ${data.firstName} ${data.lastName}`;
            let details = `${data.address} ${data.state} ${data.country} ${data.zip}`;

            document.getElementById('viewimage').src = `http://localhost:3000/employees/${id}/avatar`;
            document.getElementById('viewname').innerHTML = name;
            document.getElementById('viewemail').innerHTML = data.email;
            document.getElementById('viewgender').innerHTML = data.gender;
            document.getElementById('viewdob').innerHTML = data.dob;
            document.getElementById('viewphone').innerHTML = data.phone;
            document.getElementById('viewqualification').innerHTML = data.qualifications;
            document.getElementById('viewaddress').innerHTML = details;
            document.getElementById('viewusername').innerHTML = data.username;

            // display age
            let [day, month, ageyear] = data.dob.split("-");
            const newyear = `${ageyear}`;
            const date = new Date();
            let year = date.getFullYear();
            const age = year - newyear;
            document.getElementById('viewage').innerHTML = age;
        })
        .catch(error => console.error('Error:', error));
}

// update ......

function displaydata() {
    document.getElementById("editemployee_view").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}


function cancelx_view() {
    document.getElementById("editemployee_view").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

document.getElementById("viewedit").addEventListener("click", () => {
    edit_detail();
});

// display data ....



function edit_detail() {
    const data = initialEditData;

    if (data) {
        document.getElementById("upload_editimage").src = `http://localhost:3000/employees/${data.id}/avatar`;
        document.getElementById("view_salutation").value = data.salutation;
        document.getElementById("view_fristname").value = data.firstName;
        document.getElementById("view_lastname").value = data.lastName;
        document.getElementById("view_email").value = data.email;
        document.getElementById("view_phone").value = data.phone;
        document.getElementById("view_quqlification").value = data.qualifications;
        document.getElementById("view_address").value = data.address;
        document.getElementById("view_city").value = data.city;
        document.getElementById("view_state").value = data.state;
        document.getElementById("view_country").value = data.country;
        document.getElementById("view_zip").value = data.zip;
        document.getElementById("view_username").value = data.username;
        document.getElementById("view_password").value = data.password;
        document.getElementById("view_gender").value = data.gender;

        let [day, month, year] = data.dob.split("-");
        document.getElementById('view_date').value = `${year}-${month}-${day}`;

        document.querySelector(`input[name='editgender'][value='${data.gender}']`).checked = true;
        document.getElementById("input_fileimg").src = `http://localhost:3000/employees/${data.id}/avatar`;
    }

    // validation......



    const updatedEmployee = document.getElementById('updateEmployee');
    updatedEmployee.addEventListener('click', function handleClick() {
        const updatedValidation = editvalidation();
        if (!updatedValidation) return;

        if (dataChanges()) {
            saveChanges(data.id);
        } else {
            cancelx_view();
        }

        updatedEmployee.removeEventListener('click', handleClick);
    });

    displaydata(); 
}

// Check if there are any changes in the form............


function dataChanges() {
    const currentData = getCurrentFormData();
    const imageChanged = document.getElementById("input_fileimg").files.length > 0;
    let hasChanges = false;

    if (Object.keys(currentData).some(key => currentData[key] !== initialEditData[key]) || imageChanged) {
        hasChanges = true;
    }

    return hasChanges;
}


// Get current form data
function getCurrentFormData() {
    let dateofBirth = document.getElementById("view_date").value;
    let [year, month, day] = dateofBirth.split("-");
    let formattedDate = `${day}-${month}-${year}`;

    return {
        salutation: document.getElementById("view_salutation").value,
        firstName: document.getElementById("view_fristname").value,
        lastName: document.getElementById("view_lastname").value,
        email: document.getElementById("view_email").value,
        phone: document.getElementById("view_phone").value,
        dob: formattedDate,
        gender: document.querySelector('input[name="editgender"]:checked').value,
        qualifications: document.getElementById("view_quqlification").value,
        address: document.getElementById("view_address").value,
        city: document.getElementById("view_city").value,
        state: document.getElementById("view_state").value,
        country: document.getElementById("view_country").value,
        username: document.getElementById("view_username").value,
        password: document.getElementById("view_password").value,
        zip: document.getElementById("view_zip").value,
    };
}

// Save changes if there are any



function saveChanges(id) {
    const employeeData = getCurrentFormData();

    fetch(`http://localhost:3000/employees/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(employeeData),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Successfully saved", data);

            if (document.getElementById("input_fileimg").files.length > 0) {
                const inputFile = document.getElementById('input_fileimg');
                const formData = new FormData();
                formData.append("avatar", inputFile.files[0]);

                fetch(`http://localhost:3000/employees/${id}/avatar`, {
                    method: "POST",
                    body: formData,
                })
                    .then(response => {
                        if (!response.ok) {
                            console.log("Avatar image upload failed");
                        } else {
                            console.log("Avatar upload success");
                        }
                    });
            }
        })
        .then(() => {
            Swal.fire({
                title: "Data updated!",
                icon: "success"
            });
            cancelx_view(); 
        })
        .catch(error => console.error('Error:', error));
}


// Preview image before upload

document.getElementById("input_fileimg").addEventListener("change", (event) => {
    const imgPreview = document.getElementById("upload_editimage");
    imgPreview.src = URL.createObjectURL(event.target.files[0]);
});



function cancelEditView() {
    document.getElementById("editemployee_view").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}



function cancelEditView() {
    document.getElementById("editemployee_view").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
let flag = 0;
document.getElementById("input_fileimg").addEventListener('change', () => {
    flag = 1;
})





function editvalidation() {
    const salutation = document.getElementById("view_salutation").value.trim();
    const firstName = document.getElementById("view_fristname").value.trim();
    const lastName = document.getElementById("view_lastname").value.trim();
    const email = document.getElementById("view_email").value.trim();
    const phone = document.getElementById("view_phone").value.trim();

    const gender = document.querySelector('input[name="editgender"]:checked')
    const gender_editValidation = document.getElementById("view_gendererror")


    const qualifications = document.getElementById("view_quqlification").value.trim();
    const address = document.getElementById("view_address").value.trim();
    const country = document.getElementById("view_country").value.trim();
    const state = document.getElementById("view_state").value.trim();
    const city = document.getElementById("view_city").value.trim();
    const zip = document.getElementById("view_zip").value.trim();
    const username = document.getElementById("view_username").value.trim();
    const password = document.getElementById("view_password").value.trim();



    // patterns....

    const namePattern = /^[A-za-z]+$/
    const phonePattern = /^\d{10}$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const pinpattern = /^\d{6}$/

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
        document.getElementById('view_salutationerror').textContent = "salutation is required";
        Valid = false;
    }

    if (!namePattern.test(firstName)) {
        document.getElementById('view_fristnameerror').textContent = "First Name is required"
        Valid = false;
    }

    if (!namePattern.test(lastName)) {
        document.getElementById('view_lastnameerror').textContent = "Last Name is required"
        Valid = false;
    }
    if (!emailPattern.test(email)) {
        document.getElementById('view_emailerror').textContent = "Email is required"
        Valid = false;
    }

    if (!phonePattern.test(phone)) {
        document.getElementById('view_phoneerror').textContent = "Phone is required"
        Valid = false;
    }
    if (!pinpattern.test(zip)) {
        document.getElementById('view_ziperror').textContent = "Pin is required"
        Valid = false;
    }


    if (qualifications == "") {
        document.getElementById('view_quqlificationerror').textContent = "Qualifications are required"
        Valid = false;

    }

    if (address == "") {
        document.getElementById('view_addresserror').textContent = "Address is required"
        Valid = false;
    }

    if (country == "" || country == "select") {
        document.getElementById('view_countryerror').textContent = "Country is required"
        Valid = false;
    }
    if (state == "" || state == "select") {
        document.getElementById('view_stateerror').textContent = "State is required"
        Valid = false;
    }

    if (city == "") {
        document.getElementById('view_cityerror').textContent = "City is required"
        Valid = false;
    }


    if (username == "") {
        document.getElementById('view_usernameerror').textContent = "*Username is required"
        Valid = false;
    }

    if (password == "") {
        document.getElementById('view_passworderror').textContent = "Password is required"
        Valid = false;
    }


    // validation of gender

    const male = document.getElementById("maleId")
    const female = document.getElementById("femaleId")

    male.addEventListener("click", () => {
        document.getElementById("view_gendererror").textContent = "";
    })

    female.addEventListener("click", () => {
        document.getElementById("view_gendererror").textContent = "";
    })


    return Valid;
}

document.getElementById('editemployee_view').addEventListener('input', () => {
    const containers = document.querySelectorAll('#editemployee_view div');
    containers.forEach(container => {
        const input = container.querySelector('input');
        const errorElement = container.querySelector('.text-danger');
        if (input && errorElement && input === document.activeElement) {
            errorElement.textContent = ""; // Clear the error message
        }
    });
});


function Cleareditform() {
    // var defaultImage =document.getElementById('upload_img');
    // defaultImage.src='images/avatardp.jpg';

    document.getElementById('view_salutationerror').textContent = "";
    document.getElementById('view_fristnameerror').textContent = "";
    document.getElementById('view_lastnameerror').textContent = "";
    document.getElementById('view_emailerror').textContent = "";
    document.getElementById('view_phoneerror').textContent = "";
    document.getElementById('view_quqlificationerror').textContent = "";
    document.getElementById('view_addresserror').textContent = "";
    document.getElementById('view_countryerror').textContent = "";
    document.getElementById('view_stateerror').textContent = "";
    document.getElementById('view_cityerror').textContent = "";
    document.getElementById('view_ziperror').textContent = "";
    document.getElementById('view_usernameerror').textContent = "";
    document.getElementById('view_passworderror').textContent = "";
    document.getElementById('view_dateerror').textContent = "";
    document.getElementById('view_gendererror').textContent = "";

}

//  delete_Employe.........................

function cancelfunc() {
    document.getElementById('view_delete').style.display = "block"
    document.getElementById("overlay").style.display = "block";

}


let de = document.getElementById("delete_close")
de.addEventListener('click', () => {
    Deleteclosefunction()
})



function Deleteclosefunction() {
    document.getElementById("view_delete").style.display = "none"
    document.getElementById("overlay").style.display = "none"

}

function delete_Employee() {
    document.getElementById("view_delete").style.display = "block"
    document.getElementById("overlay").style.display = "block"

}
const deletebviewEmployee = document.getElementById('deleteData')
deletebviewEmployee.addEventListener('click', () => {
    deletefunction(id);

})


function delete_cancel() {
    document.getElementById("view_delete").style.display = "none";
    document.getElementById("overlay").style.display = "none";

}

function deletefunction(id) {
    fetch(`http://localhost:3000/employees/${id}`, {
        method: 'DELETE'

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

