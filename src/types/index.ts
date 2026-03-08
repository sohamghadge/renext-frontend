// =============================================
// ENUMS
// =============================================

export enum UserType {
  RENEXT_ADMIN = 'RENEXT_ADMIN',
  CCLA = 'CCLA',
  SPECIAL_CHIEF_SECRETARY = 'SPECIAL_CHIEF_SECRETARY',
  DISTRICT_COLLECTOR = 'DISTRICT_COLLECTOR',
  ADDITIONAL_COLLECTOR = 'ADDITIONAL_COLLECTOR',
  RDO = 'RDO',
  TAHSILDAR = 'TAHSILDAR',
  DEPUTY_TAHSILDAR = 'DEPUTY_TAHSILDAR',
  VRO = 'VRO',
  VILLAGE_SURVEYOR = 'VILLAGE_SURVEYOR',
  OWNER = 'OWNER',
  PROXY = 'PROXY',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT',
  TENANT = 'TENANT',
  REAL_ESTATE_DEVELOPER = 'REAL_ESTATE_DEVELOPER',
  REAL_ESTATE_ANALYST = 'REAL_ESTATE_ANALYST',
  REAL_ESTATE_INVESTOR = 'REAL_ESTATE_INVESTOR',
}

export enum PrimaryClassification {
  ADMIN = 'Admin',
  ADMINISTRATION = 'Administration',
  CITIZENS = 'Citizens',
  COMMERCIAL = 'Commercial',
}

export enum SecondaryClassification {
  // Admin
  PLATFORM_ADMIN = 'Platform Admin',
  // Administration hierarchy
  CCLA_LEVEL = 'CCLA Level',
  SECRETARIAT_LEVEL = 'Secretariat Level',
  DISTRICT_LEVEL = 'District Level',
  SUB_DISTRICT_LEVEL = 'Sub-District Level',
  MANDAL_LEVEL = 'Mandal Level',
  DEPUTY_MANDAL_LEVEL = 'Deputy Mandal Level',
  VILLAGE_REVENUE_LEVEL = 'Village Revenue Level',
  VILLAGE_SURVEY_LEVEL = 'Village Survey Level',
  // Citizens
  PROPERTY_OWNER = 'Property Owner',
  AUTHORIZED_PROXY = 'Authorized Proxy',
  PROPERTY_MANAGER = 'Property Manager',
  PROPERTY_AGENT = 'Property Agent',
  TENANT_OCCUPANT = 'Tenant/Occupant',
  // Commercial
  DEVELOPER = 'Developer',
  ANALYST = 'Analyst',
  INVESTOR = 'Investor',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

// =============================================
// USER INTERFACES
// =============================================

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  contactNumber: string;
  address: string;
  userType: UserType;
  primaryClassification: PrimaryClassification;
  secondaryClassification: SecondaryClassification;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  contactNumber: string;
  address: string;
  password: string;
  userType: UserType;
  primaryClassification: PrimaryClassification;
  secondaryClassification: SecondaryClassification;
  status?: UserStatus;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  primaryClassification: PrimaryClassification;
  secondaryClassification: SecondaryClassification;
  status: UserStatus;
}

// =============================================
// AUTH INTERFACES
// =============================================

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

// =============================================
// API INTERFACES
// =============================================

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

// =============================================
// UI INTERFACES
// =============================================

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: SidebarNavItem[];
  disabled?: boolean;
}

// =============================================
// CLASSIFICATION MAPPINGS
// =============================================

