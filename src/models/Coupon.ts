import {Schema, model, Types} from "mongoose";
export interface ICoupon {
  _id?: string;
  name: string;
  code: string;
  services?: Types.ObjectId[];
  items?: Types.ObjectId[];
  amount: string;
  type: string;
  start_date?: string;
  end_date?: string;
  minimum_order_limit?: string;
  maximum_order_limit?: string;
  coupon_limit?: string;
}
// Create a Schema corresponding to the document interface.
const couponSchema = new Schema<ICoupon>({
  name: {type: String, required: true, trim: true},
  code: {type: String, required: true, trim: true},
  services: [{type: Schema.Types.ObjectId, trim: true, ref: "Service"}],
  items: [{type: Schema.Types.ObjectId, trim: true, ref: "Item"}],
  amount: {type: String, trim: true, required: true},
  type: {type: String, trim: true, required: true},
  start_date: {type: String, trim: true},
  end_date: {type: String, trim: true},
  minimum_order_limit: {type: String, trim: true},
  maximum_order_limit: {type: String, trim: true},
  coupon_limit: {type: String, trim: true}
}, {timestamps: true});

// Create a Model.
export default model<ICoupon>('Coupon', couponSchema);


