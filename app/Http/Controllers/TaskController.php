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
}
