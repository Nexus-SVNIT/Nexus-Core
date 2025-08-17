import React, { useState } from 'react';

const AddProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [teamMembers, setTeamMembers] = useState([{ admissionNumber: '' }]);
    const [mentors, setMentors] = useState([{ admissionNumber: '' }]); // For mentors
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleAddMember = () => {
        setTeamMembers([...teamMembers, { admissionNumber: '' }]);
    };

    const handleAddMentor = () => {
        setMentors([...mentors, { admissionNumber: '' }]);
    };

    const handleMemberChange = (index, value) => {
        const updatedMembers = teamMembers.map((member, i) =>
            i === index ? { ...member, admissionNumber: value } : member
        );
        setTeamMembers(updatedMembers);
    };

    const handleMentorChange = (index, value) => {
        const updatedMentors = mentors.map((mentor, i) =>
            i === index ? { ...mentor, admissionNumber: value } : mentor
        );
        setMentors(updatedMentors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const projectData = {
            title,
            description,
            githubLink,
            teamMembers,
            mentors,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/projects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            // Reset the form after successful submission
            setTitle('');
            setDescription('');
            setGithubLink('');
            setTeamMembers([{ admissionNumber: '' }]);
            setMentors([{ admissionNumber: '' }]);
            alert('Project added successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Project</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Title:</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Description:</label>
                    <textarea
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">GitHub Link:</label>
                    <input
                        type="url"
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        required
                    />
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Team Members</h3>
                {teamMembers.map((member, index) => (
                    <div key={index} className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Admission Number:</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
                                value={member.admissionNumber}
                                onChange={(e) => handleMemberChange(index, e.target.value.trim())}
                                required
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="mt-4 text-blue-500 hover:underline"
                    onClick={handleAddMember}
                >
                    Add Team Member
                </button>

                <h3 className="text-xl font-semibold mt-6 mb-4">Mentors</h3>
                {mentors.map((mentor, index) => (
                    <div key={index} className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Admission Number:</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
                                value={mentor.admissionNumber}
                                onChange={(e) => handleMentorChange(index, e.target.value.trim())}
                                required
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="mt-4 text-blue-500 hover:underline"
                    onClick={handleAddMentor}
                >
                    Add Mentor
                </button>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full mt-6 bg-blue-500 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProject;
