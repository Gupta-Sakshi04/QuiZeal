 var b = document.forms["New-TestForm"]["branch"]
    b.value = localStorage.getItem("branch")
    console.log(localStorage.getItem("branch"))
    
    var options=[]
    var problems=[]

    function addOption()
    {
        // console.log('button pressed')
        var text = document.getElementById("option").value;
        const a = {
            "option": text
        }
        options.push(a)
        var li=document.createElement('div')
        li.innerHTML = `<div class="form-group">
        <input class="form-control-sm" value=` + text + ` readonly>
        </div>`;
        var doc= document.getElementById('list')
        doc.appendChild(li);
        document.getElementById("option").value=null
    }

    function handleSubmitques(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());
        // console.log(value)
        // console.log(value.answers)
        console.log(options)
        value.answers=options
        // console.log(JSON.stringify(value))
        problems.push(value)
        console.log(problems)
        var li="";
        for(var i=0;i<options.length;i++)
        {
            li+=`<div class="form-group">
            <input class="form-control-sm" value="`+ options[i].option+`" readonly>
            </div>`
            // li+="<li>"+options[i].option+"</li>"
        }
        // console.log(li)
        // console.log(options)
        var scan=document.getElementById("appended")
        var x=document.createElement("div")
        x.innerHTML=`<div class="p-2 m-2 form-group" style="border: 2px solid grey">
        <div class="form-group">
            <textarea class="form-control" rows="2" readonly>`+value.question+`</textarea>
        </div>
        <div class="form-group">
            `+li+`
          </div>

        <div class="form-group">
            <input class="form-control-sm" value=`+value.answer + ` readonly>
        </div>
        <div class="form-group">
            <textarea class="form-control" readonly>`+value.explanation+`</textarea>
        </div>
    </div>`
        scan.appendChild(x)
        document.getElementById("add_ques").reset();
        $('#quesModal').modal('hide');
        document.getElementById("list").innerHTML=null
        options=[]
        // var e = document.querySelector("list");
        // e.innerHTML = "";
        
    }
    const form = document.getElementById("add_ques")
    form.addEventListener('submit', handleSubmitques);


    async function handleSubmitfinal(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());
        console.log(value)
        var d= {
            hours: value.hours,
            minutes: value.minutes,
            seconds: value.seconds

        }
        delete value.seconds
        delete value.minutes
        delete value.hours
        value["duration"]= d;
        value["questions"]=problems;
        console.log(value)

        const response = await fetch('/api/test/list', {
            method: 'POST',
            body: JSON.stringify(value),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(JSON.stringify(value))
        const myJson = await response.json();
        console.log(myJson)
        if (myJson.status === "error") {
            document.getElementById("error_test").innerHTML = myJson.error
        } else window.location.reload();
    }
    const form_test = document.getElementById("add_test")
    form_test.addEventListener('submit', handleSubmitfinal);



    // function addQuestion()
    // {
    //     // console.log('button pressed')
    //     var li="";
    //     console.log(li)
    //     for(var i=0;i<options.length;i++)
    //     {
    //         li+=`<div class="form-group">
    //         <input class="form-control-sm" value="`+ options[i].option+`" readonly>
    //         </div>`
    //         // li+="<li>"+options[i].option+"</li>"
    //     }
    //     console.log(li)
    //     console.log(options)
    //     var scan=document.getElementById("appended")
    //     var x=document.createElement("div")
    //     x.innerHTML=`<div class="p-2 m-2 form-group" style="border: 2px solid grey">
    //     <div class="form-group">
    //         <textarea class="form-control" rows="2" readonly>`+document.forms["New-TestForm"]["question"].value+`</textarea>
    //     </div>
    //     <div class="form-group" id="options">
    //         `+li+`
    //       </div>

    //     <div class="form-group">
    //         <input class="form-control-sm" value=`+document.forms["New-TestForm"]["answer"].value + ` readonly>
    //     </div>
    //     <div class="form-group">
    //         <textarea class="form-control" readonly>`+document.forms["New-TestForm"]["explanation"].value+`</textarea>
    //     </div>
    // </div>`
    //     scan.appendChild(x)
    //     var q= {
    //         "question": document.forms["New-TestForm"]["question"].value,
    //         "answers": options,
    //         "answer": document.forms["New-TestForm"]["answer"].value,
    //         "explanation": document.forms["New-TestForm"]["explanation"].value
    //     }
    //     problems.push(q);
        
    //     console.log(problems)
    // }