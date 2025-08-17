const { google } = require("googleapis");
const fs = require("fs");
const teamMembersModel = require("../models/teamMembersModel");
const User = require("../models/userModel");

const credentials = {
    type: process.env.GOOGLE_CLOUD_TYPE,
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
    auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
    token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN
};

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

const uploadImageToDrive = async (file, admissionNumber) => {
    try {
        if (!file) {
            return { success: false, error: 'No file uploaded.' };
        }

        const fileMetadata = {
            name: admissionNumber,
            parents: [process.env.GOOGLE_DRIVE_TEAM_MEMBERS_FOLDER_ID] // Folder for team members' images
        };

        const media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
        };

        const fileResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Remove the local file after uploading to Google Drive
        fs.unlinkSync(file.path);

        return { success: true, fileId: fileResponse.data.id };
    } catch (error) {
        console.error('Error uploading file:', error.message || error);
        return { success: false, error: error.message || 'Unknown error' };
    }
};

const addTeamMember = async (req, res) => {
    try {
        const { admissionNumber, role, year, priority } = req.body;

        // Check if required fields are present
        if (!admissionNumber || !role || !year || priority === undefined) {
            return res.status(400).json({ message: "Admission number, role, year, and priority are required" });
        }

        // Check if user exists in User collection
        const userExists = await User.findOne({ admissionNumber });
        if (!userExists) {
            return res.status(404).json({ message: "User with this admission number does not exist" });
        }

        // Upload the team member's image to Google Drive
        const uploadResult = await uploadImageToDrive(req.file, admissionNumber);
        if (!uploadResult.success) {
            return res.status(500).json({ message: `Error uploading file: ${uploadResult.error}` });
        }

        // Create and save the new team member record
        const newTeamMember = new teamMembersModel({
            admissionNumber,
            role,
            image: uploadResult.fileId, // Save Google Drive file ID
            year,
            priority: Number(priority),
            password: userExists.password, // Copy hashed password
            personalEmail: userExists.personalEmail // Copy personal email
        });
        await newTeamMember.save();

        res.status(201).json({ message: "Team member added successfully", data: newTeamMember });
    } catch (error) {
        console.error('Error adding team member:', error.message);
        res.status(500).json({ message: "Error adding team member", error: error.message });
    }
};

module.exports = { addTeamMember };
