import transporter from "./nodemailer.js";

export const sendContractSignEmail = async (
  email,
  name,
  contractUrl,
  signLink
) => {
  try {
    const mailOptions = {
      from: "easydrive <easy.drive.app.mail@gmail.com>",
      to: "osamaalsrraj3@gmail.com",
      subject: "Contract Sign Request - Car Rental Agreement",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Contract Sign Request</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #1e40af; padding: 40px 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">EasyDrive</h1>
              <div style="width: 60px; height: 2px; background-color: white; margin: 15px auto;"></div>
              <h2 style="margin: 0; font-size: 18px; font-weight: 400;">Car Rental Contract</h2>
              <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Digital Signature Required</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1e40af;">Dear ${name},</h3>
              <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.6; color: #475569;">
                You have received an official car rental contract that requires your digital signature. Please carefully review all terms and conditions before proceeding with the agreement.
              </p>

              <!-- Contract Details -->
              <div style="border: 2px solid #e2e8f0; padding: 25px; margin-bottom: 30px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #1e40af; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.05em;">Contract Details</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #334155;">Status:</td>
                    <td style="padding: 8px 0; color: #1e40af;">Awaiting Signature</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #334155;">Signatory:</td>
                    <td style="padding: 8px 0; color: #475569;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #334155;">Email:</td>
                    <td style="padding: 8px 0; color: #475569;">${email}</td>
                  </tr>
                </table>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${contractUrl}" style="
                  background-color: #ffffff;
                  color: #1e40af;
                  text-decoration: none;
                  padding: 14px 28px;
                  border: 2px solid #1e40af;
                  font-weight: 600;
                  display: inline-block;
                  font-size: 14px;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  margin-right: 15px;
                  margin-bottom: 10px;
                ">
                  Review Contract
                </a>
              </div>

              <!-- Primary CTA -->
              <div style="border: 2px solid #1e40af; padding: 30px; text-align: center; background-color: #f8fafc;">
                <h4 style="font-size: 18px; font-weight: 600; color: #1e40af; margin-bottom: 15px;">Ready to Sign?</h4>
                <p style="font-size: 15px; color: #475569; margin-bottom: 20px; line-height: 1.5;">
                  By proceeding, you acknowledge that you have read, understood, and agree to all terms and conditions outlined in this contract.
                </p>
                <p style="font-size: 14px; color: #1e40af; margin-bottom: 25px; font-weight: 500;">
                  Payment will be automatically processed upon contract signing
                </p>
                <a href="${signLink}" style="
                  background-color: #1e40af;
                  color: white;
                  padding: 16px 40px;
                  font-weight: 600;
                  font-size: 16px;
                  text-decoration: none;
                  display: inline-block;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                ">
                  Accept & Sign Contract
                </a>
              </div>

              <!-- Time Warning -->
              <div style="margin-top: 30px; padding: 20px; border: 2px solid #dc2626; background-color: #fef2f2;">
                <h4 style="font-size: 16px; font-weight: 600; color: #dc2626; margin-bottom: 10px; text-align: center;">⚠️ URGENT - TIME SENSITIVE</h4>
                <p style="font-size: 15px; color: #7f1d1d; text-align: center; margin-bottom: 0; font-weight: 500;">
                  This rental reservation will be automatically cancelled if not signed within <strong>15 minutes</strong> of receiving this email.
                </p>
              </div>

              <!-- Instructions -->
              <div style="margin-top: 30px; padding: 25px; border-left: 4px solid #1e40af; background-color: #f8fafc;">
                <h4 style="font-size: 16px; font-weight: 600; color: #1e40af; margin-bottom: 15px;">Process Overview</h4>
                <ol style="padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                  <li style="margin-bottom: 8px;">Review the complete rental agreement document</li>
                  <li style="margin-bottom: 8px;">Sign the contract to secure your reservation</li>
                  <li style="margin-bottom: 8px;">Complete identity verification process</li>
                  <li style="margin-bottom: 8px;"><strong>Payment will be processed automatically after contract signing</strong></li>
                  <li style="margin-bottom: 8px;">Receive confirmation and pickup instructions</li>
                </ol>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 30px; border-top: 2px solid #e2e8f0; text-align: center; background-color: #f8fafc;">
              <p style="font-size: 14px; color: #64748b; margin-bottom: 10px;">
                <strong>EasyDrive Car Rental Services</strong>
              </p>
              <p style="font-size: 12px; color: #94a3b8; margin-bottom: 15px;">
                For assistance, please contact our customer support team
              </p>
              <p style="font-size: 11px; color: #cbd5e1;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
