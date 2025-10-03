<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $user = auth()->user()->loadCount([
            'tasks',
        ]);

        return Inertia::render('task', [
            'user' => $user,
            'tasks' => $user->tasks,
            'tasksCount' => $user->tasks_count,
        ]);
    }

    public function store(Request $request)
    {
        $tasks = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string|max:800'
        ]);

        $tasks['user_id'] = auth()->id();

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

    public function destroy($id)
    {
        $task = Task::findOrfail($id);
        $task->delete();

        return redirect()->route('task.index')->with('success', 'Task deleted.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title' => 'required|string|max:50',
            'description' => 'required|string|max:800'
        ]);
        
        $task = Task::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        $task->update($data);

        return redirect()->route('task.index')->with('success', 'Task has been updated.');
    }
}
