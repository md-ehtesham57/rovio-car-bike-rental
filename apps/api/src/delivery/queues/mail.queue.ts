import { Queue } from "bullmq";
import { env } from "../../config";

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  tls: env.REDIS_TLS ? {} : undefined,
};

export const mailQueue = new Queue("mail-queue", { connection });

export async function addMailJob(data: { type: string; email: string; name: string; token: string }) {
  await mailQueue.add("send-mail", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  });
}
