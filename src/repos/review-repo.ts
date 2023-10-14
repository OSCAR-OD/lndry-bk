import Review , {IReview} from "@models/Review";

async function add(review: IReview): Promise<boolean> {
  let outcome: boolean = false;
  await new Review(review).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const review:IReview|null = await Review.findById(id);
  if(!review) return false;
  return true;
}

async function getByID(id: string): Promise<IReview|null> {
  return (await Review.findById(id).populate('item').populate('customer'));
}

async function getByProductID(id: string): Promise<IReview[]|null> {
  return (await Review.find({item: id}).populate('item').populate('customer'));
}

async function getApprovedByProduct(id: string): Promise<IReview[]|null> {
  return (await Review.find({item: id, approval: true}).populate('item').populate('customer'));
}

async function getAll(): Promise<IReview[]> {
  return (await Review.find().populate('item').populate('customer').sort({createdAt:'desc'}));
}

async function update(id:string, review: IReview): Promise<Boolean> {
  let outcome: boolean = false;
  await Review.findOneAndUpdate(
    { _id: id },
    { $set: review },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Review.deleteOne({_id: id}) ? outcome = true : null;
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
  getByProductID,
  getApprovedByProduct
} as const;
