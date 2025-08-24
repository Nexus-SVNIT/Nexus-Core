const nodemailer = require('nodemailer');

const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASSWORD
    }
});

function emailHeader() {
    return `
    <div style="background: #1e1e1e; padding: 28px 20px; text-align: center; border-bottom: 1px solid #2c2c2c;">
        <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" alt="Nexus Logo" style="max-height: 70px; margin-bottom: 12px;" />
        <div style="font-size: 15px; color: #bbb;">Departmental Cell of DoCSE & DoAI, SVNIT Surat</div>
    </div
    `;
}

function emailFooter() {
    return `
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
    `;
}

function emailWrapper(contentHtml) {
    return `
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
                ${emailHeader()}
                <div style="padding: 30px 28px; color: #ddd; font-size: 16px; line-height: 1.6;">
                    ${contentHtml}
                </div>
                ${emailFooter()}
            </div>
        </body>
    </html>
    `;
}

async function sendAlumniWelcomeEmail(user) {
    const contentHtml = `
        <div class='content'>
            <p>Dear ${user.fullName || 'Alumnus'},</p>
            <p>Congratulations on achieving this important milestone. As you step into the next chapter of your journey, we are pleased to welcome you to the <b><span style='color: #00c6fb;'>Nexus Alumni Network</span></b> – the official alumni community for the <i>CSE & AI Departments of SVNIT</i>.</p>
            <p>Your time at SVNIT has contributed to the legacy of our department, and now, as an alumnus, you become an integral part of the Nexus community that connects students, faculty, and alumni. Through this network, we aim to create opportunities for mentorship, collaboration, and sharing expertise with the batches to come.</p>
            <div>To include you in our alumni directory and ensure smooth communication, we request you to share the following details:</div>
            <ul>
                <li><span class='mandatory'>Branch*</span></li>
                <li><span class='mandatory'>LinkedIn Profile*</span> (URL)</li>
                <li><span class='mandatory'>Company Name*</span></li>
                <li><span class='mandatory'>Designation*</span></li>
                <li><span class='mandatory'>Expertise*</span> (Areas you excel in – e.g., AI/ML, Software Development, Cloud, etc.)</li>
                <li>GitHub Profile (URL)</li>
                <li>LeetCode Profile (ID – e.g., <code>neal_wu</code>)</li>
                <li>Codeforces Profile (ID – e.g., <code>tourist</code>)</li>
                <li>CodeChef Profile (ID)</li>
            </ul>
            <div>To get started:</div>
            <div style='margin: 28px 0 18px 0; text-align: center;'>
                <a href='https://www.nexus-svnit.in/alumni' class='button-link'>Visit Alumni Network Page</a><br>
                <a href='https://www.nexus-svnit.in/profile' class='button-link'>Update Your Profile</a><br>
                <a href='https://www.nexus-svnit.in/interview-experience' class='button-link'>Share Interview Experience</a>
            </div>
            <p>This information will help us build a comprehensive alumni network and allow current students to connect with you for guidance and mentorship.</p>
            <p>We look forward to your continued involvement and support as part of the Nexus community.</p>
            <p>Warm Regards,<br>Team Nexus</p>
        </div>
    `;
    const html = emailWrapper(contentHtml);
    await transporter.sendMail({
        from: EMAIL_ID,
        to: user.personalEmail,
        subject: "Congratulations – You’re Now Part of the Nexus Alumni Network",
        html
    });
}

module.exports = { sendAlumniWelcomeEmail, emailHeader, emailFooter };