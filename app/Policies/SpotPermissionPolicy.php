<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\SpotPermission;
use App\Models\User;

class SpotPermissionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->checkPermissionTo('view-any SpotPermission');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SpotPermission $spotpermission): bool
    {
        return $user->checkPermissionTo('view SpotPermission');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->checkPermissionTo('create SpotPermission');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SpotPermission $spotpermission): bool
    {
        return $user->checkPermissionTo('update SpotPermission');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SpotPermission $spotpermission): bool
    {
        return $user->checkPermissionTo('delete SpotPermission');
    }

    /**
     * Determine whether the user can delete any models.
     */
    public function deleteAny(User $user): bool
    {
        return $user->checkPermissionTo('delete-any SpotPermission');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SpotPermission $spotpermission): bool
    {
        return $user->checkPermissionTo('restore SpotPermission');
    }

    /**
     * Determine whether the user can restore any models.
     */
    public function restoreAny(User $user): bool
    {
        return $user->checkPermissionTo('restore-any SpotPermission');
    }

    /**
     * Determine whether the user can replicate the model.
     */
    public function replicate(User $user, SpotPermission $spotpermission): bool
    {
        return $user->checkPermissionTo('replicate SpotPermission');
    }

    /**
     * Determine whether the user can reorder the models.
     */
    public function reorder(User $user): bool
    {
        return $user->checkPermissionTo('reorder SpotPermission');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SpotPermission $spotpermission): bool
    {
        return $user->checkPermissionTo('force-delete SpotPermission');
    }

    /**
     * Determine whether the user can permanently delete any models.
     */
    public function forceDeleteAny(User $user): bool
    {
        return $user->checkPermissionTo('force-delete-any SpotPermission');
    }
}
