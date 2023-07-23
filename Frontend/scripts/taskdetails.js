const user2 = JSON.parse(sessionStorage.getItem("user")) || "";
const token = localStorage.getItem("token")

let taskId = localStorage.getItem("taskId") || ""

let projecttitlename1 = localStorage.getItem("projecttitle") || "";

let task1edit = document.querySelector(".create-Edit")
let task1delete = document.querySelector(".Edit1")


if (user2.role === "Employee") {
    task1delete.style.display="none"
}
if (user2.role !== "Employee") {
    task1edit.style.display="none"
}
let backbtn2 = document.getElementById("back-btn2")

backbtn2.addEventListener("click", () => {
    localStorage.removeItem("taskId")
    window.location.href = "./task.html"
})


let title2 = document.getElementById("title-2")
let taskcreateddate = document.getElementById("taskdetails-date")
let taskdetailsstatus = document.getElementById("taskdetails-status")
let taskcreatedby = document.getElementById("taskdetails-createdby")
let taskdetailassignto = document.getElementById("taskdetails-assignto")
let taskdetailendtime = document.getElementById("taskdetails-endtime")
let taskdetailprojectname = document.getElementById("taskdetails-projectname")
let taskdetailtotaltime = document.getElementById("taskdetails-time")

taskdetailprojectname.innerText = projecttitlename1


window.addEventListener("load", () => {
    fetchdata()
})


async function fetchdata() {
    try {
        let res = await fetch(`https://desk-time-clone-app.onrender.com/task/${taskId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        let data = await res.json();


        title2.innerText = data.task.title

        const startDate = new Date(data.task.startTime);
        const currentDate = new Date();
        const endDate = data.task.endTime ? new Date(data.task.endTime) : currentDate;
    
        const formattedDate1 = endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
    
        let totalDays = currentDate.getTime() - startDate.getTime();
        let totalTime = Math.floor(totalDays / (1000 * 60 * 60));
    
        if (data.task.endTime) {
          totalDays = endDate.getTime() - startDate.getTime();
          totalTime = Math.floor(totalDays / (1000 * 60 * 60));
          taskdetailendtime.innerText = formattedDate1;
        }

        const formattedDate = startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });
       
        taskcreateddate.innerText = formattedDate;
        taskdetailsstatus.innerText = data.task.status;
        let st = data.task.status
        taskdetailtotaltime.innerText = totalTime+ "Hrs";
        

        await fetch(`https://desk-time-clone-app.onrender.com/user/${data.task.createdBy}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json())
        .then(data => {
            taskcreatedby.innerText=data.user
        }).catch((error) => {
            console.log(error)
        })

        await fetch(`https://desk-time-clone-app.onrender.com/user/${data.task.assignedTo}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json())
        .then(data => {
            taskdetailassignto.innerText=data.user
            if(user2.role === "Employee"){
                if(data.user!==user2.name){
                    task1edit.style.display="none"
                }else{
                    task1edit.addEventListener("click",()=>{
                        document.getElementById("edit-task-form").style.display="block"
                        document.getElementById("status-edit").value = st
                    })
                }
            }
        }).catch((error) => {
            console.log(error)
        })


    } catch (error) {
        console.log(error)
    }
}






task1delete.addEventListener("click", () => {
  
     fetch(`https://desk-time-clone-app.onrender.com/task/delete/${taskId}`, {

        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(res => res.json())
        .then(data => {
            console.log("Task Will be Deleted")
            if (data.message === 'Task Deleted') {
                alert(data.message)
                localStorage.removeItem("taskId")
                window.location.href = "./task.html"
            }
        }).catch((error) => {
            console.log("couldn't delete the task")
            alert(error)
            console.log(error)
        })



})


document.getElementById("edit-task-form").addEventListener("submit",(e)=>{
    e.preventDefault()
    let status = document.getElementById("status-edit").value
    fetch(`https://desk-time-clone-app.onrender.com/task/${taskId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },body:JSON.stringify({status})
    }).then(res => res.json())
        .then(data => {
            console.log(data)
            console.log("Task is updated")
            alert(data.message)
            document.getElementById("edit-task-form").style.display="none"
            fetchdata()
        }).catch((error) => {
            console.log("couldn't delete the task")
            alert(error)
            console.log(error)
        })
})