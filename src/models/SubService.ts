import {Schema, model, Types} from "mongoose";
import {IService} from "./Service";
export interface ISubService extends IService {
  parent: Types.ObjectId
}
// Create a Schema corresponding to the document interface.
const subServiceSchema = new Schema<ISubService>({
  parent: {type: Schema.Types.ObjectId, ref: "Service", required: true, trim: true},
  name: {type: String, required: true, trim: true},
}, {timestamps: true});

// Create a Model.
export default model<ISubService>('SubService', subServiceSchema);


