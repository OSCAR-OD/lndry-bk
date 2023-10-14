import rolePermissionRepo from '@repos/role-permission-repo';
import {IRolePermissions} from '@models/RolePermissions';
import permissions from "@util/permissions";

// **** Functions **** //

function getAll(): Promise<IRolePermissions[]> {
  return rolePermissionRepo.getAll();
}

function getSingle(role: string): Promise<IRolePermissions|null> {
  return rolePermissionRepo.getByRole(role);
}

function addOne(rolePermissions: IRolePermissions): Promise<Boolean> {
  return rolePermissionRepo.add(rolePermissions);
}

function updateOne(name: string,rolePermissions: IRolePermissions): Promise<Boolean> {
  return rolePermissionRepo.update(name,rolePermissions);
}

async function _delete(name: string): Promise<boolean> {
  const persists = await rolePermissionRepo.existByRole(name);
  if (!persists) {
    return false;
  }
  return rolePermissionRepo.delete(name);
}

async function seed(){
  //Only call this function once
  let allRoles = await getAll();
  if(allRoles.length < 5){
    const roles = ['Super admin', 'Admin', 'Manager', 'Content Officer','Freelancer'];
    for (let i=0;i<roles.length;i++){
      const role = roles[i];
      const persist:boolean = await rolePermissionRepo.existByRole(role);
      if(!persist){
        if(roles[i] === 'Super admin'){
          await addOne({role, permissions});
        } else {
          await addOne({role, permissions: ['dashboard']});
        }
      }
    }
    allRoles = await getAll();
  }
  return allRoles;
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  seed,
  getSingle
} as const;
