import { PermissionLevel, DefaultLevels, DefaultLevelsUnauthenticated } from 'src/types/Permissions';
import { ResourceType } from 'src/types/Resources';

// resource

export const checkUnauthPermissions = (requiredLevel: PermissionLevel, resourceType: ResourceType): boolean =>
    DefaultLevelsUnauthenticated[resourceType] >= requiredLevel;

export const checkDefaultPermissions = (requiredLevel: PermissionLevel, resourceType: ResourceType): boolean =>
    DefaultLevels[resourceType] >= requiredLevel;

// site

export const checkSiteUnauthPermissions = (requiredLevel: PermissionLevel): boolean =>
    checkUnauthPermissions(requiredLevel, ResourceType.Site);

export const checkSiteDefaultPermissions = (requiredLevel: PermissionLevel): boolean =>
    checkDefaultPermissions(requiredLevel, ResourceType.Site);

// is the user the creator of the resource, or is their permission level sufficient?
export const checkPermissions = (requiredLevel: PermissionLevel, resource: Resource): boolean => {
    if (resource.userPermissions == null) {
        console.error('[checkPermissions] Resource does not have a userPermissions field.');
        return false;
    }

    // if the user making the request is the creator of the resource,
    // they have unconditional create/edit/delete permissions.
    if (resource.creator &&
        resource.creator.id === resource.userPermissions.userID) {
        return true;
    }

    return (resource.userPermissions.level >= requiredLevel);
}

// is the user the creator of the resource?
export const checkIsAuthor = (resource: Resource): boolean => {
    if (resource.creator == null) {
        console.error('Resource does not have a creator field.');
        return false;
    }

    if (resource.userPermissions == null) {
        console.error('[checkIsAuthor] Resource does not have a userPermissions field.');
        return false;
    }

    return (resource.creator.id === resource.userPermissions.userID);
}
