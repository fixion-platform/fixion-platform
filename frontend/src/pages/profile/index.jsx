import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().max(11),
  email: z.string(),
  location: z.string(),
  dateOfBirth: z.string(),
});
function Profile() {
  const form = useForm({ resolver: zodResolver(formSchema) });

  function onSubmit(values) {
    console.log(values);
  }
  return (
    <>
      <section>
        <h2>Account Information</h2>
        <div className='flex items-center mb-[2.875rem] gap-[1.875rem]'>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>JN</AvatarFallback>
          </Avatar>
          <div>
            <p>Jane Moon</p>
            <p>icon here</p>
          </div>
        </div>
      </section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid grid-cols-1 md:grid-cols-2 gap-10 '
        >
          <FormField
            control={form.control}
            name='FirstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-[#1E1A62]")}>
                  First Name
                </FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='LastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-[#1E1A62]")}>Doe</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-[#1E1A62]")}>
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-[#1E1A62]")}>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='johndoe@gmail.com'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-[#1E1A62]")}>Location</FormLabel>
                <FormControl>
                  <Input placeholder='Nigeria' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dateOfBirth'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-[#1E1A62]")}>
                  Date of Birth
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='Bio'
            render={({ field }) => (
              <FormItem className={cn("col-span-full")}>
                <FormLabel className={cn("text-[#1E1A62]")}>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

export default Profile;
