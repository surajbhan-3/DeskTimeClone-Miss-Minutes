const express = require("express");
const { projectModel } = require("../models/project.model");
const{UserModel} =require("../models/user.model")
const { role } = require("../middlewares/role.middleware");

const projectRoute = express.Router()
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API endpoints for managing Project
 */

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProject'
 *     responses:
 *       200:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Response message
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Error message (e.g., Project already exists)
 *       403:
 *         description: Access forbidden (User must be Admin or Manager)
 */

/**
 * @swagger
 * /project/details/{id}:
 *   get:
 *     summary: Get project details by ID
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /project/searchProject/{name}:
 *   get:
 *     summary: Search project by name
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: Project name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /project/AllProjectsByManager/{id}:
 *   get:
 *     summary: Get all projects created by a manager
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Manager ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       404:
 *         description: No projects found for the manager
 */

/**
 * @swagger
 * /project/delete/{projectid}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: projectid
 *         in: path
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       403:
 *         description: Access forbidden (User must be Admin)
 */

/**
 * @swagger
 * /project/{id}:
 *   patch:
 *     summary: Update project status by ID
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdate'
 *     responses:
 *       200:
 *         description: Project status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Response message
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Project ID
 *         name:
 *           type: string
 *           description: Project name
 *         description:
 *           type: string
 *           description: Project description
 *         status:
 *           type: string
 *           enum: [in progress, completed]
 *           description: Project status
 *         tasks:
 *           type: array
 *           items:
 *             type: string
 *           description: List of task IDs associated with the project
 *         createdBy:
 *           type: array
 *           items:
 *             type: string
 *           description: List of manager IDs who created the project
 *         timeTracking:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date-time
 *               description: Project start date
 *             endDate:
 *               type: string
 *               format: date-time
 *               description: Project end date (for completed projects)
 *             totalHours:
 *               type: number
 *               description: Total hours spent on the project (optional)
 *     NewProject:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Project name
 *         description:
 *           type: string
 *           description: Project description
 *         status:
 *           type: string
 *           enum: [in progress, completed]
 *           description: Project status
 *     ProjectUpdate:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [in progress, completed]
 *           description: New status for the project
 */


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