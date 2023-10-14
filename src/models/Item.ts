import {Schema, model, Types} from "mongoose";
export interface IItem {
  _id?: string;
  name: string;
  slug?: string;
  subTitle: string;
  service: Types.ObjectId;
  sub_service?: Types.ObjectId;
  price: string;
  image: string;
  description: string;
  offerAmount?: string;
  offerType?: string;
  showOnPopularSection?: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
}
// Create a Schema corresponding to the document interface.
const itemSchema = new Schema<IItem>({
  name: {type: String, required: true, trim: true},
  slug: {type: String, trim: true},
  service: {type: Schema.Types.ObjectId, required: true, trim: true, ref: 'Service'},
  subTitle: {type: String, required: true, trim: true, ref: 'Service'},
  sub_service: {type: Schema.Types.ObjectId, trim: true, ref: 'SubService'},
  price: {type: String, trim: true, required: true},
  image: {type: String, trim: true, required: true},
  description: {type: String, trim: true, required: true},
  offerAmount: {type: String, trim: true},
  offerType: {type: String, trim: true},
  metaTitle: {type: String, trim: true},
  metaDescription: {type: String, trim: true},
  showOnPopularSection: {type: Boolean, trim: true, default: true},
  keywords: [{type: String, trim: true}],
}, {timestamps: true});

itemSchema.pre('save', function (next) {
  const str = this.name.toLowerCase();
  const noSpecialChars = str.replace(/[^a-zA-Z0-9 ]/g, '');
  this.slug = noSpecialChars.replaceAll(' ','-');
  next();
});
// Create a Model.
export default model<IItem>('Item', itemSchema);


