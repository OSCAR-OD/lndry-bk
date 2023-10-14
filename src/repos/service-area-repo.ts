import ServiceArea , {IServiceArea} from "@models/ServiceArea";

async function add(serviceArea: IServiceArea): Promise<boolean> {
  let outcome: boolean = false;
  await new ServiceArea(serviceArea).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const serviceArea:IServiceArea|null = await ServiceArea.findById(id);
  if(!serviceArea) return false;
  return true;
}

async function getByID(id: string): Promise<IServiceArea|null> {
  return (await ServiceArea.findById(id));
}

async function getSingleByPostCode(postcode: string): Promise<IServiceArea|null> {
  const two = postcode.substring(0,2);
  const three = postcode.substring(0,3);
  const four = postcode.substring(0,4);
  const serviceAreas = await ServiceArea.aggregate([
    {
      $match: {
        $or: [
          {city_postcode: {$regex: new RegExp(two,'i')}},
          {city_postcode: {$regex: new RegExp(three,'i')}},
          {city_postcode: {$regex: new RegExp(four,'i')}},
          {city_postcode: {$regex: new RegExp(postcode,'i')}}
        ],
        $and: [{published: true}]
      }
    },
    {
      $limit: 1
    }
  ]).exec();
  return serviceAreas?serviceAreas[0]:null;
}

async function getAll(): Promise<IServiceArea[]> {
  return (await ServiceArea.find().sort({createdAt:'desc'}));
}

async function update(id:string, serviceArea: IServiceArea): Promise<Boolean> {
  let outcome: boolean = false;
  await ServiceArea.findOneAndUpdate(
    { _id: id },
    { $set: serviceArea },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await ServiceArea.deleteOne({_id: id}) ? outcome = true : null;
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
  getSingleByPostCode
} as const;
