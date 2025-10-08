<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Chapter;
use App\Models\User;
use App\Models\Level;
use App\Models\Category;
use App\Models\Language;
use App\Models\Outcome;
use App\Models\Requirement;

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
        return $this->hasMany(Chapter::class)
            ->orderBy('sort_order', 'asc');
    }

    public function outcomes()
    {
        return $this->hasMany(Outcome::class)
            ->orderBy('sort_order', 'asc');
    }

    public function requirements()
    {
        return $this->hasMany(Requirement::class)
            ->orderBy('sort_order', 'asc');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
