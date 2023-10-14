import {Schema, model} from "mongoose";
export interface IGiftAmount {
    _id?: string;
    userPay: number; //The amount user is paying
    userGet: number; //The amount user will get
    bonus?: number;
}
// Create a Schema corresponding to the document interface.
const giftAmountSchema = new Schema<IGiftAmount>({
    userPay: {type: Number, trim: true,required: true},
    userGet: {type: Number, trim: true,required: true},
    bonus: {type: Number, trim: true},
}, {timestamps: true});

giftAmountSchema.pre('save', function (next) {
    this.bonus = this.userGet - this.userPay;
    next();
});

// Create a Model.
export default model<IGiftAmount>('GiftAmount', giftAmountSchema);


