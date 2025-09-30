import { Button } from "@/components/ui/button";
import { CircleCheck, Edit3Icon, PlusCircle, TrashIcon } from "lucide-react";
import { PageProps } from '@inertiajs/core';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormEventHandler, useState } from "react";
import { router, useForm } from "@inertiajs/react";

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

    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

    const submitTask: FormEventHandler = (e) => {
        e.preventDefault();
        post('/tasks/store', {
            onFinish: () => reset(),
        });
    };

    const toggleTask = (id: number) => {
        setLocalTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );

        router.put(`/tasks/${id}/toggle`, {
            preserveState: true,
        });
    };

    const deleteTask = (id: number) => {
        router.delete(`/tasks/${id}/destroy`, {
            onSuccess: (page) => {
                setLocalTasks(page.props.tasks);
            },
        });
    };

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
                                                    value={data.title}
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
                            {localTasks.map((task) => (
                                <div key={task.id} className={`flex justify-between items-center gap-2 border rounded p-2 ${task.completed ? "scale-95" : ""}`}>
                                    <div className="flex gap-5 items-center">
                                        <div className="flex flex-col gap-1">
                                            <Button onClick={() => deleteTask(task.id)} className="w-6 h-6 bg-red-400">
                                                <TrashIcon />
                                            </Button>
                                            <Button className="w-6 h-6">
                                                <Edit3Icon />
                                            </Button>
                                        </div>
                                        <div>
                                            <p className={`font-bold ${task.completed ? "opacity-50" : "opacity-100"}`}>{task.title}</p>
                                            <p className={`max-w-xl ${task.completed ? "opacity-50" : "opacity-100"}`}>{task.description}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => toggleTask(task.id)} className={`max-w-xl ${task.completed ? "bg-emerald-100" : ""}`} variant="outline">
                                        <CircleCheck />
                                        {task.completed ? "" : "Complete"}
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
