<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StartQuestion;

class CategoryController extends Controller
{
    public function getSessionCategories()
    {

        $categories = StartQuestion::all();

        return $categories;

    }
}