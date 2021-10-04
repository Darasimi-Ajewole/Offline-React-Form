import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';


const effect = (effectData, _action) => {
  const defaultRequest = offlineConfig.effect
  const { customRequest } = effectData
  if (customRequest) return customRequest(effectData)
  return defaultRequest(effectData)
}

export const offlineMiddleware = offline({ ...offlineConfig, effect })