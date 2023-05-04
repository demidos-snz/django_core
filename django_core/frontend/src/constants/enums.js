export const STATUS = Object.freeze({
  IN_WORK_OF_MC: 2,
  IN_WORK_OF_CLIENT: 3,
  CLOSING_REQUEST: 4,
  CLOSED: 5,
})

export const VERDICT = Object.freeze({
  TRUE_POSITIVE: 1,
  FALSE_POSITIVE: 2,
})

export const CM_LINE = Object.freeze({
  FIRST_LINE: 1,
  SECOND_LINE: 2,
})

export const TYPE_INCIDENT = Object.freeze({
  BOTNET: 1,
  DDOS_SUCCESS: 2,
  MALWARE_SUCCESS: 3,
  CAPTURE_TRAFFIC: 4,
  PHISHING: 5,
  COMPROMISE: 6,
  INTEGRITY_VIOLATION: 7,
  DISCLOSURE: 8,
  PROHIBITED_CONTENT: 9,
  SPAM: 10,
  EXPLOITATION_SUCCESS: 11,
  POLICY: 12,
  DDOS_ATTEMPT: 13,
  BRUTE_FORCES: 14,
  MALWARE_ATTEMPT: 15,
  EXPLOITATION_ATTEMPT: 16,
  SCAM: 17,
  SCAN: 18,
  SOCIAL_ENGINEERING: 19,
  VULNERABILITY: 20,
})

export const SEVERITY_LEVEL = Object.freeze({
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
})

export const ROLE = Object.freeze({
  SYSADMIN: 0,
  SUPERUSER: 1,
  OPERATOR_OF_FIRST_LINE: 2,
  OPERATOR_OF_SECOND_LINE: 3,
  CLIENT_OF_FIRST_LINE: 4,
  CLIENT: 5,
})

export const ACTIVENESS_TYPE = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 2,
})

export const RULE_ENTITIES = Object.freeze({
  NAME: 1,
  SEVERITY: 2,
  TYPE: 3,
  DESCRIPTION: 4,
  STATUS: 5,
  CM_LINE: 6,
  OPERATOR: 7,
  EVENTS: 9,
  RECOMMENDATIONS: 10,
  ACTIONS_TAKEN: 11,
  RECOMMENDATION_CONFIRMATION: 12,
  NCIRCC: 13,
})

export const SENSOR_TYPES = Object.freeze({
  IDS_NS: 1,
  IDS_HS: 2,
  MP_SIEM: 3,
})

export const ORGANIZATION_TABS = Object.freeze({
  MAIN: 1,
  INFORMATION_SECURITY: 2,
})

export const ORGANIZATION_TABS_IN_ACTIVES = Object.freeze({
  SEGMENTS: 1,
  NETWORKS: 2,
  NODES: 3,
})

export const ORGANIZATION_STRUCTURE_ITEM_TYPES = Object.freeze({
  SEGMENT_ROOT: 'segmentRoot',
  SEGMENT: 'segment',
  SENSOR: 'sensor',
  SIEM_ROOT: 'siemRoot',
})

export const TOOLTIP_TYPES = Object.freeze({
  RECOMMENDATIONS: 'recommendations',
  ACTIONS_TAKEN: 'actionsTaken',
})

export const HISTORY_ACTIONS = Object.freeze({
  AFFECTED_ACTIVE_ADDED: 'affected_active_added',
  ATTACHMENT_ADDED: 'attachment_added',
  ATTACHMENT_REMOVED: 'attachment_removed',
  DESCRIPTION_ESTABLISHED: 'description_established',
  DESCRIPTION_CHANGED: 'description_changed',
  RECOMMENDATION_ADDED: 'recommendation_added',
  RECOMMENDATION_REMOVED: 'recommendation_removed',
  ACTION_TAKEN_ADDED: 'action_taken_added',
  ACTION_TAKEN_REMOVED: 'action_taken_removed',
  STATUS_CHANGED: 'status_changed',
  TYPE_CHANGED: 'type_changed',
  NAME_CHANGED: 'name_changed',
  NAME_ESTABLISHED: 'name_established',
  ASSIGNED_USER_CHANGED: 'assigned_changed',
  CM_LINE_CHANGED: 'cm_line_changed',
  SEVERITY_LEVEL_CHANGED: 'severity_level_changed',
  COMMENT_ADDED: 'comment_added',
  COMMENT_REMOVED: 'comment_removed',
  USER_REMOVED: 'user_removed',
  USER_ADDED: 'user_added',
  TRANSMITTED: 'transmitted',
})

export const ALERT_TYPES = Object.freeze({
  NOTIFICATION: 'notification',
  DIALOG: 'dialog',
})

export const NCIRCC_NOTIFICATION_CATEGORY = Object.freeze({
  INCIDENT: 1,
  ATTACK: 2,
  VULNERABILITY: 3,
})

export const NCIRCC_DIALOG_TABS = Object.freeze({
  NOTIFICATION: 1,
  COMMENTS: 2,
  EVIDENCES: 3,
})

export const NCIRCC_NOTIFICATION_STATUS = Object.freeze({
  CREATED: 1,
  REGISTERED: 2,
  SUPPLEMENT_REQUIRED: 3,
  VERIFICATION: 4,
  DECISION_MADE: 5,
  ARCHIVED: 6,
})

export const SIEM_TYPES = Object.freeze({
  ELASTIC: 'elastic',
  TIAS: 'tias',
})

export const PASSWORD_STATUS = Object.freeze({
  ACTUAL: 1,
  OBSOLETE: 2,
  OUTDATED: 3,
})

export const TLP_ITEMS = Object.freeze({
  WHITE: 1,
  GREEN: 2,
  AMBER: 3,
  RED: 4,
})

export const RELATIVE_VALUE_TYPE = Object.freeze({
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
})

export const RELATIVE_VALUE_DIRECTION = Object.freeze({
  FORWARD: 'forward',
  BACKWARD: 'backward',
})

export const INCIDENT_TABS = Object.freeze({
  EVENTS: 1,
  HISTORY: 2,
  COMMENTS: 3,
  FILES: 4,
  ASSETS: 5,
  IOCS: 6,
})
