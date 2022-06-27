const User = require( '../models/User');
const Project = require ('../models/Project')
const Task = require ('../models/Task')

module.exports = {

    async save(req, res) {
        const { name } = req.body;
        const { user } = req;

        if(!name) {
            return res.status(400).json({message: 'name is required'})
        }
        const userDb = await User.findOne({_id: user.user_id})

        const project = await Project.create({
            name,
            user:  userDb._id,
            tasks: []
        });

        userDb.projects.push(project)
        await User.updateOne(userDb)

        await project.populate('user');
        return res.status(201).json(project);
    },

    async getAll(req, res) {
        const { user_id } = req.user;

        const projectsByUser = await Project.find({ user: user_id });

        return res.status(200).json(projectsByUser);
    },

    async update(req, res) {
        const { name } = req.body;
        const { id } = req.params;

        const project = await Project.findOne({ _id: id });
        project.name = name;

        await Project.updateOne(project)

        await project.populate('user');
        return res.status(200).json(project);
    },

    async delete(req, res) { //delete task//project do user
        const { id } = req.params;
        const { user_id } = req.user;

        const project = await Project.findOne({ _id: id });
        const user = await User.findOne({ _id: user_id });
        
        for (const value of project.tasks) {
            await Task.deleteOne(value);
        } 
        
        var filtered = user.projects.filter(value => !value.equals(project._id));
        user.projects = filtered;

        await Project.deleteOne(project)
        await User.updateOne(user)

        return res.status(204).json();
    }

}