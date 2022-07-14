import { SessionData } from "../utils/upload";

export interface FileSchema {
  id: string;
  created?: Date;
  modified?: Date;
  fileModified?: Date;
  uploadData?: SessionData;
  uploading?: boolean;
}

export interface ResponseSchema {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  phone?: string;
  created?: Date;
  modified?: Date;
  recorded?: Date;
  submitted?: Date;
  failed?: Date;
  displayPic?: string;
}
