import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: { type: String, required: true },
    image: String,
    resetOtp: { type: String, match: /^\d{6}$/ },
    resetOtpExpires: Date,
}, {
    versionKey: false,
    methods: {
        setOtp(email, otp) {
            return mongoose
                .model("User")
                .findOneAndUpdate(
                    { email },
                    { resetOtp: otp, resetOtpExpires: Date.now() + 15 * 60 * 1000 },
                    { new: true }
                );
        },
        resetPassword(email, password_hash) {
            return mongoose
                .model("User")
                .findOneAndUpdate(
                    { email },
                    { password: password_hash, resetOtp: null, resetOtpExpires: null },
                    { new: true }
                );
        }
    },
    statics: {
        register(req, password_hash) {
            return new mongoose.model("User")({
                username: req.body.username,
                email: req.body.email,
                password: password_hash,
                image: req.file ? req.file.filename : undefined,
                createdAt: new Date().toISOString()
            }).save();
        },
        checkUserByEmail(email) {
            return mongoose
            .model("User")
            .findOne({ email });
        },
        me(userId) {
            return mongoose
                .model("User")
                .findById(userId)
                .select("-password -resetOtp -resetOtpExpires");
            }
        }
});
    
export const User = mongoose.model("User", userSchema);