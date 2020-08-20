import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Provider, createClient, useQuery } from 'urql';

import { Measurement } from '../models';

interface LastMeasurementProps {
  metricName: string;
}

const useStyles = makeStyles(() => ({
  root: {
    margin: '12px',
    padding: '12px',
  }
}));

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});


const query = `
query ($metricName: String!) {
  getLastKnownMeasurement(metricName: $metricName) {
    metric
    value
    unit
    at
  }
}
`;

export default (props: LastMeasurementProps) => {
  return (
    <Provider value={client}>
      <LastKnownMeasurement {...props} />
    </Provider>
  );
};

const LastKnownMeasurement = (props: LastMeasurementProps) => {
  const [measurement, setMeasurement] = React.useState<Measurement | null>(null);
  const classes = useStyles();

  const [result, executeQuery] = useQuery({
    query,
    variables: {
      metricName: props.metricName
    }
  });

  const { data } = result;

  useEffect(() => {
    if (!data) return;

    setMeasurement(data.getLastKnownMeasurement as Measurement);

    const intervalId = setInterval(() => {
      executeQuery({ requestPolicy: 'network-only' });
    }, 1300);

    return () => clearInterval(intervalId);
  }, [data, executeQuery]);

  return (
    <div>
      <Card className={classes.root}>
        <Typography variant="h6" >
          {props.metricName}
        </Typography>
        <Typography variant="h5">
          {measurement
            ? `${measurement.value} ${measurement.unit}`
            : null}
        </Typography>
      </Card>
    </div>
  );
};
