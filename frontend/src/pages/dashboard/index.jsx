import { Card, CardContent } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import JobStatus from "./jobStatus";
import ReviewsAndFeedback from "./reviewsAndFeedback";
import Earnings from "./earnings";

function Dashboard() {
  return (
    <>
      <section className='flex justify-between items-center mt-[2rem]'>
        <div>
          <h2 className='text-[2rem] font-semibold'>Hello Jane</h2>
          <p>You have 2 new job requests!</p>
        </div>
        <div>
          <Switch className='bg-amber-500' />
          <p>Available</p>
        </div>
      </section>
      <section className='grid grid-cols-2 md:grid-cols-4 gap-[1rem] mt-[2rem]'>
        <Card className='bg-[#3BBF411A] flex flex-col gap-[6px]'>
          <CardContent>
            <p className='font-semibold'>Job Request</p>
            <p className='text-[1.5rem] font-semibold'>
              5 <span className='text-[1rem] font-normal'>25%</span>
            </p>
            <p>4 job request last week</p>
          </CardContent>
        </Card>
        <Card className='bg-[#E48B001A] flex flex-col gap-[6px]'>
          <CardContent>
            <p className='font-semibold'>Pending Jobs</p>
            <p className='text-[1.5rem] font-semibold'>
              5 <span className='text-[1rem] font-normal'>25%</span>
            </p>
            <p>3 pending jobs last week</p>
          </CardContent>
        </Card>
        <Card className='bg-[#504D841A] flex flex-col gap-[6px]'>
          <CardContent>
            <p className='font-semibold'>Active Jobs</p>
            <p className='text-[1.5rem] font-semibold'>
              5 <span className='text-[1rem] font-normal'>25%</span>
            </p>
            <p>3 active jobs last week</p>
          </CardContent>
        </Card>
        <Card className='bg-[#F10B0E1A] flex flex-col gap-[6px]'>
          <CardContent>
            <p className='font-semibold'>Completed Jobs</p>
            <p className='text-[1.5rem] font-semibold'>
              5 <span className='text-[1rem] font-normal'>25%</span>
            </p>
            <p>4 completed jobs last week</p>
          </CardContent>
        </Card>
      </section>

      <Earnings />
      <JobStatus />
      <ReviewsAndFeedback />
    </>
  );
}

export default Dashboard;
