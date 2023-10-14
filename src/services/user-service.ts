import {IUser} from '@models/User';
import userRepo from "@repos/user-repo";


// **** Functions **** //

function getAll(role: string = '', start: any = '', end: any = ''): Promise<IUser[]> {
  return userRepo.getAll(role, start, end);
}

async function getSingle(id: string) : Promise<IUser | null> {
  return await userRepo.getByID(id);
}
async function getByEmail(email: string) : Promise<IUser | null> {
  return await userRepo.getByEmail(email);
}
async function getByEmailNotForPassword(email: string) : Promise<IUser | null> {
  return await userRepo.getByEmailNotForPassword(email);
}

function addOne(user: IUser): Promise<Boolean> {
  return userRepo.add(user);
}

function updateOne(email: string,user: IUser, host: string = ''): Promise<Boolean> {
  return userRepo.update(email,user);
}

function updateOneByID(id: string,user: IUser, host: string): Promise<Boolean> {
  return userRepo.updateByID(id,user);
}

async function _delete(email: string, host: string): Promise<boolean> {
  const persists = await userRepo.existByEmail(email);
  if (!persists) {
    return false;
  }
  return userRepo.delete(email);
}

async function deleteByID(id: string, host: string): Promise<boolean> {
  const persists = await userRepo.existByID(id);
  if (!persists) {
    return false;
  }
  return userRepo.deleteByID(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  updateOneByID,
  getSingle,
  deleteByID,
  getByEmail,
  getByEmailNotForPassword
} as const;
