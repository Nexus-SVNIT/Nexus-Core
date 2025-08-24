const link = 'https://nexus-svnit.in';
const LINK_COLOR = '#4fc3f7';

const emailWrapperTemplate = (content) => (
    `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            .link {
                color: #4fc3f7;
                text-decoration: none;
            }
            .link:hover {
                text-decoration: underline;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #00c6fb;
                color: #111 !important;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 12px;
            }
        </style>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0;">
        <div style="max-width: 650px; margin: 40px auto; background: #181818; border-radius: 14px; box-shadow: 0 4px 24px rgba(0,0,0,0.25); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: #1e1e1e; padding: 28px 20px; text-align: center; border-bottom: 1px solid #2c2c2c;">
                <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" alt="Nexus Logo" style="max-height: 70px; margin-bottom: 12px;" />
                <div style="font-size: 15px; color: #bbb;">Departmental Cell of DoCSE & DoAI, SVNIT Surat</div>
            </div>

            <!-- Content -->
            <div style="padding: 30px 28px; color: #ddd; font-size: 16px; line-height: 1.6;">
                ${content}
            </div>

            <!-- Footer -->
            <div style="background: #1e1e1e; color: #aaa; text-align: center; font-size: 14px; padding: 20px; border-top: 1px solid #2c2c2c;">
                <div><strong>Team Nexus</strong> • CSE & AI Departments, SVNIT Surat</div>
                <div style="margin: 6px 0;">
                    Contact: 
                    <a class="link" style="color:${LINK_COLOR};" href="mailto:nexus@coed.svnit.ac.in">nexus@coed.svnit.ac.in</a> |
                    <a class="link" style="color:${LINK_COLOR};" href="https://www.nexus-svnit.in">nexus-svnit.in</a>
                </div>
                <div>
                    Follow us: 
                    <a class="link" style="color:${LINK_COLOR};" href="https://www.linkedin.com/company/nexus-svnit">LinkedIn</a> |
                    <a class="link" style="color:${LINK_COLOR};" href="https://www.instagram.com/nexus.svnit/">Instagram</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
);

const postVerificationTemplate = (author, postTitle, id) => ({
    subject: 'Your Interview Experience Post Has Been Verified',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${author.fullName},</h3>
        <p>
            Great news! Your interview experience post <strong>"${postTitle}"</strong> has been verified and is now live on the platform.
        </p>
        <p>
            Thank you for contributing to the community and helping fellow students with your valuable insights!
        </p>
        <p>
            <a class="btn" href="${link}/interview-experiences/post/${id}">View Your Post</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const alumniVerificationTemplate = (name) => ({
    subject: 'Alumni Status Verified',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${name},</h3>
        <p>
            Congratulations! Your alumni status has been verified by the NEXUS team.
        </p>
        <p>
            You now have full access to the alumni features on the platform. Welcome back to the NEXUS community!
        </p>
        <p>
            <a class="btn" href="${link}">Explore Alumni Features</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const alumniRejectionTemplate = (name) => ({
    subject: 'Alumni Status Update',
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0;">Dear ${name},</h3>
        <p>
            Your alumni verification request has been reviewed and could not be verified at this time.
        </p>
        <p>
            Please ensure you meet all eligibility criteria and try again. If you have any questions, feel free to contact us.
        </p>
        <p>
            <a class="btn" href="${link}">Try Again</a>
        </p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const formEmailTemplate = ({name, desc, deadline, formId, createdBy}) => ({
    subject: `New Form Released: ${name}`,
    text: `New Form Released: ${name}. Apply before deadline: ${deadline}.`,
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0; color: #4fc3f7;">New Form Released</h3>
        <p>Dear {{name}},</p>
        <p>A new form has been released on the NEXUS portal:</p>
        
        <div style="background-color: #2c2c2c; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Name:</strong> ${name}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Description:</strong> ${desc}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Deadline:</strong> ${new Date(deadline).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
            ${createdBy ? `<div><strong style="color: #4fc3f7;">Created By:</strong> ${createdBy}</div>` : ''}
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
            <a class="btn" href="${link}/forms/${formId}" style="background-color: #4fc3f7; color: #111; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                APPLY NOW
            </a>
        </div>
        
        <p>Please ensure you submit your response before the deadline. If you face any issues, feel free to contact us.</p>
        <p style="margin-top: 28px;">Thanks,<br>Team NEXUS</p>
    `)
});

const formCreationNotificationTemplate = ({name, desc, deadline, isOpenForAll, enableTeams, teamSize, fileUploadEnabled, creatorEmail, creatorAdmissionNumber, creatorRole, sheetId, formId}) => ({
    subject: `New Form Created: ${name}`,
    html: emailWrapperTemplate(`
        <h3 style="margin-top: 0; color: #4fc3f7;">New Form Created</h3>
        <div style="background-color: #2c2c2c; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Form Name:</strong> ${name}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Description:</strong> ${desc}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Deadline:</strong> ${deadline}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Target Audience:</strong> ${isOpenForAll ? 'Open to All' : 'SVNIT Students Only'}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Team Registration:</strong> ${enableTeams ? `Yes (Team Size: ${teamSize})` : 'No'}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">File Upload Required:</strong> ${fileUploadEnabled ? 'Yes' : 'No'}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Created By:</strong> ${creatorEmail} ${creatorAdmissionNumber ? `(${creatorAdmissionNumber})` : ''} ${creatorRole ? `- ${creatorRole}` : ''}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #4fc3f7;">Created On:</strong> ${new Date().toLocaleString()}</div>
        </div>
        <p>
            <a class="btn" href="https://docs.google.com/spreadsheets/d/${sheetId}" style="margin-right: 10px;">View Responses</a>
            <a class="btn" href="${link}/forms/${formId}">View Form</a>
        </p>
    `)
});

module.exports = { 
    postVerificationTemplate,
    alumniVerificationTemplate,
    alumniRejectionTemplate,
    formEmailTemplate,
    formCreationNotificationTemplate,
};
