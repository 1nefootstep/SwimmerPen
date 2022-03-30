import React from 'react';
import { Text, Box, Column } from 'native-base';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { shortenText } from '../../state/Util';

export interface GeneralLineChartProps {
  data: LineChartData;
  precision?: number;
  unit?: string;
  width?: number;
  chartName?: string;
}

export default function GeneralLineChart({
  data,
  precision,
  unit = '',
  width,
  chartName = '',
}: GeneralLineChartProps) {
  const screenWidth = width ?? Dimensions.get('window').width;
  const numXLabels = data.labels.length;
  const fontSize = numXLabels < 10 ? 10 : 6;
  const verticalLabelFontSize = unit.length < 4 ? 10 : 8;
  const numLegends = data.legend?.length ?? 1;
  const maxCharPerLegend = Math.ceil(screenWidth / numLegends / 40);
  const spacePerXLabel = screenWidth / numXLabels;
  const targetSpacePerXLabel = fontSize * 8;
  const skipXLabel = Math.max(
    Math.ceil(targetSpacePerXLabel / spacePerXLabel),
    1
  );
  const formattedData = {
    ...data,
    labels: data.labels.map((e, i) => (i % skipXLabel === 0 ? e : '')),
    legend:
      data.legend !== undefined
        ? data.legend.map(e => shortenText(e, maxCharPerLegend))
        : undefined,
  };
  console.log(`spacePerXLabel: ${spacePerXLabel} skipXLabel: ${skipXLabel}`);
  // const rotation = () => {
  //   if (numXLabels < 10) {
  //     return 0;
  //   }
  //   return 45;
  // };
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
    propsForVerticalLabels: { fontSize: fontSize },
    propsForHorizontalLabels: { fontSize: verticalLabelFontSize },
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
  };

  return (
    <Column space={1} alignItems="center">
      <Text bold>{chartName}</Text>
      <LineChart
        data={formattedData}
        width={screenWidth - 40}
        height={250}
        xLabelsOffset={-10}
        yAxisSuffix={` ${unit}`}
        yLabelsOffset={16}
        // verticalLabelRotation={rotation()}
        withVerticalLines={false}
        renderDotContent={({ x, y, index, indexData }) => {
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
              <Text fontSize={fontSize}>
                {indexData.toFixed(precision !== undefined ? precision : 1)}
              </Text>
            </Box>
          );
        }}
        chartConfig={chartConfig}
      />
    </Column>
  );
}
