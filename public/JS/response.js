var link = window.location.href
id = link.substr(link.indexOf('=') + 1)
console.log(id)
console.log('linked')
// console.log('http://localhost:3000/api/response/'+id)
fetch('http://localhost:3000/api/response/'+id,{
    method: 'GET',
    headers: {
        'content-type':'application/json'
    }
})

    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendresponses(data);
    })
    .catch(function (err) {
        console.log('error occured')
        console.log('error ' + err);
    });

function appendresponses(data) {
    console.log('here')
    console.log(data)
    function SortByID(x,y) {
        return ((x.rollNumber == y.rollNumber) ? 0 : ((x.rollNumber > y.rollNumber) ? 1 : -1 ));
      }
    data.sort(SortByID);
    document.getElementById('head').innerHTML=data[0].name
    var mainContainer = document.getElementById("responsetable");
    for (var i = 0; i < data.length; i++) {
            var div = document.createElement('tr');
            div.innerHTML = `<tr>
            <td>`+data[i].rollNumber+`</td>
            <td>`+data[i].branch+`</td>
            <td>`+data[i].marks+`</td>
        </tr>`
            mainContainer.appendChild(div);
    }
}

async function deleteresponses() {
    console.log('Delete Pressed')
    const response = await fetch('http://localhost:3000/api/response/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        } // string or object
    });
    const myJson = await response.json();
    console.log(myJson)
    window.location.reload();
}