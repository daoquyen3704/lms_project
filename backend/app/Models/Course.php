<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Chapter;
use App\Models\User;
use App\Models\Level;

class Course extends Model
{
    protected $appends = ['course_small_image'];

    function getCourseSmallImageAttribute()
    {
        if ($this->image == "") {
            return "";
        }

        return asset('uploads/course/small/' . $this->image);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}
