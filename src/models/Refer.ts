import {Schema, model} from "mongoose";

export interface IRefer {
    _id?: string;
    email: string;
    total: number;
    used: number;
    available: number;
    history: string[];
}
// Create a Schema corresponding to the document interface.
const referSchema = new Schema<IRefer>({
    email: {type: String, required: true, trim: true},
    total: {type: Number, trim: true, required: true},
    used: {type: Number, trim: true, required: true},
    available: {type: Number, trim: true, required: true},
    history: [{type: String, trim: true, required: true}],
}, {timestamps: true});

// Create a Model.
export default model<IRefer>('Refer', referSchema);


