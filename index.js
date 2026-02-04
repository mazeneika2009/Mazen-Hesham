require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Check for placeholder credentials on startup
if (process.env.EMAIL_USER && process.env.EMAIL_USER.includes('your-email')) {
    console.warn('\n⚠️  WARNING: You are using placeholder credentials in .env');
    console.warn('   Email functionality will fail until you update EMAIL_USER and EMAIL_PASS.\n');
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Route: Send Email
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // 2. Email Options
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender info (note: Gmail often overrides this to auth user)
        to: process.env.EMAIL_USER,   // Send to yourself
        subject: `Portfolio Contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<h3>New Contact Form Submission</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong><br>${message}</p>`
    };

    // 3. Send Email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent from ${email}`);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        
        if (error.code === 'EAUTH') {
            console.error('\n❌ AUTHENTICATION FAILED');
            console.error('   1. Check if EMAIL_USER in .env is correct.');
            console.error('   2. Ensure EMAIL_PASS is a Google App Password (not your login password).');
            console.error('   3. Make sure 2-Step Verification is enabled on your Google Account.\n');
        }

        res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
});

// Serve the main page for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});