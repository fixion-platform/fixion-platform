import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

function JobStatus() {
  return (
    <section className='mt-[2rem]'>
      <h3 className='font-semibold'>Job Status Overview</h3>
      <div className='bg-[#f5f5f5] p-4 rounded-2xl'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead>Job Title</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className='  bg-white'>
              <TableCell className=''>Fix Kitchen faucet</TableCell>
              <TableCell>Mr Williams</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>July 3,2025</TableCell>
              <TableCell className='flex gap-[4px] hover:bg-transparent'>
                <Button className='bg-[#fff] rounded-full shadow-none text-[#4D4D4D] flex-1 border border-[#050150]'>
                  Cancel
                </Button>
                <Button className='bg-[#050150] rounded-full text-[#fff] flex-1'>
                  Start
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className='bg-white '>
              <TableCell>Repair AC unit</TableCell>
              <TableCell>Miss Peggy</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>July 3,2025</TableCell>
              <TableCell className='flex gap-[4px] hover:bg-transparent'>
                <Button className='bg-[#fff] rounded-full shadow-none text-[#4D4D4D] flex-1 border border-[#050150]'>
                  View
                </Button>
                <Button className='bg-[#050150] rounded-full text-[#fff] flex-1'>
                  Complete
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className='bg-white '>
              <TableCell>Paint living room</TableCell>
              <TableCell>Miss Lisa</TableCell>
              <TableCell>Request</TableCell>
              <TableCell>July 3,2025</TableCell>
              <TableCell className='flex gap-[4px] hover:bg-transparent'>
                <Button className='bg-[#fff] rounded-full shadow-none text-[#4D4D4D] flex-1 border border-[#050150]'>
                  Reject
                </Button>
                <Button className='bg-[#050150] rounded-full text-[#fff] flex-1'>
                  Accept
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className='bg-white '>
              <TableCell>Install lighting fixture</TableCell>
              <TableCell>Mrs Bella</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>July 3,2025</TableCell>
              <TableCell>
                <Button className='bg-[#050150] rounded-full w-[100%]'>
                  Accept
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p className='text-right text-[#FEA500]'>Browse full list</p>
      </div>
    </section>
  );
}

export default JobStatus;
