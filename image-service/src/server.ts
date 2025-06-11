import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: "http://82.202.128.170:3000",
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions));

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    let uploadPath = UPLOADS_DIR;

    if (req.originalUrl.includes("avatar")) {
      uploadPath = path.join(UPLOADS_DIR, "avatars");
    } else if (req.originalUrl.includes("event")) {
      uploadPath = path.join(UPLOADS_DIR, "events");
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use("/images", express.static(UPLOADS_DIR));

app.post(
  "/upload/avatar/",
  upload.single("avatar"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    res.json({ url: `images/avatars/${req.file.filename}` });
  }
);

app.post(
  "/upload/event/",
  upload.single("eventImage"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    res.json({ url: `images/events/${req.file.filename}` });
  }
);

app.listen(PORT, () =>
  console.log(`Image service running on http://localhost:${PORT}`)
);
