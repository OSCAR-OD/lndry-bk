import Coupon, {ICoupon} from "@models/Coupon";

async function add(coupon: ICoupon): Promise<boolean> {
  let outcome: boolean = false;
  await new Coupon(coupon).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const coupon:ICoupon|null = await Coupon.findById(id);
  if(!coupon) return false;
  return true;
}

async function getByID(id: string): Promise<ICoupon|null> {
  return (await Coupon.findById(id).populate('services').populate('items'));
}
async function getByCode(code: string): Promise<ICoupon|null> {
  return (await Coupon.findOne({code}));
}

async function getAll(): Promise<ICoupon[]> {
  return (await Coupon.find().populate('services').populate('items').sort({createdAt:'desc'}));
}

async function update(id:string, coupon: ICoupon): Promise<Boolean> {
  let outcome: boolean = false;
  await Coupon.findOneAndUpdate(
    { _id: id },
    { $set: coupon },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Coupon.deleteOne({_id: id}) ? outcome = true : null;
  return outcome;
}

// **** Export default **** //

export default {
  add,
  existByID,
  getAll,
  getByID,
  update,
  delete: _delete,
  getByCode
} as const;
