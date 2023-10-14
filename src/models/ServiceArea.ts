import {Schema, model} from "mongoose";

export interface IServiceArea {
  _id?: string;
  location_name?: string;
  state_postcode?: string;
  city_postcode: string;
  address?: string;
  published?: boolean;
  drafted?: boolean;
}
// Create a Schema corresponding to the document interface.
const serviceAreaSchema = new Schema<IServiceArea>({
  location_name: {type: String, trim: true},
  state_postcode: {type: String, trim: true},
  city_postcode: {type: String, trim: true, required: true},
  address: {type: String, trim: true},
  published: {type: Boolean, trim: true},
  drafted: {type: Boolean, trim: true},
}, {timestamps: true});

// Create a Model.
export default model<IServiceArea>('ServiceArea', serviceAreaSchema);


