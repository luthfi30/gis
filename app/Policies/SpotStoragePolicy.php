<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\SpotStorage;
use App\Models\User;

class SpotStoragePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->checkPermissionTo('view-any SpotStorage');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SpotStorage $spotstorage): bool
    {
        return $user->checkPermissionTo('view SpotStorage');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->checkPermissionTo('create SpotStorage');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SpotStorage $spotstorage): bool
    {
        return $user->checkPermissionTo('update SpotStorage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SpotStorage $spotstorage): bool
    {
        return $user->checkPermissionTo('delete SpotStorage');
    }

    /**
     * Determine whether the user can delete any models.
     */
    public function deleteAny(User $user): bool
    {
        return $user->checkPermissionTo('delete-any SpotStorage');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SpotStorage $spotstorage): bool
    {
        return $user->checkPermissionTo('restore SpotStorage');
    }

    /**
     * Determine whether the user can restore any models.
     */
    public function restoreAny(User $user): bool
    {
        return $user->checkPermissionTo('restore-any SpotStorage');
    }

    /**
     * Determine whether the user can replicate the model.
     */
    public function replicate(User $user, SpotStorage $spotstorage): bool
    {
        return $user->checkPermissionTo('replicate SpotStorage');
    }

    /**
     * Determine whether the user can reorder the models.
     */
    public function reorder(User $user): bool
    {
        return $user->checkPermissionTo('reorder SpotStorage');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SpotStorage $spotstorage): bool
    {
        return $user->checkPermissionTo('force-delete SpotStorage');
    }

    /**
     * Determine whether the user can permanently delete any models.
     */
    public function forceDeleteAny(User $user): bool
    {
        return $user->checkPermissionTo('force-delete-any SpotStorage');
    }
}
