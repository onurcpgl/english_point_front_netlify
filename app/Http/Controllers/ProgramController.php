<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;
use Illuminate\Support\Facades\App;

class ProgramController extends Controller
{
    public function index(Request $request)
    {

        // 3. Verileri çek
        $programs = Program::where('is_active', true)->get();

        return response()->json([
            'status' => true,
            'data' => $programs
        ]);
    }
}