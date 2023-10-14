import Video , {IVideo} from "@models/Video";

async function add(video: IVideo): Promise<boolean> {
  let outcome: boolean = false;
  await new Video(video).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const video:IVideo|null = await Video.findById(id);
  if(!video) return false;
  return true;
}

async function getByID(id: string): Promise<IVideo|null> {
  return (await Video.findById(id));
}

async function getAll(): Promise<IVideo[]> {
  return (await Video.find().sort({createdAt:'desc'}));
}

async function update(id:string, video: IVideo): Promise<Boolean> {
  let outcome: boolean = false;
  await Video.findOneAndUpdate(
    { _id: id },
    { $set: video },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Video.deleteOne({_id: id}) ? outcome = true : null;
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
