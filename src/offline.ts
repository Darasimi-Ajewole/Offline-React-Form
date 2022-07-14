import { offline } from "@redux-offline/redux-offline";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults";
import { OfflineAction } from "@redux-offline/redux-offline/lib/types";

export interface OfflineReqPayload {
  url: string;
  json: { [key: string]: any };
  headers?: { [key: string]: string };
}
export type OfflineCustomRequest = (
  effectData: OfflineReqPayload
) => Promise<any>;

export interface OfflineMetadata extends OfflineReqPayload {
  customRequest: OfflineCustomRequest;
}

const effect = (effectData: OfflineMetadata, _action: OfflineAction) => {
  const defaultRequest = offlineConfig.effect;
  const { customRequest } = effectData;
  if (customRequest) return customRequest(effectData);
  return defaultRequest(effectData, _action);
};

export const offlineMiddleware = offline({ ...offlineConfig, effect });
