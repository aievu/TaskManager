import { Button } from "@/components/ui/button";
import { CircleCheck, PlusCircle } from "lucide-react";
import { PageProps } from '@inertiajs/core';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { route } from 'ziggy-js';

type Task = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

type NewTask = {
    title: string
    description: string;
}

interface Props extends PageProps {
    tasks: Task[];
}

export default function Tasks({tasks}: Props) {

    const { data, setData, post, processing, errors, reset } = useForm<Required<NewTask>>({
        title: '',
        description: '',
    });

    const submitTask: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('task.store'), {
            onFinish: () => reset('title', 'description'),
        });
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-5 border rounded-lg p-3">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">My Tasks</h1>
                    <Dialog>
                        <DialogTrigger>
                            <Button>
                                <PlusCircle />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Writing Task</DialogTitle>
                                    <form onSubmit={submitTask} method="post" className="grid gap-2">
                                        <div className="grid gap-2">
                                            <div>
                                                <Label>Title</Label>
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    required
                                                    placeholder="Task Title"
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <Textarea
                                                    id="description"
                                                    required
                                                    value={data.description}
                                                    placeholder="Task Description"
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    disabled={processing}
                                                />
                                            </div>
                                        </div>
                                        <Button disabled={processing} type="submit">Write Task</Button>
                                    </form>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <div>
                    {tasks.length === 0 ? (
                        <p>You have no tasks yet.</p>
                    ) : (
                        <div className="flex flex-col gap-2 ">
                            {tasks.map((task) => (
                                <div key={task.id} className={`flex justify-between items-center gap-2 border rounded p-2 ${task.completed ? "scale-95" : ""}`}>
                                    <div>
                                        <p className={`font-bold ${task.completed ? "opacity-50" : "opacity-100"}`}>{task.title}</p>
                                        <p className={`max-w-xl ${task.completed ? "opacity-50" : "opacity-100"}`}>{task.description}</p>
                                    </div>
                                    <Button className={`max-w-xl ${task.completed ? "bg-emerald-100" : ""}`} variant="outline">
                                        <CircleCheck />
                                        {task.completed ? "Completed" : "Complete"}
                                    </Button>
                                </div>
                            ))} 
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
