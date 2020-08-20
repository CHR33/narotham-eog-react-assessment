import React, { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { TextField, makeStyles } from '@material-ui/core';
import { createClient, Provider, useQuery } from 'urql';

const useStyles = makeStyles({
	clearBtn: {
		color: '#000'
	},
	metricTag: {
		borderRadius: '4px',
		margin: '3px',
		maxWidth: 'calc(100% - 6px)'
	}
});

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
	const styles = useStyles();

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
			classes={{
				clearIndicator: styles.clearBtn,
				tag: styles.metricTag
			}}
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
