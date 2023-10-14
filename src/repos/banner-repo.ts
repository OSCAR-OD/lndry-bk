import Banner, {IBanner} from "@models/Banner";

async function add(banner: IBanner): Promise<boolean> {
  let outcome: boolean = false;
  await new Banner(banner).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const banner:IBanner|null = await Banner.findById(id);
  if(!banner) return false;
  return true;
}

async function getByID(id: string): Promise<IBanner|null> {
  return (await Banner.findById(id));
}

async function getAll(): Promise<IBanner[]> {
  return (await Banner.find().sort({createdAt:'desc'}));
}

async function getAllByPosition(position: string): Promise<IBanner[]> {
  return (await Banner.find({position: position}).sort({createdAt:'desc'}));
}

async function update(id:string, banner: IBanner): Promise<Boolean> {
  let outcome: boolean = false;
  await Banner.findOneAndUpdate(
    { _id: id },
    { $set: banner },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Banner.deleteOne({_id: id}) ? outcome = true : null;
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
  getAllByPosition
} as const;
