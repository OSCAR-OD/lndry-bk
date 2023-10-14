import {Schema, model} from "mongoose";

export interface IBlog {
  _id?: string;
  title: string;
  slug?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  order?: number;
  image?: string;
  description?: string;
  published?: boolean;
  drafted?: boolean;
  visitorCount?: number;
}
// Create a Schema corresponding to the document interface.
const blogSchema = new Schema<IBlog>({
  title: {type: String, trim: true, required: true},
  slug: {type: String, trim: true},
  metaTitle: {type: String, trim: true, required: true},
  metaDescription: {type: String, trim: true, required: true},
  keywords: [{type: String, trim: true, required: true}],
  order:{type: Number, trim: true, default: 0},
  image: {type: String, trim: true},
  description: {type: String, trim: true},
  published: {type: Boolean, trim: true},
  drafted: {type: Boolean, trim: true},
  visitorCount: {type: Number, trim: true, default: 0}
}, {timestamps: true});

blogSchema.pre('save', function (next) {
  const str = this.title.toLowerCase();
  const noSpecialChars = str.replace(/[^a-zA-Z0-9 ]/g, '');
  this.slug = noSpecialChars.replaceAll(' ','-')+'-'+Math.ceil(Math.random()*10);
  next();
});
// Create a Model.
export default model<IBlog>('Blog', blogSchema);