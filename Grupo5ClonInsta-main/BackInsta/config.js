import "dotenv/config";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = process.env.PORT || 3000;
const ROOT = dirname(fileURLToPath(import.meta.url));
const MAX_AVATAR_IMAGE_SIZE = 150;
const MAX_ENTRY_IMAGE_SIZE = 1024;
const MAX_VIDEO_DURATION = 60;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  SECRET,
  UPLOADS_DIR,
  SMTP_USER,
  SMTP_PASS,
  SENDER_EMAIL,
  API_TOKEN,
  VIDEO_DIR,
  TEMP_DIR,
  CLIENT,
} = process.env;

export {
  ROOT,
  PORT,
  MAX_ENTRY_IMAGE_SIZE,
  MAX_VIDEO_DURATION,
  MAX_VIDEO_SIZE,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  SECRET,
  SMTP_USER,
  SMTP_PASS,
  SENDER_EMAIL,
  API_TOKEN,
  UPLOADS_DIR,
  VIDEO_DIR,
  TEMP_DIR,
  CLIENT,
};
