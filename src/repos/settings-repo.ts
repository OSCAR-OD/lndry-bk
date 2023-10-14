import Settings , {ISettings} from "@models/Settings";

async function add(settings: ISettings): Promise<boolean> {
  let outcome: boolean = false;
  if(!await exist()){
    await new Settings(settings).save() ? outcome = true : false;
  }
  return outcome;
}

async function exist(): Promise<boolean> {
  const settings:ISettings[]|null = await Settings.find();
  if(!(settings?.length>0)) return false;
  return true;
}

async function get(): Promise<ISettings|null> {
  const settings:ISettings[]|null = await Settings.find();
  return (settings[0]);
}

async function update(id: string, settings: ISettings): Promise<Boolean> {
  let outcome: boolean = false;
  await Settings.findOneAndUpdate(
    { _id: id },
    { $set: settings },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Settings.deleteOne({_id: id}) ? outcome = true : null;
  return outcome;
}

// **** Export default **** //

export default {
  add,
  exist,
  get,
  update,
  delete: _delete
} as const;
