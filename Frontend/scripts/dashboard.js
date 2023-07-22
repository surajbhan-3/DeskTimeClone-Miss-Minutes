const menuIconBtn = document.getElementById('menu-icon-btn');
const menuIconBtn1 = document.getElementById('menu-icon1');
const sidebar = document.getElementById('sidebar');
const bar = document.getElementById("bar")
const title = document.querySelector(".title")
const links = document.querySelectorAll('.link');





let dis= []
let cproject 
let ttask
let intask
let nstask

menuIconBtn.addEventListener('click', () => {
   if(sidebar.style.width==="80px"){
    sidebar.style.width="250px"
    bar.style.marginLeft="250px"
    title.style.display="block"
    links.forEach(link => link.style.display = "block");
   }else{
    sidebar.style.width="80px"
    bar.style.marginLeft="80px"
    title.style.display="none"
    links.forEach(link => link.style.display = "none");
   }
});

menuIconBtn1.addEventListener("click",()=>{
  if(sidebar.style.display === "none"){
    
    sidebar.style.display = "block"
  }else{
    sidebar.style.display ="none"
  }
})


const bellicon = document.getElementById("bell-icon")
const popup = document.getElementsByClassName("popup")[0]
const addnotification = document.getElementById("addnotification")
bellicon.addEventListener("click",()=>{
    if(addnotification.innerHTML===""){
        if(popup.style.display === "none"){
            popup.style.display = "flex"
          } else {
            popup.style.display = "none"
          }
    }else{
       if(addnotification.style.display==="none") {
        addnotification.style.display="block"
       }else{
        addnotification.style.display="none"
       }
    }
})
let username = document.getElementById("username")
const userlogo = document.getElementById("userlogo");
const urlParams = new URLSearchParams(window.location.search)
  let userID = urlParams.get("userID")
  let accessToken = urlParams.get("accesstoken");
  
  if(userID && accessToken){
    fetch(`http://localhost:8080/user/get/${userID}`)
    .then((res)=>res.json())
    .then((data)=>{
      dis.push(data.user)
      let c = data.user.assignedProjects.filter((el)=>{
        if(el.status==="completed"){
          return el
        }
      })
      let ct = data.user.assignedTasks.filter((el)=>{
        if(el.status==="Completed"){
          return el
        }
      })
      let it = data.user.assignedTasks.filter((el)=>{
        if(el.status==="Not Started"){
          return el
        }
      })
      let nst = data.user.assignedTasks.filter((el)=>{
        if(el.status==="In Progress"){
          return el
        }
      })
      cproject=c.length
      ctask=ct.length
      intask=it.length
      nstask=nst.length
      displayuser(dis)
      const user = {
        id:data.user._id,
        name: data.user.name,
        role: data.user.role,
        assignedTasks: data.user.assignedTasks || [],
        assignedProjects: data.user.assignedProjects || [],
      };
      sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
      username.textContent = data.user.name
      userlogo.textContent=username.textContent.charAt(0).toUpperCase();
    }).catch((err)=>{
      console.log(err)
    })
  }else{
    const user = JSON.parse(sessionStorage.getItem("user"))
    username.textContent = user.name
    userlogo.textContent = username.textContent.charAt(0).toUpperCase();
    let token = localStorage.getItem("token")
    fetch(`http://localhost:8080/user/get/${user.id}`)
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data.user);
      let c = data.user.assignedProjects.filter((el)=>{
        if(el.status==="completed"){
          return el
        }
      })
      cproject=c.length
      dis.push(data.user)
      displayuser(dis)
    })
    .catch((err)=>{
      console.log(err);
    })
  }



function toggleDropdown1(dropdown1) {
  if (dropdown1.style.display === 'none') {
    dropdown1.style.display = 'block';
  } else {
    dropdown1.style.display = 'none';
  }
}


const logout = document.getElementById("logout")

logout.addEventListener("click",()=>{
  // fetch(`http://localhost:8080/user/logout`,{
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `${token}`
  //   },
  // })
  // .then((res) => res.json())
  // .then((data) => {
    username = "";
    userlogo.textContent = "";
    sessionStorage.clear(); 
    localStorage.clear();
    window.location.href = "./index.html";
  })
  // .catch((err)=>{
  //   console.log(err);
  // });    
// })

