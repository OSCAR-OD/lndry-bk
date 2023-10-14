import Blog, {IBlog} from "@models/Blog";

async function add(blog: IBlog): Promise<boolean> {
  let outcome: boolean = false;
  await new Blog(blog).save() ? outcome = true : null;
  return outcome;
}

async function existByID(id: string): Promise<boolean> {
  const blog:IBlog|null = await Blog.findById(id);
  if(!blog) return false;
  return true;
}

async function getByID(id: string): Promise<IBlog|null> {
  return (await Blog.findById(id));
}

async function getSingleBySlug(slug: string): Promise<IBlog|null> {
  return (await Blog.findOne({slug}));
}

async function getAll(): Promise<IBlog[]> {
  // return (await Blog.find().select('-metaTitle -metaDescription').sort({createdAt:'desc'}));
  return (await Blog.aggregate([
    {
      $project: {
        _id: 1,
        image: 1,
        keywords: 1,
        order:1,
        visitorCount: 1,
        createdAt: 1,
        title: 1,
        slug: 1,
        published: 1,
        drafted: 1,
        description: { $substrBytes: [ "$description", 0, 78 ] }
      }
    },
    {
      $sort: {createdAt: -1}
    }
  ]).exec());
}

async function update(id:string, blog: any): Promise<Boolean> {
  let outcome: boolean = false;
  await Blog.findOneAndUpdate(
    { _id: id },
    { $set: blog },
    { new: true }).exec() ? outcome = true : null;
  return outcome;
}

async function _delete(id:string): Promise<boolean> {
  let outcome: boolean = false;
  await Blog.deleteOne({_id: id}) ? outcome = true : null;
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
  getSingleBySlug
} as const;