export const USER_TYPE_LABELS: Record<UserType, string> = {
  [UserType.RENEXT_ADMIN]: 'ReNEXT Admin',
  [UserType.CCLA]: 'CCLA',
  [UserType.SPECIAL_CHIEF_SECRETARY]: 'Special Chief Secretary',
  [UserType.DISTRICT_COLLECTOR]: 'District Collector',
  [UserType.ADDITIONAL_COLLECTOR]: 'Additional Collector',
  [UserType.RDO]: 'RDO',
  [UserType.TAHSILDAR]: 'Tahsildar',
  [UserType.DEPUTY_TAHSILDAR]: 'Deputy Tahsildar',
  [UserType.VRO]: 'VRO',
  [UserType.VILLAGE_SURVEYOR]: 'Village Surveyor',
  [UserType.OWNER]: 'Owner',
  [UserType.PROXY]: 'Proxy',
  [UserType.MANAGER]: 'Manager',
  [UserType.AGENT]: 'Agent',
  [UserType.TENANT]: 'Tenant',
  [UserType.REAL_ESTATE_DEVELOPER]: 'Real Estate Developer',
  [UserType.REAL_ESTATE_ANALYST]: 'Real Estate Analyst',
  [UserType.REAL_ESTATE_INVESTOR]: 'Real Estate Investor',
};

export const USER_TYPE_CLASSIFICATION: Record<
  UserType,
  { primary: PrimaryClassification; secondary: SecondaryClassification }
> = {
  [UserType.RENEXT_ADMIN]: {
    primary: PrimaryClassification.ADMIN,
    secondary: SecondaryClassification.PLATFORM_ADMIN,
  },
  [UserType.CCLA]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.CCLA_LEVEL,
  },
  [UserType.SPECIAL_CHIEF_SECRETARY]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.SECRETARIAT_LEVEL,
  },
  [UserType.DISTRICT_COLLECTOR]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.DISTRICT_LEVEL,
  },
  [UserType.ADDITIONAL_COLLECTOR]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.DISTRICT_LEVEL,
  },
  [UserType.RDO]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.SUB_DISTRICT_LEVEL,
  },
  [UserType.TAHSILDAR]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.MANDAL_LEVEL,
  },
  [UserType.DEPUTY_TAHSILDAR]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.DEPUTY_MANDAL_LEVEL,
  },
  [UserType.VRO]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.VILLAGE_REVENUE_LEVEL,
  },
  [UserType.VILLAGE_SURVEYOR]: {
    primary: PrimaryClassification.ADMINISTRATION,
    secondary: SecondaryClassification.VILLAGE_SURVEY_LEVEL,
  },
  [UserType.OWNER]: {
    primary: PrimaryClassification.CITIZENS,
    secondary: SecondaryClassification.PROPERTY_OWNER,
  },
  [UserType.PROXY]: {
    primary: PrimaryClassification.CITIZENS,
    secondary: SecondaryClassification.AUTHORIZED_PROXY,
  },
  [UserType.MANAGER]: {
    primary: PrimaryClassification.CITIZENS,
    secondary: SecondaryClassification.PROPERTY_MANAGER,
  },
  [UserType.AGENT]: {
    primary: PrimaryClassification.CITIZENS,
    secondary: SecondaryClassification.PROPERTY_AGENT,
  },
  [UserType.TENANT]: {
    primary: PrimaryClassification.CITIZENS,
    secondary: SecondaryClassification.TENANT_OCCUPANT,
  },
  [UserType.REAL_ESTATE_DEVELOPER]: {
    primary: PrimaryClassification.COMMERCIAL,
    secondary: SecondaryClassification.DEVELOPER,
  },
  [UserType.REAL_ESTATE_ANALYST]: {
    primary: PrimaryClassification.COMMERCIAL,
    secondary: SecondaryClassification.ANALYST,
  },
  [UserType.REAL_ESTATE_INVESTOR]: {
    primary: PrimaryClassification.COMMERCIAL,
    secondary: SecondaryClassification.INVESTOR,
  },
};

// =============================================
// MODULE 2 — ENTITY TYPES
// =============================================

export enum PropertyType {
  LAND = 'Land',
  VILLA = 'Villa',
  APARTMENT = 'Apartment',
  COMMERCIAL_GOVERNMENT = 'Commercial - Government',
  COMMERCIAL_PRIVATE = 'Commercial - Private',
}

export enum PartyType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
}

export enum OwnerStatus {
  ACTIVE = 'ACTIVE',
  ENCUMBERED = 'ENCUMBERED',
}

