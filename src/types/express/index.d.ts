import 'express';
import {IFile} from "@shared/types";

// **** Declaration Merging **** //

declare module 'express' {

  export interface Request {
    token?: any;
    images?: IFile[];
  }
}
