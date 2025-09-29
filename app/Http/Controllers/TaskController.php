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
        $request->validate([
            'title' => 'required|string|max:50',
            'note' => 'required|string|max:800'
        ]);

        Task::create($request);

        return redirect()->route('task.index')->with('success', 'The task has been saved.');
    }
}
