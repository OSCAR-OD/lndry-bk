import {Schema, model} from "mongoose";
export interface IBanner {
  _id?: string;
  name: string;
  position: string;
  link?: string;
  file: string;
  caption?: string;
  color?: string;
}
// Create a Schema corresponding to the document interface.
const bannerSchema = new Schema<IBanner>({
  name: {type: String, required: true, trim: true},
  position: {type: String, required: true, trim: true},
  link: {type: String, trim: true},
  file: {type: String, trim: true, required: true},
  caption: {type: String, trim: true},
  color: {type: String, trim: true}
}, {timestamps: true});

// Create a Model.
export default model<IBanner>('Banner', bannerSchema);


