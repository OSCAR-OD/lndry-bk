import { Schema, model } from "mongoose";

export interface IAdjustmentProducts {
  pid: string;
  name: string;
  quantity: number;
  price: number;
}
export interface IOrder {
  _id?: string;
  customID?: string;
  postCode: string;
  streetAddress: string;
  collectionDate: string;
  collectionTime: string;
  deliveryDate: string;
  deliveryTime: string;
  email: string;
  name: string;
  billingPostcode: string;
  billingStreetAddress: string;
  mobile: string;
  cart: string;
  products: string[];
  discount: string;
  total: string;
  subTotal: string;
  payment?: boolean;
  paymentIntent?: string;
  collectionInfo?: string;
  deliveryInfo?: string;
  extraDetails?: string;
  spi?: string;
  status?: string;
  recursive?: number;
  amountPaid?: number;
  couponCode?: string;
  couponDiscount?: number;
  initialAmountCaptured?: boolean;
  adjustmentNote?: string;
  invoiceNumber?: string;
  adjustmentPrice?: number;
  adjustmentPaid?: boolean;
  referCode?: string;
  adjustmentProducts?: IAdjustmentProducts[];
  freelancerID?: string;
  freelancerPaid: boolean;
}
// Create a Schema corresponding to the document interface.
const orderSchema = new Schema<IOrder>(
  {
    postCode: { type: String, trim: true, required: true },
    customID: { type: String, trim: true },
    streetAddress: { type: String, trim: true, required: true },
    collectionDate: { type: String, trim: true, required: true },
    collectionTime: { type: String, trim: true, required: true },
    deliveryDate: { type: String, trim: true, required: true },
    deliveryTime: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    billingPostcode: { type: String, trim: true, required: true },
    billingStreetAddress: { type: String, trim: true, required: true },
    mobile: { type: String, trim: true, required: true },
    cart: { type: String, trim: true, required: true },
    discount: { type: String, trim: true, required: true },
    total: { type: String, trim: true, required: true },
    subTotal: { type: String, trim: true, required: true },
    payment: { type: Boolean, trim: true, required: true, default: false },
    spi: { type: String, trim: true, default: "" },
    paymentIntent: { type: String, trim: true, default: "" },
    collectionInfo: { type: String, trim: true, default: "" },
    deliveryInfo: { type: String, trim: true, default: "" },
    extraDetails: { type: String, trim: true, default: "" },
    products: [
      {
        id: { type: Schema.Types.ObjectId, required: true, trim: true },
        quantity: { type: String, required: true, trim: true },
      },
    ],
    status: { type: String, trim: true, default: "Submitted" },
    couponCode: { type: String, trim: true, default: "" },
    couponDiscount: { type: Number, trim: true, default: 0 },
    recursive: {
      type: Number,
      trim: true,
      default: 0,
      enum: [0, 7, 14, 21, 28],
    },
    amountPaid: { type: Number, trim: true, default: 0 },
    initialAmountCaptured: { type: Boolean, trim: true, default: false },
    adjustmentPaid: { type: Boolean, trim: true, default: false },
    adjustmentNote: { type: String, trim: true },
    adjustmentPrice: { type: Number, trim: true, default: 0 },
    referCode: { type: String, trim: true },
    invoiceNumber: { type: String, trim: true },
    adjustmentProducts: [
      {
        pid: { type: String, trim: true, required: true },
        name: { type: String, trim: true, required: true },
        quantity: { type: Number, trim: true, required: true },
        price: { type: Number, trim: true, required: true },
      },
    ],
    freelancerID: { type: String, trim: true },
    freelancerPaid: { type: Boolean, trim: true, default: false },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (this.postCode) {
    const date = new Date();
    const postcode = this.postCode.toUpperCase().replaceAll(" ", "");
    const random = Math.floor(Math.random() * 10000 + 1);
    this.customID = `${postcode}${date.getDay()}${date.getMonth()}${date.getFullYear()}${random}`;
    this.invoiceNumber = `${postcode}${date.getDay()}${date.getMonth()}${date.getFullYear()}${Math.floor(
      Math.random() * 10000 + 1
    )}`;
  }
  next();
});

// Create a Model.
export default model<IOrder>("Order", orderSchema);
