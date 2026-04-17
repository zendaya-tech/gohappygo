import { Capacitor } from '@capacitor/core';

export const useIsNativeApp = () => {
  return Capacitor.isNativePlatform();
};
