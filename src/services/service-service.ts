import serviceRepo from '@repos/service-repo';
import {IService} from '@models/Service';
import path from "path";
import envVars from "@shared/env-vars";
import fs from "fs";
import subServiceRepo from "@repos/sub-service-repo";


// **** Functions **** //

function getAll(): Promise<IService[]> {
  return serviceRepo.getAll();
}
function getAllIds(): Promise<any[]> {
  return serviceRepo.getAllIds();
}

async function getSingle(id: string) : Promise<IService | null> {
  return await serviceRepo.getByID(id);
}

async function getSingleBySlug(slug: string) : Promise<IService | null> {
  return await serviceRepo.getBySlug(slug);
}

function addOne(service: IService): Promise<Boolean> {
  return serviceRepo.add(service);
}

async function updateOne(id: string,service: IService,host:string=''): Promise<Boolean> {
  const existing:IService|null = await serviceRepo.getByID(id);
  if (!existing) {
    return false;
  } else {
    if(service.icon && existing.icon){
      const filePath = path.join(__dirname, '../', envVars.folder, existing.icon.split(host)[1]);
      fs.unlinkSync(filePath);
    }
    if(service.icon === ''){
      service.icon = existing.icon;
    }
    return serviceRepo.update(id,service);
  }
}

async function _delete(id: string,host:string): Promise<boolean> {
  const existing:IService|null = await serviceRepo.getByID(id);
  if (!existing) {
    return false;
  } else {
    if(existing.icon){
      const filePath = path.join(__dirname, '../', envVars.folder, existing.icon.split(host)[1]);
      fs.unlinkSync(filePath);
    }
    return serviceRepo.delete(id);
  }
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getSingleBySlug,
  getAllIds
} as const;
