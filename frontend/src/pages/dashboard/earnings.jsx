import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent } from "../../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";

const chartData = [
  { day: "Monday", price: 5000 },
  { day: "Tuesday", price: 45000 },
  { day: "Wednesday", price: 52000 },
  { day: "Thursday", price: 51000 },
  { day: "Friday", price: 50000 },
  { day: "Saturday", price: 72000 },
  { day: "Sunday", price: 50000 },
];

const chartConfig = {
  price: {
    label: "Price",
    color: "#2563eb",
  },
};

function Earnings() {
  return (
    <section className='mt-[2rem]'>
      <h3 className='font-semibold'>Earning Summary</h3>
      <div className='grid grid-cols-1 md:grid-cols-[0.5fr_1fr] gap-[1rem]'>
        <Card className='bg-[#f5f5f5] flex flex-col justify-center'>
          <CardContent className='bg-[#E6E6ED] '>
            <p className=' text-[1.5rem]'>
              72,000 <span className='text-[1rem]'>Earnings this week</span>
            </p>
          </CardContent>
          <CardContent className='bg-[#E6E6ED]'>
            <p className=' text-[1.5rem]'>
              245,000 <span className=' text-[1rem]'>Total earnings</span>
            </p>
          </CardContent>
          <CardContent className='bg-[#E6E6ED]'>
            <p className=' text-[1.5rem]'>
              240,000 <span className=' text-[1rem]'>Withdrawable</span>
            </p>
          </CardContent>
        </Card>

        <div className='bg-[#f5f5f5] rounded-2xl'>
          <ChartContainer config={chartConfig} className='w-[80%] mx-auto px-4'>
            <LineChart data={chartData}>
              <CartesianGrid />
              <XAxis
                dataKey='day'
                tickFormatter={(value) => value.slice(0, 3)}
                interval={0}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey='price' />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </section>
  );
}

export default Earnings;
