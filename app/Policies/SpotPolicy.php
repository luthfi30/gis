<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\Spot;
use App\Models\User;

class SpotPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->checkPermissionTo('view-any Spot');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Spot $spot): bool
    {
        return $user->checkPermissionTo('view Spot');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->checkPermissionTo('create Spot');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Spot $spot): bool
    {
        return $user->checkPermissionTo('update Spot');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Spot $spot): bool
    {
        return $user->checkPermissionTo('delete Spot');
    }

    /**
     * Determine whether the user can delete any models.
     */
    public function deleteAny(User $user): bool
    {
        return $user->checkPermissionTo('delete-any Spot');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Spot $spot): bool
    {
        return $user->checkPermissionTo('restore Spot');
    }

    /**
     * Determine whether the user can restore any models.
     */
    public function restoreAny(User $user): bool
    {
        return $user->checkPermissionTo('restore-any Spot');
    }

    /**
     * Determine whether the user can replicate the model.
     */
    public function replicate(User $user, Spot $spot): bool
    {
        return $user->checkPermissionTo('replicate Spot');
    }

    /**
     * Determine whether the user can reorder the models.
     */
    public function reorder(User $user): bool
    {
        return $user->checkPermissionTo('reorder Spot');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Spot $spot): bool
    {
        return $user->checkPermissionTo('force-delete Spot');
    }

    /**
     * Determine whether the user can permanently delete any models.
     */
    public function forceDeleteAny(User $user): bool
    {
        return $user->checkPermissionTo('force-delete-any Spot');
    }
}
