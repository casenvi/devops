<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Video;
use Faker\Generator as Faker;

$factory->define(Video::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence(10),
        'description' => $faker->sentence(20),
        'year_launched' => rand(1980, 2020),
        'opened' => rand(0, 1),
        'rating' => array_rand(Video::RATTING),
        'duration' => rand(1, 60)
    ];
});
