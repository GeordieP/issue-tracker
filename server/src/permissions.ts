import { Permission as PermissionModel } from './models';

interface Permission {
    userID?: ID,
    resourceID: ID,
    level: number,
}

export enum PermissionLevel {
    Admin = 99,
    None = 0,
    Read = 1,
    Create = 2,
    Edit = 3,
    Delete = 4,
}

export enum ResourceType {
    Site = '__SITE',
    Project = 'PROJECT',
}

const SITE_RESOURCE_ID = ResourceType.Site;

// default permission levels for each type
const DefaultLevels = Object.freeze({
    [ResourceType.Site]: PermissionLevel.Read,
    [ResourceType.Project]: PermissionLevel.Create,
});

const DefaultLevelsUnauthenticated = Object.freeze({
    [ResourceType.Site]: PermissionLevel.Read,
    [ResourceType.Project]: PermissionLevel.Read,
});

// ask the db for a permissions object
const dbGetPerms = async (userID: ID, resourceID: ID): Promise<Permission> =>
    PermissionModel.findOne({ userID, resourceID }).lean().exec();

// between a resource permission and site-wide permission object, determine which has priority and return it.
function getPermissionPriority(resourcePermissions: Permission, sitePermissions: Permission): Permission {
    // if the resource doesn't have a level, default to site immediately
    if (!resourcePermissions.level) return sitePermissions;

    const { level: resourceLvl } = resourcePermissions;
    const { level: siteLvl } = sitePermissions;

    // if either document has a value of 0, it takes priority and is returned.
    if (resourceLvl === PermissionLevel.None) return resourcePermissions;
    if (siteLvl === PermissionLevel.None) return sitePermissions;

    // return the higher of the two
    if (resourceLvl > siteLvl) return resourcePermissions;
    return sitePermissions;
}

// get permissions object matching resource & user id from database,
// falling back to defaults for resource type (or site) if nothing found in db
export async function getPermissions(resourceID: ID, resourceType: ResourceType, userID: ID): Promise<Permission> {
    if (userID == null)
        throw new Error('No user ID provided.');
    if (resourceID == null)
        throw new Error('No resource ID provided. If you\'re looking for site-wide permissions, use `getUserSitePermissions` instead.');
    if (resourceType == null)
        throw new Error('No resourceType provided.');

    const [site, resource]: Permission[] = await Promise.all([
        dbGetPerms(userID, SITE_RESOURCE_ID),
        dbGetPerms(userID, resourceID),
    ]);

    // both documents found;
    // return the higher permission value of both found documents.
    if (site && resource)
        return Promise.resolve(getPermissionPriority(site, resource));

    // neither document found; return defaults
    if (!site && !resource)
        return Promise.resolve(getDefaultPermissions(resourceID, resourceType, userID))

    // TODO: should below compare with default values?
    // eg if we've found ONLY resource, should we compare with default site?

    // only the resource document was found; return it.
    if (resource) return Promise.resolve(resource);

    // only the site document was found; return it.
    return Promise.resolve(site);
}

// build a permissions object out of given resource id, resource type, userID, and the
// default level for the resource type, do the same for site-wide default level, then return
// the higher priority of the two.
export function getDefaultPermissions(resourceID: ID, resourceType: ResourceType, userID?: ID): Promise<Permission> {
    // create site permission matching the request
    const site: Permission = {
        userID,
        resourceID,
        level: DefaultLevels[ResourceType.Site],
    };

    // create resource permission matching the request
    const resource: Permission = {
        userID,
        resourceID,
        level: DefaultLevels[resourceType],
    };

    // return priority
    return Promise.resolve(getPermissionPriority(site, resource));
}

// same as getDefaultPermissions, but for unauthorized user default permission levels
export function getUnauthPermissions(resourceID: ID, resourceType: ResourceType, userID?: ID): Promise<Permission> {
    const site: Permission = {
        userID,
        resourceID,
        level: DefaultLevelsUnauthenticated[ResourceType.Site],
    };

    const resource: Permission = {
        userID,
        resourceID,
        level: DefaultLevelsUnauthenticated[resourceType],
    };

    return Promise.resolve(getPermissionPriority(site, resource));
}

export const getSitePermissions = (userID: string): Promise<Permission> =>
    getPermissions(SITE_RESOURCE_ID, ResourceType.Site, userID);

export const getDefaultSitePermissions = (): Promise<Permission> =>
    getDefaultPermissions(SITE_RESOURCE_ID, ResourceType.Site);

export const getUnauthSitePermissions = (): Promise<Permission> =>
    getUnauthPermissions(SITE_RESOURCE_ID, ResourceType.Site);
