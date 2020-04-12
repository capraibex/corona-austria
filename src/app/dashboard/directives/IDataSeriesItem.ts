import { DataPoint } from '../Datapoint';

export interface IDataSeriesItem {
  type: string;
  dataPoints: DataPoint[];
  color?: string;
  name?: string;
  toolTipContent?: string;
}
