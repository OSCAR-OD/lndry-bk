import RolePermissions, {IRolePermissions} from "@models/RolePermissions";

async function add(rolePermission: IRolePermissions): Promise<boolean> {
  let outcome: boolean = false;
  await new RolePermissions(rolePermission).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const rolePermission:IRolePermissions|null = await RolePermissions.findById(id);
  if(!rolePermission) return false;
  return true;
}

async function existByRole(role: string): Promise<boolean> {
  const rolePermission:IRolePermissions|null = await RolePermissions.findOne({role});
  if(!rolePermission) return false;
  return true;
}

async function getByID(id: string): Promise<IRolePermissions|null> {
  return (await RolePermissions.findById(id));
}

async function getByRole(role: string): Promise<IRolePermissions|null> {
  return (await RolePermissions.findOne({role}));
}

async function getAll(): Promise<IRolePermissions[]> {
  return (await RolePermissions.find().sort({createdAt:'desc'}));
}

async function update(name:string, rolePermission: IRolePermissions): Promise<Boolean> {
  let outcome: boolean = false;
  await RolePermissions.findOneAndUpdate(
    { role: name },
    { $set: rolePermission },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(name:string): Promise<boolean> {
  let outcome: boolean = false;
  await RolePermissions.deleteOne({role: name}) ? outcome = true : null;
  return outcome;
}

// **** Export default **** //

export default {
  add,
  existByID,
  getAll,
  getByID,
  update,
  delete: _delete,
  existByRole,
  getByRole
} as const;
