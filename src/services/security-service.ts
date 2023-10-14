import securityRepo from '@repos/security-repo';
import {ISecurity} from '@models/Security';


// **** Functions **** //

function getAll(): Promise<ISecurity[]> {
  return securityRepo.getAll();
}


function addOne(banner: ISecurity): Promise<Boolean> {
  return securityRepo.add(banner);
}

function updateOne(id: string,banner: ISecurity): Promise<Boolean> {
  return securityRepo.update(id,banner);
}

async function _delete(email: string): Promise<boolean> {
  const persists = await securityRepo.existByEmail(email);
  if (!persists) {
    return false;
  }
  return securityRepo.delete(email);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
