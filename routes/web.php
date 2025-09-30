<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/tasks', [TaskController::class, 'index'])->name('task.index');
Route::post('/tasks/store', [TaskController::class, 'store'])->name('task.store');
Route::put('/tasks/{id}/toggle', [TaskController::class, 'toggle'])->name('task.toggle');
Route::delete('/tasks/{id}/destroy', [TaskController::class, 'destroy'])->name('task.destroy');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
