const user = require('../models/userModel.js');
const { sendEmail } = require('../utils/emailUtils.js');

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortBy || 'fullName';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;
        const searchQuery = req.query.search || '';
        const branchFilter = req.query.branch || 'all';
        const yearFilter = req.query.year || 'all';

        // Create search query
        const searchConditions = {
            emailVerified: true,
        };

        // Add search conditions
        if (searchQuery) {
            searchConditions.$or = [
                { fullName: { $regex: searchQuery, $options: 'i' } },
                { admissionNumber: { $regex: searchQuery, $options: 'i' } },
                { branch: { $regex: searchQuery, $options: 'i' } },
                { personalEmail: { $regex: searchQuery, $options: 'i' } },
                { instituteEmail: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        // Add branch filter
        if (branchFilter !== 'all') {
            searchConditions.branch = { $regex: branchFilter, $options: 'i' };
        }

        // Add year filter
        if (yearFilter !== 'all') {
            const yearPattern = yearFilter.slice(2); // Get last two digits of year
            searchConditions.admissionNumber = {
                $regex: `^[UI]${yearPattern}`,
                $options: 'i'
            };
        }

        const users = await user.find(
            searchConditions,
            '-password -verificationToken -resetPasswordToken -resetPasswordExpires -emailVerified -subscribed -__v'
        )
            .sort({ [sortField]: sortOrder })
            .skip(limit === 1000000 ? 0 : (page - 1) * limit) // Skip pagination if downloading all
            .limit(limit);

        const totalUsers = await user.countDocuments(searchConditions);

        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}

const notifyBatch = async (req, res) => {
    try {
        // Extract inputs from request body
        const subject = req.body.subject || req.body.emailSubject || '';
        const htmlTemplate = req.body.html || '';
        const recipients = req.body.batches || req.body.recipients || req.body.to || req.body.emails || '';
        const customAddressing = req.body.customAddressing === true || req.body.customAddressing === 'true';

        console.log('Notification request received:', {
            subject,
            htmlLength: htmlTemplate?.length,
            recipients: typeof recipients === 'string'
                ? recipients
                : Array.isArray(recipients)
                    ? JSON.stringify(recipients)
                    : typeof recipients,
            customAddressing
        });

        if (!subject || !htmlTemplate) {
            return res.status(400).json({ message: 'Email subject and HTML content are required' });
        }

        // Normalize input list
        const rawInputs = Array.isArray(recipients) ? recipients : String(recipients || '').split(',');
        const inputs = rawInputs.map(b => String(b).trim()).filter(Boolean);

        if (!inputs.length) {
            return res.status(400).json({ message: 'Please provide at least one batch prefix or email address' });
        }

        console.log('Parsed inputs:', inputs);

        // Categorize inputs
        const prefixes = [];
        const admissionNumbers = [];
        const directEmails = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        inputs.forEach(input => {
            if (emailRegex.test(input)) {
                directEmails.push(input);
            } else if (/^[ui][a-z0-9]{6,8}$/i.test(input)) {
                admissionNumbers.push(input.toUpperCase());
            } else if (/^[ui][a-z0-9]+$/i.test(input)) {
                prefixes.push(input.toLowerCase());
            } else {
                console.log(`Invalid input skipped: ${input}`);
            }
        });

        let recipientsList = [];
        let matchedBatches = [];
        let matchedAdmissions = [];

        // Find recipients by admission number
        if (admissionNumbers.length > 0) {
            const admissionRecipients = await user.find(
                {
                    emailVerified: true,
                    admissionNumber: { $in: admissionNumbers },
                    personalEmail: { $exists: true, $ne: '' }
                },
                { personalEmail: 1, fullName: 1, admissionNumber: 1, _id: 0 }
            ).lean();

            matchedAdmissions = admissionRecipients.map(r => r.admissionNumber);
            recipientsList.push(...admissionRecipients);
        }

        // Find recipients by batch prefix
        if (prefixes.length > 0) {
            const regex = new RegExp(`^(${prefixes.join('|')})`, 'i');
            matchedBatches = prefixes;

            const batchRecipients = await user.find(
                {
                    emailVerified: true,
                    admissionNumber: { $regex: regex },
                    personalEmail: { $exists: true, $ne: '' }
                },
                { personalEmail: 1, fullName: 1, _id: 0 }
            ).lean();

            recipientsList.push(...batchRecipients);
        }

        // Add direct email recipients
        if (directEmails.length > 0) {
            recipientsList.push(
                ...directEmails.map(email => ({
                    personalEmail: email,
                    fullName: email.split('@')[0]
                }))
            );
        }

        if (!recipientsList.length) {
            return res.status(404).json({
                message: 'No recipients found for the provided inputs',
                debug: { inputs, prefixes, emails: directEmails }
            });
        }

        // Deduplicate by email
        const uniqueMap = new Map();
        for (const r of recipientsList) {
            const email = r.personalEmail?.trim();
            if (email && !uniqueMap.has(email)) {
                uniqueMap.set(email, r.fullName || 'User');
            }
        }

        console.log(`Final recipient count after deduplication: ${uniqueMap.size}`);

        // Send emails
        let sentCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const [email, name] of uniqueMap.entries()) {
            try {
                let htmlToSend = htmlTemplate;
                if (!customAddressing && htmlTemplate.includes('{{FULL_NAME}}')) {
                    htmlToSend = htmlTemplate.replace('{{FULL_NAME}}', name || 'User');
                }
                await sendEmail({ to: email, subject, html: htmlToSend });
                sentCount++;
            } catch (err) {
                errorCount++;
                errors.push({ email, error: err.message });
            }
        }

        return res.status(200).json({
            message: `Sent ${sentCount} emails successfully${errorCount ? ` (${errorCount} failed)` : ''}`,
            totalRecipients: sentCount,
            failedCount: errorCount,
            batches: matchedBatches.length ? matchedBatches : undefined,
            directEmails: directEmails.length ? directEmails : undefined,
            specificAdmissionNumbers: matchedAdmissions.length ? matchedAdmissions : undefined
        });

    } catch (err) {
        console.error('notifyBatch error:', err);
        return res.status(500).json({ message: 'Server error sending batch emails', error: err.message });
    }
};

const getUserStats = async (req, res) => {
    try {
        const totalUsers = await user.countDocuments({ emailVerified: true });

        // Get branch-wise stats
        const branchStats = await user.aggregate([
            { $match: { emailVerified: true } },
            { $group: { _id: "$branch", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get year-wise stats
        const yearStats = await user.aggregate([
            { $match: { emailVerified: true } },
            {
                $project: {
                    year: {
                        $substr: ["$admissionNumber", 1, 2]
                    }
                }
            },
            { $group: { _id: "$year", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        // Calculate month-over-month growth
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);

        const currentMonthUsers = await user.countDocuments({
            emailVerified: true,
            createdAt: { $gte: lastMonth }
        });

        const growthRate = ((currentMonthUsers / totalUsers) * 100).toFixed(2);

        // Get profile completion stats
        const profileStats = await user.aggregate([
            { $match: { emailVerified: true } },
            {
                $project: {
                    completionRate: {
                        $multiply: [
                            {
                                $divide: [
                                    {
                                        $add: [
                                            { $cond: [{ $gt: ["$githubProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$linkedInProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$leetcodeProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$codeforcesProfile", ""] }, 1, 0] },
                                            { $cond: [{ $gt: ["$codechefProfile", ""] }, 1, 0] }
                                        ]
                                    },
                                    5
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgCompletionRate: { $avg: "$completionRate" }
                }
            }
        ]);

        res.status(200).json({
            totalUsers,
            branchStats,
            yearStats,
            growthRate,
            profileCompletionRate: profileStats[0]?.avgCompletionRate.toFixed(2) || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user statistics', error });
    }
};

module.exports = {
    getAllUsers,
    getUserStats,
    notifyBatch,
};