import SubService , {ISubService} from "@models/SubService";

async function add(subService: ISubService): Promise<boolean> {
  let outcome: boolean = false;
  await new SubService(subService).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const subService:ISubService|null = await SubService.findById(id);
  if(!subService) return false;
  return true;
}

async function getByID(id: string): Promise<ISubService|null> {
  return (await SubService.findById(id).populate('parent'));
}

async function getByService(id: string | undefined): Promise<ISubService[] | null> {
  return (await SubService.find({parent: id}).populate('parent'));
}

async function getAll(): Promise<ISubService[]> {
  return (await SubService.find().populate('parent').sort({createdAt: 'desc'}));
}

async function update(id:string, subService: ISubService): Promise<Boolean> {
  let outcome: boolean = false;
  await SubService.findOneAndUpdate(
    { _id: id },
    { $set: subService },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await SubService.deleteOne({_id: id}) ? outcome = true : null;
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
  getByService
} as const;