const dashboard_page = document.getElementById("dashboard-page-btn")
const project_page = document.getElementById("project-page-btn");
const project_chat_page = document.getElementById("project-chat-btn")

dashboard_page.addEventListener("click",()=>{
  window.location.href= "./dashboard.html"
})
project_page.addEventListener("click",()=>{
  window.location.href= "./project.html"
})
project_chat_page.addEventListener("click",()=>{
  window.location.href= "./chat.html"
})

function displayuser(dis) {
  

  const userCardDetails = document.getElementById("usercarddetails");
  userCardDetails.innerHTML = "";
if(dis[0].role==="Employee"){
  dis.forEach((el) => {
    const rightDetailsContainer = document.createElement("div");
    rightDetailsContainer.id = "rightdetails";
    const leftDetailsContainer = document.createElement("div");
    leftDetailsContainer.id = "leftdetails";

    // Project Chart Container
    const projectChartContainer = document.createElement("div");
    projectChartContainer.style.width = "300px";
    projectChartContainer.style.height = "300px";
    const projectChartCanvas = document.createElement("canvas");
    projectChartCanvas.id = "Project";
    projectChartContainer.appendChild(projectChartCanvas);

    // Task Chart Container
    const taskChartContainer = document.createElement("div");
    taskChartContainer.style.width = "300px";
    taskChartContainer.style.height = "300px";
    const taskChartCanvas = document.createElement("canvas");
    taskChartCanvas.id = "Task";
    taskChartContainer.appendChild(taskChartCanvas);

    rightDetailsContainer.innerHTML = `
      <h2>Name: ${el.name}</h2>
      <h3>Total Project: ${el.assignedProjects.length}</h3>
      <h3>Completed Project: ${cproject}</h3>
      <h3>In Progress Project: ${el.assignedProjects.length - cproject}</h3>
    `;
    rightDetailsContainer.appendChild(projectChartContainer);

    leftDetailsContainer.innerHTML = `
      <h2>Role: ${el.role}</h2>
      <h3>Total Task: ${el.assignedTasks.length}</h3>
      <h3>Completed Task: ${ctask}</h3>
      <h3>In Progress Tasks: ${intask}</h3>
      <h3>Not Started Tasks: ${nstask}</h3>
    `;
    leftDetailsContainer.appendChild(taskChartContainer);

    userCardDetails.appendChild(rightDetailsContainer);
    userCardDetails.appendChild(leftDetailsContainer);

    // Project Bar Chart
    const projectChart = new Chart(projectChartCanvas, {
      type: "bar",
      data: {
        labels: ["Completed", "In Progress"],
        datasets: [
          {
            label: "Projects",
            data: [cproject, el.assignedProjects.length - cproject],
            backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Task Bar Chart
    const taskChart = new Chart(taskChartCanvas, {
      type: "bar",
      data: {
        labels: ["Completed", "In Progress", "Not Started"],
        datasets: [
          {
            label: "Tasks",
            data: [ctask, intask, nstask],
            backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)", "rgba(255, 99, 132, 0.8)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
}else{
  dis.forEach((el) => {
    const rightDetailsContainer = document.createElement("div");
    rightDetailsContainer.id = "rightdetails";
    

    // Project Chart Container
    const projectChartContainer = document.createElement("div");
    projectChartContainer.style.width = "300px";
    projectChartContainer.style.height = "300px";
    const projectChartCanvas = document.createElement("canvas");
    projectChartCanvas.id = "Project";
    projectChartContainer.appendChild(projectChartCanvas);

    

    rightDetailsContainer.innerHTML = `
      <h2>Name: ${el.name}</h2>
      <h2>Role: ${el.role}</h2>
      <h3>Total Project: ${el.assignedProjects.length}</h3>
      <h3>Completed Project: ${cproject}</h3>
      <h3>In Progress Project: ${el.assignedProjects.length - cproject}</h3>
    `;
    rightDetailsContainer.appendChild(projectChartContainer);


    userCardDetails.appendChild(rightDetailsContainer);

    // Project Bar Chart
    const projectChart = new Chart(projectChartCanvas, {
      type: "bar",
      data: {
        labels: ["Completed", "In Progress"],
        datasets: [
          {
            label: "Projects",
            data: [cproject, el.assignedProjects.length - cproject],
            backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

  });
}
  
}
