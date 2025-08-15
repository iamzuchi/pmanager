import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { taskStatusVariant } from '@/utils';
import { TaskStatus } from '@prisma/client';


interface Task {
  id: string;
  status: TaskStatus;
  // other fields...
}

interface TasksByStatusCardProps {
  tasks: Task[];
}

const TasksByStatusCard: React.FC<TasksByStatusCardProps> = ({ tasks }) => {
  const statuses = Object.values(TaskStatus);

  const data = statuses.map(status => ({
    status,
    count: tasks.filter(task => task.status === status).length
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={taskStatusVariant[entry.status] || taskStatusVariant.default}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TasksByStatusCard;
