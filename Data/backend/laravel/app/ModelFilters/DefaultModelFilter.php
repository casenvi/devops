<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

abstract class DefaultModelFilter extends ModelFilter
{
    protected $sortable = [];

    public function setup()
    {
        $this->blacklistMethod('isSortable');
        $noShort = $this->input('sort', '') === '';
        if ($noShort) {
            $this->orderBy('created_at' . 'DESC');
        }
    }

    public function sort($column)
    {
        if (\method_exists($this, $method = 'sortBy' . Str::studly($column))) {
            $this->method();
        }

        if ($this->isSortable($column)) {
            $dir = strtolower($this->input('dir')) == 'asc' ? 'ASC' : 'DESC';
            $this->orderBy($column, $dir);
        }
    }
    protected function isSortable($column)
    {
        return in_array($column, $this->sortable);
    }
}
