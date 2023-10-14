import {Schema, model} from "mongoose";
export interface ISettings {
  _id?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  copyright?: string;
  logo?: string;
  facebook?: string;
  twitter?: string;
  whatsapp?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  about?: string;
  referrerGet?: number;
  customerGet?: number;
}
// Create a Schema corresponding to the document interface.
const settingSchema = new Schema<ISettings>({
  phoneNumber: {type: String, trim: true},
  email: {type: String, trim: true},
  address: {type: String, trim: true},
  copyright: {type: String, trim: true},
  about: {type: String, trim: true},
  logo: {type: String, trim: true, required: true},
  facebook: {type: String, trim: true},
  twitter: {type: String, trim: true},
  whatsapp: {type: String, trim: true},
  instagram: {type: String, trim: true},
  youtube: {type: String, trim: true},
  linkedin: {type: String, trim: true},
  referrerGet: {type: Number, trim: true},
  customerGet: {type: Number, trim: true},
}, {timestamps: true});

// Create a Model.
export default model<ISettings>('Settings', settingSchema);


