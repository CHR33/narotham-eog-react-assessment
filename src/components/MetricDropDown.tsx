import React from 'react';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

interface MetricDropDownProps {
	onMetricSelection: (val: string[]) => void;
}

const metrics = [
	'waterTemp',
	'flareTemp',
	'casingPressure',
	'oilTemp',
	'turbinePressure',
	'injValveOpen'
];

export const MetricDropDown: React.FC<MetricDropDownProps> = (props) => {
	return (
		<Autocomplete
			filterSelectedOptions
			renderInput={(params: AutocompleteRenderInputParams) => (
				<TextField
					variant="outlined"
					{...params}
				/>
			)}
			multiple
			options={metrics}
			defaultValue={[]}
			onChange={(_, value) => props.onMetricSelection(value)}
		/>
	);
};
