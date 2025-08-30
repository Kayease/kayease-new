import nodemailer from "nodemailer";

// Create transporter with cPanel email settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.kayease.in",
    port: parseInt(process.env.SMTP_PORT) || 465, // SMTP Port from the image
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Alternative transporter for cPanel with different port
const createAlternativeTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.kayease.in",
    port: 587, // Alternative port
    secure: false, // false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Get the appropriate transporter
const getTransporter = () => {
  try {
    // Try secure SMTP first (port 465)
    return createTransporter();
  } catch (error) {
    // console.log('Falling back to alternative SMTP configuration');
    return createAlternativeTransporter();
  }
};

// Professional organization signature matching the business card design exactly
const getOrganizationSignature = () => {
  return `
    <div style="margin-top: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Professional Footer - Business Card Style -->
      <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        
        <!-- Business Card Layout -->
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          
          <!-- Left Section - Logo -->
          <div style="flex: 0 0 80px; text-align: center;">
            <img src="https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037615/Kayease.logo_unlzuj.png" 
                 alt="Kayease Logo" 
                 style="width: 60px; height: 60px; object-fit: contain; margin: 0 auto; display: block;">
          </div>
          
          <!-- Vertical Divider -->
          <div style="width: 1px; height: 80px; background-color: #d1d5db; margin: 0 10px;"></div>
          
          <!-- Right Section - Company Info -->
          <div style="flex: 1;">
            <!-- Company Name -->
            <h3 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #1e293b; text-transform: uppercase;">KAYEASE GLOBAL</h3>
            
            <!-- Tagline -->
            <p style="margin: 0 0 16px 0; color: #64748b; font-size: 13px; font-style: italic; line-height: 1.4;">Smart, Scalable Solutions From Code to Conversions</p>
            
                         <!-- Contact Information -->
             <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: #1e293b;">
               <div style="display: flex; align-items: center; margin-bottom: 4px;">
                 <span style="color: #1e293b; margin-right: 8px; font-size: 14px;">📞</span>
                 <a href="tel:+919887664666" style="color: #1e293b; text-decoration: underline; font-weight: 600;">+91 98876-64666</a>
               </div>
               <div style="display: flex; align-items: center; margin-bottom: 4px;">
                 <span style="color: #1e293b; margin-right: 8px; font-size: 14px;">📧</span>
                 <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #1e293b; text-decoration: underline; font-weight: 600;">${process.env.ADMIN_EMAIL}</a>
               </div>
               <div style="display: flex; align-items: center; margin-bottom: 4px;">
                 <span style="color: #1e293b; margin-right: 8px; font-size: 14px;">📍</span>
                 <span style="color: #1e293b; font-weight: 600;">Jaipur, Rajasthan</span>
               </div>
               <div style="display: flex; align-items: center;">
                 <span style="color: #1e293b; margin-right: 8px; font-size: 14px;">🌐</span>
                 <a href="https://kayease.com" style="color: #1e293b; text-decoration: underline; font-weight: 600;">Kayease.com</a>
               </div>
             </div>
          </div>
        </div>
        
        <!-- Footer Text -->
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.4;">
            <strong style="color: #1e293b;">KAYEASE GLOBAL</strong> • Empowering businesses through innovative technology solutions<br>
            This email was sent by the <strong style="color: #1e293b;">Kayease HR Team</strong>.
          </p>
        </div>
        
      </div>
    </div>
  `;
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    // console.log('Email connection verified successfully');
    return { success: true, message: "Email connection verified" };
  } catch (error) {
    // console.error('Email connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Clean and professional custom email from admin panel
export const sendCustomEmail = async (
  to,
  subject,
  message,
  fromName = "Kayease HR Team"
) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          
          <!-- Clean Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Kayease</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">HR Communication</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
            
            <!-- Subject -->
            <div style="margin-bottom: 24px;">
              <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">${subject}</h2>
              <p style="color: #64748b; margin: 0; font-size: 14px;">Message from ${fromName}</p>
            </div>
            
            <!-- Message Content -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #667eea;">
              <div style="white-space: pre-wrap; line-height: 1.6; color: #334155; font-size: 15px;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <!-- Help Section -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h4 style="color: #0c4a6e; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Need Help?</h4>
              <p style="margin: 0; color: #0369a1; font-size: 14px; line-height: 1.5;">
                If you have any questions or need assistance, please contact us at 
                <a href="mailto:${
                  process.env.ADMIN_EMAIL
                }" text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
              </p>
            </div>
          </div>
          
          ${getOrganizationSignature()}
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // console.error('Error sending custom email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Enhanced new application notification to admin
export const sendNewApplicationNotification = async (application) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Kayease HR" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🎯 New Job Application - ${application.jobTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px; border-radius: 15px; margin-bottom: 25px; text-align: center; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">New Job Application</h1>
            <p style="color: white; margin: 12px 0 0 0; font-size: 18px; opacity: 0.95; font-weight: 300;">Application Received Successfully</p>
          </div>
          
          <div style="background: white; padding: 35px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Application Details</h2>
              <p style="color: #64748b; margin: 0; font-size: 14px; font-weight: 500;">A new candidate has applied for a position</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 25px 0;">
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">👤 Applicant Information</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong >Full Name:</strong><br>${application.fullName}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong >Email:</strong><br>
                  <a href="mailto:${
                    application.email
                  }" text-decoration: none;">${application.email}</a>
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong >Phone:</strong><br>
                  <a href="tel:${application.phone}" text-decoration: none;">${
        application.phone
      }</a>
                </p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">💼 Position Details</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong >Position:</strong><br>${application.jobTitle}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong >Experience:</strong><br>${application.experience}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong >Applied On:</strong><br>${new Date(
                    application.appliedAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            
            ${
              application.coverLetter
                ? `
              <div style="margin: 25px 0; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Cover Letter</h3>
                <p style="margin: 0; line-height: 1.7; color: #78350f; font-size: 14px;">${application.coverLetter}</p>
              </div>
            `
                : ""
            }
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/admin/applications" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                🔍 View Full Application
              </a>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 10px; border: 1px solid #bae6fd;">
              <h3 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px; font-weight: 600;">⚡ Quick Actions</h3>
              <p style="margin: 0; color: #0369a1; font-size: 14px; line-height: 1.6;">
                • Review the application in detail<br>
                • Update application status<br>
                • Send custom email to applicant<br>
                • Schedule interview if shortlisted
              </p>
            </div>
          </div>
          ${getOrganizationSignature()}
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Admin notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // console.error('Error sending admin notification:', error);
    throw new Error(`Failed to send admin notification: ${error.message}`);
  }
};

