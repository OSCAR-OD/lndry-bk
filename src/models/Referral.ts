import { Schema, Types, model } from "mongoose";
export interface IReferral {
  _id?: string;
  referrerID: Types.ObjectId;
  userEmail: string;
  referrerGet: number;
  userGet: number;
  referrerAmountExpire: number;
  userAmountExpire: number;
  paid: boolean;
}
// Create a Schema corresponding to the document interface.
const ReferralSchema = new Schema<IReferral>(
  {
    referrerID: {
      type: Schema.Types.ObjectId,
      trim: true,
      required: true,
      ref: "User",
    },
    userEmail: { type: String, trim: true, required: true },
    referrerGet: { type: Number, trim: true, default: 0 },
    userGet: { type: Number, trim: true, default: 0 },
    referrerAmountExpire: { type: Number, trim: true, default: 30 },
    userAmountExpire: { type: Number, trim: true, default: 30 },
    paid: { type: Boolean, trim: true, default: false },
  },
  { timestamps: true }
);

// Create a Model.
export default model<IReferral>("Referral", ReferralSchema);
