import couponRepo from '@repos/coupon-repo';
import {ICoupon} from '@models/Coupon';


// **** Functions **** //

function getAll(): Promise<ICoupon[]> {
  return couponRepo.getAll();
}

async function getSingle(id: string) : Promise<ICoupon | null> {
  return await couponRepo.getByID(id);
}
async function getSingleByCode(code: string) : Promise<ICoupon | null> {
  return await couponRepo.getByCode(code);
}

function addOne(banner: ICoupon): Promise<Boolean> {
  return couponRepo.add(banner);
}

function updateOne(id: string,banner: ICoupon): Promise<Boolean> {
  return couponRepo.update(id,banner);
}

async function _delete(id: string): Promise<boolean> {
  const persists = await couponRepo.existByID(id);
  if (!persists) {
    return false;
  }
  return couponRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getSingleByCode
} as const;
