// import { Button } from "../../components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";

// function JobStatus() {
//   return (
//     <section className='mt-[2rem]'>
//       <h3 className='font-semibold'>Job Status Overview</h3>
//       <div className='bg-[#f5f5f5] p-4 rounded-2xl'>
//         <Table>
//           <TableHeader>
//             <TableRow className='hover:bg-transparent'>
//               <TableHead>Job Title</TableHead>
//               <TableHead>Client Name</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Due Date</TableHead>
//               <TableHead>Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             <TableRow className='  bg-white'>
//               <TableCell className=''>Fix Kitchen faucet</TableCell>
//               <TableCell>Mr Williams</TableCell>
//               <TableCell>Pending</TableCell>
//               <TableCell>July 3,2025</TableCell>
//               <TableCell className='flex gap-[4px] hover:bg-transparent'>
//                 <Button className='bg-[#fff] rounded-full shadow-none text-[#4D4D4D] flex-1 border border-[#050150]'>
//                   Cancel
//                 </Button>
//                 <Button className='bg-[#050150] rounded-full text-[#fff] flex-1'>
//                   Start
//                 </Button>
//               </TableCell>
//             </TableRow>
//             <TableRow className='bg-white '>
//               <TableCell>Repair AC unit</TableCell>
//               <TableCell>Miss Peggy</TableCell>
//               <TableCell>Active</TableCell>
//               <TableCell>July 3,2025</TableCell>
//               <TableCell className='flex gap-[4px] hover:bg-transparent'>
//                 <Button className='bg-[#fff] rounded-full shadow-none text-[#4D4D4D] flex-1 border border-[#050150]'>
//                   View
//                 </Button>
//                 <Button className='bg-[#050150] rounded-full text-[#fff] flex-1'>
//                   Complete
//                 </Button>
//               </TableCell>
//             </TableRow>
//             <TableRow className='bg-white '>
//               <TableCell>Paint living room</TableCell>
//               <TableCell>Miss Lisa</TableCell>
//               <TableCell>Request</TableCell>
//               <TableCell>July 3,2025</TableCell>
//               <TableCell className='flex gap-[4px] hover:bg-transparent'>
//                 <Button className='bg-[#fff] rounded-full shadow-none text-[#4D4D4D] flex-1 border border-[#050150]'>
//                   Reject
//                 </Button>
//                 <Button className='bg-[#050150] rounded-full text-[#fff] flex-1'>
//                   Accept
//                 </Button>
//               </TableCell>
//             </TableRow>
//             <TableRow className='bg-white '>
//               <TableCell>Install lighting fixture</TableCell>
//               <TableCell>Mrs Bella</TableCell>
//               <TableCell>Completed</TableCell>
//               <TableCell>July 3,2025</TableCell>
//               <TableCell>
//                 <Button className='bg-[#050150] rounded-full w-[100%]'>
//                   Accept
//                 </Button>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//         <p className='text-right text-[#FEA500]'>Browse full list</p>
//       </div>
//     </section>
//   );
// }

// export default JobStatus;
function JobStatus() {
  return (
    <section className="mt-8">
      <h3 className="font-semibold mb-4">Job Status Overview</h3>

      <div className="bg-[#f5f5f5] p-4 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 font-semibold">Job Title</th>
              <th className="p-3 font-semibold">Client Name</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Due Date</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Row 1 */}
            <tr className="bg-white hover:bg-gray-50 transition">
              <td className="p-3">Fix Kitchen Faucet</td>
              <td className="p-3">Mr Williams</td>
              <td className="p-3 text-[#FEA500] font-medium">Pending</td>
              <td className="p-3">July 3, 2025</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button className="border border-[#050150] text-[#4D4D4D] bg-white rounded-full px-3 py-1 text-sm hover:bg-gray-100 transition flex-1">
                    Cancel
                  </button>
                  <button className="bg-[#050150] text-white rounded-full px-3 py-1 text-sm hover:bg-[#0b0b5f] transition flex-1">
                    Start
                  </button>
                </div>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="bg-white hover:bg-gray-50 transition">
              <td className="p-3">Repair AC Unit</td>
              <td className="p-3">Miss Peggy</td>
              <td className="p-3 text-green-600 font-medium">Active</td>
              <td className="p-3">July 3, 2025</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button className="border border-[#050150] text-[#4D4D4D] bg-white rounded-full px-3 py-1 text-sm hover:bg-gray-100 transition flex-1">
                    View
                  </button>
                  <button className="bg-[#050150] text-white rounded-full px-3 py-1 text-sm hover:bg-[#0b0b5f] transition flex-1">
                    Complete
                  </button>
                </div>
              </td>
            </tr>

            {/* Row 3 */}
            <tr className="bg-white hover:bg-gray-50 transition">
              <td className="p-3">Paint Living Room</td>
              <td className="p-3">Miss Lisa</td>
              <td className="p-3 text-blue-600 font-medium">Request</td>
              <td className="p-3">July 3, 2025</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button className="border border-[#050150] text-[#4D4D4D] bg-white rounded-full px-3 py-1 text-sm hover:bg-gray-100 transition flex-1">
                    Reject
                  </button>
                  <button className="bg-[#050150] text-white rounded-full px-3 py-1 text-sm hover:bg-[#0b0b5f] transition flex-1">
                    Accept
                  </button>
                </div>
              </td>
            </tr>

            {/* Row 4 */}
            <tr className="bg-white hover:bg-gray-50 transition">
              <td className="p-3">Install Lighting Fixture</td>
              <td className="p-3">Mrs Bella</td>
              <td className="p-3 text-gray-500 font-medium">Completed</td>
              <td className="p-3">July 3, 2025</td>
              <td className="p-3">
                <button className="bg-[#050150] text-white rounded-full px-3 py-1 text-sm hover:bg-[#0b0b5f] transition w-full">
                  Accept
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p className="text-right text-[#FEA500] mt-3 font-medium cursor-pointer hover:underline">
          Browse full list
        </p>
      </div>
    </section>
  );
}

export default JobStatus;
