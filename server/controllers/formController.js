const mongoose = require('mongoose');
const Forms = require('../models/formModel.js');
const User = require('../models/userModel.js');
const teamMemberModel = require('../models/teamMembersModel.js');
const { sendEmail } = require('../utils/emailUtils.js');
const { 
    formEmailTemplate, 
    formCreationNotificationTemplate,
} = require('../utils/emailTemplates.js');
const { google } = require('googleapis');
const { getDriveClient, getCredentials } = require('../utils/driveUtils.js');

// Get authenticated Drive and Sheets clients
const auth = new google.auth.GoogleAuth({
    credentials: getCredentials(),
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Error handling utility
const handleError = (res, err) => {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
};


// Get all forms (admin only)
const getAllForms = async (req, res) => {
    try {
        const allForms = await Forms.find()
            .select({
                "responseCount": { $size: "$responses" },
                name: true,
                deadline: true,
                publish: true,
                isHidden: true,
                sheetId: true
            })
            .sort({ created_date: -1 });
        res.status(200).json(allForms);
    } catch (err) {
        handleError(res, err);
    }
};

// Update form status
const updateFormStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { publish, isHidden } = req.body;

        if (typeof publish !== 'boolean' || typeof isHidden !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const form = await Forms.findById(id);
        if (!form) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        form.publish = publish;
        form.isHidden = isHidden;
        await form.save();

        res.json({ success: true, message: 'Form status updated successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

// Update form deadline
const updateFormDeadline = async (req, res) => {
    try {
        const { id } = req.params;
        const { deadline } = req.body;

        if (!deadline || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid deadline format. Expected format: YYYY-MM-DD' 
            });
        }

        const form = await Forms.findById(id);
        if (!form) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        form.deadline = deadline;
        await form.save();

        res.json({ success: true, message: 'Form deadline updated successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

// Update form details
const updateForm = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const form = await Forms.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json(form);
    } catch (error) {
        handleError(res, error);
    }
};

// Create Google Drive folder using driveUtils
async function createDriveFolder(formTitle) {
    const drive = getDriveClient();
    const folderName = `${formTitle} - ${new Date().toLocaleDateString()}`;
    
    const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [process.env.GOOGLE_DRIVE_FORMS_FOLDER_ID]
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            fields: "id"
        });
        return response.data.id;
    } catch (error) {
        console.error("Error creating Drive folder:", error);
        throw new Error("Failed to create folder in Google Drive");
    }
}

// Create Google Sheet in Drive folder
async function createGoogleSheet(formTitle, folderId) {
    const drive = getDriveClient();
    const resource = {
        name: `${formTitle} Responses`,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [folderId],
    };

    try {
        const response = await drive.files.create({
            resource,
            fields: 'id, name',
        });
        return response.data.id;
    } catch (error) {
        console.error("Error creating Google Sheet:", error);
        throw new Error("Failed to create Google Sheet");
    }
}

// Create a new form
const createForm = async (req, res) => {
    const { name, desc, deadline, formFields, WaLink, enableTeams, teamSize, 
            fileUploadEnabled, posterImageDriveId, extraLinkName, extraLink, 
            isHidden, isOpenForAll } = req.body;
    const _event = "none";

    let driveFolderId = null;
    let sheetId = null;

    try {
        // Check if user is authenticated as team member
        if (!req.user || !req.user.admissionNumber) {
            return res.status(401).json({ message: "Authentication required" });
        }
        
        // Get user info from team member details in req.user
        const teamMemberDetails = {
            admissionNumber: req.user.admissionNumber,
            
            role: req.user.role,
            email: req.user.email
        };
        
        // Create Google Drive folder and Sheet
        driveFolderId = await createDriveFolder(name);
        sheetId = await createGoogleSheet(name, driveFolderId);

        // Initialize Sheet headers
        if (sheetId) {
            const values = isOpenForAll ? [] : [
                'admissionNumber',
                'name',
                'mobileNumber',
                'personalEmail',
                'branch',
            ];
            formFields.forEach(field => {
                values.push(field.questionText);
            });
            if(enableTeams){
                values.push('teamName');
                values.push('teamMembers');
            }
            if(fileUploadEnabled){
                values.push('files');
            }
            values.push('dateTime');
            await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: 'Sheet1',
                valueInputOption: 'RAW',
                resource: {
                    values: [values],
                },
            });
        }

        // Create the form
        const createdForm = await Forms.create({
            name,
            desc,
            deadline,
            created_date: new Date().toISOString(),
            publish: true,
            formFields,
            WaLink,
            _event,
            ...(enableTeams && teamSize > 0 ? { enableTeams, teamSize } : {}),
            fileUploadEnabled,
            driveFolderId,
            sheetId,
            posterImageDriveId,
            extraLinkName,
            extraLink,
            isHidden,
            isOpenForAll,
            createdBy: teamMemberDetails.email || '',
            createdByAdmissionNumber: teamMemberDetails.admissionNumber || '',
            createdByRole: teamMemberDetails.role || ''
        });

        // Send notification to admin team about the new form
        await sendEmail({
            to: process.env.EMAIL_ID,
            ...formCreationNotificationTemplate({
                name,
                desc,
                deadline,
                isOpenForAll,
                enableTeams,
                teamSize,
                fileUploadEnabled,
                creatorEmail: teamMemberDetails.email,
                creatorAdmissionNumber: teamMemberDetails.admissionNumber,
                creatorRole: teamMemberDetails.role,
                sheetId,
                formId: createdForm._id
            })
        });

        res.status(200).json({
            success: true, 
            message: 'Form created successfully',
            form: createdForm
        });
    } catch (err) {
        handleError(res, err);
    }
};

