import { Query } from '../query/query';

export interface DeleteHandler {
  query: Query;
  isRemote: boolean;
}

export interface FirebaseHandler {
  query: Query;
  handlerType: FirebaseHandlerType;
}

export enum FirebaseHandlerType {
  UPLOAD, DOWNLOAD
}
