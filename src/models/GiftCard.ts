import {Schema, model, Types} from "mongoose";
export interface IGiftCard {
    _id?: string;
    customID: string;
    fromName: string;
    fromEmail: string;
    fromPhone?: string;
    toName: string;
    toEmail: string;
    toPhone?: string;
    message?: string;
    userGet: number;
    userPaid: number;
    bonus?: number;
    template: Types.ObjectId;
    payment?: boolean;
    paymentIntent?: string;
    spi?: string;
    used?: boolean;
}
// Create a Schema corresponding to the document interface.
const giftCardSchema = new Schema<IGiftCard>({
    customID: {type: String, trim: true},
    fromName: {type: String, trim: true,required: true},
    fromEmail: {type: String, trim: true,required: true},
    fromPhone: {type: String, trim: true},
    toName: {type: String, trim: true,required: true},
    toEmail: {type: String, trim: true,required: true},
    toPhone: {type: String, trim: true},
    message: {type: String, trim: true},
    userGet: {type: Number, trim: true, default: 0},
    userPaid: {type: Number, trim: true, required: true},
    bonus: {type: Number, trim: true, default: 0},
    template: {type: Schema.Types.ObjectId, trim: true, ref: 'GiftTheme', required: true},
    payment: {type: Boolean, trim: true, default: false},
    paymentIntent: {type: String, trim: true},
    spi: {type: String, trim: true},
    used: {type: Boolean, trim: true, default: false}
}, {timestamps: true});
giftCardSchema.pre('save', function (next) {
    const date = new Date();
    const random = Math.floor((Math.random() * 10000) + 1);
    this.customID = `NLGC-${date.getDate()}${date.getMonth()+1}${date.getFullYear()}-${random}`;
    next();
});
// Create a Model.
export default model<IGiftCard>('GiftCard', giftCardSchema);


