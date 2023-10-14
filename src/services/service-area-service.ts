import serviceAreaRepo from '@repos/service-area-repo';
import {IServiceArea} from '@models/ServiceArea';


// **** Functions **** //

function getAll(): Promise<IServiceArea[]> {
  return serviceAreaRepo.getAll();
}

async function getSingle(id: string) : Promise<IServiceArea | null> {
  return await serviceAreaRepo.getByID(id);
}

async function getSingleByPostCode(postcode: string) : Promise<IServiceArea | null> {
  return await serviceAreaRepo.getSingleByPostCode(postcode);
}

function addOne(banner: IServiceArea): Promise<Boolean> {
  return serviceAreaRepo.add(banner);
}

function updateOne(id: string,banner: IServiceArea): Promise<Boolean> {
  return serviceAreaRepo.update(id,banner);
}

async function _delete(id: string): Promise<boolean> {
  const persists = await serviceAreaRepo.existByID(id);
  if (!persists) {
    return false;
  }
  return serviceAreaRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getSingleByPostCode
} as const;
