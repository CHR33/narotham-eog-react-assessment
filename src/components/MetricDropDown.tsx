import React, { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { createClient, Provider, useQuery } from 'urql';

interface MetricDropDownProps {
	onMetricSelection: (val: string[]) => void;
}

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const query = `
	query getMetrics {
		getMetrics
	}
`;

export default (props: MetricDropDownProps) => {
	return (
		<Provider value={client}>
			<MetricDropDown {...props} />
		</Provider>
	)
}

export const MetricDropDown = (props: MetricDropDownProps) => {
	const [metrics, setMetrics] = useState<string[]>([]);

	const [result] = useQuery({
    query
	});

	const { data } = result;

	useEffect(() => {
    if (!data) return;

    setMetrics(data.getMetrics);
  }, [data]);

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
