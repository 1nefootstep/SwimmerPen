import React from 'react';
import { Text, Box } from 'native-base';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';

export interface GeneralLineChartProps {
  data: LineChartData;
  precision?: number;
  unit?: string;
}

export default function GeneralLineChart({
  data,
  precision,
  unit,
}: GeneralLineChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const numXLabels = data.labels.length;

  const fontSize = () => {
    if (numXLabels < 10) {
      return 10;
    }
    return 6;
  };
  const verticalLabelFontSize = () => {
    if (unit !== undefined) {
      if (unit.length < 4) {
        return 10;
      }
      return 8;
    }
    return 10;
  };
  const rotation = () => {
    if (numXLabels < 10) {
      return 0;
    }
    return 45;
  };
  const yLabelOffset = () => {
    if (numXLabels < 10) {
      return 0;
    }
    return 10;
  };
  const chartConfig: AbstractChartConfig = {
    backgroundColor: '#1cc910',
    backgroundGradientFromOpacity: 0,
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    fillShadowGradientFromOpacity: 0,
    fillShadowGradientToOpacity: 0,
    color: (opacity = 1) => `#023047`,
    labelColor: (opacity = 1) => `#333`,
    propsForVerticalLabels: { fontSize: fontSize() },
    propsForHorizontalLabels: { fontSize: verticalLabelFontSize() },
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
  };

  return (
    <LineChart
      data={data}
      width={screenWidth - 40}
      height={250}
      xLabelsOffset={-10}
      yAxisSuffix={unit !== undefined ? ` ${unit}` : ''}
      yLabelsOffset={16}
      verticalLabelRotation={rotation()}
      withVerticalLines={false}
      renderDotContent={({ x, y, index, indexData }) => {
        console.log(`index: ${index}: ${indexData.toFixed(1)}`);
        return (
          <Box
            key={`${x},${y}`}
            px={2}
            borderRadius={8}
            style={{
              position: 'absolute',
              top: y + 12 + yLabelOffset(),
              left: x - 15,
            }}
            bg="purple.50"
          >
            <Text fontSize={fontSize()}>
              {indexData.toFixed(precision !== undefined ? precision : 1)}
            </Text>
          </Box>
        );
      }}
      chartConfig={chartConfig}
    />
  );
}
