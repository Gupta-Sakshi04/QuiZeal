fetch('http://localhost:3000/api/admin/getfaculty')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendUsers(data);
    })
    .catch(function (err) {
        console.log('error ' + err);
    });

function appendUsers(data) {
    function SortByID(x,y) {
        return ((x.profId == y.profId) ? 0 : ((x.profId > y.profId) ? 1 : -1 ));
      }
    data.sort(SortByID);  
    var mainContainer = document.getElementById("myData");
    for (var i = 0; i < data.length; i++) {
            var div = document.createElement('tr');
            div.innerHTML = `<tr>
            <td>`+data[i].profId+`</td>
            <td>`+data[i].profName+`</td>
            <td>`+data[i].branch+`</td>
            <td>`+data[i].email+`</td>
            <td>`+data[i].phoneNumber+`</td>
        </tr>`
            mainContainer.appendChild(div);
    }
    document.getElementById("NStdApp").innerHTML = count
}