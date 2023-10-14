import {Schema, model} from "mongoose";

export interface IService {
  _id?: string;
  name: string;
  icon?: string;
  metaTitle?: string;
  metaDescription?: string;
}
// Create a Schema corresponding to the document interface.
const serviceSchema = new Schema<IService>({
  name: {type: String, required: true, trim: true},
  icon: {type: String, trim: true, required: true},
  metaTitle: {type: String, trim: true, required: true},
  metaDescription: {type: String, trim: true, required: true},
}, {timestamps: true});

// Create a Model.
export default model<IService>('Service', serviceSchema);


