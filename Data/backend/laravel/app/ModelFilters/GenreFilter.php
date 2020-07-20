<?php

namespace App\ModelFilters;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'created_at', 'is_active'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }

    public function categories($categories)
    {
        $idOrNames = explode(',', $categories);
        $this->whereHas('categories', function (Builder $query) use ($idOrNames) {
            $query->whereIn('id', $idOrNames)
                ->orWhereIn('name', $idOrNames);
        });
    }
}
