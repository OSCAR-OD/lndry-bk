import ServiceContent , {IServiceContent} from "@models/ServiceContent";

async function add(serviceContent: IServiceContent): Promise<boolean> {
  let outcome: boolean = false;
  await new ServiceContent(serviceContent).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const serviceContent:IServiceContent|null = await ServiceContent.findById(id);
  if(!serviceContent) return false;
  return true;
}

async function getByID(id: string): Promise<IServiceContent|null> {
  return (await ServiceContent.findById(id).populate('service'));
}

async function getAll(): Promise<IServiceContent[]> {
  return (await ServiceContent.find().populate('service').sort({createdAt:'desc'}));
}

async function update(id:string, serviceContent: IServiceContent): Promise<Boolean> {
  let outcome: boolean = false;
  await ServiceContent.findOneAndUpdate(
    { _id: id },
    { $set: serviceContent },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await ServiceContent.deleteOne({_id: id}) ? outcome = true : null;
  return outcome;
}

// **** Export default **** //

export default {
  add,
  existByID,
  getAll,
  getByID,
  update,
  delete: _delete
} as const;
