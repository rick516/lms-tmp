import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const PurchasesSummaryChart = ({ data }) => {
  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="courseId" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="purchases" fill="#8884d8" />
    </BarChart>
  );
};