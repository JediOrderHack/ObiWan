import 'dotenv/config'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'


const PORT = process.env.PORT || 3000
const root = dirname(fileURLToPath(import.meta.url))
const maxImageSize = 1024
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
  TEMP_DIR
} = process.env;

export{
    root,
    PORT,
    maxImageSize,
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
    TEMP_DIR
}