import bannerRepo from '@repos/banner-repo';
import {IBanner} from '@models/Banner';
import fs from "fs";
import path from "path";
import envVars from "@shared/env-vars";


// **** Functions **** //

async function getAll(): Promise<IBanner[]> {
  return await bannerRepo.getAll();
}
async function getAllByPosition(position: string): Promise<IBanner[]> {
  return await bannerRepo.getAllByPosition(position);
}

async function getSingle(id: string) : Promise<IBanner | null> {
  return await bannerRepo.getByID(id);
}

async function addOne(banner: IBanner): Promise<Boolean> {
  return await bannerRepo.add(banner);
}

async function updateOne(id: string,banner: IBanner,host:string=''): Promise<Boolean> {
  const existing:IBanner|null = await bannerRepo.getByID(id);
  if(!existing){
    return false;
  } else {
    if(banner.file === ''){
      banner.file = existing.file;
    } else {
      const image = existing.file.split('/');
      const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return await bannerRepo.update(id,banner);
  }
}

async function _delete(id: string, host:string): Promise<boolean> {
  const existing:IBanner|null = await bannerRepo.getByID(id);
  if(!existing){
    return false;
  } else {
    const image = existing.file.split('/');
    const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
    if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return bannerRepo.delete(id);
  }
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getAllByPosition
} as const;
