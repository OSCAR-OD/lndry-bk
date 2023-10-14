import FAQ, {IFAQ} from "@models/FAQ";

async function add(faq: IFAQ): Promise<boolean> {
  let outcome: boolean = false;
  await new FAQ(faq).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const faq:IFAQ|null = await FAQ.findById(id);
  if(!faq) return false;
  return true;
}

async function getByID(id: string): Promise<IFAQ|null> {
  return (await FAQ.findById(id).populate('item'));
}

async function getByProductID(id: string): Promise<IFAQ[] | null> {
  return (await FAQ.find({item: id}));
}

async function getAll(): Promise<IFAQ[]> {
  return (await FAQ.find().populate('item').sort({createdAt:'desc'}));
}

async function update(id:string, faq: IFAQ): Promise<Boolean> {
  let outcome: boolean = false;
  await FAQ.findOneAndUpdate(
    { _id: id },
    { $set: faq },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await FAQ.deleteOne({_id: id}) ? outcome = true : null;
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
  getByProductID
} as const;
