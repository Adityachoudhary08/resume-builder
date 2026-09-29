import { IUser } from "@/types/user.types";
import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Omit<IUser, '_id'>, Document {
   comparePassword(candidatePassword: string): boolean;
}

const userSchema = new mongoose.Schema<UserDocument> ({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    mobile: {
        type: String,
        minlength: [10, "Mobile number must be at least 10 characters long"],
        maxlength: [15, "Mobile number must be at most 15 characters long"],
    }
},{
    timestamps: true,
})

userSchema.pre('save', function(): void {
    if (!this.isModified('password')) return;
    this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = function(candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password);
}

const userModel: Model<UserDocument> = (mongoose.models.User as Model<UserDocument>) || (mongoose.models.users as Model<UserDocument>) || mongoose.model<UserDocument>('User', userSchema);
export default userModel;