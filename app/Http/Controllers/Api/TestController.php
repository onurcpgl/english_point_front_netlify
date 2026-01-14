<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="English Point API",
 *      description="Laravel 12 API with Swagger Documentation",
 *      @OA\Contact(
 *          email="onur@example.com"
 *      ),
 * )
 */
class TestController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/test",
     *     summary="Test API endpoint",
     *     tags={"Test"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="API çalışıyor!")
     *         )
     *     )
     * )
     */
    public function index()
    {
        return response()->json(['message' => 'API çalışıyor!']);
    }
}