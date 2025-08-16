const Project = require('../models/projectModel');

const createProject = async (req, res) => {
    const { title, description, githubLink, teamMembers, mentors } = req.body;

    const newProject = new Project({
        title,
        description,
        githubLink,
        status: 'ongoing',
        teamMembers,
        mentors,
    });

    try {
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createProject
};