// Enhanced application confirmation to applicant
export const sendApplicationConfirmation = async (application) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Kayease HR" <${process.env.SMTP_USER}>`,
      to: application.email,
      subject: `✅ Application Received - ${application.jobTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px; border-radius: 15px; margin-bottom: 25px; text-align: center; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Application Received</h1>
            <p style="color: white; margin: 12px 0 0 0; font-size: 18px; opacity: 0.95; font-weight: 300;">Thank you for your interest in Kayease</p>
          </div>
          
          <div style="background: white; padding: 35px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Dear ${
                application.firstName
              },</h2>
              <p style="color: #64748b; margin: 0; font-size: 14px; font-weight: 500;">We're excited to review your application</p>
            </div>
            
            <div style="line-height: 1.8; color: #334155; font-size: 16px;">
              <p style="margin-bottom: 20px;">Thank you for your interest in the <strong >${
                application.jobTitle
              }</strong> position at Kayease. We have successfully received your application and our HR team will review it carefully.</p>
              
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 What happens next?</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">1️⃣ Application Review</h4>
                    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">Our HR team will review your application within 2-3 business days</p>
                  </div>
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">2️⃣ Status Update</h4>
                    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">You will receive an email update on your application status</p>
                  </div>
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">3️⃣ Next Steps</h4>
                    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">If shortlisted, we will contact you for the interview process</p>
                  </div>
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">4️⃣ Questions?</h4>
                    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">Contact us at <a href="mailto:${
                      process.env.ADMIN_EMAIL
                    }">${process.env.ADMIN_EMAIL}</a></p>
                  </div>
                </div>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b; margin: 25px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">💡 Application Reference</h3>
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                  <strong>Position:</strong> ${application.jobTitle}<br>
                  <strong>Applied On:</strong> ${new Date(
                    application.appliedAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              
              <p style="margin-top: 25px; font-size: 16px; line-height: 1.6;">If you have any questions about your application or the hiring process, please don't hesitate to contact our HR team at <a href="mailto:${
                process.env.ADMIN_EMAIL
              }" text-decoration: none; font-weight: 600;">${
        process.env.ADMIN_EMAIL
      }</a></p>
              
              <p style="margin-top: 30px; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #1e293b;">Kayease HR Team</strong>
              </p>
            </div>
          </div>
          ${getOrganizationSignature()}
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Application confirmation sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // console.error('Error sending application confirmation:', error);
    throw new Error(
      `Failed to send application confirmation: ${error.message}`
    );
  }
};

// Clean and professional status update notification
export const sendStatusUpdateNotification = async (
  application,
  newStatus,
  note = ""
) => {
  try {
    const transporter = getTransporter();

    const statusMessages = {
      pending: "Your application is currently under review by our HR team.",
      reviewing: "Your application is being actively reviewed by our HR team.",
      shortlisted:
        "Congratulations! Your application has been shortlisted for the next round.",
      interview_scheduled:
        "Your interview has been scheduled. You will receive detailed information shortly.",
      interviewed:
        "Your interview has been completed. We will provide feedback and next steps soon.",
      selected:
        "Congratulations! You have been selected for the position. Welcome to the Kayease team!",
      rejected:
        "Thank you for your interest in joining Kayease. We have decided to move forward with other candidates.",
      withdrawn: "Your application has been withdrawn as requested.",
    };

    const statusColors = {
      pending: "#f59e0b",
      reviewing: "#3b82f6",
      shortlisted: "#10b981",
      interview_scheduled: "#8b5cf6",
      interviewed: "#06b6d4",
      selected: "#059669",
      rejected: "#ef4444",
      withdrawn: "#6b7280",
    };

    const statusIcons = {
      pending: "⏳",
      reviewing: "🔍",
      shortlisted: "✅",
      interview_scheduled: "📅",
      interviewed: "🎯",
      selected: "🎉",
      rejected: "❌",
      withdrawn: "↩️",
    };

    const mailOptions = {
      from: `"Kayease HR" <${process.env.SMTP_USER}>`,
      to: application.email,
      subject: `Application Status Update - ${application.jobTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          
          <!-- Clean Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Kayease</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Application Status Update</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
            
            <!-- Greeting -->
            <div style="margin-bottom: 24px;">
              <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Dear ${
                application.firstName
              },</h2>
              <p style="color: #64748b; margin: 0; font-size: 14px;">We wanted to provide you with an update on your application.</p>
            </div>
            
            <!-- Application Details -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6;">
                <strong>Position:</strong> ${application.jobTitle}
              </p>
            </div>
            
            <!-- Status Update -->
            <div style="background: ${
              statusColors[newStatus] || "#667eea"
            }; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">${
                statusIcons[newStatus] || "📊"
              }</div>
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${
                newStatus.charAt(0).toUpperCase() +
                newStatus.slice(1).replace("_", " ")
              }</h3>
              <p style="margin: 0; font-size: 14px; opacity: 0.95; line-height: 1.5;">${
                statusMessages[newStatus] ||
                "Your application status has been updated."
              }</p>
            </div>
            
            ${
              note
                ? `
              <!-- Additional Note -->
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 24px;">
                <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Additional Note</h4>
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.5;">${note}</p>
              </div>
            `
                : ""
            }
            
            <!-- Next Steps -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 24px;">
              <h4 style="color: #0c4a6e; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Next Steps</h4>
              <ul style="margin: 0; padding-left: 20px; color: #0369a1; font-size: 14px; line-height: 1.5;">
                <li style="margin-bottom: 4px;">You will receive further communication based on your new status</li>
                <li style="margin-bottom: 4px;">For any questions, contact us at <a href="mailto:${
                  process.env.ADMIN_EMAIL
                }" text-decoration: none;">${process.env.ADMIN_EMAIL}</a></li>
                <li>Keep an eye on your email for important updates</li>
              </ul>
            </div>
            
            <!-- Closing -->
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #64748b;">
                Best regards,<br>
                <strong style="color: #1e293b;">Kayease HR Team</strong>
              </p>
            </div>
          </div>
          
          ${getOrganizationSignature()}
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Status update notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // console.error('Error sending status update notification:', error);
    throw new Error(
      `Failed to send status update notification: ${error.message}`
    );
  }
};

