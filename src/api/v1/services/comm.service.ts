import nodemailer from "nodemailer";
import twilio from "twilio";
import OtpService from "./otp.service.js";
import { OtpRefTypes } from "../enums/otp-ref-types.enum.js";
import { Otp } from "../interfaces/otp.interface.js";
import { logger } from "../../../config/logger.js";
export default class CommService {
  private twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  public conf: any;
  public emailVerificationMailTemplate: string;
  public propertyListingMailTemplate: string;
  public propertyApplicationMailTemplate: string;
  public landlordNotificationMailTemplate: string;
  constructor() {
    // Initialize the email configuration in the constructor
    this.conf = {
      host: process.env.MAILER_SERVICE,
      port: Number(process.env.MAILER_PORT) || 587, // Ensure this is a number
      secure: false, // Set to true if using port 465 (SSL) 587
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Disable SSL hostname checking (if necessary)
      },
    }

    // public emailVerificationMailTemplate: string;


    this.propertyListingMailTemplate = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      img {
        max-width: 100%;
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
        sans-serif;
      padding: 20px;
      background: #ffffff;
    "
  >
  <div>
    <p style="width: 118px">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1"
        alt="letbud logo"
      />
    </p>
  </div>

  <div style="background-color: #ebf0f9;">
    <main style="margin: 0 auto; background-color: #ebf0f9; padding-bottom: 20px">
      <div
        style="
          text-align: center;
          padding: 32px 10px;
          margin-bottom: 12px;
          background: #fdf2d3;
          color: #1b3562;
          font-weight: 700;
          font-size: 26px;
        "
      >
        🏠 Your Property Listing is Live!
      </div>

      <div style="padding: 0 20px; color: #1E1E2D;">
        <p style="margin: 20px 0">Hi [Lessor Name],</p>

        <div>
          🎉 Congratulations! Your property listing has been successfully posted
          on our platform. 🎊
        </div>

        <div style="margin-top: 10px">
          Now, potential renters can explore your fantastic property and get in
          touch with you for inquiries. If you have any updates or need to make
          changes, feel free to edit the listing anytime.
        </div>

        <div style="margin-top: 10px">
          Thank you for choosing our platform to showcase your property. If you
          have any questions or need assistance, don't hesitate to reach out to
          our support team
        </div>

        <div style="color: #1e1e2d; margin-top: 48px; line-height: 22px">
          Best Regards, <br />
          <b>Team Letbud</b>
        </div>

        <div style="font-size: 12px; margin: 10px 0; color: #9499a8">
          This email was sent from a notification-only address that cannot
          accept incoming emails.<br />
          Please do not reply to this message.
        </div>
        <div style="font-size: 12px; margin: 10px 0; color: #9499a8; padding-bottom: 20px;">
          Reach out to our support team via
          <a href="mailto:supportbud@letbud.com" style="color: #4b7bcd"
            >supportbud@letbud.com
          </a>
        </div>
      </div>
    </main>

    
    </div>
    <div style="padding: 20px;">
      <div style="display: flex; align-items: center; padding: 8px 21px">
        <div style="width: 90px;">
          <img
            style="
              width: 96;
              height: auto;
              margin-top: 20px;
              -webkit-filter: grayscale(100%);
              filter: grayscale(100%);
            "
            src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1"
            alt="letbud logo"
          />
        </div>
        <!-- socials -->
        <div style="margin-left: auto; margin-top: 20px">
          <img
            style="width: 24px"
            src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275966733_5367624433282777_4220713818439775162_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=42PlQztGvkoAX9OwPAk&_nc_oc=AQlkURfsZuAnooJH5WUvqjuL05tpnrie0kocVYE2fCbNYED54Ig1m_ENxBI7pSnTctQ&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDzLKvNa6RgQgYHmgakQNg0ln2WcdOSaycC67EjW1rU4Q&oe=65416E63"
            alt="Twitter"
          />
          <img
            style="width: 24px"
            src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/276079790_239645664974434_7595452976573962628_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=nThW5cznc-kAX8GcLV8&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfB8SjGhEVkQgZTr6qkSlKvrNBe_vJxSPOHmigXL8YNWHQ&oe=654178B1"
            alt="Instagram"
          />
          <img
            style="width: 24px"
            src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275775241_706660317361134_8955597739986331891_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=IzroPbDaL-EAX_TmTT5&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDA91DYES4wIrxJl2Bnc-xEgLU_bZtc8sEyrCt7Oh7u0A&oe=654114C2"
            alt="LinkedIn"
          />
        </div>
      </div>

      <div
        style="
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 400;
          color: #9499a8;
          line-height: 18px;
        "
      >
        Discover Your Dream Space: Modern Living, Effortless Booking. © 2023
        Letbud
      </div>
    </div>
  </body>
</html>

  
  `;

    this.propertyApplicationMailTemplate = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          img {
            max-width: 100%;
          }
        </style>
      </head>
      <body
        style="
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
          padding: 20px;
          background: #ffffff;
        "
      >
      <div>
        <p style="width: 118px">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1"
            alt="letbud logo"
          />
        </p>
      </div>

      <div style="background-color: #ebf0f9;">
        <main style="margin: 0 auto; background-color: #ebf0f9; padding-bottom: 20px">
          <div
            style="
              text-align: center;
              padding: 32px 10px;
              margin-bottom: 12px;
              background: #fdf2d3;
              color: #1b3562;
              font-weight: 700;
              font-size: 26px;
            "
          >
            🏠 Application Successful!
          </div>

          <div style="padding: 0 20px; color: #1E1E2D;">
            <p style="margin: 20px 0">Hi [Applicant Name],</p>

            <div>
              🎉 Congratulations! Your application was successful and is under review.
              We will get back to you soon. 🎊
            </div>

            <div style="margin-top: 10px">
              Thank you for choosing our platform. If you
              have any questions or need assistance, don't hesitate to reach out to our support team.
              <a href="mailto:supportbud@letbud.com" style="color: #4b7bcd"
            >supportbud@letbud.com
          </a>
            </div>

            
            <div style="color: #1e1e2d; margin-top: 48px; line-height: 22px">
              Best Regards, <br />
              <b>Team Letbud</b>
            </div>

            <div style="font-size: 12px; margin: 10px 0; color: #9499a8">
              This email was sent from a notification-only address that cannot
              accept incoming emails.<br />
              Please do not reply to this message.
            </div>
            <div style="font-size: 12px; margin: 10px 0; color: #9499a8; padding-bottom: 20px;">
              Reach out to our support team via
              <a href="mailto:supportbud@letbud.com" style="color: #4b7bcd"
                >supportbud@letbud.com
              </a>
            </div>
          </div>
        </main>

        
        </div>
        <div style="padding: 20px;">
          <div style="display: flex; align-items: center; padding: 8px 21px">
            <div style="width: 90px;">
              <img
                style="
                  width: 96;
                  height: auto;
                  margin-top: 20px;
                  -webkit-filter: grayscale(100%);
                  filter: grayscale(100%);
                "
                src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1"
                alt="letbud logo"
              />
            </div>
            <!-- socials -->
            <div style="margin-left: auto; margin-top: 20px">
              <img
                style="width: 24px"
                src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275966733_5367624433282777_4220713818439775162_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=42PlQztGvkoAX9OwPAk&_nc_oc=AQlkURfsZuAnooJH5WUvqjuL05tpnrie0kocVYE2fCbNYED54Ig1m_ENxBI7pSnTctQ&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDzLKvNa6RgQgYHmgakQNg0ln2WcdOSaycC67EjW1rU4Q&oe=65416E63"
                alt="Twitter"
              />
              <img
                style="width: 24px"
                src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/276079790_239645664974434_7595452976573962628_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=nThW5cznc-kAX8GcLV8&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfB8SjGhEVkQgZTr6qkSlKvrNBe_vJxSPOHmigXL8YNWHQ&oe=654178B1"
                alt="Instagram"
              />
              <img
                style="width: 24px"
                src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275775241_706660317361134_8955597739986331891_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=IzroPbDaL-EAX_TmTT5&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDA91DYES4wIrxJl2Bnc-xEgLU_bZtc8sEyrCt7Oh7u0A&oe=654114C2"
                alt="LinkedIn"
              />
            </div>
          </div>

          <div
            style="
              padding: 8px 12px;
              font-size: 12px;
              font-weight: 400;
              color: #9499a8;
              line-height: 18px;
            "
          >
            Discover Your Dream Space: Modern Living, Effortless Booking. © 2023
            Letbud
          </div>
        </div>
      </body>
    </html>
  `;
    // Assign the email template in the constructor or as a direct instance property
    this.emailVerificationMailTemplate = `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              img {
                max-width: 100%;
              }
            </style>
          </head>
          <body
            style="
              margin: 0;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                sans-serif;
              padding: 20px;
              background: #ffffff;
            "
          >
          <div>
            <p style="width: 118px">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1"
                alt="letbud logo"
              />
            </p>
          </div>

          <div style="background-color: #ebf0f9;">
            <main style="margin: 0 auto; background-color: #ebf0f9; padding-bottom: 20px">
              <div
                style="
                  text-align: center;
                  padding: 32px 10px;
                  margin-bottom: 12px;
                  background: #fdf2d3;
                  color: #1b3562;
                  font-weight: 700;
                  font-size: 26px;
                "
              >
                Verify your email
              </div>

              <div style="padding: 0 20px; color: #1E1E2D;">
                <p style="margin: 20px 0">Hi [User's Name],</p>

                <div>
                  🎉 Please verify your email by either clicking the link below or entering the verification code:
                </div>

                <div style="margin-top: 10px; font-weight: bold;">
                  Verification Code: <span style="font-size: 20px; color: #4b7bcd;">[OTP Code]</span>
                </div>

                <div style="margin-top: 20px;">
                  <a href="[Verification Link]" style="color: #ffffff; background-color: #4b7bcd; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                  </a>
                </div>

                <div style="margin-top: 48px; color: #1e1e2d; line-height: 22px">
                  Best Regards, <br />
                  <b>Team Letbud</b>
                </div>

                <div style="font-size: 12px; margin: 10px 0; color: #9499a8">
                  This email was sent from a notification-only address that cannot
                  accept incoming emails.<br />
                  Please do not reply to this message.
                </div>
                <div style="font-size: 12px; margin: 10px 0; color: #9499a8; padding-bottom: 20px;">
                  Reach out to our support team via
                  <a href="mailto:supportbud@letbud.com" style="color: #4b7bcd">
                    supportbud@letbud.com
                  </a>
                </div>
              </div>
            </main>

            
            </div>
            <div style="padding: 20px;">
              <div style="display: flex; align-items: center; padding: 8px 21px">
                <div style="width: 90px;">
                  <img
                    style="
                      width: 96;
                      height: auto;
                      margin-top: 20px;
                      -webkit-filter: grayscale(100%);
                      filter: grayscale(100%);
                    "
                    src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1"
                    alt="letbud logo"
                  />
                </div>
                <!-- socials -->
                <div style="margin-left: auto; margin-top: 20px">
                  <img
                    style="width: 24px"
                    src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275966733_5367624433282777_4220713818439775162_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=42PlQztGvkoAX9OwPAk&_nc_oc=AQlkURfsZuAnooJH5WUvqjuL05tpnrie0kocVYE2fCbNYED54Ig1m_ENxBI7pSnTctQ&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDzLKvNa6RgQgYHmgakQNg0ln2WcdOSaycC67EjW1rU4Q&oe=65416E63"
                    alt="Twitter"
                  />
                  <img
                    style="width: 24px"
                    src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/276079790_239645664974434_7595452976573962628_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=nThW5cznc-kAX8GcLV8&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfB8SjGhEVkQgZTr6qkSlKvrNBe_vJxSPOHmigXL8YNWHQ&oe=654178B1"
                    alt="Instagram"
                  />
                  <img
                    style="width: 24px"
                    src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275775241_706660317361134_8955597739986331891_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=IzroPbDaL-EAX_TmTT5&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDA91DYES4wIrxJl2Bnc-xEgLU_bZtc8sEyrCt7Oh7u0A&oe=654114C2"
                    alt="LinkedIn"
                  />
                </div>
              </div>

              <div
                style="
                  padding: 8px 12px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #9499a8;
                  line-height: 18px;
                "
              >
                Discover Your Dream Space: Modern Living, Effortless Booking. © 2023
                Letbud
              </div>
            </div>
          </body>
        </html>
      `;

    this.landlordNotificationMailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style> img { max-width: 100%; } </style>
    </head>
    <body style="margin:0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding:20px; background:#ffffff;">
      <div>
        <p style="width:118px">
          <img src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1" alt="letbud logo"/>
        </p>
      </div>
      <div style="background-color:#ebf0f9;">
        <main style="margin:0 auto; padding-bottom:20px;">
          <div style="text-align:center; padding:32px 10px; margin-bottom:12px; background:#fdf2d3; color:#1b3562; font-weight:700; font-size:26px;">
            📨 New Rental Request Received!
          </div>
          <div style="padding:0 20px; color:#1E1E2D;">
            <p>Hi [Lessor Name],</p>
            <p>Good news 🎉 Someone just applied to rent your property on Letbud!</p>
            <p><b>Applicant:</b> [Applicant Name]<br/>
              <b>Email:</b> [Applicant Email]</p>
            <p>Please review the application in your dashboard and reach out to the applicant if needed.</p>
            <p style="margin-top:48px;">Best Regards,<br/><b>Team Letbud</b></p>
          </div>
        </main>
      </div>
    </body>
    </html>
    `;

  };



  public async sendPropertyPostedEmail(email: string) {
    const transporter = nodemailer.createTransport(this.conf);
    const emailTemplate = this.propertyListingMailTemplate.replace('[Lessor Name]', email.split('@')[0]); // Assuming the email is the user's name
    let header = {
      from: process.env.MAILER_USER,
      to: email,
      subject: `🏠 Your Property Listing is Live!`,
      html: emailTemplate,
    };

    try {
      await transporter.sendMail(header);
    } catch (err) {
      logger.error(`Email sending failed: ${err.message}`);
      throw err;
    }
  }

  public async sendRequestToRentEmail(email: string, firstName: string, lastName: string) {
    const fullName = `${firstName} ${lastName}`.trim(); // Ensures no extra spaces if lastName is missing

    const transporter = nodemailer.createTransport(this.conf);

    // Replace placeholder with actual applicant's full name
    const emailTemplate = this.propertyApplicationMailTemplate.replace('[Applicant Name]', fullName);

    let header = {
      from: process.env.MAILER_USER,
      to: email,
      subject: `🏠 Your Application is Successful`,
      html: emailTemplate,
    };

    try {
      await transporter.sendMail(header);
    } catch (err) {
      throw err;
    }
  }

  public async sendRequestToLandlordEmail(
    landlordEmail: string,
    landlordName: string,
    applicantFirstName: string,
    applicantLastName: string,
    applicantEmail: string
  ): Promise<void> {
    const transporter = nodemailer.createTransport(this.conf);

    const applicantFullName = `${applicantFirstName} ${applicantLastName}`.trim();

    const html = this.landlordNotificationMailTemplate
      .replace("[Lessor Name]", landlordName)
      .replace("[Applicant Name]", applicantFullName)
      .replace("[Applicant Email]", applicantEmail);

    const mailOptions = {
      from: process.env.MAILER_USER,
      to: landlordEmail,
      subject: "📨 New Rental Request for Your Property",
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Landlord notification email sent to ${landlordEmail}`);
    } catch (err: any) {
      logger.error(`Error sending landlord notification email: ${err.message}`);
      throw err;
    }
  }

  public async sendEmailVerificationOTP(ref: string, otpRefType: OtpRefTypes): Promise<Otp> {
    const otpService = new OtpService();

    // Generate and save OTP
    const otpRecord = await otpService.getOtp(ref, otpRefType); // Generate and save OTP
    const otp = otpRecord.otp; // Extract the OTP from the saved record

    // If otpRefType is EMAIL, send via email
    if (otpRefType === OtpRefTypes.EMAIL) {
      const transporter = nodemailer.createTransport(this.conf); // Email transport configuration

      // Set the verification link
      const verificationLink = `${process.env.WEB_APP_URL}/verify-email?otp=${otp}&ref=${ref}`;

      // Replace placeholders in the email template
      const html = this.emailVerificationMailTemplate
        .replace('[User\'s Name]', ref) // Assuming 'ref' is the user's email
        .replace('[OTP Code]', otp)
        .replace('[Verification Link]', verificationLink);

      let header = {
        from: process.env.MAILER_USER,
        to: ref, // Use dynamic reference (email)
        subject: `Email Verification OTP`,
        html: html,
      };

      try {
        // Send the email
        await transporter.sendMail(header);
        return otpRecord; // Return the OTP record
      } catch (err) {
        throw new Error(`Error sending OTP via email: ${err.message}`);
      }
    }

    // If otpRefType is PHONE, send via SMS
    else if (otpRefType === OtpRefTypes.PHONE_NUMBER) {
      try {
        const sms = await this.twilioClient.messages.create({
          body: `Your OTP is ${otp}. Please do not share it with anyone.`,
          from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
          to: ref, // Phone number provided by the user
        });

        console.log(`SMS sent to ${ref}:`, sms.sid);
        return otpRecord; // Return the OTP record
      } catch (error) {
        throw new Error(`Error sending OTP via SMS: ${error.message}`);
      }
    }

    // Handle invalid otpRefType
    else {
      throw new Error(`Invalid reference type: ${otpRefType}`);
    }
  }
  /**
     * Send an email notifying the applicant that their rental request has been approved.
     * @param email - Applicant's email address.
     * @param firstName - Applicant's first name.
     * @param lastName - Applicant's last name.
     * @param moveInDate - The move-in date assigned (if any).
     */
  public async sendPropertyApprovalEmail(
    email: string,
    firstName: string,
    lastName: string,
    moveInDate?: Date
  ): Promise<void> {
    const transporter = nodemailer.createTransport(this.conf);
    const fullName = `${firstName} ${lastName}`.trim();
    const moveInText = moveInDate
      ? moveInDate.toLocaleDateString()
      : "To be determined";

    const html = `
    <p>Hi ${fullName},</p>
    <p>Your rental application has been approved!</p>
    <p>Your move-in date is scheduled for: <strong>${moveInText}</strong></p>
    <p>Thank you for choosing our platform.</p>
    <p>Best Regards,<br/><b>Team Letbud</b></p>
  `;

    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: "Your Rental Application Has Been Approved",
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Approval email sent to ${email}`);
    } catch (err) {
      logger.error(`Error sending approval email: ${err.message}`);
      throw err;
    }
  }

  public async sendPasswordResetEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport(this.conf);
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Dear User,</p>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>Please use this OTP to reset your password. If you did not request a password reset, please ignore this email.</p>
        <p>Regards,<br/>Team Letbud</p>
      </div>
    `;
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: "Password Reset OTP",
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err: any) {
      logger.error(`Error sending password reset email: ${err.message}`);
      throw new Error(`Error sending password reset email: ${err.message}`);
    }
  }

}
