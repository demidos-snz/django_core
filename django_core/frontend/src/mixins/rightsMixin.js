import { mapGetters } from 'vuex'
import { CM_LINE, ROLE, RULE_ENTITIES, STATUS } from '@/constants/enums'

export default {
  methods: {},
  computed: {
    ...mapGetters('operator', ['operator', 'role']),
    ...mapGetters('permissions', ['p9s']),

    canSendNotification() {
      return (incident) => {
        switch (incident.status) {
          case STATUS.IN_WORK_OF_MC:
          case STATUS.IN_WORK_OF_CLIENT:
            switch (incident.cmLine) {
              case CM_LINE.FIRST_LINE:
                return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_FIRST_LINE, ROLE.OPERATOR_OF_SECOND_LINE].includes(
                  this.operator.role
                )
              case CM_LINE.SECOND_LINE:
                return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_SECOND_LINE].includes(this.operator.role)
              default:
                return false
            }
          case STATUS.CLOSING_REQUEST:
            return [ROLE.SUPERUSER].includes(this.operator.role)
          case STATUS.CLOSED:
          default:
            return false
        }
      }
    },
    canCreateIncident() {
      return ![ROLE.SYSADMIN, ROLE.CLIENT].includes(this.operator.role)
    },
    canDeleteIncident() {
      return (incident) => {
        if ([STATUS.CLOSED].includes(incident.status)) return false

        const isAuthor = this.operator.id === incident.author.id
        const clientAuthor = incident.author.role === ROLE.CLIENT_OF_FIRST_LINE

        if (this.operator.role === ROLE.SUPERUSER) return true
        else if (!isAuthor) return false
        else if (incident.status === STATUS.IN_WORK_OF_MC && !clientAuthor) {
          switch (incident.cmLine) {
            case CM_LINE.FIRST_LINE:
              return this.operator.role === ROLE.OPERATOR_OF_FIRST_LINE
            case CM_LINE.SECOND_LINE:
              return this.operator.role === ROLE.OPERATOR_OF_SECOND_LINE
            default:
              return false
          }
        } else if (incident.status === STATUS.IN_WORK_OF_CLIENT && clientAuthor) {
          return incident.cmLine === CM_LINE.FIRST_LINE && this.operator.role === ROLE.CLIENT_OF_FIRST_LINE
        }

        return false
      }
    },
    canFilterIncidentLines() {
      return ![ROLE.SYSADMIN, ROLE.CLIENT_OF_FIRST_LINE, ROLE.CLIENT].includes(this.operator.role)
    },
    canAddComments() {
      return this.operator.role !== ROLE.SYSADMIN
    },
    canDeleteComment() {
      return (comment) => {
        return comment.user.id === this.operator.id || this.operator.role === ROLE.SUPERUSER
      }
    },
    canAddAttachments() {
      return this.operator.role !== ROLE.SYSADMIN
    },
    canDeleteAttachment() {
      return (file) => {
        return file.userId === this.operator.id || this.operator.role === ROLE.SUPERUSER
      }
    },
    canCreateIncidentEvents() {
      return (incident) => {
        const hasRights = this.p9s.canCreate(RULE_ENTITIES.EVENTS)
        const isAuthor = incident.assigned ? this.operator.id === incident.assignedId : false
        const isSuperuser = this.operator.role === ROLE.SUPERUSER
        if (incident.assigned) {
          return hasRights && (isAuthor || isSuperuser)
        }
        if (incident.cmLine === CM_LINE.FIRST_LINE) {
          return isAuthor
        }
        if (incident.cmLine === CM_LINE.SECOND_LINE) {
          return isSuperuser
        }
      }
    },
    canCreateUser() {
      return [ROLE.SYSADMIN, ROLE.SUPERUSER].includes(this.operator.role)
    },
    canUpdateUser() {
      return [ROLE.SYSADMIN, ROLE.SUPERUSER].includes(this.operator.role)
    },
    canCreateOrganization() {
      return [ROLE.SYSADMIN, ROLE.SUPERUSER].includes(this.operator.role)
    },
    hasReportAccess() {
      return ![ROLE.SYSADMIN, ROLE.CLIENT, ROLE.CLIENT_OF_FIRST_LINE].includes(this.operator.role)
    },
    canCreateReports() {
      return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_FIRST_LINE, ROLE.OPERATOR_OF_SECOND_LINE].includes(this.operator.role)
    },
    canDeleteReport() {
      return (report) => {
        return this.operator.role === ROLE.SUPERUSER || report.authorId === this.operator.id
      }
    },
    canUpdateAffectedAssets() {
      return (incident) => {
        switch (incident.status) {
          case STATUS.IN_WORK_OF_MC:
            switch (incident.cmLine) {
              case CM_LINE.FIRST_LINE:
                return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_FIRST_LINE, ROLE.OPERATOR_OF_SECOND_LINE].includes(
                  this.operator.role
                )
              case CM_LINE.SECOND_LINE:
                return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_SECOND_LINE].includes(this.operator.role)
              default:
                return false
            }
          case STATUS.IN_WORK_OF_CLIENT:
            switch (incident.cmLine) {
              case CM_LINE.FIRST_LINE:
                return [ROLE.SUPERUSER, ROLE.CLIENT_OF_FIRST_LINE].includes(this.operator.role)
              case CM_LINE.SECOND_LINE:
                return [ROLE.SUPERUSER].includes(this.operator.role)
              default:
                return false
            }
          case STATUS.CLOSING_REQUEST:
          case STATUS.CLOSED:
          default:
            return false
        }
      }
    },
    canUpdateIocs() {
      return (incident) => {
        switch (incident.status) {
          case STATUS.IN_WORK_OF_MC:
            switch (incident.cmLine) {
              case CM_LINE.FIRST_LINE:
                return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_FIRST_LINE, ROLE.OPERATOR_OF_SECOND_LINE].includes(
                  this.operator.role
                )
              case CM_LINE.SECOND_LINE:
                return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_SECOND_LINE].includes(this.operator.role)
              default:
                return false
            }
          case STATUS.IN_WORK_OF_CLIENT:
            switch (incident.cmLine) {
              case CM_LINE.FIRST_LINE:
                return [ROLE.SUPERUSER, ROLE.CLIENT_OF_FIRST_LINE].includes(this.operator.role)
              case CM_LINE.SECOND_LINE:
                return [ROLE.SUPERUSER].includes(this.operator.role)
              default:
                return false
            }
          case STATUS.CLOSING_REQUEST:
          case STATUS.CLOSED:
          default:
            return false
        }
      }
    },
    availableStatuses() {
      return (incident) => {
        let statuses = function () {
          if (this.operator.role === ROLE.SUPERUSER)
            return [STATUS.IN_WORK_OF_MC, STATUS.IN_WORK_OF_CLIENT, STATUS.CLOSING_REQUEST, STATUS.CLOSED]

          const clientAuthor = incident.author.role === ROLE.CLIENT_OF_FIRST_LINE

          switch (incident.status) {
            case STATUS.IN_WORK_OF_MC:
              if (clientAuthor) {
                if (this.operator.role === ROLE.OPERATOR_OF_SECOND_LINE && incident.cmLine === CM_LINE.SECOND_LINE) {
                  return [STATUS.IN_WORK_OF_CLIENT, STATUS.CLOSED]
                }
              } else {
                if (this.operator.role === ROLE.OPERATOR_OF_FIRST_LINE && incident.cmLine === CM_LINE.FIRST_LINE) {
                  return [STATUS.IN_WORK_OF_CLIENT, STATUS.CLOSING_REQUEST]
                }
                if (this.operator.role === ROLE.OPERATOR_OF_SECOND_LINE && incident.cmLine === CM_LINE.SECOND_LINE) {
                  return [STATUS.IN_WORK_OF_CLIENT, STATUS.CLOSED]
                }
              }
              return []
            case STATUS.IN_WORK_OF_CLIENT:
              if (clientAuthor) {
                if (this.operator.role === ROLE.CLIENT_OF_FIRST_LINE && incident.cmLine === CM_LINE.FIRST_LINE) {
                  return [STATUS.CLOSED]
                }
                if (this.operator.role === ROLE.CLIENT && incident.cmLine === CM_LINE.FIRST_LINE) {
                  return [STATUS.CLOSING_REQUEST]
                }
                if (this.operator.role === ROLE.CLIENT && incident.cmLine === CM_LINE.SECOND_LINE) {
                  return [STATUS.IN_WORK_OF_MC, STATUS.CLOSING_REQUEST]
                }
              } else {
                if (this.operator.role === ROLE.CLIENT) {
                  return [STATUS.IN_WORK_OF_MC, STATUS.CLOSING_REQUEST]
                }
              }
              return []
            case STATUS.CLOSING_REQUEST:
              if (clientAuthor) {
                if (this.operator.role === ROLE.OPERATOR_OF_SECOND_LINE && incident.cmLine === CM_LINE.SECOND_LINE) {
                  return [STATUS.IN_WORK_OF_MC, STATUS.IN_WORK_OF_CLIENT, STATUS.CLOSED]
                }
                if (this.operator.role === ROLE.CLIENT_OF_FIRST_LINE && incident.cmLine === CM_LINE.FIRST_LINE) {
                  return [STATUS.IN_WORK_OF_CLIENT, STATUS.CLOSED]
                }
              } else {
                if (this.operator.role === ROLE.OPERATOR_OF_SECOND_LINE) {
                  return [STATUS.IN_WORK_OF_MC, STATUS.IN_WORK_OF_CLIENT, STATUS.CLOSED]
                }
              }
              return []
            case STATUS.CLOSED:
            default:
              return []
          }
        }.bind(this)()
        if (incident.transmissionDatetimeRaw) {
          return statuses
        } else {
          statuses = statuses.filter((status) => status !== STATUS.IN_WORK_OF_CLIENT)
          return statuses
        }
      }
    },
    canDeleteRecommendation() {
      return (recommendation) => {
        return !recommendation.confirmed && this.p9s.canDelete(RULE_ENTITIES.RECOMMENDATIONS)
      }
    },
    canCreateBulletins() {
      return () => {
        return this.operator.role === ROLE.SUPERUSER
      }
    },
    canDeleteBulletin() {
      return () => {
        return this.operator.role === ROLE.SUPERUSER
      }
    },
    canChangeSensorActiveness() {
      return [ROLE.SUPERUSER, ROLE.SYSADMIN].includes(this.operator.role)
    },
    canReadNcirccData() {
      return (incident) => {
        return incident.organization.isOcii && this.p9s.canRead(RULE_ENTITIES.NCIRCC)
      }
    },
    canCreateNcirccData() {
      return (incident) => {
        return incident.organization.isOcii && this.p9s.canCreate(RULE_ENTITIES.NCIRCC)
      }
    },
    canUpdateNcirccData() {
      return (incident) => {
        return incident.organization.isOcii && this.p9s.canUpdate(RULE_ENTITIES.NCIRCC)
      }
    },
    canCreateActives() {
      return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_SECOND_LINE, ROLE.SYSADMIN].includes(this.operator.role)
    },
    canUpdateActives() {
      return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_SECOND_LINE, ROLE.SYSADMIN].includes(this.operator.role)
    },
    canDeleteActives() {
      return [ROLE.SUPERUSER, ROLE.OPERATOR_OF_SECOND_LINE, ROLE.SYSADMIN].includes(this.operator.role)
    },
  },
}
