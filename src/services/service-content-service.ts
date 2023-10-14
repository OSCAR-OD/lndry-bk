import serviceContentRepo from '@repos/service-content-repo';
import {IServiceContent} from '@models/ServiceContent';
import path from "path";
import envVars from "@shared/env-vars";
import fs from "fs";


// **** Functions **** //

function getAll(): Promise<IServiceContent[]> {
  return serviceContentRepo.getAll();
}

async function getSingle(id: string) : Promise<IServiceContent | null> {
  return await serviceContentRepo.getByID(id);
}

function addOne(serviceContent: IServiceContent): Promise<Boolean> {
  return serviceContentRepo.add(serviceContent);
}

async function updateOne(id: string,serviceContent: IServiceContent,host:string=''): Promise<Boolean> {
  const existing : IServiceContent | null = await serviceContentRepo.getByID(id);
  if(!existing){
    return false;
  } else {
    if(serviceContent.image && existing.image){
      const filePath = path.join(__dirname, '../', envVars.folder, existing.image.split(host)[1]);
      fs.unlinkSync(filePath);
    }
    if(serviceContent.image === ''){
      serviceContent.image = existing.image;
    }
    return serviceContentRepo.update(id,serviceContent);
  }
}

async function _delete(id: string, host:string): Promise<boolean> {
  const existing:IServiceContent|null = await serviceContentRepo.getByID(id);
  if (!existing) {
    return false;
  } else {
    if(existing.image){
      const filePath = path.join(__dirname, '../', envVars.folder, existing.image.split(host)[1]);
      fs.unlinkSync(filePath);
    }
  }
  return serviceContentRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle
} as const;
