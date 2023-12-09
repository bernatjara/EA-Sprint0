import mongoose, { Document, Schema } from 'mongoose';
import { IAsignatura } from './Asignatura';
import bcrypt from 'bcrypt';

export interface IUser {
    name: string;
    password: string;
    email: string;
    asignatura?: string[];
    newPassword: string;
    rol: string;
    image: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        asignatura: { type: [Schema.Types.ObjectId], required: false, ref: 'asignatura' },
        newPassword: { type: String, required: false },
        rol: { type: String, required: true },
        image: { type: String, required: false, default: '' }
    },
    {
        versionKey: false
    }
);
UserSchema.methods.encryptPassword = async (password:string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };
UserSchema.methods.validatePassword = async function (password:string) {
    return bcrypt.compare(password, this.password);
  };
export default mongoose.model<IUserModel>('user', UserSchema);