// Get responses for a form (admin only)
const getResponses = async (req, res) => {
    const id = req.params.id;
    try {
        // Fetch responses with user details
        const form = await Forms.findById(id).select({ responses: true, enableTeams: true, _id: false });

        if (!form) throw new Error("Form not found");

        const responseWithUserDetails = await Promise.all(
            !form.enableTeams
                ? form.responses.map(async (response) => {
                    const user = await User.findOne({ admissionNumber: response.admissionNumber }, { password: false, shareCodingProfile: false, subscribed: false, emailVerified: false }).lean();
                    return {
                        ...response,
                        user: user || null,
                    };
                })
                : form.responses.map(async (response) => {
                    const teamMemberDetails = await Promise.all(
                        response.teamMembers.map(async (teamMember) => {
                            const user = await User.findOne({ admissionNumber: teamMember }).lean();
                            return user || null;
                        })
                    );
                    return {
                        ...response,
                        teamLeader: response.admissionNumber,
                        admissionNumber: undefined,
                        teamMembers: teamMemberDetails,
                    };
                })
        );

        res.status(200).json({ responses: responseWithUserDetails, enableTeams: form.enableTeams });
    } catch (err) {
        handleError(res, err);
    }
};

// Get form fields (for display)
const getFormFields = async (req, res) => {
    const id = req.params.id;
    try {
        const formFields = await Forms.findById(id).select({ _id: false, responses: false, __v: false, responseCount: false, _event: false });
        if (!formFields) throw new Error("Form not found");
        res.status(200).json(formFields);
    } catch (err) {
        handleError(res, err);
    }
};

// Notify all subscribers about a form        
const notifyAllSubscribers = async (req, res) => {
    try {
        const formId = req.params.formId;
        const form = await Forms.findById(formId);

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Fetch core member who created the notification
        const teamMember = await teamMemberModel.findById(req.user.id).select('email admissionNumber');
        const formCreator = form.createdByAdmissionNumber || (teamMember ? teamMember.admissionNumber : 'NEXUS Core Team');
        
        // Find all subscribed users
        const subscribers = await User.find({ subscribed: true });
        if (subscribers.length === 0) {
            return res.status(200).json({ message: "No subscribers to notify" });
        }

        // Get all recipient emails
        const bccRecipients = subscribers.map(subscriber => subscriber.personalEmail);
        const batchSize = 50;
        
        // Send emails in batches
        for (let i = 0; i < bccRecipients.length; i += batchSize) {
            const batch = bccRecipients.slice(i, i + batchSize);
            
            try {
                const emailContent = formEmailTemplate({
                    name: form.name,
                    desc: form.desc,
                    deadline: form.deadline,
                    formId: form._id,
                    createdBy: formCreator
                });
                 // Replace template placeholder with actual recipient name
                await sendEmail({
                    to: "noreply@nexus-svnit.in",
                    bcc: batch,
                    ...emailContent,
                    html: emailContent.html.replace('{{name}}', 'NEXUS Member')
                });
                
                console.log(`Sent batch ${Math.ceil(i/batchSize) + 1} with ${batch.length} recipients`);
            } catch (error) {
                console.error(`Error sending batch ${Math.ceil(i/batchSize) + 1}:`, error);
            }
        }

        // Send confirmation to admin with details
        await sendEmail({
            to: process.env.EMAIL_ID,
            cc: teamMember ? teamMember.email : undefined,
            subject: `Form Notification Sent: ${form.name}`,
            html: `
                <div style="background-color: black; color: white; font-size: 14px; padding: 20px;">
                    <div style="background-color: #333; padding: 20px; border-radius: 8px;">
                        <h2>Form Notification Summary</h2>
                        <p>Form <strong>${form.name}</strong> notification was sent to ${subscribers.length} subscribers.</p>
                        <p>Created by: ${formCreator}</p>
                        <p>Notification sent by: ${teamMember ? teamMember.email : 'Unknown'}</p>
                        <p>Sent on: ${new Date().toLocaleString()}</p>
                        <p><a href="https://docs.google.com/spreadsheets/d/${form.sheetId}" style="color: #1a73e8;">View Responses</a></p>
                    </div>
                </div>
            `
        });

        return res.status(200).json({ message: `Notification sent to ${subscribers.length} subscribers.` });
    } catch (error) {
        handleError(res, error);  
    }
};

// Export all controller functions
module.exports = {
    getAllForms,
    createForm,
    getResponses, 
    getFormFields,     
    updateFormStatus,    
    updateFormDeadline,
    notifyAllSubscribers,
    updateForm,
};
