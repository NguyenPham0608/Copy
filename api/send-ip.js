import nodemailer from 'nodemailer';

export default async (req, res) => {
    if (req.method === 'POST') {
        // Capture the user's IP address from the request
        const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Create a transporter object using SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email from environment variables
                pass: process.env.EMAIL_PASS, // Your app-specific password from environment variables
            },
        });

        // Mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send the email to yourself
            subject: 'New Visitor IP',
            text: `User's IP address: ${userIP}`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send('Email sent');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    } else {
        // Method Not Allowed
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
