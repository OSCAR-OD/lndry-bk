import {Schema, model, Types} from "mongoose";
export interface ISeo {
  title: string;
  description: string;
}
export interface IServiceContent {
  _id?: string;
  service: Types.ObjectId;
  image?: string;
  description: string;
  seo: ISeo[];
}
// Create a Schema corresponding to the document interface.
const serviceContentSchema = new Schema<IServiceContent>({
  service: {type: Schema.Types.ObjectId, trim: true, ref: "Service"},
  image: {type: String, trim: true},
  description: {type: String, trim: true, required: true},
  seo: [{
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true}
  }],
}, {timestamps: true});

// Create a Model.
export default model<IServiceContent>('ServiceContent', serviceContentSchema);


