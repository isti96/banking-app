import React from "react";
import { Chart } from "react-charts";

function MyChart() {
  const data = [
    {
      label: "React Charts",
      data: [
        {
          date: new Date(),
          stars: 23467238,
        },
      ],
    },
  ];

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.stars,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
}

export default MyChart;
