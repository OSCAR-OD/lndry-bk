import orderRepo from '@repos/order-repo';
import {IOrder} from '@models/Order';


// **** Functions **** //

function getAll(): Promise<IOrder[]> {
  return orderRepo.getAll();
}

async function getSingle(id: string) : Promise<IOrder | null> {
  return await orderRepo.getByID(id);
}
async function getSingleByEmail(email: string) : Promise<IOrder | null> {
  return await orderRepo.getByEmail(email);
}
async function getAllByEmail(email: string) : Promise<IOrder[] | null> {
  return await orderRepo.getAllByEmail(email);
}

function addOne(order: IOrder): Promise<unknown> {
  return orderRepo.add(order);
}

function updateOne(id: string,order:any): Promise<Boolean> {
  return orderRepo.update(id,order);
}

async function _delete(id: string): Promise<boolean> {
  const persists = await orderRepo.existByID(id);
  if (!persists) {
    return false;
  }
  return orderRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getSingleByEmail,
  getAllByEmail
} as const;
