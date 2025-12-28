import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface DeviceBreakdownProps {
  data: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  const chartData = [
    { name: 'Mobile', value: data.mobile },
    { name: 'Desktop', value: data.desktop },
    { name: 'Tablet', value: data.tablet },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent = 0 }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
