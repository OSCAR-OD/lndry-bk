import faqRepo from '@repos/faq-repo';
import {IFAQ} from '@models/FAQ';


// **** Functions **** //

function getAll(): Promise<IFAQ[]> {
  return faqRepo.getAll();
}

async function getSingle(id: string) : Promise<IFAQ | null> {
  return await faqRepo.getByID(id);
}

async function getByProductID(id: string) : Promise<IFAQ[] | null> {
  return await faqRepo.getByProductID(id);
}

function addOne(banner: IFAQ): Promise<Boolean> {
  return faqRepo.add(banner);
}

function updateOne(id: string,banner: IFAQ): Promise<Boolean> {
  return faqRepo.update(id,banner);
}

async function _delete(id: string): Promise<boolean> {
  const persists = await faqRepo.existByID(id);
  if (!persists) {
    return false;
  }
  return faqRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getByProductID
} as const;
