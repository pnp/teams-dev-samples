export const ParseSignInEntry = (entry: ISignInEntry): ISignInEntry => ({ ...entry, createdDateTime: new Date(entry.createdDateTime as any as string) });

export interface ISignInEntryResponse {
    "@odata.context": string
    value: ISignInEntry[]
}

export interface ISignInEntry {
    id: string
    createdDateTime: Date
    userDisplayName: string
    userPrincipalName: string
    userId: string
    appId: string
    appDisplayName: string
    ipAddress: string
    clientAppUsed: string
    correlationId: string
    conditionalAccessStatus: string
    isInteractive: boolean
    riskDetail: string
    riskLevelAggregated: string
    riskLevelDuringSignIn: string
    riskState: string
    riskEventTypes: any[]
    riskEventTypes_v2: any[]
    resourceDisplayName: string
    resourceId: string
    status: Status
    deviceDetail: DeviceDetail
    location: Location
    appliedConditionalAccessPolicies: any[]
}

export interface Status {
    errorCode: number
    failureReason: string
    additionalDetails?: string
}

export interface DeviceDetail {
    deviceId: string
    displayName: string
    operatingSystem: string
    browser: string
    isCompliant: boolean
    isManaged: boolean
    trustType: string
}

export interface Location {
    city: string
    state: string
    countryOrRegion: string
    geoCoordinates: GeoCoordinates
}

export interface GeoCoordinates {
    altitude: any
    latitude: number
    longitude: number
}
