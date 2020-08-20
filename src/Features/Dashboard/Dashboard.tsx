import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core';

import MetricDropDown from '../../components/MetricDropDown';
import MeasurementChart from '../../components/MeasurementChart';
import LastKnownMeasurement from '../../components/LastKnownMeasurement';
import { Measurement, MeasurementItem } from '../../models';

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
		justifyContent: 'space-between',
		padding: '16px'
	},
	dropDownContainer: {
		flex: '1',
	},
	heartBeatDataContainer: {
		display: 'flex',
		flex: '1',
		flexWrap: 'wrap',
	}
});

const client = createClient({
	url: 'https://react.eogresources.com/graphql',
});

const heartBeatQuery = `
	query heartBeat {
		heartBeat
	}
`;

const query = `
	query($measurementQuery: [MeasurementQuery]) {
		getMultipleMeasurements(input: $measurementQuery) {
			metric,
			measurements {
				at,
				metric,
				value,
				unit
			}
		}
	}
`;

export default () => {
	return (
		<Provider value={client}>
			<Dashboard />
		</Provider>
	);
};

export const Dashboard = () => {
	const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
	const [heartBeat, setHeartBeat] = useState<number>(0);
	const [chartData, setChartData] = useState<Measurement[]>([]);
	const measurementQuery = useMemo(() => {
		return selectedMetrics.map((metricName) => ({
			metricName,
			after: heartBeat - 1800000
		}));
	}, [selectedMetrics, heartBeat]);
	const styles = useStyles();

	const [heartBeatResult] = useQuery({
    query: heartBeatQuery
  });

	const [result, executeQuery] = useQuery({
    query,
    variables: {
      measurementQuery,
		},
		pause: measurementQuery.length === 0
	});

	const { data } = result;

	const onMetricSelection = useCallback((metrics: string[]) => {
		setSelectedMetrics(metrics);

		if (metrics.length === 0) {
			setChartData([]);
		}
	}, [])

	useEffect(() => {
		if (heartBeatResult && heartBeatResult.data) {
			setHeartBeat(heartBeatResult.data.heartBeat)
		}
	}, [heartBeatResult]);

  useEffect(() => {
		if (!data) return;

		const { getMultipleMeasurements } = data;
		const newChartData: Measurement[][] = [];

		getMultipleMeasurements.forEach((item: MeasurementItem) => {
      return newChartData.push(item.measurements);
		});

		const mappedData = newChartData.flat().map(item => {
			item[item.metric] = item.value;
			return item;
		});

		setChartData(mappedData);

		const intervalId = setInterval(() => {
			executeQuery({ requestPolicy: 'network-only' });
		}, 1300);

		return () => clearInterval(intervalId);
	}, [data, executeQuery]);

	return (
		<section className={styles.container}>
			<div className={styles.infoContainer}>
				<div className={styles.heartBeatDataContainer}>
					{selectedMetrics.map(metric => (
						<LastKnownMeasurement
							key={metric}
							metricName={metric}
						/>
					))}
				</div>
				<div className={styles.dropDownContainer}>
					<MetricDropDown onMetricSelection={onMetricSelection} />
				</div>
			</div>
			<div>
				{chartData.length > 0 && (
					<MeasurementChart
						data={chartData}
						selectedMetrics={selectedMetrics}
					/>
				)}
			</div>
		</section>
	);
};
