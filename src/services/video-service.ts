import {IVideo} from '@models/Video';
import videoRepo from "@repos/video-repo";


// **** Functions **** //

function getAll(): Promise<IVideo[]> {
  return videoRepo.getAll();
}

async function getSingle(id: string) : Promise<IVideo | null> {
  return await videoRepo.getByID(id);
}

function addOne(banner: IVideo): Promise<Boolean> {
  return videoRepo.add(banner);
}

function updateOne(id: string,banner: IVideo): Promise<Boolean> {
  return videoRepo.update(id,banner);
}

async function _delete(id: string): Promise<boolean> {
  const persists = await videoRepo.existByID(id);
  if (!persists) {
    return false;
  }
  return videoRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  getSingle
} as const;
