const express = require("express");
const { projectModel } = require("../models/project.model");
const{UserModel} =require("../models/user.model")
const { role } = require("../middlewares/role.middleware");

const projectRoute = express.Router()

projectRoute.get("/",async(req,res)=>{
    try {
        const projects = await projectModel.find();
        
        res.send(projects)
    } catch (err) {
        res.send(err.message)
    }
})


projectRoute.post("/create", role(["Admin", "Manager"]),async (req, res) => {
    try {
        const {name,description,status} = req.body;
        const projectexist = await projectModel.findOne({name})
     
        if(projectexist){
            console.log(`Project ${name} is already there, you can go through it!`)
            res.send(`Project ${name} is already there, you can go through it!`)
        }else{
            const project = new projectModel({name,description,status,createdBy: req.body.UserId});
            await project.save();

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: req.body.UserId},
                { $push: { assignedProjects: project._id } },
                { new: true }
            );
            res.status(200).send({"msg":"project created",project})
        }
    } catch (error) {
        res.status(400).send({"message":error.message})
    }
});



projectRoute.get("/details/:id",async(req,res)=>{
  const projectId = req.params.id;
  try {
      const project = await projectModel.findOne({_id:projectId});
      res.send(project)
  } catch (err) {
      res.send(err)
  }
})

projectRoute.get("/searchProject/:name",async(req,res)=>{
  const projectName = req.params.name;
  try {
      const project = await projectModel.findOne({name:projectName});
      res.send(project)
  } catch (err) {
      res.send(err)
  }
})

projectRoute.get("/AllProjectsByManager/:id",async(req,res)=>{
  const managerId = req.params.id;
  try {
      const projects = await projectModel.find({createdBy:managerId});
      res.send(projects)
  } catch (err) {
      res.send(err)
  }
})



projectRoute.delete("/delete/:projectid",role("Admin"), async(req,res)=>{
    const projectid = req.params.projectid;
    const projectexists = await projectModel.findOne({_id: projectid});
    
    if (projectexists) {
        const project = await projectModel.findByIdAndDelete(projectexists._id).exec();
        res.status(200).send({"msg":`Project ${project.name} is successfully Deleted to`});
    } else {
        console.log("Project doesn't exist!");
        res.status(404).send({"msg":"Project doesn't exist!"});
    }
});

projectRoute.patch('/:id', async (req, res) => {
    try {
      const projectId = req.params.id;
      const { status } = req.body;
  
      const project = await projectModel.findById(projectId);
  
      if (!project) {
        return res.status(404).send({ "message": "project not found." });
      }
  
      if (status === 'completed') {
        project.status = status;
        project.timeTracking.endDate= Date.now();
      } else if (status) {
        project.status = status;
      }
      const updatedproject = await project.save();
  
      res.status(200).send({ "message": "project updated successfully.", project: updatedproject });
    } catch (error) {
      console.log(error);
      res.status(400).send({ "message": error.message });
    }
  });
module.exports = {projectRoute}