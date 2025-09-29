import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PageProps } from '@inertiajs/core';

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

interface Props extends PageProps {
    tasks: Task[];
}

export default function Tasks({tasks}: Props) {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-5 border rounded-lg p-3">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">My Tasks</h1>
                    <Button>
                        <PlusCircle />
                        New Task
                    </Button>
                </div>
                <div>
                    {tasks.length === 0 ? (
                        <p>You have no tasks yet.</p>
                    ) : (
                        <div className="flex flex-col gap-2 ">
                            {tasks.map((task) => (
                                <div key={task.id} className="border rounded p-2">
                                    <p className="font-bold">{task.title}</p>
                                    <p>{task.description}</p>
                                </div>
                            ))} 
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
