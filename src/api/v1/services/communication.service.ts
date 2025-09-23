import nodemailer from "nodemailer";
import twilio from "twilio";
import { logger } from "../../../config/logger.js";


export default class CommunicationService {
  // /**
  //  * Todo: send message to email address
  //  * @param email
  //  * @param message
  //  */
  private twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  public async sendEmail(email: string, message: string) {
    const conf = {
      host: process.env.MAILER_SERVICE as string,
      port: Number(process.env.MAILER_PORT) || 587, // Ensure this is a number
      secure: false, // Set to true if using port 465 (SSL) 587
      auth: {
        user: process.env.MAILER_USER as string,
        pass: process.env.MAILER_PASS as string,
      },
      tls: {
        rejectUnauthorized: false, // Disable SSL hostname checking (if necessary)
      },
    };

    const transporter = nodemailer.createTransport(conf);
    let header = {
      from: '"Letbud Admin" process.env.MAILER_USER',
      to: email,
      subject: "Email-subject-here",
      html: `
      <div style="display: flex;">
        <div>
            <img 
            style="width: 64; height: auto;"
            src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1" alt="letbud logo" />
        </div>
        <div style="margin-left: auto;">
            <img
            src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275966733_5367624433282777_4220713818439775162_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=42PlQztGvkoAX9OwPAk&_nc_oc=AQlkURfsZuAnooJH5WUvqjuL05tpnrie0kocVYE2fCbNYED54Ig1m_ENxBI7pSnTctQ&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDzLKvNa6RgQgYHmgakQNg0ln2WcdOSaycC67EjW1rU4Q&oe=65416E63"
            alt="Twitter"
            />
            <img
            src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/276079790_239645664974434_7595452976573962628_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=nThW5cznc-kAX8GcLV8&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfB8SjGhEVkQgZTr6qkSlKvrNBe_vJxSPOHmigXL8YNWHQ&oe=654178B1"
            alt="Instagram"
            />
            <img
            src="https://z-p3-scontent.flos2-2.fna.fbcdn.net/v/t39.8562-6/275775241_706660317361134_8955597739986331891_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=IzroPbDaL-EAX_TmTT5&_nc_ht=z-p3-scontent.flos2-2.fna&oh=00_AfDA91DYES4wIrxJl2Bnc-xEgLU_bZtc8sEyrCt7Oh7u0A&oe=654114C2"
            alt="LinkedIn"
            />
        </div>
    </div>`,
    };

    try {
      await transporter.sendMail(header);
    } catch (err) {
      throw err;
    }
  }

  // /**
  //  * Todo: send message to phoneNumber
  //  * @param email
  //  * @param message
  //  */
  public async sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; message?: string }> {
    try {
      const sms = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        to: phoneNumber, // Recipient's phone number
      });

      console.log(`SMS sent to ${phoneNumber}:`, sms.sid);
      return { success: true, message: "OTP sent via SMS successfully" };
    } catch (error) {
      console.error("Error sending OTP via SMS:", error);
      return { success: false, message: "Failed to send OTP via SMS" };
    }
  }
}
