// import { Card, CardContent } from "../../components/ui/card";
// import { Switch } from "../../components/ui/switch";
// import JobStatus from "./jobStatus";
// import ReviewsAndFeedback from "./reviewsAndFeedback";
// import Earnings from "./earnings";

// function Dashboard() {
//   return (
//     <>
//       <section className='flex justify-between items-center mt-[2rem]'>
//         <div>
//           <h2 className='text-[2rem] font-semibold'>Hello Jane</h2>
//           <p>You have 2 new job requests!</p>
//         </div>
//         <div>
//           <Switch className='bg-amber-500' />
//           <p>Available</p>
//         </div>
//       </section>
//       <section className='grid grid-cols-2 md:grid-cols-4 gap-[1rem] mt-[2rem]'>
//         <Card className='bg-[#3BBF411A] flex flex-col gap-[6px]'>
//           <CardContent>
//             <p className='font-semibold'>Job Request</p>
//             <p className='text-[1.5rem] font-semibold'>
//               5 <span className='text-[1rem] font-normal'>25%</span>
//             </p>
//             <p>4 job request last week</p>
//           </CardContent>
//         </Card>
//         <Card className='bg-[#E48B001A] flex flex-col gap-[6px]'>
//           <CardContent>
//             <p className='font-semibold'>Pending Jobs</p>
//             <p className='text-[1.5rem] font-semibold'>
//               5 <span className='text-[1rem] font-normal'>25%</span>
//             </p>
//             <p>3 pending jobs last week</p>
//           </CardContent>
//         </Card>
//         <Card className='bg-[#504D841A] flex flex-col gap-[6px]'>
//           <CardContent>
//             <p className='font-semibold'>Active Jobs</p>
//             <p className='text-[1.5rem] font-semibold'>
//               5 <span className='text-[1rem] font-normal'>25%</span>
//             </p>
//             <p>3 active jobs last week</p>
//           </CardContent>
//         </Card>
//         <Card className='bg-[#F10B0E1A] flex flex-col gap-[6px]'>
//           <CardContent>
//             <p className='font-semibold'>Completed Jobs</p>
//             <p className='text-[1.5rem] font-semibold'>
//               5 <span className='text-[1rem] font-normal'>25%</span>
//             </p>
//             <p>4 completed jobs last week</p>
//           </CardContent>
//         </Card>
//       </section>

//       <Earnings />
//       <JobStatus />
//       <ReviewsAndFeedback />
//     </>
//   );
// }

// export default Dashboard;
import { useState } from "react";
import JobStatus from "./jobStatus";
import ReviewsAndFeedback from "./reviewsAndFeedback";
import Earnings from "./earnings";

function Dashboard() {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <>
      {/* Header and Availability Toggle */}
      <section className="flex justify-between items-center mt-[2rem]">
        <div>
          <h2 className="text-[2rem] font-semibold">Hello Jane</h2>
          <p>You have 2 new job requests!</p>
        </div>

        {/* Availability Toggle */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => setIsAvailable(!isAvailable)}
            className={`flex items-center cursor-pointer transition-colors duration-300 rounded-full`}
            style={{
              width: "60px",
              height: "30px",
              padding: "3px 4px",
              borderRadius: "100px",
              background: isAvailable ? "#1877F2" : "#9CA3AF",
              justifyContent: isAvailable ? "flex-end" : "flex-start",
            }}
          >
            <div className="bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300" />
          </div>
          <p className="mt-1 text-sm font-medium">
            {isAvailable ? "Available" : "Not Available"}
          </p>
        </div>
      </section>

      {/* Statistic Cards Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-[1rem] mt-[2rem]">
        {/* Job Request */}
        <div className="bg-[#3BBF411A] rounded-xl p-4 flex flex-col gap-[6px] shadow-sm">
          <p className="font-semibold">Job Request</p>
          <p className="text-[1.5rem] font-semibold">
            5 <span className="text-[1rem] font-normal">25%</span>
          </p>
          <p>4 job request last week</p>
        </div>

        {/* Pending Jobs */}
        <div className="bg-[#E48B001A] rounded-xl p-4 flex flex-col gap-[6px] shadow-sm">
          <p className="font-semibold">Pending Jobs</p>
          <p className="text-[1.5rem] font-semibold">
            5 <span className="text-[1rem] font-normal">25%</span>
          </p>
          <p>3 pending jobs last week</p>
        </div>

        {/* Active Jobs */}
        <div className="bg-[#504D841A] rounded-xl p-4 flex flex-col gap-[6px] shadow-sm">
          <p className="font-semibold">Active Jobs</p>
          <p className="text-[1.5rem] font-semibold">
            5 <span className="text-[1rem] font-normal">25%</span>
          </p>
          <p>3 active jobs last week</p>
        </div>

        {/* Completed Jobs */}
        <div className="bg-[#F10B0E1A] rounded-xl p-4 flex flex-col gap-[6px] shadow-sm">
          <p className="font-semibold">Completed Jobs</p>
          <p className="text-[1.5rem] font-semibold">
            5 <span className="text-[1rem] font-normal">25%</span>
          </p>
          <p>4 completed jobs last week</p>
        </div>
      </section>

      {/* Other Sections */}
      <Earnings />
      <JobStatus />
      <ReviewsAndFeedback />
    </>
  );
}

export default Dashboard;
