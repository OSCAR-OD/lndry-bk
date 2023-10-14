import reviewRepo from '@repos/review-repo';
import {IReview} from '@models/Review';
import path from "path";
import envVars from "@shared/env-vars";
import fs from "fs";


// **** Functions **** //

function getAll(): Promise<IReview[]> {
  return reviewRepo.getAll();
}

async function getSingle(id: string) : Promise<IReview | null> {
  return await reviewRepo.getByID(id);
}

async function getByProduct(id: string) : Promise<IReview[] | null> {
  return await reviewRepo.getByProductID(id);
}
async function getApprovedByProduct(id: string) : Promise<IReview[] | null> {
  return await reviewRepo.getApprovedByProduct(id);
}

function addOne(review: IReview): Promise<Boolean> {
  return reviewRepo.add(review);
}

async function updateOne(id: string,review: IReview, host:string=''): Promise<Boolean> {
  const existing:IReview|null = await reviewRepo.getByID(id);
  if(!existing){
    return false;
  } else {
    if(review.image !== '' && existing.image){
      const image = existing.image.split('/');
      const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if(review.image === ''){
      review.image = existing.image;
    }
    if(review.images){
      if (existing.images) {
        for (let i=0;i<existing.images?.length; i++){
          const image = existing.images[i].split('/');
          const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
          if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      }
    }
    if(!review.images?.length){
      review.images = existing.images;
    }
    return reviewRepo.update(id,review);
  }
}

async function _delete(id: string, host:string): Promise<boolean> {
  const existing:IReview|null = await reviewRepo.getByID(id);
  if (!existing) {
    return false;
  } else {
    if(existing.image){
      const image = existing.image.split('/');
      const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (existing.images) {
      for (let i=0;i<existing.images?.length; i++){
        const image = existing.images[i].split('/');
        const filePath = path.join(__dirname, '../', envVars.folder, image[image.length-1]);
        if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
    return reviewRepo.delete(id);
  }
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getByProduct,
  getApprovedByProduct
} as const;
