import {Schema, model, Types} from "mongoose";
export interface faq{
  question: string;
  answer: string;
}
export interface IFAQ {
  _id?: string;
  item: Types.ObjectId;
  faq: faq[];
}
// Create a Schema corresponding to the document interface.
const faqSchema = new Schema<IFAQ>({
  item: {type: Schema.Types.ObjectId, trim: true, ref: "Item"},
  faq: [{
    question: {type: String, trim: true, required: true},
    answer: {type: String, trim: true, required: true}
  }],
}, {timestamps: true});

// Create a Model.
export default model<IFAQ>('FAQ', faqSchema);


