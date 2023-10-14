import { Schema, Types, model } from "mongoose";

export interface IHistory {
  kind: string;
  amount: number;
  effect: string;
  description: string;
  createdAt: string;
}
export interface IWallet {
  _id?: string;
  userID: Types.ObjectId;
  availableBalance: number;
  history: IHistory[];
}
// Create a Schema corresponding to the document interface.
const walletSchema = new Schema<IWallet>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      trim: true,
      required: true,
      ref: "User",
    },
    availableBalance: { type: Number, trim: true, default: 0 },
    history: [
      {
        kind: { type: String, trim: true, required: true },
        amount: { type: Number, trim: true, required: true },
        effect: { type: String, trim: true, default: "Dr", enum: ["Dr", "Cr"] },
        description: { type: String, trim: true, required: true },
        createdAt: { type: String, trim: true, default: new Date() },
      },
    ],
  },
  { timestamps: true }
);

// Create a Model.
export default model<IWallet>("Wallet", walletSchema);
