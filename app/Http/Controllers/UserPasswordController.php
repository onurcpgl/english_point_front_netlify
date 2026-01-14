<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Notifications\UserPasswordResetNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;

class UserPasswordController extends Controller
{
    public function requestResetPassword(Request $request)
    {
        App::setLocale('tr');

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first('email'),
            ], 200);
        }

        $user = User::where('email', $request->email)->first();



        $token = Str::uuid()->toString();

        UserPasswordReset::create([
            'user_id' => $user->id,
            'token' => $token,
            'used' => false,
        ]);

        $frontUrl = env('FRONT_URL', 'http://localhost:3000');
        $resetLink = $frontUrl . "/user-reset-password/{$token}";

        $user->notify(new UserPasswordResetNotification($user, $resetLink));

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset link has been sent to your email.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:6',
            'token' => 'required|string|min:6',
        ]);

        $reset = UserPasswordReset::where('token', $request->token)->first();

        if (!$reset || $reset->used) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or already used reset link.',
            ], 200);
        }

        $user = $reset->user;
        $user->password = Hash::make($request->password);
        $user->save();

        $reset->used = true;
        $reset->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password has been reset successfully.',
        ]);
    }

    public function checkResetPasswordStatus(Request $request)
    {
        $request->validate([
            'token' => 'required|string|min:6',
        ]);

        $result = UserPasswordReset::where('token', $request->token)->first();

        if (!$result || $result->used) {
            return response()->json([
                'status' => 'error',
                'message' => "This password reset link has already been used or has expired.",
            ], 200);
        }

        $dbTimezone = 'UTC';
        $appTz = config('app.timezone') ?? date_default_timezone_get();
        $createdAt = Carbon::createFromFormat('Y-m-d H:i:s', $result->created_at, $dbTimezone)
            ->setTimezone($appTz);

        $expiresAt = $createdAt->copy()->addMinutes(30);
        $now = Carbon::now($appTz);

        if ($now->greaterThan($expiresAt)) {
            return response()->json([
                'status' => 'error',
                'message' => "This password reset link has already been used or has expired.",
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Token is valid.",
        ]);
    }
}