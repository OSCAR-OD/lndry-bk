import blogRepo from '@repos/blog-repo';
import {IBlog} from '@models/Blog';
import path from "path";
import envVars from "@shared/env-vars";
import fs from "fs";


// **** Functions **** //

function getAll(): Promise<IBlog[]> {
  return blogRepo.getAll();
}

function addOne(blog: IBlog): Promise<Boolean> {
  return blogRepo.add(blog);
}

async function getSingle(id: string) : Promise<IBlog | null> {
  return await blogRepo.getByID(id);
}

async function getSingleBySlug(slug: string) : Promise<IBlog | null> {
  return await blogRepo.getSingleBySlug(slug);
}

async function updateOne(id: string,blog: any,host:string=''): Promise<Boolean> {
  const existing:IBlog|null = await blogRepo.getByID(id);
  if(!existing){
    return false;
  } else {
    if(blog.image !=='' && existing.image && host !== '' && blog.image !== undefined){
      const image = existing.image.split('/');
      const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if(blog.image === '' || blog.image === undefined){
      blog.image = existing.image;
    }
    return blogRepo.update(id,blog);
  }
}

async function _delete(id: string, host:string=''): Promise<boolean> {
  const persists:IBlog|null = await blogRepo.getByID(id);
  if(persists){
    if(persists.image){
      const image = persists.image.split('/');
      const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return blogRepo.delete(id);
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
  getSingleBySlug
} as const;