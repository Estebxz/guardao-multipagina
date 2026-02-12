import { auth } from "@clerk/nextjs/server";
import AddTaskForm from "@common/add-form";

export default async function Home() {
  await auth.protect();
  
  return (
    <div className="flex h-full flex-col bg-background text-foreground">
        <div className="py-4 sm:p-10 sm:max-w-180 max-w-full"> 
          <AddTaskForm />
        </div>
    </div>
  );
}
