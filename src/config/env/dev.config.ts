import { config } from 'dotenv';
config();
export const devConfig = {
    DB_URI: process.env.DB_URI,
    PORT: process.env.PORT,
    API_SECRET: process.env.API_SECRET,
    API_KEY: process.env.API_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    SECRET_KEY: process.env.SECRET_KEY,
    ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,
    ENCRYPTION_IV: process.env.ENCRYPTION_IV,
    OTP_Body: (otp: string) => {
        return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    /* General resets */
    body,table,td{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;}
    img{border:0;display:block;outline:none;text-decoration:none;}
    a{color:inherit;text-decoration:none;}

    /* Container */
    .email-wrapper{width:100%;background-color:#f4f6f8;padding:30px 0;}
    .email-content{max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(11,23,39,0.08);}

    /* Header */
    .email-header{padding:24px 32px;background:linear-gradient(90deg,#4f46e5,#06b6d4);color:#ffffff;text-align:center}
    .brand{font-weight:700;font-size:20px;letter-spacing:0.2px}

    /* Body */
    .email-body{padding:28px 32px;color:#0f172a}
    .lead{font-size:18px;margin:0 0 12px}
    .text{font-size:14px;line-height:1.5;color:#475569;margin:0 0 18px}

    /* OTP box */
    .otp-box{display:inline-block;padding:18px 28px;background:#f1f5f9;border-radius:10px;font-size:28px;letter-spacing:4px;font-weight:700;color:#0f172a}

    /* Button */
    .btn{display:inline-block;padding:12px 20px;border-radius:8px;background:#111827;color:#fff;font-weight:600}

    /* Footer */
    .email-footer{padding:20px 32px;font-size:12px;color:#94a3b8;background:#fbfdff}

    /* Small screens */
    @media only screen and (max-width:420px){
      .email-header{padding:18px}
      .email-body{padding:20px}
      .otp-box{font-size:22px;padding:14px 20px}
    }
  </style>
</head>
<body>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="email-content">

          <!-- Header -->
          <tr>
            <td class="email-header">
              <div style="display:flex;align-items:center;justify-content:center;gap:12px">
                <img src="https://via.placeholder.com/40" width="40" height="40" alt="logo" style="border-radius:8px">
                <div class="brand">{{COMPANY}}</div>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body">
              <p class="lead">Your verification code</p>
              <p class="text">Use the code below to verify your email address. This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>

              <div style="text-align:center;margin:18px 0">
                <div class="otp-box">{${otp}}</div>
              </div>

              <div style="text-align:center;margin:18px 0">
                <a href="#" class="btn">Verify now</a>
              </div>

              <p class="text" style="font-size:13px;color:#64748b">If the "Verify now" button doesn't work, copy and paste the code above into the verification page.</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px">
              <hr style="border:none;border-top:1px solid #e6edf3;margin:0">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="email-footer">
              <table role="presentation" width="100%">
                <tr>
                  <td style="vertical-align:top;padding-right:12px">
                    <strong style="color:#0f172a">Need help?</strong>
                    <div style="margin-top:6px">Contact our <a href="#">support team</a>.</div>
                  </td>
                  <td style="vertical-align:top;text-align:right">
                    <div>© <span id="year">2025</span> {{COMPANY}}</div>
                    <div style="margin-top:6px"><a href="#">Unsubscribe</a></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

  <!-- Inline fallback for email clients that strip head styles -->
  <style>
    /* Safety: re-apply minimal inline styles if needed */
  </style>

</body></html>`
    },
    
};