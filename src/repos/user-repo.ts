import User, { IUser } from "@models/User";
import bcrypt from "bcryptjs";

/**
 * Add one user.
 */
async function add(user: IUser): Promise<boolean> {
  let outcome: boolean = false;
  // Password Hash
  user.password = await bcrypt.hash(user.password, 10);
  (await new User(user).save()) ? (outcome = true) : null;
  return outcome;
}

/**
 * See if a user with the given email exists.
 */
async function existByEmail(email: string): Promise<boolean> {
  const user: IUser | null = await User.findOne({ email });
  if (!user) return false;
  return true;
}

async function existByID(id: string): Promise<boolean> {
  const user: IUser | null = await User.findById(id);
  if (!user) return false;
  return true;
}

/**
 * Find a user with the given email exists.
 */
async function getByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email });
}

async function getByEmailNotForPassword(
  email: string
): Promise<IUser | null | any> {
  return await User.findOne({ email }).select("-password");
}

/**
 * Find a user with the given id exists.
 */
async function getByID(id: string): Promise<IUser | null | any> {
  return await User.findById(id).select(["-password"]);
}

function addOneDay(date: string) {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
}

/**
 * Get all files.
 */
async function getAll(
  role: string = "",
  start: any,
  end: any
): Promise<IUser[]> {
  let query: any = {};
  if (start !== "") {
    query.createdAt = { $gte: new Date(start) };
  }
  if (end !== "") {
    query.createdAt = { $lt: addOneDay(end) };
  }
  if (start !== "" && end !== "") {
    query.createdAt = { $gte: new Date(start), $lt: addOneDay(end) };
  }
  let users: any;
  if (role !== "") {
    query.role = role;
  }
  if (query) {
    users = await User.find(query)
      .select(["-password"])
      .sort({ createdAt: "desc" });
  } else {
    users = await User.find().select(["-password"]).sort({ createdAt: "desc" });
  }

  return users;
}

/**
 * Add one user.
 */
async function updatePassword(
  password: string,
  email: string
): Promise<boolean> {
  let outcome: boolean = false;
  // Password Hash
  password = await bcrypt.hash(password, 10);
  (await User.findOneAndUpdate(
    { email: email },
    { $set: { password } },
    { new: true }
  ).exec())
    ? (outcome = true)
    : null;
  return outcome;
}

/**
 * Add one user.
 */
async function update(email: string, user: IUser): Promise<boolean> {
  let outcome: boolean = false;
  (await User.findOneAndUpdate(
    { email: email },
    { $set: user },
    { new: true }
  ).exec())
    ? (outcome = true)
    : null;
  return outcome;
}
/**
 * Add one user.
 */
async function updateByID(id: string, user: IUser): Promise<boolean> {
  let outcome: boolean = false;
  (await User.findOneAndUpdate(
    { _id: id },
    { $set: user },
    { new: true }
  ).exec())
    ? (outcome = true)
    : null;
  return outcome;
}
/**
 * Add one user.
 */
async function _delete(email: string): Promise<boolean> {
  let outcome: boolean = false;
  (await User.deleteOne({ email: email })) ? (outcome = true) : null;
  return outcome;
}

async function deleteByID(id: string): Promise<boolean> {
  let outcome: boolean = false;
  (await User.deleteOne({ _id: id })) ? (outcome = true) : null;
  return outcome;
}

// **** Export default **** //

export default {
  add,
  existByEmail,
  getByEmail,
  updatePassword,
  getAll,
  update,
  delete: _delete,
  updateByID,
  deleteByID,
  existByID,
  getByID,
  getByEmailNotForPassword,
} as const;
