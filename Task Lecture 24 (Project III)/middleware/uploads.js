import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const imageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/gif"];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024}, // max 5MB
    fileFilter: (req, file, cb) => {
        // check type
        if(imageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("INVALID TYPE"));
        }
    }
});

function checkErrors(imageFile, field) {
    return (req, res, next) => {
        imageFile(req, res, (err) => {
            if(!err) { // no error
                return next();
            }

            if(err.code == "LIMIT_FILE_SIZE") { // size error
                return res.status(422).json({
                    errors: {
                        image: {
                            errors: [`${field} must be smaller than 5MB`]
                        }
                    }
                });

            } else if(err.message == "INVALID TYPE") { // type error
                return res.status(422).json({
                    errors: {
                        image: {
                            errors: [`${field} file type must be jpg, jpeg, png, webp, gif`]
                        }
                    }
                });

            } else { // other error
                next(err);
            }

        })
    }
}

export function uploadOne(field) {
    return checkErrors(upload.single(field), field);
}

export function uploadMany(field) {
    return checkErrors(upload.array(field, 5), field);
}