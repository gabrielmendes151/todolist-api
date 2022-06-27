const Project = require ('../models/Project')
const Task = require ('../models/Task')

module.exports = {

    async save(req, res) {
        const { description, finishDate, projectId } = req.body;

        if(!description) {
            return res.status(400).json({message: 'description is required'})
        }

        if(!projectId) {
            return res.status(400).json({message: 'description is required'})
        }

        const project = await Project.findOne({_id: projectId})

        const task = await Task.create({
            description,
            project:  project._id,
            createDate: new Date(),
            finishDate,
            status: 'CREATED'
        });

        project.tasks.push(task)
        await Project.updateOne(project)

        await task.populate('project');
        return res.status(201).json(task);
    },

    async getAllByProject(req, res) {
        const { projectId } = req.query;

        if(!projectId) {
            return res.status(401).json({message: 'task not found'})
        }

        const taskByProject = await Task.find({ project: projectId });

        return res.status(200).json(taskByProject);
    },

    async update(req, res) {
        const { description, status } = req.body;
        const { id } = req.params;

        const task = await Task.findOne({ _id: id });
        task.description = description;
        task.status = status;

        await Task.updateOne(task)

        await task.populate('project');
        return res.status(200).json(task);
    },

    async delete(req, res) {
        const { id } = req.params;

        const task = await Task.findOne({ _id: id });
        const project = await Project.findOne({_id: task.project._id});
        var filtered = project.tasks.filter(value => !value.equals(task._id));
        project.tasks = filtered;
        await Task.deleteOne(task)
        await Project.updateOne(project)

        return res.status(204).json();
    }

}