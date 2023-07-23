const express = require("express")
const {UserModel} = require("../models/user.model")
const{auth} = require("../middlewares/auth")
const {BlacklistModel} = require("../models/blacklist.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRoute = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing User
 */

/**
 * @swagger
 * /user/employee:
 *   get:
 *     summary: Get all employees
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 */

/**
 * @swagger
 * /user/get/{id}:
 *   get:
 *     summary: Get a user with assigned projects and tasks by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithAssignments'
 *       400:
 *         description: Invalid user ID
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       200:
 *         description: Registration success
 *       400:
 *         description: Error message (e.g., User already exists)
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Error message (e.g., Invalid credentials)
 */

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout success
 *       400:
 *         description: Error message (e.g., Token not provided)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           description: User email
 *         role:
 *           type: string
 *           enum: [Admin, Manager, Employee]
 *           description: User role
 *         assignedTasks:
 *           type: array
 *           items:
 *             type: string
 *           description: List of assigned task IDs
 *         assignedProjects:
 *           type: array
 *           items:
 *             type: string
 *           description: List of assigned Project IDs
 *     NewUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Response message
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *         user:
 *           $ref: '#/components/schemas/User'
 */



userRoute.get("/employee",async(req,res)=>{
    try {
        const users = await UserModel.find({role:"Employee"})
        res.send(users)
    } catch (err) {
        res.send(err.message)
    }
})
userRoute.get("/:id",async(req,res)=>{
    const id = req.params.id;
    try {
        const user = await UserModel.findOne({_id:id})
        res.status(200).send({"user":user.name})
    } catch (err) {
        res.send(err.message)
    }
})
userRoute.get("/get/:id",async(req,res)=>{
    const id = req.params.id;
    try {
        const user = await UserModel.findOne({_id:id}).populate("assignedProjects").populate("assignedTasks")
        res.status(200).send({"user":user})
    } catch (err) {
        res.send(err.message)
    }
})

userRoute.get("/",async(req,res)=>{
    try {
        const users = await UserModel.find()
        
        res.send(users)
    } catch (err) {
        res.send(err.message)
    }
})

userRoute.post("/signup",async(req,res)=>{
    const {name,email,password,role} = req.body
    try {
        const user = await UserModel.findOne({email})
        if(user) return res.status(400).send({"msg":"User Already There Login"})
        bcrypt.hash(password, 5, async(err, hash)=> {
            const newuser = new UserModel({name,email,password:hash,role})
            await newuser.save()
            res.status(200).send({"msg":"Register Success"})
        });
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


userRoute.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await UserModel.findOne({email})
        if(!user) return res.status(400).send({"msg":"register First"})
        bcrypt.compare(password, user.password, async(err, result) =>{
            if(err) return res.status(400).send("Wrong Password")
           if(result){
            const accessToken = jwt.sign({UserId:`${user._id}`,role:user.role},"name",{expiresIn:"3h"})
            const refreshToken = jwt.sign({UserId:`${user._id}`,role:user.role},"rename",{expiresIn:"3h"})

            

            res.status(200).send({"msg":"login Success",accessToken,refreshToken,user})
           }else{
            return res.status(400).send({"msg":"Wrong Password"})
           }
        });
        
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

userRoute.get("/:id",auth,async(req,res)=>{
    try {
        const id = req.params.id

        const user =  await UserModel.findOne({_id:id})

        if(!user) return res.status(400).send({"msg":"No User"})

        res.status(200).send({"user":user})
     } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


    
  

userRoute.get("/logout", auth, async (req, res) => {
    try {
      const token = req.headers.authorization;
      const newAccessToken = new BlacklistModel({ token: token });
      await newAccessToken.save();
      res.status(200).send({ msg: "Logout Success" });
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  });




module.exports={userRoute}