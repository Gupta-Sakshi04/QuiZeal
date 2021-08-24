fetch('http://localhost:3000/api/test/list', {
        method: 'GET',
        withCredentials: true
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendtests(data);
    })
    .catch(function (err) {
        console.log('error ' + err);
    });

function appendtests(data) {
    console.log(data)
    var mainContainer = document.getElementById("testdata");
    // document.getElementById("testdata").innerHTML = data.length
    var count = 0
    for (var i = 0; i < data.length; i++) {
        var b= localStorage.getItem('branch');
        console.log(b)
        if(b==data[i].branch)
        {
            count += 1
        var x;
        if(data[i].isEnabled==true) x="checked"
        else x= "unchecked"
        var con = document.createElement("tr");
        con.innerHTML = `<tr>
        <td class="col-1">` + count + `</td>
        <td class="col-1">` + data[i].branch + ` </td>
        <td class="col-4">` + data[i].name + `</td>
        <td class="col-1">` + data[i].duration.hours + ':' + data[i].duration.minutes + ':' + data[i].duration.seconds + `</td>
        <td class="col-1">
            <a class="button is-small is-primary" onclick=getresponses("` + data[i]._id + `")>Responses</a>
        </td>
        <td class="col-1">
            <a class="button is-small is-primary" onclick=getquestions("` + data[i]._id + `")>Details</a>
        </td>
        <td class="col-1">
            <button class="button is-small is-danger" onclick=DeleteTest("` + data[i]._id + `")>Delete Test</button>
        </td>
        <td class="col-1">
            <label class="switch">
            <input type="checkbox"`+x+` id="checktest`+ count +`" onclick=EnableDisabletest("`+ data[i]._id +`",`+ count +`)>
            <span class="slider round"></span>
          </label>
        </td>
        </tr>`
        
        mainContainer.appendChild(con);
        }
    }
}

async function EnableDisabletest(id,i) {
    // console.log(i, id)
    var checkBox = document.getElementById("checktest"+i, id);
    // console.log(checkBox)
    var check
    if (checkBox.checked == true) {
        check=true;
    } else {
        check=false;
    }
    console.log(check)
    const response = await fetch('http://localhost:3000/api/test/list/' + id, {
        method: 'PUT',
        body: JSON.stringify({
            "isEnabled": check
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}

async function DeleteTest(id) {
    console.log('Delete Pressed', id)
    const response = await fetch('http://localhost:3000/api/test/list/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        } // string or object
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}

async function DeleteAllTest() {
    console.log('Delete All Pressed')
    const response = await fetch('http://localhost:3000/api/test/list', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}

async function getquestions(id) {
    location.href = "detailedtest.html?id=" + id
}
async function getresponses(id) {
    location.href = "showresponses.html?id=" + id
}