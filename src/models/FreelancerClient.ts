import {Schema, model, Types} from "mongoose";
export interface IFreelancerClient {
    _id?: string;
    freelancerID: Types.ObjectId;
    customerEmail: string;
    totalOrder?: number;
}
// Create a Schema corresponding to the document interface.
const freelancerClientSchema = new Schema<IFreelancerClient>({
    freelancerID: {type: Schema.Types.ObjectId, trim: true, required: true, ref: 'User'},
    customerEmail: {type: String, trim: true, required: true},
    totalOrder: {type: Number, trim: true, default: 0},
}, {timestamps: true});

// Create a Model.
export default model<IFreelancerClient>('FreelancerClient', freelancerClientSchema);


