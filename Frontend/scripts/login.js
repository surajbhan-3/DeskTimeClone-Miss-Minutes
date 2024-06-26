const form = document.querySelector("form");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");


const user = JSON.parse(sessionStorage.getItem("user")) || "";

// const url ="https://nodejs-production-1836.up.railway.app/"

form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const email = emailInput.value;
    const password = passwordInput.value;
  
    fetch(`https://desktime.onrender.com/user/login`,{
      method: "POST",
      body: JSON.stringify({email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        if (data.msg === "login Success"){
            alert(data.msg);
            emailInput.value = "";
            passwordInput.value = "";
            const user = {
              id:data.user._id,
              name: data.user.name,
              role: data.user.role,
              assignedTasks: data.user.assignedTasks || [],
              assignedProjects: data.user.assignedProjects || [],
            };
            sessionStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", data.accessToken);
             window.location.href = "./dashboard.html";
        }else{
            alert(data.msg);
            emailInput.value = "";
            passwordInput.value = "";
        } 
      })
      .catch((err)=>{
        console.log(err);
      });
  });