import Order, {IOrder} from "@models/Order";

async function add(order: IOrder): Promise<unknown> {
  let outcome: boolean = false;
  const save = await new Order(order).save();
  await save ? outcome = true : null;
  return {outcome,data:save};
}

async function existByID(id: string): Promise<boolean> {
  const order:IOrder|null = await Order.findById(id);
  if(!order) return false;
  return true;
}

async function getByID(id: string): Promise<IOrder|null> {
  return (await Order.findById(id));
}
async function getByEmail(email: string): Promise<IOrder|null> {
  return (await Order.findOne({email}));
}

async function getAllByEmail(email: string): Promise<IOrder[]|null> {
  return (await Order.find({email: email, payment: true}).select('-cart').sort({createdAt: 'desc'}));
}

async function getAll(): Promise<IOrder[]> {
  return (await Order.find({payment: true}).sort({createdAt: 'desc'}));
}

async function update(id:string, order: IOrder): Promise<Boolean> {
  let outcome: boolean = false;
  await Order.findOneAndUpdate(
    { _id: id },
    { $set: order },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Order.deleteOne({_id: id}) ? outcome = true : null;
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
  getByEmail,
  getAllByEmail
} as const;
