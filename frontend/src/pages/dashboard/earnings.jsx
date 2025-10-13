// import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
// import { Card, CardContent } from "../../components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "../../components/ui/chart";

// const chartData = [
//   { day: "Monday", price: 5000 },
//   { day: "Tuesday", price: 45000 },
//   { day: "Wednesday", price: 52000 },
//   { day: "Thursday", price: 51000 },
//   { day: "Friday", price: 50000 },
//   { day: "Saturday", price: 72000 },
//   { day: "Sunday", price: 50000 },
// ];

// const chartConfig = {
//   price: {
//     label: "Price",
//     color: "#2563eb",
//   },
// };

// function Earnings() {
//   return (
//     <section className='mt-[2rem]'>
//       <h3 className='font-semibold'>Earning Summary</h3>
//       <div className='grid grid-cols-1 md:grid-cols-[0.5fr_1fr] gap-[1rem]'>
//         <Card className='bg-[#f5f5f5] flex flex-col justify-center'>
//           <CardContent className='bg-[#E6E6ED] '>
//             <p className=' text-[1.5rem]'>
//               72,000 <span className='text-[1rem]'>Earnings this week</span>
//             </p>
//           </CardContent>
//           <CardContent className='bg-[#E6E6ED]'>
//             <p className=' text-[1.5rem]'>
//               245,000 <span className=' text-[1rem]'>Total earnings</span>
//             </p>
//           </CardContent>
//           <CardContent className='bg-[#E6E6ED]'>
//             <p className=' text-[1.5rem]'>
//               240,000 <span className=' text-[1rem]'>Withdrawable</span>
//             </p>
//           </CardContent>
//         </Card>

//         <div className='bg-[#f5f5f5] rounded-2xl'>
//           <ChartContainer config={chartConfig} className='w-[80%] mx-auto px-4'>
//             <LineChart data={chartData}>
//               <CartesianGrid />
//               <XAxis
//                 dataKey='day'
//                 tickFormatter={(value) => value.slice(0, 3)}
//                 interval={0}
//               />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Line dataKey='price' />
//             </LineChart>
//           </ChartContainer>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Earnings;
import { LineChart, Line, XAxis, CartesianGrid, Tooltip } from "recharts";

const chartData = [
  { day: "Monday", price: 5000 },
  { day: "Tuesday", price: 45000 },
  { day: "Wednesday", price: 52000 },
  { day: "Thursday", price: 51000 },
  { day: "Friday", price: 50000 },
  { day: "Saturday", price: 72000 },
  { day: "Sunday", price: 50000 },
];

function Earnings() {
  return (
    <section className="mt-8">
      <h3 className="font-semibold text-lg mb-4">Earning Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1fr] gap-4">
        {/* Earnings Summary */}
        <div className="bg-gray-100 rounded-2xl p-4 flex flex-col justify-center">
          <div className="bg-gray-200 rounded-xl p-4 mb-2">
            <p className="text-2xl font-semibold">
              ₦72,000{" "}
              <span className="text-base font-normal text-gray-700">
                Earnings this week
              </span>
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl p-4 mb-2">
            <p className="text-2xl font-semibold">
              ₦245,000{" "}
              <span className="text-base font-normal text-gray-700">
                Total earnings
              </span>
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl p-4">
            <p className="text-2xl font-semibold">
              ₦240,000{" "}
              <span className="text-base font-normal text-gray-700">
                Withdrawable
              </span>
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-100 rounded-2xl p-4 flex justify-center">
          <LineChart
            width={500}
            height={250}
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickFormatter={(value) => value.slice(0, 3)}
              interval={0}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </div>
      </div>
    </section>
  );
}

export default Earnings;
