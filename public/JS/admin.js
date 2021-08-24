function myFunction() {
    console.log('here in the function')
    let root = document.documentElement;
    let x = document.getElementById("img");
    root.classList.toggle("dark-mode");
    // x.classList.toggle("inverted");
}
var studentdata;
var facultydata;

fetch('http://localhost:3000/api/admin/getusers', {
        method: 'GET',
        withCredentials: true
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        studentdata = data;
        appendUsers(data);
    })
    .catch(function (err) {
        console.log('error ' + err);
    });

fetch('http://localhost:3000/api/admin/getfaculty', {
        method: 'GET',
        withCredentials: true
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        facultydata = data;
        appendFaculty(data);
    })
    .catch(function (err) {
        console.log('error ' + err);
    });

function appendFaculty(data) {
    var mainContainer = document.getElementById("FacAppData");
    document.getElementById("NFac").innerHTML = data.length
    var count = 0
    for (var i = 0; i < data.length; i++) {
        if (data[i].isApproved === false) {
            count += 1
            var div = document.createElement('tr');
            div.innerHTML = `<tr>
                <td width="5%">
                    <i class="fa fa-bell-o"></i>
                </td>
                <td>` +
                data[i].profName + ' ' + data[i].profId +
                `</td>
                <td class="">
                    <button class="button is-small is-primary" onclick=ApproveFaculty("` + data[i]._id + `")>Approve</button>
                </td>
                <td class="">
                    <button class="button is-small is-danger" onclick=DeleteFaculty("` + data[i]._id + `")>DisApprove</button>
                </td>
                </tr>`
            mainContainer.appendChild(div);
        }
        document.getElementById("NFacApp").innerHTML = count
    }
}

function appendUsers(data) {
    document.getElementById("NStd").innerHTML = data.length
    var mainContainer = document.getElementById("myData");
    var count = 0

    for (var i = 0; i < data.length; i++) {
        if (data[i].isApproved === false) {
            count += 1
            var div = document.createElement('tr');
            div.innerHTML = `<tr>
                <td width="5%">
                    <i class="fa fa-bell-o"></i>
                </td>
                <td>` +
                data[i].fullName + ' ' + data[i].rollNumber +
                `</td>
                <td class="">
                    <button class="button is-small is-primary" onclick=ApproveStudent("` + data[i]._id + `")>Approve</button>
                </td>
                <td class="">
                    <button class="button is-small is-danger" onclick=DeleteStudent("` + data[i]._id + `")>DisApprove</button>
                </td>
                </tr>`
            mainContainer.appendChild(div);
        }
    }
    document.getElementById("NStdApp").innerHTML = count
}

async function DeleteFaculty(_id) {
    console.log('delete Pressed ' + _id)
    const myBody = {
        "_id": _id
    }
    const response = await fetch('http://localhost:3000/api/admin/deletefaculty', {
        method: 'DELETE',
        body: JSON.stringify(myBody),
        headers: {
            'Content-Type': 'application/json'
        } // string or object
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}

async function ApproveFaculty(_id) {
    console.log('Approve Pressed ' + _id)
    const response = await fetch('http://localhost:3000/api/admin/approvefaculty/' + _id, {
        method: 'PUT',
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}

async function DeleteStudent(_id) {
    console.log('delete Pressed ' + _id)
    const myBody = {
        "_id": _id
    }
    console.log(myBody)

    const response = await fetch('http://localhost:3000/api/admin/deletestudent', {
        method: 'DELETE',
        body: JSON.stringify(myBody),
        headers: {
            'Content-Type': 'application/json'
        } // string or object
    });

    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}

async function ApproveStudent(_id) {
    console.log('Approve Pressed ' + _id)
    const response = await fetch('http://localhost:3000/api/admin/approvestudents/' + _id, {
        method: 'PUT',
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}

function validateregistration() {
    var name = document.forms["RegForm"]["fullName"];
    var email = document.forms["RegForm"]["email"];
    var phone = document.forms["RegForm"]["phoneNumber"];
    var branch = document.forms["RegForm"]["branch"];
    var password = document.forms["RegForm"]["password"];
    var roll = document.forms["RegForm"]["rollNumber"];

    if (name.value == "") {
        window.alert("Please enter your Name.");
        name.focus();
        return false;
    }

    if (roll.value == "") {
        window.alert("Please enter your RollNumber.");
        roll.focus();
        return false;
    }

    if (email.value == "") {
        window.alert(
            "Please enter a valid E-Mail Address.");
        email.focus();
        return false;
    }

    if (phone.value == "") {
        window.alert(
            "Please enter your Phone Number.");
        phone.focus();
        return false;
    }

    if (password.value == "") {
        window.alert("Please enter your password");
        password.focus();
        return false;
    }
    if (password.value.length < 6) {
        window.alert("Please Keep Minimum password Length: 7");
        password.focus();
        return false;
    }
    return true;
}
async function handleSubmituser(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    console.log(value)
    value['isApproved']="true"
    value.phoneNumber= +value.phoneNumber
    const response = await fetch('/api/admin/adduser', {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(JSON.stringify(value))
    const myJson = await response.json();
    console.log(response)
    console.log(myJson)
    if (myJson.status === "error") {
        document.getElementById("error_reg").innerHTML = myJson.error
    }
    else window.location.reload();
}
const form = document.getElementById("sign_id")
form.addEventListener('submit', handleSubmituser);



function deletebyroll() {
    var roll = document.getElementById("roll").value
    for (var i = 0; i < studentdata.length; i++) {
        if (roll === studentdata[i].rollNumber) {
            DeleteStudent(studentdata[i]._id);
            break;
        }
    }
    window.location.reload();
}


async function handleSubmitfac(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    value['isApproved']=true
    console.log(value)
    const response = await fetch('/api/faculty/register', {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(typeof (JSON.stringify(value)))
    const myJson = await response.json();
    console.log(myJson)
    if (myJson.status === "error") {
        document.getElementById("error_reg_fac").innerHTML = myJson.error
    }
    else window.location.reload();
}
const form_fac = document.getElementById("add_fac")
form_fac.addEventListener('submit', handleSubmitfac);


function deletebyprofid() {
    var prof = document.getElementById("profId").value
    console.log(prof)
    for (var i = 0; i < facultydata.length; i++) {
        if (prof === facultydata[i].profId) {
            DeleteFaculty(facultydata[i]._id);
            break;
        }
    }
    window.location.reload();
}