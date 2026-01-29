<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->collection->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'owner' => $user->owner,
            'group' => $user->group,
            'status' => $user->status,
            'photo' => $user->photo ? url()->route('image', ['path' => $user->photo, 'w' => 60, 'h' => 60, 'fit' => 'crop']) : null,
            'deleted_at' => $user->deleted_at,
            'password' => $user->password,
        ]);
    }
}
