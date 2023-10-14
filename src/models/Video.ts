import {Schema, model} from "mongoose";
export interface IVideo {
  _id?: string;
  title: string;
  link: string;
}
// Create a Schema corresponding to the document interface.
const reviewSchema = new Schema<IVideo>({
  title: {type: String, trim: true, required: true},
  link: {type: String, trim: true, required: true}
}, {timestamps: true});

// Create a Model.
export default model<IVideo>('Video', reviewSchema);


