import itemRepo from '@repos/item-repo';
import {IItem} from '@models/Item';
import path from "path";
import envVars from "@shared/env-vars";
import fs from "fs";


// **** Functions **** //

function getAll(): Promise<IItem[]> {
  return itemRepo.getAll();
}

function getAllIds(): Promise<IItem[]> {
  return itemRepo.getAllIds();
}

function getAllForHomePage(filter: string): Promise<IItem[]> {
  return itemRepo.getAllForHomePage(filter);
}

async function getSingle(id: string) : Promise<IItem | null> {
  return await itemRepo.getByID(id);
}
async function getSingleBySlug(slug: string) : Promise<IItem | null> {
  return await itemRepo.existBySlug(slug);
}

function addOne(item: IItem): Promise<Boolean> {
  return itemRepo.add(item);
}

async function updateOne(id: string,item: IItem, host:string=''): Promise<Boolean> {
  const existing:IItem|null = await itemRepo.getByID(id);
  if(!existing){
    return false;
  } else {
    if(item.image !== '' && existing.image){
      const image = existing.image.split('/');
      const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if(item.image === ''){
      item.image = existing.image;
    }
    return itemRepo.update(id,item);
  }
}

async function _delete(id: string, host:string): Promise<boolean> {
  const existing:IItem|null = await itemRepo.getByID(id);
  if (!existing) {
    return false;
  } else {
    if(existing.image && host){
      const image = existing.image.split('/');
      const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return itemRepo.delete(id);
  }
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getAllForHomePage,
  getAllIds,
  getSingleBySlug
} as const;
