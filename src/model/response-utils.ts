import { createSelector, OrmState, QuerySet, Ref } from "redux-orm";
import { ReactText } from "react";
import { ResponseModel } from "./response";
import orm from ".";

// @ts-ignore-start
const _getResponse = createSelector(orm.Response);
// @ts-ignore-end

export function getResponse(
  state: OrmState<any>,
  filter: ReactText
): Ref<ResponseModel>;

export function getResponse(
  state: OrmState<any>,
  filter: ReactText[]
): Ref<ResponseModel>[];

export function getResponse(
  state: OrmState<any>,
  filter: null
): Ref<ResponseModel>[];

export function getResponse(...params: any[]): any {
  return _getResponse(...params);
}

export const getPendingResponseCount = createSelector(orm, (session) =>
  session.Response.all()
    .filter((response: Ref<ResponseModel>) =>
      Boolean(response.recorded && !response.submitted)
    )
    .count()
);

export const getFailedResponses = createSelector<any, QuerySet<ResponseModel>>(
  orm,
  (session) =>
    session.Response.all().filter((response: Ref<ResponseModel>) =>
      Boolean(response.recorded && response.failed)
    )
);
