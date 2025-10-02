import { Button } from "@/components/ui/button";
import { BookCheck, CircleCheck, CircleUser, Edit3Icon, LogOut, PlusCircle, TrashIcon } from "lucide-react";
import { PageProps } from '@inertiajs/core';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormEventHandler, useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import InputError from "@/components/input-error";
import { logout } from '@/routes';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';


type Task = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
}

type HandleTasks = {
    title: string
    description: string;
    editTitle: string;
    editDescription: string;
}

interface Props extends PageProps {
    tasks: Task[];
    tasksCount: number;
    user: {
        name: string;
    }
}

export default function Tasks({user, tasks, tasksCount}: Props) {

    const { data, setData, post, processing, errors, reset } = useForm<Required<HandleTasks>>({
        title: '',
        description: '',
        editTitle: '',
        editDescription: '',
    });

    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

    const [taskEditing, setTaskEditing] = useState<Task | null>(null);

    const submitTask: FormEventHandler = (e) => {
        e.preventDefault();
        post('/tasks/store', {
            onSuccess: (page) => {
                reset();
                setLocalTasks(page.props.tasks as Task[]);
            },
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
                setLocalTasks(page.props.tasks as Task[]);
            },
        });
    };

    const editTask: FormEventHandler = (e) => {
        e.preventDefault();
        if (!taskEditing) return;

        router.put(`/tasks/${taskEditing.id}/update`, {
            title: data.editTitle,
            description: data.editDescription,
        }, {
            onSuccess: (page) => {
                reset();
                setLocalTasks(page.props.tasks as Task[]);
                setTaskEditing(null);
            },
        });
    };

    const cleanup = useMobileNavigation();
    
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
                    <CircleUser className="w-10 h-10" />
                    {user.name}
                </h1>
                <Button variant="outline">
                    <Link
                        className="flex items-center"
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        data-test="logout-button"
                    >
                        <LogOut className="mr-2" />
                        Log out
                    </Link>
                </Button>
            </div>
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
                                    <DialogDescription>
                                        <form onSubmit={submitTask} method="POST" className="grid gap-2">
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
                                                    <InputError message={errors.title} />
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
                                                    <InputError message={errors.description} />
                                                </div>
                                            </div>
                                            <Button disabled={processing} type="submit">Write Task</Button>
                                        </form>
                                    </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex">
                    <p className="flex gap-2 rounded p-1"><BookCheck /> Amount: {tasksCount}</p>
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
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button className="w-6 h-6 bg-red-400">
                                                        <TrashIcon />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Deleting Task</DialogTitle>
                                                        <DialogDescription>
                                                            <div className="grid gap-2">
                                                                <p>Are you sure? This action in not reversible.</p>
                                                                <Button disabled={processing} onClick={() => deleteTask(task.id)} variant="destructive">Delete Task</Button>
                                                            </div>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button className="w-6 h-6" onClick={() => {
                                                        setTaskEditing(task);
                                                        setData("editTitle", task.title);
                                                        setData("editDescription", task.description);
                                                    }}>
                                                        <Edit3Icon />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Editing Task</DialogTitle>
                                                            <DialogDescription>
                                                                <form onSubmit={editTask} method="POST" className="grid gap-2">
                                                                    <div className="grid gap-2">
                                                                        <div>
                                                                            <Label>Title</Label>
                                                                            <Input
                                                                                id="editTitle"
                                                                                type="text"
                                                                                required
                                                                                placeholder="Task Title"
                                                                                value={data.editTitle}
                                                                                onChange={(e) => setData('editTitle', e.target.value)}
                                                                                disabled={processing}
                                                                            />
                                                                            <InputError message={errors.editTitle} />
                                                                        </div>
                                                                        <div>
                                                                            <Label>Description</Label>
                                                                            <Textarea
                                                                                id="editDescription"
                                                                                required
                                                                                value={data.editDescription}
                                                                                placeholder="Task Description"
                                                                                onChange={(e) => setData('editDescription', e.target.value)}
                                                                                disabled={processing}
                                                                            />
                                                                            <InputError message={errors.editDescription} />
                                                                        </div>
                                                                    </div>
                                                                    <DialogClose className="grid">
                                                                        <Button disabled={processing} type="submit">Edit Task</Button>
                                                                    </DialogClose>

                                                                </form>
                                                            </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div>
                                            <p className={`font-bold ${task.completed ? "opacity-50" : "opacity-100"}`}>{task.title}</p>
                                            <p className={`max-w-xl ${task.completed ? "opacity-50" : "opacity-100"}`}>{task.description}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => toggleTask(task.id)} className={`max-w-xl ${task.completed ? "bg-emerald-200" : ""}`} variant="outline">
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
