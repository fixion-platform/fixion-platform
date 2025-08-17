import { Avatar } from "@radix-ui/react-avatar";
import FiveStar from "../../assets/five-star.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import Ratings from "../../components/ui/ratings";
import { Star } from "lucide-react";
import { Progress } from "../../components/ui/progress";
function ReviewsAndFeedback() {
  return (
    <section className='mt-[2rem]'>
      <h3 className='font-semibold'>Reviews and Feedback</h3>
      <div className='bg-[#F5F5F5] grid grid-cols-1 md:grid-cols-[0.4fr_1fr] p-4 gap-3 rounded-xl'>
        <div className='flex flex-col gap-[1rem] '>
          {/* 1ST GRID */}
          <div className='flex flex-col items-center mt-10'>
            <p className='text-[2rem] font-semibold'>4.2</p>
            <img src={FiveStar} alt='Ratings' />
            <p>Based on 31 ratings</p>
          </div>
          <div className='flex flex-col gap-[8px]'>
            <Ratings>
              <p>5</p>
              <Star color='#FFC107' fill='#FFC107' />
              <Progress value={11} />
              <p>11</p>
            </Ratings>
            <Ratings>
              <p>4</p>
              <Star color='#FFC107' fill='#FFC107' />
              <Progress value={15} />
              <p>15</p>
            </Ratings>
            <Ratings>
              <p>3</p>
              <Star color='#FFC107' fill='#FFC107' />
              <Progress value={4} />
              <p>4</p>
            </Ratings>
            <Ratings>
              <p>2</p>
              <Star color='#FFC107' fill='#FFC107' />
              <Progress value={1} />
              <p>2</p>
            </Ratings>
            <Ratings>
              <p>1</p>
              <Star color='#FFC107' fill='#FFC107' />
              <Progress value={0} />
              <p>0</p>
            </Ratings>
          </div>
        </div>
        {/* 2ND GRID */}
        <div className='flex flex-col gap-[1rem]'>
          <Card className=' shadow-none'>
            <CardHeader className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback className=' bg-[#1E1A62]  text-[#CB7200] '>
                  SO
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Susan Okpom</CardTitle>
                <CardDescription>June 15,2025</CardDescription>
              </div>
            </CardHeader>
            <CardContent className='mt-0'>
              <p>
                Quick, professional, and very respectful. She even cleaned up
                after the job. Highly recommended!
              </p>
            </CardContent>
          </Card>
          <Card className=' shadow-none'>
            <CardHeader className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback className=' bg-[#1E1A62] text-[#CB7200]'>
                  AL
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Ajibo Lanre</CardTitle>
                <CardDescription>June 15,2025</CardDescription>
              </div>
            </CardHeader>
            <CardContent className='mt-0'>
              <p>
                Second time booking her, same excellent service. Keeps to time
                and knows her craft.
              </p>
            </CardContent>
          </Card>
          <Card className=' shadow-none'>
            <CardHeader className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback className='text-[#CB7200] bg-[#1E1A62] '>
                  CO
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Susan Okpom</CardTitle>
                <CardDescription>June 15,2025</CardDescription>
              </div>
            </CardHeader>
            <CardContent className='mt-0'>
              <p>
                Work quality was great, but there was a slight delay in arrival.
                Still very satisfied overall.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ReviewsAndFeedback;
