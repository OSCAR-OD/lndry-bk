import Service , {IService} from "@models/Service";

async function add(service: IService): Promise<boolean> {
  let outcome: boolean = false;
  await new Service(service).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const service:IService|null = await Service.findById(id);
  if(!service) return false;
  return true;
}

async function getByID(id: string): Promise<IService|null> {
  return (await Service.findById(id));
}
async function getBySlug(slug: string): Promise<IService|null> {
  return (await Service.findOne({name: {$regex: new RegExp(slug,'i')}}));
}

async function getAll(): Promise<IService[]> {
  return (await Service.aggregate([
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: 'service',
        as: 'products',
        pipeline: [
          {
            $group: {
              _id: "$service",
              total: {$sum: 1}
            }
          }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        icon: 1,
        products: 1,
        createdAt: 1
      }
    },
    {
      $sort: {createdAt: -1}
    }
  ]).exec());
}

async function getAllIds(): Promise<any[]> {
  const services = await Service.aggregate([{$project: {_id: 1}}]).exec();
  const tempServiceIds = [];
  for (let i of services){
    tempServiceIds.push(i._id);
  }
  return (tempServiceIds);
}

async function update(id:string, service: IService): Promise<Boolean> {
  let outcome: boolean = false;
  await Service.findOneAndUpdate(
    { _id: id },
    { $set: service },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Service.deleteOne({_id: id}) ? outcome = true : null;
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
  getBySlug,
  getAllIds
} as const;
