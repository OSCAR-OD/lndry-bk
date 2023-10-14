import {Schema, model} from "mongoose";
import {IAdjustmentProducts} from "@models/Order";
interface IItem {
  name: string;
  quantity: number;
  price?:number;
}
export interface IDriverOrder {
  _id?: string;
  postCode: string;
  streetAddress: string;
  items: IItem[];
  collectionDate: string;
  collectionTime: string;
  collectionInfo?: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryInfo?: string;
  name:string;
  email: string;
  billingPostcode:string;
  billingStreetAddress: string;
  extraDetails?: string;
  mobile: string;
  discount?: number;
  total?: number;
  subTotal?: number;
  payment: boolean;
  spi: string;
  status?: string;
  paymentIntent?: string;
  recursive?: number;
  amountPaid?: number;
  initialAmountCaptured?: boolean;
  adjustmentNote?: string;
  adjustmentPrice?: number;
  adjustmentPaid?: boolean;
  adjustmentProducts?: IAdjustmentProducts[];
  invoiceNumber?: string;
  couponCode?: string;
  couponDiscount?: number;
  customID?: string;
  referCode?: string;
}
// Create a Schema corresponding to the document interface.
const driverOrderSchema = new Schema<IDriverOrder>({
  postCode: {type: String, required: true, trim: true},
  streetAddress: {type: String, required: true, trim: true},
  items: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      trim: true,
      default: 0
    }
  }],
  collectionDate: {type: String, trim: true, required: true},
  collectionTime: {type: String, trim: true, required: true},
  collectionInfo: {type: String, trim: true},
  deliveryDate: {type: String, trim: true, required: true},
  deliveryTime: {type: String, trim: true, required: true},
  deliveryInfo: {type: String, trim: true},
  name: {type: String, trim: true, required: true},
  email: {type: String, trim: true, required: true},
  billingPostcode: {type: String, trim: true, required: true},
  billingStreetAddress: {type: String, trim: true, required: true},
  extraDetails: {type: String, trim: true},
  mobile: {type: String, trim: true, required: true},
  discount: {type: Number, trim: true, default: 0},
  total: {type: Number, trim: true, default: 0},
  subTotal: {type: Number, trim: true, default: 0},
  payment: {type: Boolean, trim: true, required: true, default: false},
  spi: {type: String, trim: true, default: ''},
  status: {type: String, trim: true, default: 'Submitted'},
  paymentIntent: {type: String, trim: true, required: true},
  recursive: {type: Number, trim: true, default: 0, enum: [0, 7, 14, 21, 28]},
  amountPaid: {type: Number, trim: true, default: 0},
  initialAmountCaptured: {type: Boolean, trim: true, default: false},
  adjustmentPaid: {type: Boolean, trim: true, default: false},
  adjustmentNote: {type: String, trim: true},
  adjustmentPrice: {type: Number, trim: true, default: 0},
  couponCode: {type: String, trim: true, default: ''},
  couponDiscount: {type: Number, trim: true, default: 0},
  invoiceNumber: {type: String, trim: true},
  adjustmentProducts: [{
    pid: {type: String, trim: true, required: true},
    name: {type: String, trim: true, required: true},
    quantity: {type: Number, trim: true, required: true},
    price: {type: Number, trim: true, required: true}
  }],
  customID: {type: String, trim: true},
  referCode: {type: String, trim: true},
}, {timestamps: true});

driverOrderSchema.pre('save', function (next) {
  if(this.postCode){
    const date = new Date();
    const postcode = this.postCode.toUpperCase().replaceAll(' ','');
    const random = Math.floor((Math.random() * 10000) + 1);
    this.customID = `${postcode}${date.getDay()}${date.getMonth()}${date.getFullYear()}${random}`;
    this.invoiceNumber = `${postcode}${date.getDay()}${date.getMonth()}${date.getFullYear()}${Math.floor((Math.random() * 10000) + 1)}`;
  }
  next();
});
// Create a Model.
export default model<IDriverOrder>('DriverOrders', driverOrderSchema);


