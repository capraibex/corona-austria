import { DataPoint } from './DataPoint';

export interface IMetaData {
    "Bestätigte Fälle": DataPoint[],
    "Genesen": DataPoint[],
    "Hospitalisierung*": DataPoint[],
    "Intensivstation*": DataPoint[],
    "Testungen": DataPoint[],
    "Todesfälle": DataPoint[]
}