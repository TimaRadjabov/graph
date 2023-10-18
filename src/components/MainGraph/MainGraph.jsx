import { Bar } from 'react-chartjs-2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const series = [
  {
    name: 'Series 1',
    data: [
      { category: 'A', value: Math.random() },
      { category: 'B', value: Math.random() },
      { category: 'C', value: Math.random() },
    ],
  },
  {
    name: 'Series 2',
    data: [
      { category: 'B', value: Math.random() },
      { category: 'C', value: Math.random() },
      { category: 'D', value: Math.random() },
    ],
  },
  {
    name: 'Series 3',
    data: [
      { category: 'C', value: Math.random() },
      { category: 'D', value: Math.random() },
      { category: 'E', value: Math.random() },
    ],
  },
];
const Graph = ({ dataKey, data, name }) => {
  return <Line dataKey={dataKey} data={data} name={name} />;
};

const MainGraph = () => {

  return (
    <LineChart width={500} height={300}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
      <YAxis dataKey="value" />
      <Tooltip />
      <Legend />
      {series.map((s) => (
        <Bar dataKey="value" data={s.data} name={s.name} key={s.name} />
      ))}
    </LineChart>
  );
};

export default MainGraph;
