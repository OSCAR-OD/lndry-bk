import {ISubService} from '@models/SubService';
import subServiceRepo from "@repos/sub-service-repo";


// **** Functions **** //

function getAll(): Promise<ISubService[]> {
  return subServiceRepo.getAll();
}

async function getSingle(id: string) : Promise<ISubService | null> {
  return await subServiceRepo.getByID(id);
}

async function getByService(id: string | undefined) : Promise<ISubService[] | null> {
  return await subServiceRepo.getByService(id);
}

function addOne(subService: ISubService): Promise<Boolean> {
  return subServiceRepo.add(subService);
}

async function updateOne(id: string,subService: ISubService): Promise<Boolean> {
  const existing : ISubService|null = await subServiceRepo.getByID(id);
  if (!existing) {
    return false;
  } else {
    return subServiceRepo.update(id,subService);
  }
}

async function _delete(id: string): Promise<boolean> {
  const existing : ISubService|null = await subServiceRepo.getByID(id);
  if (existing) {
    return subServiceRepo.delete(id);
  } else {
    return false;
  }
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getByService
} as const;
