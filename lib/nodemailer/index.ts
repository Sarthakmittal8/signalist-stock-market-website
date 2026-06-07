import nodemailer from 'nodemailer'
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE, STOCK_ALERT_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";
import {email} from "zod";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    try {
        const htmlTemplate = WELCOME_EMAIL_TEMPLATE
            .replace("{{name}}", name)
            .replace("{{intro}}", intro);

        const  mailOptions = {
            from: `"Signalist" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: `Welcome to Signalist - your stock market toolkit is ready!`,
            text: "Thanks for joining Signalist",
            html: htmlTemplate,
        }
        
        console.log('Sending welcome email');
        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        throw error;
    }
}

export const sendNewsSummaryEmail = async ({ email, date, newsContent }: NewsSummaryEmailData) => {
    try {
        const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
            .replace("{{date}}", date)
            .replace("{{newsContent}}", newsContent);

        const mailOptions = {
            from: `"Signalist News" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: `Market News Summary Today - ${date}`,
            text: "Today's market news summary from Signalist.",
            html: htmlTemplate,
        }
        
        console.log(`Sending daily news summary email to: ${email}`);
        const result = await transporter.sendMail(mailOptions);
        console.log(`Daily news email sent successfully to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error(`Failed to send daily news email to ${email}:`, error);
        throw error;
    }
}

// NEW: Function to send stock alerts with premium UI
export const sendStockAlertEmail = async ({ email, alerts }: { email: string, alerts: string[] }) => {
    try {
        // Format the alerts into a dark-mode friendly HTML list
        const alertHtml = alerts.map(alert => 
            `<li style="margin-bottom: 16px; color: #f8fafc; font-size: 15px; line-height: 1.5; padding-left: 12px; border-left: 2px solid #fbbf24;">
                ${alert}
            </li>`
        ).join('');

        // Inject the list into the new premium template
        const htmlTemplate = STOCK_ALERT_EMAIL_TEMPLATE.replace("{{alertsHtml}}", alertHtml);

        const mailOptions = {
            from: `"Signalist Alerts" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: '🚨 Signalist: Stock Alerts Triggered!',
            text: `Your stock alerts have been triggered:\n${alerts.join('\n')}`,
            html: htmlTemplate,
        };

        console.log(`Sending stock alert email to: ${email}`);
        const result = await transporter.sendMail(mailOptions);
        console.log(`Stock alert email sent successfully to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error(`Failed to send stock alert email to ${email}:`, error);
        throw error;
    }
}

// Test function to verify email configuration
export const testEmailConfiguration = async () => {
    try {
        console.log('Testing email configuration...');
        console.log('Email configured:', !!process.env.NODEMAILER_EMAIL);
        console.log('Password configured:', !!process.env.NODEMAILER_PASSWORD);
        
        // Verify transporter configuration
        const verified = await transporter.verify();
        console.log('Email transporter verified:', verified);
        return { success: true, verified };
    } catch (error) {
        console.error('Email configuration test failed:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}