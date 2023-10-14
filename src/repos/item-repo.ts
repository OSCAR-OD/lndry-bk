import Item, {IItem} from "@models/Item";
import * as console from "console";

async function add(item: IItem): Promise<boolean> {
    let outcome: boolean = false;
    await new Item(item).save() ? outcome = true : null;
    return outcome;
}

async function existByID(id: string): Promise<boolean> {
    const item: IItem | null = await Item.findById(id);
    if (!item) return false;
    return true;
}

async function existBySlug(slug: string): Promise<IItem | null> {
    return (await Item.findOne({slug: slug}).populate('service').populate('sub_service'));
}

async function getByID(id: string): Promise<IItem | null> {
    return (await Item.findById(id).populate('service').populate('sub_service'));
}

async function getAll(): Promise<IItem[]> {
    return (await Item.find().select('-description -metaTitle -metaDescription -keywords').sort({createdAt: 'desc'}));
}
async function getAllIds(): Promise<any[]> {
    const items = await Item.aggregate([{$project: {_id: 1}}]).exec();
    const ids = [];
    for (let i of items){
        ids.push(i._id);
    }
    return (ids);
}

async function getAllForHomePage(filter: string): Promise<IItem[]> {
    let items: any = [];
    if (filter === 'discount') {
        items = await Item.find({offerType: {$ne: ''}}).select('-description -metaTitle -metaDescription -keywords').limit(10);
    } else if (filter === 'popular') {
        items = await Item.find({showOnPopularSection: true}).select('-description -metaTitle -metaDescription -keywords').limit(10);
    }
    return items;
}

async function update(id: string, item: IItem): Promise<Boolean> {
    let outcome: boolean = false;
    await Item.findOneAndUpdate(
        {_id: id},
        {$set: item},
        {new: true}).exec() ? outcome = true : null;
    return outcome;
}

async function _delete(id: string): Promise<boolean> {
    let outcome: boolean = false;
    await Item.deleteOne({_id: id}) ? outcome = true : null;
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
    getAllForHomePage,
    getAllIds,
    existBySlug
} as const;
