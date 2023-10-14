import Contact, {IContact} from "@models/Contact";

async function add(contact: IContact): Promise<boolean> {
  let outcome: boolean = false;
  await new Contact(contact).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const contact:IContact|null = await Contact.findById(id);
  if(!contact) return false;
  return true;
}

async function getByID(id: string): Promise<IContact|null> {
  return (await Contact.findById(id));
}

async function getAll(): Promise<IContact[]> {
  return (await Contact.find().sort({createdAt: 'desc'}));
}

async function update(id:string, contact: IContact): Promise<Boolean> {
  let outcome: boolean = false;
  await Contact.findOneAndUpdate(
    { _id: id },
    { $set: contact },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Contact.deleteOne({_id: id}) ? outcome = true : null;
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
