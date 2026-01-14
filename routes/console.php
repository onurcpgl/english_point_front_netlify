<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// 1. Hatırlatmalar (5 dk)
Schedule::command('session:send-reminders')
    ->everyFiveMinutes()
    ->runInBackground();

// 2. Boş Dersleri İptal Et (10 dk - Öğrencisi Olmayanlar)
Schedule::command('session:auto-cancel')
    ->everyTenMinutes()
    ->runInBackground();

// 3. YENİ: Unutulmuş Dersleri Kapat (Saat başı - Öğrencisi Olanlar)
Schedule::command('session:auto-cancel-stale')
    ->hourly()
    ->runInBackground();

Schedule::command('course:activate-sessions')
    ->everyMinute()
    ->runInBackground();