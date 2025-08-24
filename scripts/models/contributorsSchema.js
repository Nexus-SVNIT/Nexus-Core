const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    total: {
        type: Number,
        default: 0
    },
    contributors: [
        {
        githubId: { type: String, required: true },
        contributions: { type: Number, default: 0 },
        avatar_url: String,
        html_url: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Contributor', contributorSchema);
