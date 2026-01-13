import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    // Verify transporter configuration
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: `"Instagram Lite" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
}

export function generatePasswordResetEmail(resetLink: string, username: string): string {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #fafafa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 40px 20px;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          font-size: 32px;
          font-weight: 400;
          font-family: 'Cookie', cursive;
          color: #262626;
          margin: 0;
        }
        .content {
          color: #262626;
          line-height: 1.6;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #0095f6;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #0081d5;
        }
        .divider {
          border-top: 1px solid #dbdbdb;
          margin: 30px 0;
        }
        .footer {
          text-align: center;
          color: #8e8e8e;
          font-size: 12px;
          margin-top: 30px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>Instagram Lite</h1>
        </div>
        
        <div class="content">
          <h2>Đặt lại mật khẩu</h2>
          
          <p>Xin chào <strong>${username}</strong>,</p>
          
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Instagram Lite của bạn.</p>
          
          <p>Click vào nút bên dưới để tạo mật khẩu mới:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Đặt lại mật khẩu</a>
          </div>
          
          <p>Hoặc copy và paste link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #0095f6; font-size: 14px;">${resetLink}</p>
          
          <div class="warning">
            <p style="margin: 0;"><strong>⚠️ Lưu ý:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Link này sẽ hết hạn sau <strong>1 giờ</strong></li>
              <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
              <li>Không chia sẻ link này với bất kỳ ai</li>
            </ul>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          <p>&copy; ${new Date().getFullYear()} Instagram Lite. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate OTP verification email
export function generateOTPEmail(otp: string, username: string): string {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #fafafa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 40px 20px;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          font-size: 32px;
          font-weight: 400;
          font-family: 'Cookie', cursive;
          color: #262626;
          margin: 0;
        }
        .content {
          color: #262626;
          line-height: 1.6;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .otp-box {
          background-color: #f5f5f5;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          border: 1px solid #e0e0e0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: 700;
          color: #222222;
          letter-spacing: 6px;
          margin: 0;
          font-family: 'Courier New', monospace;
        }
        .otp-label {
          color: #555555;
          font-size: 14px;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .divider {
          border-top: 1px solid #dbdbdb;
          margin: 30px 0;
        }
        .footer {
          text-align: center;
          color: #8e8e8e;
          font-size: 12px;
          margin-top: 30px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
        .info {
          background-color: #d1ecf1;
          border: 1px solid #bee5eb;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #0c5460;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>Instagram Lite</h1>
        </div>
        
        <div class="content">
          <h2>Xác thực email của bạn</h2>
          
          <p>Xin chào <strong>${username}</strong>,</p>
          
          <p>Cảm ơn bạn đã đăng ký tài khoản Instagram Lite! Để hoàn tất quá trình đăng ký, vui lòng xác thực địa chỉ email của bạn bằng mã OTP bên dưới:</p>
          
          <div class="otp-box" style="background-color:#f5f5f5;border-radius:12px;padding:30px;text-align:center;margin:30px 0;border:1px solid #e0e0e0;">
            <div class="otp-label" style="color:#555555;font-size:14px;margin-top:10px;text-transform:uppercase;letter-spacing:2px;">MÃ XÁC THỰC</div>
            <p class="otp-code" style="font-size:32px;font-weight:700;color:#222222;letter-spacing:6px;margin:12px 0 0;font-family:'Courier New',monospace;display:inline-block;">${otp}</p>
          </div>
          
          <div class="info">
            <p style="margin: 0;"><strong>📌 Hướng dẫn:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Nhập mã OTP gồm 6 chữ số vào form xác thực</li>
              <li>Mã này sẽ hết hạn sau <strong>3 phút</strong></li>
            </ul>
          </div>
          
          <div class="warning">
            <p style="margin: 0;"><strong>⚠️ Lưu ý bảo mật:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Không chia sẻ mã OTP này với bất kỳ ai</li>
              <li>Instagram Lite sẽ không bao giờ yêu cầu mã OTP qua điện thoại</li>
              <li>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này</li>
            </ul>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          <p>&copy; ${new Date().getFullYear()} Instagram Lite. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
