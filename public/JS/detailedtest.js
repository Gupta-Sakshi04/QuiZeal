var link = window.location.href
id = link.substr(link.indexOf('=') + 1)

fetch('http://localhost:3000/api/test/' + id + '/questions', {
        method: 'GET',
        withCredentials: true
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appenddata(data);
    })
    .catch(function (err) {
        console.log('error ' + err);
    });

function appenddata(data) {
    document.title = data.name
    document.getElementById("headd").innerHTML = data.name
    document.getElementById("duration").innerHTML = 'Duration = ' + data.duration.hours + ':' + data.duration.minutes + ':' + data.duration.seconds + ' '
    // document.getElementById("instruct").innerHTML=data.instructions
    var mainContainer = document.getElementById("quesdata")
    for (i = 0; i < data.questions.length; i++) {
        c = 1
        var x = ""
        for (var j = 0; j < data.questions[i].answers.length; j++) {
            x += `<div>` + c + ') ' + data.questions[i].answers[j].option + `</div>`
            c = c + 1
        }
        var div = document.createElement("tr")
        div.innerHTML = `<tr>
        <td>
            <h4>` + data.questions[i].question + `</h4>
            <div id="options">` + x + `
            <div>` + "Correct Answer: " + data.questions[i].answer + `
            </div>
            <div>` + data.questions[i].explanation + `
        <td>
        <button class="button is-small is-danger" onclick=Deletethis("` + data.questions[i]._id + `")>Delete Ques</button>
        </td>
    </tr>`
        mainContainer.appendChild(div)
    }
}

async function Deletethis(thisid) {
    console.log('Deleteques', id)
    const response = await fetch('http://localhost:3000/api/test/' + id + '/questions/' + thisid, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        } // string or object
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}
async function ClearTest() {
    console.log('Clear test pressed', id)
    const response = await fetch('http://localhost:3000/api/test/' + id + '/questions', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        } // string or object
    });
    const myJson = await response.json();
    // console.log(myJson)
    window.location.reload();
}

var options=[]

function addOption() {
    // console.log('button pressed')
        var text = document.getElementById("option").value;
        const a = {
            "option": text
        }
        // console.log(document.getElementById("option").value)
        // console.log(text);
        options.push(a) //.value gets input values
        var li=document.createElement('div')
        li.innerHTML = `<div class="form-group">
        <input class="form-control-sm" value=` + text + ` readonly>
        </div>`;
        var doc= document.getElementById('list')
        doc.appendChild(li);
        // console.log(options)
        document.getElementById("option").value=null;
    
}

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    console.log(value)
    // console.log(value.answers)
    value.answers=options
    const response = await fetch('http://localhost:3000/api/test/' + id + '/questions', {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(JSON.stringify(value))
    const myJson = await response.json();
    console.log(myJson)
    if (myJson.status == "ok") {
    window.location.reload();

    } else {
        console.log(myJson)
        document.getElementById("error_test").innerHTML = myJson.error
    }
}
const form = document.getElementById("add_ques")
form.addEventListener('submit', handleSubmit);