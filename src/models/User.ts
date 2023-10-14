import {Schema, model} from "mongoose";
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  accountStatus?: string;
  password: string;
  image?: string;
  location?: string;
  postcode?: string;
  createdAt?: string;
  stripeCustomerID?: string;
  previousOrderPostCode?: string;
  referralCode?: string; //Users own code to share with others
  referCode?: string; //If this user was referred by someone
  referCodeDeactivated?: boolean; //If this user is not qualified for ref discount
  freelanceShare?: number;
  freelancerMaxGetPerOrder?: number;
}
// const validateEmail = (email: string) => {
//   return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
// }

// Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: {type: String, trim: true, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // validate: [validateEmail, "Please provide a valid email address"],
  },
  phone: {type: String, trim: true},
  role: {
    type: String,
    trim: true,
    default: 'User',
    enum: ['Super admin', 'Admin', 'Manager', 'Content Officer', 'User','Freelancer']
  },
  status: {
    type: String,
    trim: true,
    default: 'Offline',
    enum: ['Offline', 'Online']
  },
  accountStatus: {
    type: String,
    trim: true,
    default: 'Active',
    enum: ['Active', 'Deactivate']
  },
  password: {type: String, trim: true, required: true},
  image: {type: String, trim: true},
  location: {type: String, trim: true},
  postcode: {type: String, trim: true},
  stripeCustomerID: {type: String, trim: true},
  previousOrderPostCode: {type: String, trim: true},
  referralCode: {type: String, trim: true},
  referCode: {type: String, trim: true},
  freelanceShare: {type: Number, trim: true},
  freelancerMaxGetPerOrder: {type: Number, trim: true},
  referCodeDeactivated: {type: Boolean, trim: true, default: false},
}, {timestamps: true});

userSchema.pre('save', function (next) {
  if(this.image === null || this.image === '' || this.image===undefined){
    this.image = `https://ui-avatars.com/api/?name=${this.get('name').replace(/ /g, '+')}`;
  }
  this.referralCode = Math.round(Math.random() * 1E9).toString();
  next();
});


// Create a Model.
export default model<IUser>('User', userSchema);


