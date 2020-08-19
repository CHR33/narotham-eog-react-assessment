import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Provider, createClient, useQuery } from 'urql';

import { MetricDropDown } from '../../components/MetricDropDown';
import { IState } from '../../store';
import { actions } from './reducer';

const useStyles = makeStyles({
	container: {
		backgroundColor: '#fff',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		padding: '24px'
	},
	infoContainer: {
		display: 'flex',
		height: '70px',
		justifyContent: 'flex-end',
		padding: '16px'
	},
	dropDownContainer: {
		width: '350px',
	}
});

const client = createClient({
	url: 'https://react.eogresources.com/graphql',
});

const query = `
	query($selectedMetric: String!) {
		getMeasurements(input: {
			metricName: $selectedMetric,
			before: ${new Date().getTime()},
			after: ${new Date().getTime() - 2700000}
		}) {
			metric,
			at,
			value,
			unit
		}
	}
`;

const getData = (state: IState) => {
	console.log(state.metric);
};

export default () => {
	return (
		<Provider value={client}>
			<Dashboard />
		</Provider>
	);
};

export const Dashboard = () => {
	const styles = useStyles();
	const [selectedMetric, setSelectedMetric] = useState('');
	const [result] = useQuery({
    query,
    variables: {
      selectedMetric,
		},
		pause: !selectedMetric
	});
	const dispatch = useDispatch();

	const { fetching, data, error } = result;

	const handleMetricSelection = useCallback((metrics: string[]) => {
		setSelectedMetric(metrics[0]);
		console.log('metrics:', metrics.join(','));
	}, []);

  useEffect(() => {
		if (!data) return;
		
		console.log('data', data);

		const { getMeasurements } = data;

    dispatch(actions.metricDataRecevied(getMeasurements));
  }, [dispatch, data, error]);

  if (fetching) return <div>Loading</div>;

	return (
		<section className={styles.container}>
			<div className={styles.infoContainer}>
				<div className={styles.dropDownContainer}>
					<MetricDropDown onMetricSelection={handleMetricSelection} />
				</div>
			</div>
		</section>
	);
};
