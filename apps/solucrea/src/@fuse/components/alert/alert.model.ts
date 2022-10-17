import { FuseAlertType, FuseAlertAppearance } from './alert.types';
export interface IAlert {
  appearance: FuseAlertAppearance;
  name: string;
  message: string;
  type: FuseAlertType;
  dismissed?: boolean;
  dismissible?: boolean;
  showIcon?: boolean;
  dismissTime?: number;
}
