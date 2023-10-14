import {Schema, model} from "mongoose";

export interface IGiftTheme {
    _id?: string;
    replaceAbles?: string[];
    html: string;
    previewImage?: string;
}

// Create a Schema corresponding to the document interface.
const giftThemeSchema = new Schema<IGiftTheme>({
    replaceAbles: [{type: String, trim: true}],
    html: {type: String, trim: true, required: true},
    previewImage: {type: String, trim: true}
}, {timestamps: true});

giftThemeSchema.pre('save', function (next) {
    this.replaceAbles = [
        '{{{fromName}}}',
        '{{{fromEmail}}}',
        '{{{fromPhone}}}',
        '{{{toName}}}',
        '{{{toEmail}}}',
        '{{{toPhone}}}',
        '{{{message}}}',
        '{{{amount}}}',
        '{{{bonus}}}'
    ];
    next();
});
// Create a Model.
export default model<IGiftTheme>('GiftTheme', giftThemeSchema);


