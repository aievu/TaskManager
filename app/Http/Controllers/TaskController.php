<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::get();

        return Inertia::render('task', [
            'tasks' => $tasks,
        ]);
    }

    public function store(Request $request)
    {
        $tasks = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string|max:800'
        ]);

        Task::create($tasks);

        return redirect()->route('task.index')->with('success', 'The task has been saved.');
    }

    public function toggle($id)
    {
        $task = Task::findOrFail($id);
        $task->completed = !$task->completed;
        $task->save();

        return redirect()->route('task.index')->with('success', 'The task status has been updated.');
    }
}
