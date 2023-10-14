import {Schema, model, Types} from "mongoose";
export interface IWithdrawl {
  _id?: string;
  item: Types.ObjectId;
  freelancer?: Types.ObjectId;
  image?: string;
  description: string;
  rating?: string;
  images?: string[];
  approval?: boolean
}
// Create a Schema corresponding to the document interface.
const reviewWithdrawlSchema = new Schema<IWithdrawl>({
  item: {type: Schema.Types.ObjectId, trim: true, ref: "Item"},
  freelancer: {type: Schema.Types.ObjectId, trim: true, ref: "User"},
  approval: {type: Boolean, trim: true, default: false},
}, {timestamps: true});

// Create a Model.
export default model<IWithdrawl>('ReviewWithdrawl', reviewWithdrawlSchema);


