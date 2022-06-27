const { Router }  = require('express')
const AuthController = require( '../src/controllers/AuthController')
const ProjectController = require( '../src/controllers/ProjectController')
const TaskController = require( '../src/controllers/TaskController')
const verifySignUp = require('./middlewares/auth')

const routes = Router();

routes.post("/api/auth/signup", AuthController.signup);
routes.post("/api/auth/signin", AuthController.signin);
routes.get("/api/users", verifySignUp, AuthController.getUser)

routes.post("/api/projects", verifySignUp, ProjectController.save);
routes.get("/api/projects", verifySignUp, ProjectController.getAll);
routes.put("/api/projects/:id", verifySignUp, ProjectController.update);
routes.delete("/api/projects/:id", verifySignUp, ProjectController.delete);

routes.post("/api/tasks", verifySignUp, TaskController.save);
routes.get("/api/tasks", verifySignUp, TaskController.getAllByProject);
routes.put("/api/tasks/:id", verifySignUp, TaskController.update);
routes.delete("/api/tasks/:id", verifySignUp, TaskController.delete);


module.exports = routes;