export enum EntityType {
  RE_RECORD = 'RE_RECORD',
  OWNERSHIP_RECORD = 'OWNERSHIP_RECORD',
  SALE_TRANSACTION = 'SALE_TRANSACTION',
  RENTAL_TRANSACTION = 'RENTAL_TRANSACTION',
  DISPUTE_RECORD = 'DISPUTE_RECORD',
  PROJECT_RECORD = 'PROJECT_RECORD',
}

export enum FunctionType {
  RE_REGISTRATION = 'RE_REGISTRATION',
  SALE_TRANSACTION = 'SALE_TRANSACTION',
  RENTAL_TRANSACTION = 'RENTAL_TRANSACTION',
  DEVELOPMENT_PERMIT = 'DEVELOPMENT_PERMIT',
  DISPUTE_RESOLUTION = 'DISPUTE_RESOLUTION',
}

export interface ApprovalWorkflowStep {
  id: string;
  entityType: string;
  entityId: string;
  functionType: string;
  stepNumber: number;
  requiredRole: string;
  requiredUserId?: string;
  approverUserId?: string;
  approverName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  digitalSignature?: string;
  remarks?: string;
  signedAt?: string;
  createdAt: string;
}

export interface WorkflowStatusResponse {
  entityType: string;
  entityId: string;
  functionType: string;
  currentStep: number;
  totalSteps: number;
  overallStatus: string;
  steps: ApprovalWorkflowStep[];
}

