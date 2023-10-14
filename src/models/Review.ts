import {Schema, model, Types} from "mongoose";
export interface IReview {
  _id?: string;
  item: Types.ObjectId;
  customer?: Types.ObjectId;
  customerName?: string;
  image?: string;
  description: string;
  rating?: string;
  images?: string[];
  approval?: boolean
}
// Create a Schema corresponding to the document interface.
const reviewSchema = new Schema<IReview>({
  item: {type: Schema.Types.ObjectId, trim: true, ref: "Item"},
  customer: {type: Schema.Types.ObjectId, trim: true, ref: "User"},
  customerName: {type: String, trim: true},
  image: {type: String, trim: true},
  description: {type: String, trim: true, required: true},
  rating: {type: Number, trim: true},
  approval: {type: Boolean, trim: true, default: false},
  images: [{type: String}]
}, {timestamps: true});

// Create a Model.
export default model<IReview>('Review', reviewSchema);


