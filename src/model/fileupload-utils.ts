import { createSelector, OrmState, Ref } from "redux-orm";
import { ReactText } from "react";
import { FileModel } from "./fileupload";
import orm from ".";

// @ts-ignore-start
const _getFile = createSelector(orm.FileModel);
// @ts-ignore-end

export function getFile(
  state: OrmState<any>,
  filter: ReactText
): Ref<FileModel>;

export function getFile(
  state: OrmState<any>,
  filter: ReactText[]
): Ref<FileModel>[];

export function getFile(state: OrmState<any>, filter: null): Ref<FileModel>[];

export function getFile(...params: any[]): any {
  return _getFile(...params);
}
