import DriverOrder , {IDriverOrder} from "@models/DriverOrders";

async function add(driverOrder: IDriverOrder): Promise<unknown> {
  let outcome: boolean = false;
  const save = await new DriverOrder(driverOrder).save();
  await save ? outcome = true : null;
  return {outcome,data:save};
}

async function existByID(id: string): Promise<boolean> {
  const driverOrder:IDriverOrder|null = await DriverOrder.findById(id);
  if(!driverOrder) return false;
  return true;
}

async function getByID(id: string): Promise<IDriverOrder|null> {
  return (await DriverOrder.findById(id));
}

async function getAll(): Promise<IDriverOrder[]> {
  return (await DriverOrder.find().sort({createdAt:'desc'}));
}
async function getAllByEmail(email: string): Promise<IDriverOrder[] | null> {
  return (await DriverOrder.find({email}).sort({createdAt: 'desc'}));
}

async function update(id:string, driverOrder: IDriverOrder): Promise<Boolean> {
  let outcome: boolean = false;
  await DriverOrder.findOneAndUpdate(
    { _id: id },
    { $set: driverOrder },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await DriverOrder.deleteOne({_id: id}) ? outcome = true : null;
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
  getAllByEmail
} as const;