/**
 * Send contact form notification to HR
 * @param {Object} contact - Contact form data
 * @returns {Promise<Object>} Email send result
 */
export const sendContactFormNotification = async (contact) => {
  try {
    const transporter = getTransporter();

    // Format subject for display
    const subjectLabels = {
      "hire-us": "Hire Us",
      "join-us": "Join Us",
      partnership: "Partnership",
      "general-inquiry": "General Inquiry",
      support: "Support",
      feedback: "Feedback",
      other: "Other",
    };

    const mailOptions = {
      from: `"Kayease Website" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📧 New Contact Form Submission - ${contact.fullName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px; border-radius: 15px; margin-bottom: 25px; text-align: center; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">New Contact Form Submission</h1>
            <p style="color: white; margin: 12px 0 0 0; font-size: 18px; opacity: 0.95; font-weight: 300;">Potential Client Inquiry Received</p>
          </div>
          
          <div style="background: white; padding: 35px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Contact Details</h2>
              <p style="color: #64748b; margin: 0; font-size: 14px; font-weight: 500;">A new potential client has submitted a contact form</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 25px 0;">
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">👤 Contact Information</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Full Name:</strong><br>${contact.fullName}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Email:</strong><br>
                  <a href="mailto:${
                    contact.email
                  }" style="color: #667eea; text-decoration: none;">${
        contact.email
      }</a>
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Phone:</strong><br>
                  <a href="tel:${
                    contact.phone
                  }" style="color: #667eea; text-decoration: none;">${
        contact.phone
      }</a>
                </p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">💼 Inquiry Details</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Subject:</strong><br>${
                    subjectLabels[contact.subject] || contact.subject
                  }
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Submitted:</strong><br>${new Date(
                    contact.createdAt
                  ).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 4px solid #10b981; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">💬 Message</h3>
              <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; white-space: pre-wrap;">${
                contact.description
              }</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 0%); padding: 20px; border-radius: 10px; border: 1px solid #f59e0b; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;">🚀 Next Steps</h3>
              <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
                <li>Review the inquiry details above</li>
                <li>Contact the client within 24 hours</li>
                <li>Prepare a personalized response</li>
                <li>Update the contact status in the admin panel</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${
                process.env.FRONTEND_URL || "https://kayease.com"
              }/admin/contacts" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                📋 View in Admin Panel
              </a>
            </div>
          </div>
          
          ${getOrganizationSignature()}
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending contact form notification:", error);
    throw error;
  }
};

/**
 * Send job application notification to HR
 * @param {Object} application - Job application data
 * @returns {Promise<Object>} Email send result
 */
export const sendJobApplicationToHR = async (application) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Kayease HR" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🎯 New Job Application - ${application.jobTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px; border-radius: 15px; margin-bottom: 25px; text-align: center; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">New Job Application</h1>
            <p style="color: white; margin: 12px 0 0 0; font-size: 18px; opacity: 0.95; font-weight: 300;">Application Received Successfully</p>
          </div>
          
          <div style="background: white; padding: 35px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Application Details</h2>
              <p style="color: #64748b; margin: 0; font-size: 14px; font-weight: 500;">A new candidate has applied for a position</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 25px 0;">
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">👤 Applicant Information</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Full Name:</strong><br>${application.fullName}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Email:</strong><br>
                  <a href="mailto:${
                    application.email
                  }" style="color: #667eea; text-decoration: none;">${
        application.email
      }</a>
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Phone:</strong><br>
                  <a href="tel:${
                    application.phone
                  }" style="color: #667eea; text-decoration: none;">${
        application.phone
      }</a>
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Current Location:</strong><br>${
                    application.currentLocation
                  }
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Willing to Relocate:</strong><br>${
                    application.willingToRelocate ? "Yes" : "No"
                  }
                </p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">💼 Position Details</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Position:</strong><br>${application.jobTitle}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Experience:</strong><br>${application.experience}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Expected Salary:</strong><br>${
                    application.expectedSalary || "Not specified"
                  }
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #475569;">
                  <strong>Applied On:</strong><br>${new Date(
                    application.appliedAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            
            ${
              application.skills && application.skills.length > 0
                ? `
              <div style="margin: 25px 0; padding: 20px; background: #ecfdf5; border-radius: 10px; border-left: 4px solid #10b981;">
                <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">🛠️ Skills</h3>
                <p style="margin: 0; line-height: 1.7; color: #047857; font-size: 14px;">${application.skills.join(
                  ", "
                )}</p>
              </div>
            `
                : ""
            }
            
            ${
              application.coverLetter
                ? `
              <div style="margin: 25px 0; padding: 20px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Cover Letter</h3>
                <p style="margin: 0; line-height: 1.7; color: #78350f; font-size: 14px; white-space: pre-wrap;">${application.coverLetter}</p>
              </div>
            `
                : ""
            }
            
            ${
              application.resumeUrl
                ? `
              <div style="margin: 25px 0; padding: 20px; background: #eff6ff; border-radius: 10px; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📄 Resume</h3>
                <p style="margin: 0; color: #1d4ed8; font-size: 14px;">
                  <a href="${application.resumeUrl}" target="_blank" style="color: #3b82f6; text-decoration: none; font-weight: 600;">📥 Download Resume</a>
                </p>
              </div>
            `
                : ""
            }
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/admin/applications" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                🔍 View Full Application
              </a>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 10px; border: 1px solid #bae6fd;">
              <h3 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px; font-weight: 600;">⚡ Quick Actions</h3>
              <p style="margin: 0; color: #0369a1; font-size: 14px; line-height: 1.6;">
                • Review the application in detail<br>
                • Update application status<br>
                • Send custom email to applicant<br>
                • Schedule interview if shortlisted
              </p>
            </div>
          </div>
          ${getOrganizationSignature()}
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Job application notification sent to HR:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending job application notification to HR:", error);
    throw new Error(
      `Failed to send job application notification to HR: ${error.message}`
    );
  }
};

export const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    "Unknown"
  );
};

export const sendCallbackRequestNotification = async (callbackRequest) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Kayease Website" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📞 New Callback Request Received - ${callbackRequest.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">📞 New Callback Request</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">Someone has requested a callback from your website</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 4px solid #3b82f6; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">👤 Contact Information</h3>
            <p style="margin: 8px 0; font-size: 14px; color: #475569;">
              <strong>Name:</strong><br>${callbackRequest.name}
            </p>
            <p style="margin: 8px 0; font-size: 14px; color: #475569;">
              <strong>Phone:</strong><br><a href="tel:${
                callbackRequest.phone
              }" style="color: #3b82f6; text-decoration: none;">${
        callbackRequest.phone
      }</a>
            </p>
            ${
              callbackRequest.email
                ? `
            <p style="margin: 8px 0; font-size: 14px; color: #475569;">
              <strong>Email:</strong><br><a href="mailto:${callbackRequest.email}" style="color: #3b82f6; text-decoration: none;">${callbackRequest.email}</a>
            </p>
            `
                : ""
            }
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 4px solid #10b981; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">⏰ Preferred Callback Time</h3>
            <p style="margin: 8px 0; font-size: 14px; color: #475569;">
              <strong>Requested Time:</strong><br>${new Date(
                callbackRequest.preferredTime
              ).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p style="margin: 8px 0; font-size: 14px; color: #475569;">
              <strong>Submitted:</strong><br>${new Date(
                callbackRequest.createdAt
              ).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 4px solid #f59e0b; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">💬 Message</h3>
            <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; white-space: pre-wrap;">${
              callbackRequest.message
            }</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 0%); padding: 20px; border-radius: 10px; border: 1px solid #f59e0b; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;">🚀 Next Steps</h3>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
              <li>Review the callback request details above</li>
              <li>Call the client at their preferred time</li>
              <li>Prepare for the conversation based on their message</li>
              <li>Update the request status in the admin panel</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${
              process.env.FRONTEND_URL || "https://kayease.com"
            }/admin/callback-requests" 
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
              📋 View in Admin Panel
            </a>
          </div>
        </div>
        
        ${getOrganizationSignature()}
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    // console.log("Callback request notification sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending callback request notification:", error);
    throw error;
  }
};
