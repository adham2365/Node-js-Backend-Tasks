import mongoose from "mongoose";
import crypto from "crypto";

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, default: () => crypto.randomBytes(32).toString('hex') },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model("Session", sessionSchema);