export interface ReRecord {
  id: string;
  propertyType: string;
  uniquePropertyIdentifier: string;
  address: string;
  latitude?: number;
  longitude?: number;
  areaSize?: number;
  areaUnit?: string;
  village?: string;
  mandal?: string;
  district?: string;
  state?: string;
  surveyorUserId?: string;
  surveyorRemarks?: string;
  surveyorDocumentPath?: string;
  isActive: boolean;
  createdByUserId?: string;
  currentOwnerName?: string;
  approvalStatus?: string;
  currentStep?: number;
  totalSteps?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OwnershipRecord {
  id: string;
  reRecordId: string;
  ownerUserId?: string;
  ownerName: string;
  ownerType: string;
  ownershipIssuanceDate?: string;
  ownerStatus: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaleTransactionRecord {
  id: string;
  reRecordId: string;
  sellerName?: string;
  sellerType?: string;
  sellerUserId?: string;
  buyerName?: string;
  buyerUserId?: string;
  agentName?: string;
  agentType?: string;
  agentUserId?: string;
  saleAmount?: number;
  brokerageAmount?: number;
  saleTimestamp?: string;
  contractDocumentPath?: string;
  escrowReferences?: string;
  moneyFlowAuditTrail?: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalTransactionRecord {
  id: string;
  reRecordId: string;
  leaserName?: string;
  leaserType?: string;
  leaserUserId?: string;
  tenantName?: string;
  tenantUserId?: string;
  agentName?: string;
  agentType?: string;
  agentUserId?: string;
  rentalAmount?: number;
  periodUnit?: string;
  brokerageAmount?: number;
  rentalTimestamp?: string;
  contractDocumentPath?: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisputeRecord {
  id: string;
  reRecordId?: string;
  claimantName?: string;
  claimantType?: string;
  claimantUserId?: string;
  respondentName?: string;
  respondentType?: string;
  respondentUserId?: string;
  surveyorUserId?: string;
  surveyorRemarks?: string;
  surveyorDocumentPath?: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRecord {
  id: string;
  projectName: string;
  developerName: string;
  developerType: string;
  developerUserId?: string;
  sourceReRecordId?: string;
  outcomeReRecordId?: string;
  agentName?: string;
  agentUserId?: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityAuditLog {
  id: string;
  entityType: string;
  entityId: string;
  actorUserId?: string;
  actorUsername?: string;
  action: string;
  stateSnapshot?: string;
  previousHash?: string;
  currentHash: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AnalyticsStats {
  totalReRecords: number;
  activeOwnershipRecords: number;
  pendingSaleTransactions: number;
  approvedSaleTransactions: number;
  pendingRentalTransactions: number;
  pendingDisputes: number;
  pendingProjects: number;
  myPendingActions: number;
}

export interface MarketTrend {
  month: string;
  avgSalePrice: number;
  avgRentalPrice: number;
  transactionCount: number;
}

// Payload types for forms
export interface CreateReRecordPayload {
  propertyType: string;
  uniquePropertyIdentifier: string;
  address: string;
  latitude?: number;
  longitude?: number;
  areaSize?: number;
  areaUnit?: string;
  village?: string;
  mandal?: string;
  district?: string;
  state?: string;
  surveyorUserId?: string;
  surveyorRemarks?: string;
  ownerName: string;
  ownerType: string;
  ownerUserId?: string;
  ownershipIssuanceDate?: string;
  ownerStatus?: string;
}

export interface CreateSaleTransactionPayload {
  reRecordId: string;
  sellerName: string;
  sellerType: string;
  sellerUserId?: string;
  buyerName: string;
  buyerUserId?: string;
  agentName: string;
  agentType: string;
  agentUserId?: string;
  saleAmount: number;
  salePriceReference?: string;
  brokerageAmount: number;
  brokeragePriceReference?: string;
  escrowReferences?: string;
  moneyFlowAuditTrail?: string;
}

export interface CreateRentalTransactionPayload {
  reRecordId: string;
  leaserName: string;
  leaserType: string;
  leaserUserId?: string;
  tenantName: string;
  tenantUserId?: string;
  agentName: string;
  agentType: string;
  agentUserId?: string;
  rentalAmount: number;
  periodUnit: string;
  rentalPriceReference?: string;
  brokerageAmount: number;
  brokeragePriceReference?: string;
  escrowReferences?: string;
  moneyFlowAuditTrail?: string;
}

export interface CreateDisputePayload {
  reRecordId?: string;
  claimantName: string;
  claimantType: string;
  claimantUserId?: string;
  respondentName: string;
  respondentType: string;
  respondentUserId?: string;
  surveyorUserId?: string;
  surveyorRemarks?: string;
}

export interface CreateProjectRecordPayload {
  projectName: string;
  developerName: string;
  developerType: string;
  developerUserId?: string;
  sourceReRecordId?: string;
  outcomeReRecordId?: string;
  agentName?: string;
  agentUserId?: string;
}

export interface ApproveWorkflowStepPayload {
  remarks?: string;
}

// User type labels for displaying role names in workflow steps
export const USER_TYPE_DISPLAY_LABELS: Record<string, string> = {
  RENEXT_ADMIN: 'ReNEXT Admin',
  CCLA: 'Chief Commissioner of Land Administration',
  SPECIAL_CHIEF_SECRETARY: 'Special Chief Secretary',
  DISTRICT_COLLECTOR: 'District Collector',
  ADDITIONAL_COLLECTOR: 'Additional Collector',
  RDO: 'Revenue Divisional Officer',
  TAHSILDAR: 'Tahsildar',
  DEPUTY_TAHSILDAR: 'Deputy Tahsildar',
  VRO: 'Village Revenue Officer',
  VILLAGE_SURVEYOR: 'Village Surveyor',
  OWNER: 'Owner',
  PROXY: 'Proxy',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  TENANT: 'Tenant',
  REAL_ESTATE_DEVELOPER: 'Real Estate Developer',
  REAL_ESTATE_ANALYST: 'Real Estate Analyst',
  REAL_ESTATE_INVESTOR: 'Real Estate Investor',
};

// Which user types can access each function
export const FUNCTION_ACCESS_ROLES: Record<string, string[]> = {
  RE_REGISTRATION: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'VRO', 'OWNER'],
  SALE_TRANSACTION: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'AGENT', 'OWNER'],
  RENTAL_TRANSACTION: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'AGENT', 'OWNER', 'TENANT'],
  DEVELOPMENT_PERMIT: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'AGENT', 'OWNER', 'REAL_ESTATE_DEVELOPER'],
  DISPUTE_RESOLUTION: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'VRO', 'OWNER'],
  FINANCIAL_INTELLIGENCE: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'VRO'],
  ANALYSIS_HUB: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'VRO', 'REAL_ESTATE_ANALYST'],
  INVESTOR_PORTAL: ['RENEXT_ADMIN', 'CCLA', 'SPECIAL_CHIEF_SECRETARY', 'DISTRICT_COLLECTOR', 'ADDITIONAL_COLLECTOR', 'RDO', 'TAHSILDAR', 'VRO', 'REAL_ESTATE_INVESTOR'],
};

