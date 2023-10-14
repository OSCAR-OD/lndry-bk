import driverOrderRepo from "@repos/driver-order-repo";
import {IDriverOrder} from '@models/DriverOrders';


// **** Functions **** //

function getAll(): Promise<IDriverOrder[]> {
  return driverOrderRepo.getAll();
}

function getAllByEmail(email: string): Promise<IDriverOrder[] | null> {
  return driverOrderRepo.getAllByEmail(email);
}

async function getSingle(id: string) : Promise<IDriverOrder | null> {
  return await driverOrderRepo.getByID(id);
}

function addOne(serviceContent: IDriverOrder): Promise<unknown> {
  return driverOrderRepo.add(serviceContent);
}

async function updateOne(id: string,order:any): Promise<Boolean> {
  const existing : IDriverOrder | null = await driverOrderRepo.getByID(id);
  if(!existing){
    return false;
  } else {
    return driverOrderRepo.update(id,order);
  }
}

async function _delete(id: string): Promise<boolean> {
  const existing:IDriverOrder|null = await driverOrderRepo.getByID(id);
  if (!existing) {
    return false;
  }
  return driverOrderRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle,
  getAllByEmail
} as const;
