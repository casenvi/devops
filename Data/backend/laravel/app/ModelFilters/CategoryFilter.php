<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

abstract class DefaultModelFilter extends ModelFilter
{
    protected $sortable = [];

    public function setup()
    {
        $noShort = $this->input('sort', '') === '';
        if ($noShort) {
            $this->orderBy('created_at' . 'DESC');
        }
    }

    public function sort($column)
    {
        if ($this->isSortable($column)) {
            $dir = strtolower($this->input('dir')) == 'asc' ? 'ASC' : 'DESC';
            $this->orderBy($column, $dir);
        }
    }
}
