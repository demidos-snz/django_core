import i18n from '@/translation/index.js'
import { RULE_ENTITIES, SENSOR_TYPES, RELATIVE_VALUE_TYPE, RELATIVE_VALUE_DIRECTION } from '@/constants/enums'
import { store } from '@/store'

export const tableConstants = {
  reportTableHeaders: [
    {
      text: 'Name',
      value: 'name',
      filterable: true,
      filterType: 'text',
      filterKey: 'name',
      multiple: false,
      expression: '__icontains',
    },
    {
      text: 'Type',
      value: 'step',
      filterable: true,
      filterType: 'combobox',
      filterKey: 'step',
      multiple: true,
      expression: '__in',
    },
    {
      text: 'Organization',
      value: 'organization',
      filterable: true,
      filterType: 'combobox',
      filterKey: 'organization',
      multiple: true,
      expression: '__in',
    },
    {
      text: 'Creation date',
      value: 'created',
      filterable: true,
      filterType: 'periodDatetime',
      filterKey: 'created',
      multiple: false,
      expression: null,
    },
    {
      text: 'Period start',
      value: 'dateFrom',
      filterable: true,
      filterType: 'periodDate',
      filterKey: 'date_from',
      multiple: false,
      expression: null,
    },
    {
      text: 'Period end',
      value: 'dateTo',
      filterable: true,
      filterType: 'periodDate',
      filterKey: 'date_to',
      multiple: false,
      expression: null,
    },
    {
      text: 'User',
      value: 'author',
      filterable: true,
      filterType: 'combobox',
      filterKey: 'author',
      multiple: true,
      expression: '__in',
    },
    {
      text: 'Status',
      value: 'status',
      filterable: true,
      filterType: 'combobox',
      filterKey: 'status',
      multiple: true,
      expression: '__in',
    },
    { text: 'Действия', value: 'actions', filterable: false, sortable: false },
  ],
  bulletinTableHeaders: [
    {
      text: 'Name',
      value: 'name',
      filterable: true,
      filterType: 'text',
      filterKey: 'name',
      multiple: false,
      expression: '__icontains',
    },
    {
      text: 'Type',
      value: 'typeBulletin',
      filterable: true,
      filterType: 'combobox',
      filterKey: 'type_bulletin',
      multiple: true,
      expression: '__in',
    },
    {
      text: 'Number',
      value: 'number',
      filterable: true,
      filterType: 'text',
      filterKey: 'number',
      multiple: false,
      expression: '__icontains',
    },
    {
      text: 'Date',
      value: 'date',
      filterable: true,
      filterType: 'periodDate',
      filterKey: 'date',
      multiple: false,
      expression: null,
    },
    {
      text: 'Прочитано',
      value: 'read',
      filterable: true,
      sortable: true,
      filterType: 'bool',
      orderKey: 'mark_read_datetime',
      filterKey: 'read',
      expression: null,
    },
    { text: 'Действия', value: 'actions', filterable: false, sortable: false },
  ],
  evidenceTableHeaders: [
    {
      text: 'Name',
      value: 'name',
      filterable: true,
      filterType: 'text',
      filterKey: 'name',
      multiple: false,
    },
    {
      text: 'Description',
      value: 'description',
      filterable: true,
      filterType: 'text',
      filterKey: 'description',
      multiple: false,
    },
    {
      text: 'Source',
      value: 'source',
      filterable: true,
      filterType: 'text',
      filterKey: 'source',
      multiple: false,
    },
    {
      text: 'Create date',
      value: 'created',
      filterable: true,
      filterType: 'periodDate',
      filterKey: 'created',
      multiple: false,
      expression: null,
    },
    { text: 'Действия', value: 'actions', filterable: false, sortable: false },
  ],
  getIncidentTableHeaders: () => {
    return [
      {
        text: i18n.t(`incidents.incidentsTable.hrid`),
        value: 'hrid',
        filterable: true,
        filterType: 'text',
        filterKey: 'hrid',
        multiple: false,
        expression: '__icontains',
        align: 'center',
        width: '50px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.name`),
        value: 'name',
        filterable: true,
        filterType: 'text',
        filterKey: 'name',
        multiple: false,
        expression: '__icontains',
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.description`),
        value: 'description',
        filterable: true,
        filterType: 'text',
        filterKey: 'description',
        multiple: false,
        expression: '__icontains',
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.last_comment`),
        value: 'comments__comment__text',
        filterable: true,
        filterType: 'text',
        filterKey: 'last_comment',
        multiple: false,
        expression: null,
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.organization`),
        value: 'organization',
        filterable: true,
        filterType: 'combobox',
        filterKey: 'organization_id',
        multiple: true,
        expression: '__in',
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.severity_level`),
        value: 'severity_level',
        filterable: true,
        filterType: 'combobox',
        filterKey: 'severity_level',
        multiple: true,
        expression: '__in',
        align: 'center',
        width: '50px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.type_incident`),
        value: 'type_incident',
        filterable: true,
        filterType: 'combobox',
        filterKey: 'type_incident',
        multiple: true,
        expression: '__in',
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.status`),
        value: 'status',
        filterable: true,
        filterType: 'combobox',
        filterKey: 'status',
        multiple: true,
        expression: '__in',
        align: 'center',
        width: '50px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.affected_actives`),
        value: 'affected_actives_ip_list',
        filterable: true,
        filterType: 'text',
        filterKey: 'affected_actives',
        multiple: false,
        expression: null,
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.ncircc_notification__reg_number`),
        value: 'ncircc_notification__reg_number',
        filterable: true,
        filterType: 'text',
        filterKey: 'ncircc_reg_number',
        multiple: false,
        expression: null,
        align: 'center',
        width: '50px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.ncircc_notification__status`),
        value: 'ncircc_notification__status',
        filterable: true,
        filterType: 'combobox',
        filterKey: 'ncircc_notification__status',
        multiple: true,
        expression: '__in',
        align: 'center',
        width: '50px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.author`),
        value: 'author',
        filterable: true,
        filterType: 'combobox',
        filterKey: 'author',
        multiple: true,
        expression: '__in',
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.assigned`),
        value: 'assigned',
        filterable: true,
        filterType: 'combobox',
        filterKey: 'assigned',
        multiple: true,
        expression: '__in',
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.registration_datetime`),
        value: 'registration_datetime',
        filterable: true,
        filterType: 'periodDatetime',
        filterKey: 'registration_datetime',
        multiple: false,
        expression: null,
        align: 'center',
        width: '50px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.last_modified_datetime`),
        value: 'last_modified_datetime',
        filterable: true,
        filterType: 'periodDatetime',
        filterKey: 'last_modified_datetime',
        multiple: false,
        expression: null,
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.closed_datetime`),
        value: 'closed_datetime',
        filterable: true,
        filterType: 'periodDatetime',
        filterKey: 'closed_datetime',
        multiple: false,
        expression: null,
        align: 'center',
        width: '100px',
      },
      {
        text: i18n.t(`incidents.incidentsTable.last_viewed_by_client_datetime`),
        value: 'datetime_of_last_viewing_by_client',
        filterable: true,
        filterType: 'periodDatetime',
        filterKey: 'datetime_of_last_viewing_by_client',
        multiple: false,
        expression: null,
        align: 'center',
        width: '100px',
      },
    ]
  },
  itemsPerPage: [5, 10, 20],
}

export const reportTableHeadersToFieldMap = tableConstants.reportTableHeaders.reduce((container, item) => {
  container[item.value] = item.filterKey
  return container
}, {})

export const bulletinTableHeadersToFieldMap = tableConstants.bulletinTableHeaders.reduce((container, item) => {
  container[item.value] = item.orderKey || item.filterKey
  return container
}, {})

export const getSeverityLevels = () => {
  return {
    1: {
      id: 1,
      alias: 'low',
      name: i18n.t('incidents.severityLevels.low'),
      color: '#A5D6A7',
    },
    2: {
      id: 2,
      alias: 'middle',
      name: i18n.t('incidents.severityLevels.middle'),
      color: '#FFF59D',
    },
    3: {
      id: 3,
      alias: 'high',
      name: i18n.t('incidents.severityLevels.high'),
      color: '#FFAB91',
    },
    4: {
      id: 4,
      alias: 'critical',
      name: i18n.t('incidents.severityLevels.critical'),
      color: '#EF9A9A',
    },
  }
}

export const getIncidentTypes = () => {
  return [
    {
      header: i18n.t('incidents.types.incidents'),
    },
    {
      divider: true,
    },
    {
      id: 1,
      alias: 'botnet',
      name: i18n.t('incidents.types.botnet'),
    },
    {
      id: 2,
      alias: 'ddos_success',
      name: i18n.t('incidents.types.ddos_success'),
    },
    {
      id: 3,
      alias: 'malware_success',
      name: i18n.t('incidents.types.malware_success'),
    },
    {
      id: 4,
      alias: 'capture_traffic',
      name: i18n.t('incidents.types.capture_traffic'),
    },
    {
      id: 5,
      alias: 'phishing',
      name: i18n.t('incidents.types.phishing'),
    },
    {
      id: 6,
      alias: 'compromise',
      name: i18n.t('incidents.types.compromise'),
    },
    {
      id: 7,
      alias: 'integrity_violation',
      name: i18n.t('incidents.types.integrity_violation'),
    },
    {
      id: 8,
      alias: 'disclosure',
      name: i18n.t('incidents.types.disclosure'),
    },
    {
      id: 9,
      alias: 'prohibited_content',
      name: i18n.t('incidents.types.prohibited_content'),
    },
    {
      id: 10,
      alias: 'spam',
      name: i18n.t('incidents.types.spam'),
    },
    {
      id: 11,
      alias: 'exploitation_success',
      name: i18n.t('incidents.types.exploitation_success'),
    },
    {
      id: 12,
      alias: 'policy',
      name: i18n.t('incidents.types.policy'),
    },
    {
      header: i18n.t('incidents.types.attacks'),
    },
    {
      divider: true,
    },
    {
      id: 13,
      alias: 'ddos_attempt',
      name: i18n.t('incidents.types.ddos_attempt'),
    },
    {
      id: 14,
      alias: 'bruteforce',
      name: i18n.t('incidents.types.bruteforce'),
    },
    {
      id: 15,
      alias: 'malware_attempt',
      name: i18n.t('incidents.types.malware_attempt'),
    },
    {
      id: 16,
      alias: 'exploitation_attempt',
      name: i18n.t('incidents.types.exploitation_attempt'),
    },
    {
      id: 17,
      alias: 'scam',
      name: i18n.t('incidents.types.scam'),
    },
    {
      id: 18,
      alias: 'scan',
      name: i18n.t('incidents.types.scan'),
    },
    {
      id: 19,
      alias: 'social_engineering',
      name: i18n.t('incidents.types.social_engineering'),
    },
    {
      header: i18n.t('incidents.types.vulnerabilities'),
    },
    {
      divider: true,
    },
    {
      id: 20,
      alias: 'vulnerability',
      name: i18n.t('incidents.types.vulnerability'),
    },
  ]
}

export const getUserRoles = () => {
  return {
    0: {
      id: 0,
      alias: 'sysadmin',
      name: i18n.t('users.roles.sysadmin'),
    },
    1: {
      id: 1,
      alias: 'superuser',
      name: i18n.t('users.roles.superuser'),
    },
    2: {
      id: 2,
      alias: 'first_line_operator',
      name: i18n.t('users.roles.first_line_operator'),
    },
    3: {
      id: 3,
      alias: 'second_line_operator',
      name: i18n.t('users.roles.second_line_operator'),
    },
    4: {
      id: 4,
      alias: 'first_line_client',
      name: i18n.t('users.roles.first_line_client'),
    },
    5: {
      id: 5,
      alias: 'client',
      name: i18n.t('users.roles.client'),
    },
  }
}

export const getIncidentStatuses = () => {
  return {
    2: {
      id: 2,
      alias: 'in_work_cm',
      name: i18n.t('incidents.statuses.in_work_cm'),
      color: '#4CAF50',
    },
    3: {
      id: 3,
      alias: 'in_work_client',
      name: i18n.t('incidents.statuses.in_work_client'),
      color: '#4CAF50',
    },
    4: {
      id: 4,
      alias: 'close_request',
      name: i18n.t('incidents.statuses.close_request'),
      color: '#CDDC39',
    },
    5: {
      id: 5,
      alias: 'closed',
      name: i18n.t('incidents.statuses.closed'),
      color: '#F44336',
    },
  }
}

export const getReportTypes = () => {
  return {
    0: {
      id: 0,
      alias: 'month',
      name: i18n.t('reports.types.month'),
    },
    1: {
      id: 1,
      alias: 'quarter',
      name: i18n.t('reports.types.quarter'),
    },
    2: {
      id: 2,
      alias: 'half_year',
      name: i18n.t('reports.types.half_year'),
    },
    3: {
      id: 3,
      alias: 'year',
      name: i18n.t('reports.types.year'),
    },
  }
}

export const getReportStatuses = () => {
  return {
    0: {
      id: 0,
      alias: 'success',
      name: i18n.t('reports.statuses.success'),
    },
    1: {
      id: 1,
      alias: 'pending',
      name: i18n.t('reports.statuses.pending'),
    },
    2: {
      id: 2,
      alias: 'failure',
      name: i18n.t('reports.statuses.failure'),
    },
    3: {
      id: 3,
      alias: 'started',
      name: i18n.t('reports.statuses.started'),
    },
  }
}

export const sensorTypes = {
  1: {
    id: 1,
    name: 'IDS_NS',
  },
  2: {
    id: 2,
    name: 'IDS_HS',
  },
  3: {
    id: 3,
    name: 'MP_SIEM',
  },
}

export const getIncidentVerdictTypes = () => {
  return {
    1: {
      id: 1,
      alias: 'true_positive',
      name: i18n.t('incidents.verdictTypes.true_positive'),
      color: '#A5D6A7',
    },
    2: {
      id: 2,
      alias: 'false_positive',
      name: i18n.t('incidents.verdictTypes.false_positive'),
      color: '#EF9A9A',
    },
  }
}

export const getEventSelectionDialogHeaders = () => {
  const tPrefix = 'incidents.incidentTableData.eventsTab.selectionDialog.'
  return {
    [SENSOR_TYPES.MP_SIEM]: {
      key: i18n.t(tPrefix + 'mpSiem.key'),
      name: i18n.t(tPrefix + 'mpSiem.name'),
      deviceReceiptTime: i18n.t(tPrefix + 'mpSiem.deviceReceiptTime'),
      sourceHostName: i18n.t(tPrefix + 'mpSiem.sourceHostName'),
      sourceAddress: i18n.t(tPrefix + 'mpSiem.sourceAddress'),
      destinationHostName: i18n.t(tPrefix + 'mpSiem.destinationHostName'),
      destinationAddress: i18n.t(tPrefix + 'mpSiem.destinationAddress'),
      severity: i18n.t(tPrefix + 'mpSiem.severity'),
      description: i18n.t(tPrefix + 'mpSiem.description'),
    },
    default: {
      sid: i18n.t(tPrefix + 'default.sid'),
      deviceReceiptTime: i18n.t(tPrefix + 'default.deviceReceiptTime'),
      hostName: i18n.t(tPrefix + 'default.hostName'),
      sourceAddress: i18n.t(tPrefix + 'default.sourceAddress'),
      destinationAddress: i18n.t(tPrefix + 'default.destinationAddress'),
      name: i18n.t(tPrefix + 'default.name'),
      object_: i18n.t(tPrefix + 'default.object'),
      destinationNtDomain: i18n.t(tPrefix + 'default.destinationNtDomain'),
    },
  }
}

export const common = Object.freeze({
  alertTimeout: 15,
  alertBuffer: 100,
})

export const getBulletinTypes = () => {
  return {
    1085: {
      id: 1085,
      alias: 'thread',
      name: i18n.t('bulletins.types.thread'),
    },
    1086: {
      id: 1086,
      alias: 'vulnerability',
      name: i18n.t('bulletins.types.vulnerability'),
    },
  }
}

export const getNcirccNotificationCategoryOptions = () => {
  return [
    { id: 1, name: i18n.t('ncircc.category.incident') },
    { id: 2, name: i18n.t('ncircc.category.attack') },
    { id: 3, name: i18n.t('ncircc.category.vulnerability') },
  ]
}

export const getNcirccNotificationMenuItems = () => {
  const p9s = store.getters['permissions/p9s']

  function show(incident) {
    return incident.submittedToNcircc && p9s.canUpdate(RULE_ENTITIES.NCIRCC)
  }

  return [
    { id: 1, name: i18n.t('ncircc.notification.title'), show: () => true },
    { id: 2, name: i18n.t('ncircc.comments.title'), show },
    { id: 3, name: i18n.t('ncircc.evidences.title'), show },
  ]
}

export const getTLPItems = () => {
  return [
    { id: 1, name: 'TLP:WHITE', color: 'white' },
    { id: 2, name: 'TLP:GREEN', color: 'green' },
    { id: 3, name: 'TLP:AMBER', color: 'amber' },
    { id: 4, name: 'TLP:RED', color: 'red' },
  ]
}

export const getActivityStatusItems = () => {
  return [
    { id: 1, name: i18n.t('ncircc.activityStatus.measuresTaken') },
    { id: 2, name: i18n.t('ncircc.activityStatus.measuresBeingTaken') },
    { id: 3, name: i18n.t('ncircc.activityStatus.activitiesResumed') },
    { id: 4, name: i18n.t('ncircc.activityStatus.notConfirmed') },
  ]
}

export const getAffectedSystemCategoryItems = () => {
  return [
    { id: 1, name: i18n.t('ncircc.affectedSystemCategory.firstCategory') },
    { id: 2, name: i18n.t('ncircc.affectedSystemCategory.secondCategory') },
    { id: 3, name: i18n.t('ncircc.affectedSystemCategory.thirdCategory') },
    { id: 4, name: i18n.t('ncircc.affectedSystemCategory.withoutCategory') },
    { id: 5, name: i18n.t('ncircc.affectedSystemCategory.notCii') },
  ]
}

export const getAffectedSystemFunctionItems = () => {
  return [
    { id: 1, name: i18n.t('ncircc.affectedSystemFunction.nuclear') },
    { id: 2, name: i18n.t('ncircc.affectedSystemFunction.banking') },
    { id: 3, name: i18n.t('ncircc.affectedSystemFunction.mining') },
    { id: 4, name: i18n.t('ncircc.affectedSystemFunction.stateAuthority') },
    { id: 5, name: i18n.t('ncircc.affectedSystemFunction.health') },
    { id: 6, name: i18n.t('ncircc.affectedSystemFunction.metal') },
    { id: 7, name: i18n.t('ncircc.affectedSystemFunction.science') },
    { id: 8, name: i18n.t('ncircc.affectedSystemFunction.defense') },
    { id: 9, name: i18n.t('ncircc.affectedSystemFunction.education') },
    { id: 10, name: i18n.t('ncircc.affectedSystemFunction.space') },
    { id: 11, name: i18n.t('ncircc.affectedSystemFunction.communication') },
    { id: 12, name: i18n.t('ncircc.affectedSystemFunction.massMedia') },
    { id: 13, name: i18n.t('ncircc.affectedSystemFunction.energy') },
    { id: 14, name: i18n.t('ncircc.affectedSystemFunction.transport') },
    { id: 15, name: i18n.t('ncircc.affectedSystemFunction.chemical') },
    { id: 16, name: i18n.t('ncircc.affectedSystemFunction.other') },
  ]
}

export const getImpactItems = () => {
  return [
    { id: 1, name: i18n.t('ncircc.impact.high') },
    { id: 2, name: i18n.t('ncircc.impact.low') },
    { id: 3, name: i18n.t('ncircc.impact.none') },
  ]
}

export const getActivityTypeItems = () => {
  return [
    { id: 1, name: i18n.t('ncircc.activityType.malwareControlCenter') },
    { id: 2, name: i18n.t('ncircc.activityType.malwareElement') },
    { id: 3, name: i18n.t('ncircc.activityType.malwareSource') },
    { id: 4, name: i18n.t('ncircc.activityType.notDefined') },
  ]
}

export const getNotificationStatusItems = () => {
  return [
    { id: 1, name: i18n.t('ncircc.notificationStatus.created') },
    { id: 2, name: i18n.t('ncircc.notificationStatus.registered') },
    { id: 3, name: i18n.t('ncircc.notificationStatus.supplementRequired') },
    { id: 4, name: i18n.t('ncircc.notificationStatus.verification') },
    { id: 5, name: i18n.t('ncircc.notificationStatus.decisionMade') },
    { id: 6, name: i18n.t('ncircc.notificationStatus.archived') },
  ]
}

export const getISO31662Codes = () => {
  return [
    { id: 'RU-AD', name: 'Республика Адыгея' },
    { id: 'RU-AL', name: 'Республика Алтай' },
    { id: 'RU-BA', name: 'Республика Башкортостан' },
    { id: 'RU-BU', name: 'Республика Бурятия' },
    { id: 'RU-CE', name: 'Чеченская республика' },
    { id: 'RU-CU', name: 'Чувашская Республика' },
    { id: 'RU-DA', name: 'Республика Дагестан' },
    { id: 'RU-IN', name: 'Республика Ингушетия' },
    { id: 'RU-KB', name: 'Кабардино-Балкарская Республика' },
    { id: 'RU-KL', name: 'Республика Калмыкия' },
    { id: 'RU-KC', name: 'Карачаево-Черкесская Республика' },
    { id: 'RU-KR', name: 'Республика Карелия' },
    { id: 'RU-KK', name: 'Республика Хакасия' },
    { id: 'RU-KO', name: 'Республика Коми' },
    { id: 'RU-ME', name: 'Республика Марий Эл' },
    { id: 'RU-MO', name: 'Республика Мордовия' },
    { id: 'RU-SA', name: 'Республика Саха' },
    { id: 'RU-SE', name: 'Республика Северная Осетия — Алания' },
    { id: 'RU-TA', name: 'Республика Татарстан' },
    { id: 'RU-TY', name: 'Республика Тыва' },
    { id: 'RU-UD', name: 'Удмуртская Республика' },
    { id: 'RU-ALT', name: 'Алтайский край' },
    { id: 'RU-KAM', name: 'Камчатский край' },
    { id: 'RU-KHA', name: 'Хабаровский край' },
    { id: 'RU-KDA', name: 'Краснодарский край' },
    { id: 'RU-KYA', name: 'Красноярский край' },
    { id: 'RU-PER', name: 'Пермский край' },
    { id: 'RU-PRI', name: 'Приморский край' },
    { id: 'RU-STA', name: 'Ставропольский край' },
    { id: 'RU-ZAB', name: 'Забайкальский край' },
    { id: 'RU-AMU', name: 'Амурская область' },
    { id: 'RU-ARK', name: 'Архангельская область' },
    { id: 'RU-AST', name: 'Астраханская область' },
    { id: 'RU-BEL', name: 'Белгородская область' },
    { id: 'RU-BRY', name: 'Брянская область' },
    { id: 'RU-CHE', name: 'Челябинская область' },
    { id: 'RU-IRK', name: 'Иркутская область' },
    { id: 'RU-IVA', name: 'Ивановская область' },
    { id: 'RU-KGD', name: 'Калининградская область' },
    { id: 'RU-KLU', name: 'Калужская область' },
    { id: 'RU-KEM', name: 'Кемеровская область' },
    { id: 'RU-KIR', name: 'Кировская область' },
    { id: 'RU-KOS', name: 'Костромская область' },
    { id: 'RU-KGN', name: 'Курганская область' },
    { id: 'RU-KRS', name: 'Курская область' },
    { id: 'RU-LEN', name: 'Ленинградская область' },
    { id: 'RU-LIP', name: 'Липецкая область' },
    { id: 'RU-MAG', name: 'Магаданская область' },
    { id: 'RU-MOS', name: 'Московская область' },
    { id: 'RU-MUR', name: 'Мурманская область' },
    { id: 'RU-NIZ', name: 'Нижегородская область' },
    { id: 'RU-NGR', name: 'Новгородская область' },
    { id: 'RU-NVS', name: 'Новосибирская область' },
    { id: 'RU-OMS', name: 'Омская область' },
    { id: 'RU-ORE', name: 'Оренбургская область' },
    { id: 'RU-ORL', name: 'Орловская область' },
    { id: 'RU-PNZ', name: 'Пензенская область' },
    { id: 'RU-PSK', name: 'Псковская область' },
    { id: 'RU-ROS', name: 'Ростовская область' },
    { id: 'RU-RYA', name: 'Рязанская область' },
    { id: 'RU-SAK', name: 'Сахалинская область' },
    { id: 'RU-SAM', name: 'Самарская область' },
    { id: 'RU-SAR', name: 'Саратовская область' },
    { id: 'RU-SMO', name: 'Смоленская область' },
    { id: 'RU-SVE', name: 'Свердловская область' },
    { id: 'RU-TAM', name: 'Тамбовская область' },
    { id: 'RU-TOM', name: 'Томская область' },
    { id: 'RU-TUL', name: 'Тульская область' },
    { id: 'RU-TVE', name: 'Тверская область' },
    { id: 'RU-TYU', name: 'Тюменская область' },
    { id: 'RU-ULY', name: 'Ульяновская область' },
    { id: 'RU-VLA', name: 'Владимирская область' },
    { id: 'RU-VGG', name: 'Волгоградская область' },
    { id: 'RU-VLG', name: 'Вологодская область' },
    { id: 'RU-VOR', name: 'Воронежская область' },
    { id: 'RU-YAR', name: 'Ярославская область' },
    { id: 'RU-MOW', name: 'Москва' },
    { id: 'RU-SPE', name: 'Санкт-Петербург' },
    { id: 'RU-YEV', name: 'Еврейская автономная область' },
    { id: 'RU-CHU', name: 'Чукотский автономный округ' },
    { id: 'RU-KHM', name: 'Ханты-Мансийский автономный округ — Югра' },
    { id: 'RU-NEN', name: 'Ненецкий автономный округ' },
    { id: 'RU-YAN', name: 'Ямало-Ненецкий автономный округ' },
    { id: 'UA-43', name: 'Автономная Республика Крым' },
    { id: 'UA-40', name: 'Севастополь' },
  ]
}

export const ncirccSensorTypes = {
  1: 'ViPNet IDS NS',
  2: 'ViPNet IDS HS',
  3: 'MP SIEM',
}

export const getProductCategoryItems = () => {
  return [
    { id: 1, name: i18n.t('ncircc.productCategory.osMicrosoft') },
    { id: 2, name: i18n.t('ncircc.productCategory.osUnix') },
    { id: 3, name: i18n.t('ncircc.productCategory.serverSoftware') },
    { id: 4, name: i18n.t('ncircc.productCategory.applicationSoftware') },
    { id: 5, name: i18n.t('ncircc.productCategory.workstationServerComponents') },
    { id: 6, name: i18n.t('ncircc.productCategory.telecomEquipment') },
    { id: 7, name: i18n.t('ncircc.productCategory.iss') },
    { id: 8, name: i18n.t('ncircc.productCategory.periphery') },
    { id: 9, name: i18n.t('ncircc.productCategory.industrialEquipment') },
    { id: 10, name: i18n.t('ncircc.productCategory.mobile') },
    { id: 11, name: i18n.t('ncircc.productCategory.iot') },
    { id: 12, name: i18n.t('ncircc.productCategory.health') },
    { id: 13, name: i18n.t('ncircc.productCategory.science') },
    { id: 14, name: i18n.t('ncircc.productCategory.transport') },
    { id: 15, name: i18n.t('ncircc.productCategory.communication') },
    { id: 16, name: i18n.t('ncircc.productCategory.energy') },
    { id: 17, name: i18n.t('ncircc.productCategory.banking') },
    { id: 18, name: i18n.t('ncircc.productCategory.fuel') },
    { id: 19, name: i18n.t('ncircc.productCategory.nuclear') },
    { id: 20, name: i18n.t('ncircc.productCategory.defence') },
    { id: 21, name: i18n.t('ncircc.productCategory.space') },
    { id: 22, name: i18n.t('ncircc.productCategory.mining') },
    { id: 23, name: i18n.t('ncircc.productCategory.metal') },
    { id: 24, name: i18n.t('ncircc.productCategory.chemical') },
  ]
}

export const getCmLines = () => {
  return [
    {
      id: 0,
      key: 'all',
      name: i18n.t(`incidents.all`),
    },
    {
      id: 1,
      key: 'first_line',
      name: i18n.t(`incidents.first_line`),
    },
    {
      id: 2,
      key: 'second_line',
      name: i18n.t(`incidents.second_line`),
    },
  ]
}

export const getPasswordRules = () => {
  return [
    { id: 1, text: i18n.t('dialogs.passwordHintModal.password_length') },
    { id: 2, text: i18n.t('dialogs.passwordHintModal.password_letters') },
    { id: 3, text: i18n.t('dialogs.passwordHintModal.password_digits') },
    { id: 4, text: i18n.t('dialogs.passwordHintModal.password_spaces') },
    { id: 5, text: i18n.t('dialogs.passwordHintModal.password_special') },
    { id: 6, text: i18n.t('dialogs.passwordHintModal.password_available_symbols') },
    { id: 7, text: i18n.t('dialogs.passwordHintModal.password_match') },
    { id: 8, text: i18n.t('dialogs.passwordHintModal.password_period') },
  ]
}

export const getRelativeValueTypes = () => {
  return [
    {
      id: 1,
      type: RELATIVE_VALUE_TYPE.MINUTE,
      name: i18n.t(`datetimePicker.minute`),
    },
    {
      id: 2,
      type: RELATIVE_VALUE_TYPE.HOUR,
      name: i18n.t(`datetimePicker.hour`),
    },
    {
      id: 3,
      type: RELATIVE_VALUE_TYPE.DAY,
      name: i18n.t(`datetimePicker.day`),
    },
    {
      id: 4,
      type: RELATIVE_VALUE_TYPE.WEEK,
      name: i18n.t(`datetimePicker.week`),
    },
    {
      id: 5,
      type: RELATIVE_VALUE_TYPE.MONTH,
      name: i18n.t(`datetimePicker.month`),
    },
  ]
}

export const getRelativeValueDirections = () => {
  return [
    {
      id: 1,
      type: RELATIVE_VALUE_DIRECTION.FORWARD,
      name: i18n.t(`datetimePicker.forward`),
    },
    {
      id: 2,
      type: RELATIVE_VALUE_DIRECTION.BACKWARD,
      name: i18n.t(`datetimePicker.backward`),
    },
  ]
}

export const getMonitoringModes = () => {
  return [
    {
      id: 1,
      name: i18n.t('organizations.monitoringModes.twentyfour_seven'),
    },
    {
      id: 2,
      name: i18n.t('organizations.monitoringModes.five_two'),
    },
  ]
}

export const getScopeTypes = () => {
  return [
    {
      id: 1,
      name: i18n.t('organizations.sphereTypes.defence_industry'),
    },
    {
      id: 2,
      name: i18n.t('organizations.sphereTypes.rocket_and_space_industry'),
    },
    {
      id: 3,
      name: i18n.t('organizations.sphereTypes.mining_industry'),
    },
    {
      id: 4,
      name: i18n.t('organizations.sphereTypes.metallurgical_industry'),
    },
    {
      id: 5,
      name: i18n.t('organizations.sphereTypes.chemical_industry'),
    },
    {
      id: 6,
      name: i18n.t('organizations.sphereTypes.energy_industry'),
    },
    {
      id: 7,
      name: i18n.t('organizations.sphereTypes.nuclear_power_industry'),
    },
    {
      id: 8,
      name: i18n.t('organizations.sphereTypes.fec'),
    },
    {
      id: 9,
      name: i18n.t('organizations.sphereTypes.communication'),
    },
    {
      id: 10,
      name: i18n.t('organizations.sphereTypes.banking'),
    },
    {
      id: 11,
      name: i18n.t('organizations.sphereTypes.financial_sphere'),
    },
    {
      id: 12,
      name: i18n.t('organizations.sphereTypes.science'),
    },
    {
      id: 13,
      name: i18n.t('organizations.sphereTypes.transport'),
    },
    {
      id: 14,
      name: i18n.t('organizations.sphereTypes.healthcare'),
    },
  ]
}

export const getSubjectTypes = () => {
  return [
    {
      id: 1,
      name: i18n.t('organizations.subjectTypes.federal_public_authority'),
    },
    {
      id: 2,
      name: i18n.t('organizations.subjectTypes.regional_public_authority'),
    },
    {
      id: 3,
      name: i18n.t('organizations.subjectTypes.central_bank_of_russian_federation'),
    },
    {
      id: 4,
      name: i18n.t('organizations.subjectTypes.nonprofit_organization'),
    },
    {
      id: 5,
      name: i18n.t('organizations.subjectTypes.commercial_organization'),
    },
    {
      id: 6,
      name: i18n.t('organizations.subjectTypes.local_government'),
    },
    {
      id: 7,
      name: i18n.t('organizations.subjectTypes.individual_entrepreneur'),
    },
  ]
}

export const getDistrictTypes = () => {
  return [
    {
      id: 1,
      name: i18n.t('organizations.districtTypes.central'),
    },
    {
      id: 2,
      name: i18n.t('organizations.districtTypes.north_western'),
    },
    {
      id: 3,
      name: i18n.t('organizations.districtTypes.southern'),
    },
    {
      id: 4,
      name: i18n.t('organizations.districtTypes.north_caucasian'),
    },
    {
      id: 5,
      name: i18n.t('organizations.districtTypes.volga'),
    },
    {
      id: 6,
      name: i18n.t('organizations.districtTypes.ural'),
    },
    {
      id: 7,
      name: i18n.t('organizations.districtTypes.siberian'),
    },
    {
      id: 8,
      name: i18n.t('organizations.districtTypes.far_east'),
    },
  ]
}

export const getOciiTypes = () => {
  return [
    {
      id: 1,
      name: i18n.t('organizations.ociiTypes.first_category'),
    },
    {
      id: 2,
      name: i18n.t('organizations.ociiTypes.second_category'),
    },
    {
      id: 3,
      name: i18n.t('organizations.ociiTypes.third_category'),
    },
    {
      id: 4,
      name: i18n.t('organizations.ociiTypes.no_category'),
    },
    {
      id: 5,
      name: i18n.t('organizations.ociiTypes.fstec_consideration'),
    },
    {
      id: 6,
      name: i18n.t('organizations.ociiTypes.not_cii'),
    },
  ]
}

export const getNodeCriticalityLevels = () => {
  return {
    1: {
      id: 1,
      name: i18n.t('actives.nodesTab.criticalityLevels.low'),
    },
    2: {
      id: 2,
      name: i18n.t('actives.nodesTab.criticalityLevels.middle'),
    },
    3: {
      id: 3,
      name: i18n.t('actives.nodesTab.criticalityLevels.high'),
    },
  }
}

export const datetimeFormatWithSec = 'YYYY-MM-DD HH:mm:ss'
export const datetimeFormat = 'YYYY-MM-DD HH:mm'
export const dateFormat = 'YYYY-MM-DD'
export const timeFormat = 'HH:mm'
