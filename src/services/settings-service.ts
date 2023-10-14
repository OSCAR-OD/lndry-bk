import settingsRepo from '@repos/settings-repo';
import {ISettings} from '@models/Settings';
import path from "path";
import envVars from "@shared/env-vars";
import fs from "fs";


// **** Functions **** //

function getAll(): Promise<ISettings | null> {
  return settingsRepo.get();
}


function addOne(settings: ISettings): Promise<Boolean> {
  return settingsRepo.add(settings);
}

async function updateOne(settings: ISettings,host:string=''): Promise<Boolean> {
  const existing:ISettings|null = await settingsRepo.get();
  if(!existing){
    await addOne(settings);
    return true;
  } else {
    if(existing._id !== undefined){
      if(settings.logo && existing.logo){
        const filePath = path.join(__dirname, '../', envVars.folder, existing.logo.split(host)[1]);
        fs.unlinkSync(filePath);
      }
      return settingsRepo.update(existing._id,settings);
    }
    return false;
  }
}

async function _delete(id: string, host:string): Promise<boolean> {
  const persists:ISettings|null = await settingsRepo.get();
  if(persists){
    if(persists.logo){
      const filePath = path.join(__dirname, '../', envVars.folder, persists.logo.split(host)[1]);
      fs.unlinkSync(filePath);
    }
    return settingsRepo.delete(id);
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
} as const;