// Administration secondary classification → gradient level (1-6, low to high)
export const ADMIN_SECONDARY_LEVEL: Partial<Record<SecondaryClassification, number>> = {
  [SecondaryClassification.VILLAGE_SURVEY_LEVEL]: 1,
  [SecondaryClassification.VILLAGE_REVENUE_LEVEL]: 2,
  [SecondaryClassification.DEPUTY_MANDAL_LEVEL]: 2,
  [SecondaryClassification.MANDAL_LEVEL]: 3,
  [SecondaryClassification.SUB_DISTRICT_LEVEL]: 3,
  [SecondaryClassification.DISTRICT_LEVEL]: 4,
  [SecondaryClassification.SECRETARIAT_LEVEL]: 5,
  [SecondaryClassification.CCLA_LEVEL]: 6,
  [SecondaryClassification.PLATFORM_ADMIN]: 6,
};

// Role-based accessible user types
export const ROLE_ACCESSIBLE_TYPES: Record<UserType, UserType[]> = {
  [UserType.RENEXT_ADMIN]: Object.values(UserType),
  [UserType.CCLA]: [
    UserType.SPECIAL_CHIEF_SECRETARY,
    UserType.DISTRICT_COLLECTOR,
    UserType.ADDITIONAL_COLLECTOR,
    UserType.RDO,
    UserType.TAHSILDAR,
    UserType.DEPUTY_TAHSILDAR,
    UserType.VRO,
    UserType.VILLAGE_SURVEYOR,
  ],
  [UserType.SPECIAL_CHIEF_SECRETARY]: [
    UserType.DISTRICT_COLLECTOR,
    UserType.ADDITIONAL_COLLECTOR,
    UserType.RDO,
    UserType.TAHSILDAR,
    UserType.DEPUTY_TAHSILDAR,
    UserType.VRO,
    UserType.VILLAGE_SURVEYOR,
  ],
  [UserType.DISTRICT_COLLECTOR]: [
    UserType.ADDITIONAL_COLLECTOR,
    UserType.RDO,
    UserType.TAHSILDAR,
    UserType.DEPUTY_TAHSILDAR,
    UserType.VRO,
    UserType.VILLAGE_SURVEYOR,
  ],
  [UserType.ADDITIONAL_COLLECTOR]: [
    UserType.RDO,
    UserType.TAHSILDAR,
    UserType.DEPUTY_TAHSILDAR,
    UserType.VRO,
    UserType.VILLAGE_SURVEYOR,
  ],
  [UserType.RDO]: [
    UserType.TAHSILDAR,
    UserType.DEPUTY_TAHSILDAR,
    UserType.VRO,
    UserType.VILLAGE_SURVEYOR,
  ],
  [UserType.TAHSILDAR]: [
    UserType.DEPUTY_TAHSILDAR,
    UserType.VRO,
    UserType.VILLAGE_SURVEYOR,
  ],
  [UserType.DEPUTY_TAHSILDAR]: [UserType.VRO, UserType.VILLAGE_SURVEYOR],
  [UserType.VRO]: [UserType.VILLAGE_SURVEYOR],
  [UserType.VILLAGE_SURVEYOR]: [],
  [UserType.OWNER]: [UserType.PROXY, UserType.MANAGER, UserType.TENANT],
  [UserType.PROXY]: [],
  [UserType.MANAGER]: [UserType.TENANT],
  [UserType.AGENT]: [],
  [UserType.TENANT]: [],
  [UserType.REAL_ESTATE_DEVELOPER]: [UserType.REAL_ESTATE_ANALYST],
  [UserType.REAL_ESTATE_ANALYST]: [],
  [UserType.REAL_ESTATE_INVESTOR]: [],
};
