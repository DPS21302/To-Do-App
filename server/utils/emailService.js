import nodemailer from "nodemailer";

// Create transporter lazily when needed
let transporter = null;

const getTransporter = () => {
    // Return existing transporter if already created
    if (transporter) return transporter;

    // Get environment variables at runtime (not at module load time)
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

    // Check if email configuration is available
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
        console.log('Email credentials not found in environment variables');
        return null;
    }

    // Create and cache transporter
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
        },
    });

    return transporter;
};

export const sendWelcomeEmail = async (email, name) => {
    // Get transporter (will be created if credentials are available)
    const emailTransporter = getTransporter();

    // Skip email sending if not configured
    if (!emailTransporter) {
        console.log('Email service not configured. Skipping welcome email.');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to To-Do App",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Welcome to To-Do App, ${name}!</h2>
        <p>Thank you for signing up. We're excited to have you on board.</p>
        <p>Start organizing your tasks and boost your productivity today!</p>
        <p>Best regards,<br/>The To-Do App Team</p>
      </div>
    `,
    };

    try {
        await emailTransporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
};

export const sendLoginEmail = async (email, name) => {
    // Get transporter (will be created if credentials are available)
    const emailTransporter = getTransporter();

    // Skip email sending if not configured
    if (!emailTransporter) {
        console.log('Email service not configured. Skipping login email.');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome Back to To-Do App",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Welcome Back, ${name}!</h2>
        <p>You've successfully logged in to your To-Do App account.</p>
        <p>If this wasn't you, please secure your account immediately.</p>
        <p>Best regards,<br/>The To-Do App Team</p>
      </div>
    `,
    };

    try {
        await emailTransporter.sendMail(mailOptions);
        console.log(`Login email sent to ${email}`);
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
};
