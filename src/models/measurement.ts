export interface Measurement {
	[x: string]: number | string;
	at: number;
	metric: string;
	value: number;
	unit: string;
}
