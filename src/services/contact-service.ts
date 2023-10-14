import contactRepo from '@repos/contact-repo';
import {IContact} from '@models/Contact';

// **** Functions **** //

function getAll(): Promise<IContact[]> {
  return contactRepo.getAll();
}

async function getSingle(id: string) : Promise<IContact | null> {
  return await contactRepo.getByID(id);
}

function addOne(banner: IContact): Promise<Boolean> {
  return contactRepo.add(banner);
}

function updateOne(id: string,banner: IContact): Promise<Boolean> {
  return contactRepo.update(id,banner);
}

async function _delete(id: string): Promise<boolean> {
  const persists = await contactRepo.existByID(id);
  if (!persists) {
    return false;
  }
  return contactRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle
} as const;
