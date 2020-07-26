<?php

namespace App\ModelFilters;

use App\Models\CastMember;

class CastMemberFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'created_at', 'type', 'is_active'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }

    public function type($type)
    {
        if (in_array((int)$type, CastMember::$types)) {
            $this->where('type', (int)$type);
        }
    }
   /*  public function type($typeName)
    {
        switch (strtoupper($typeName)) {
            case 'DIRETOR':
                $this->where('type', 1);
                break;
            case 'ATOR':
                    $this->where('type', 2');
                    break;
            default:
                # code...
                break;
        }
    } */
}
