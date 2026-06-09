import { Worker } from "bullmq";
import { mailService } from "../services/mail.service";
import { env } from "../../config";

const worker = new Worker(
  "mail-queue",
  async (job) => {
    const { type, email, name, token } = job.data;
    console.log(`Worker: Processing ${type} email for ${email}...`);

    try {
      switch (type) {
        case "verification":
          await mailService.sendVerificationEmail(email, name, token);
          break;
        case "password-reset":
          await mailService.sendPasswordResetEmail(email, token);
          break;
        default:
          console.warn(`Worker: Unknown job type: ${type}`);
      }
      console.log(`Worker: ${type} email sent to ${email}`);
    } catch (error) {
      console.error(`Worker: Failed to send ${type} email to ${email}. Retrying...`);
      throw error;
    }
  },
  {
    connection: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      tls: env.REDIS_TLS ? {} : undefined,
    },
  }
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed after retries: ${err.message}`);
});

console.log("Mail Worker is online and listening for jobs...");
