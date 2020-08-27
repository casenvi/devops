<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;


class CategoryFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'created_at', 'is_active'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }
    public function genres($genres)
    {
        $ids = explode(',', $genres);
        $this->whereHas('genres', function (Builder $query) use ($ids) {
            $query->whereIn('id', $ids)
                ->orWhereIn('name', $ids);
        });
    }
}
