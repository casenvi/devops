<?php

namespace App\ModelFilters;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'created_at', 'is_active'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }
}
