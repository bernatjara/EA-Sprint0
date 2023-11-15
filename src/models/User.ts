import mongoose, { Document, Schema } from 'mongoose';
import { IAsignatura } from './Asignatura';
import bcrypt from 'bcrypt';

export interface IUser {
    name: string;
    password: string;
    email: string;
    asignatura?: string[];
    rol: string;
    encryptPassword(password: string): Promise<string>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        asignatura: { type: [Schema.Types.ObjectId], required: false, ref: 'asignatura' },
        rol: { type: String, required: true }
    },
    {
        versionKey: false
    }
);
UserSchema.methods.encryptPassword = async (password:string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };
export default mongoose.model<IUserModel>('user', UserSchema);
