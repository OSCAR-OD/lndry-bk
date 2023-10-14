import {Schema, model} from "mongoose";
export interface IRolePermissions {
  _id?: string;
  role: string;
  permissions: string[];
}
// Create a Schema corresponding to the document interface.
const rolePermissionSchema = new Schema<IRolePermissions>({
  role: {type: String, trim: true, enum: ['Super admin', 'Admin', 'Manager', 'Content Officer','Freelancer']},
  permissions: {
    type:[String],
    required: true,
    enum: [
      'dashboard',
      'customers',
      'services',
      'sub services',
      'items',
      'orders',
      'service areas',
      'blogs',
      'coupon',
      'ratings & reviews',
      'videos',
      'faq',
      'service pages',
      'users',
      'roles & permissions',
      'settings'
    ]
  }
}, {timestamps: true});
// Create a Model.
export default model<IRolePermissions>('RolePermission', rolePermissionSchema);


