import {Schema, model, Types} from "mongoose";

export interface IContact {
  _id?: string;
  name: string;
  phone?: string;
  email: string;
  subject?: string;
  message: string;
}
// Create a Schema corresponding to the document interface.
const contactSchema = new Schema<IContact>({
  name: {type: String, trim: true, required: true},
  phone: {type: String, trim: true},
  email: {type: String, trim: true, required: true},
  subject: {type: String, trim: true, required: true},
  message: {type: String, trim: true, required: true},
}, {timestamps: true});

// Create a Model.
export default model<IContact>('Contact', contactSchema);


