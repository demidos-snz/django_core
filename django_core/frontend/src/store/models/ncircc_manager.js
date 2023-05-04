import { isEqual, isNil, isUndefined } from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import { NCIRCC_NOTIFICATION_CATEGORY, TLP_ITEMS } from '@/constants/enums'
import { ncirccSensorTypes, datetimeFormatWithSec } from '@/constants/constants'

/**
 * Список свойств, связанных с уведомлением НКЦКИ.
 * **/
const NCIRCC_RELATED_FIELDS = [
  'category',
  'type',
  'company',
  'ownername',
  'detecttime',
  'endtime',
  'assistance',
  'activitystatus',
  'detectiontool',
  'eventdescription',
  'tlp',
  'location',
  'city',
  'integrityimpact',
  'availabilityimpact',
  'confidentialityimpact',
  'customimpact',
  'affectedsystemname',
  'affectedsystemcategory',
  'affectedsystemfunction',
  'relatedindicatorsasn',
  'relatedindicatorsas',
  'relatedindicatorsaslir',
  'relatedobservablesservice',
  'relatedobservablesipv4',
  'relatedobservablesipv6',
  'relatedobservablesdomain',
  'relatedobservablesuri',
  'relatedobservablesemail',
  'relatedindicatorsipv4',
  'relatedindicatorsipv6',
  'relatedindicatorsdomain',
  'relatedindicatorsuri',
  'relatedindicatorsemail',
  'malwarehash',
  'relatedindicatorsvuln',
  'productcategory',
  'productinfo',
  'vulnerabilityid',
  'affectedsystemconnection',
]

/**
 * Список свойств, связанных с уведомлением НКЦКИ, значения которых являются списками.
 * **/
const ARRAY_ITEMS = [
  'relatedobservablesservice',
  'relatedobservablesipv4',
  'relatedobservablesipv6',
  'relatedobservablesdomain',
  'relatedobservablesuri',
  'relatedobservablesemail',
  'relatedindicatorsipv4',
  'relatedindicatorsipv6',
  'relatedindicatorsdomain',
  'relatedindicatorsuri',
  'relatedindicatorsemail',
  'malwarehash',
  'relatedindicatorsvuln',
  'productinfo',
]

const DATETIME_FIELDS = ['detecttime', 'endtime']

/**
 * Класс-обертка данных уведомления, реализующий логику хранения значений при их изменении.
 *
 * @param { Object } incident: объект инцидента, для которого формируется/изменяется уведомление
 *
 * @param { Object } initialData: словарь { category: Number, hasNetwork: Boolean } начальных данных для определения
 * типа и формирования уведомления
 *
 * **/
class NcirccManagerInner {
  constructor(incident, initialData) {
    this.datetimeFormat = datetimeFormatWithSec
    this.incident = incident
    this.initialMap = { ...initialData }
    this.changesMap = {}
    this.items = {}

    for (const property of NCIRCC_RELATED_FIELDS) {
      if (this.constructor.prototype.hasOwnProperty(property)) continue

      /**
       * Для каждого свойства уведомления, кроме тех для которых в классе определены собственные методы, задаем
       * методы получения и обновления через методы get и set.
       * **/
      Object.defineProperty(this, property, {
        set: this.set,
        get: this.get,
      })
    }
  }

  /**
   * Является ли уведомление уведомлением о компьютерном инциденте
   * **/
  get isIncident() {
    return this.category === NCIRCC_NOTIFICATION_CATEGORY.INCIDENT
  }

  /**
   * Является ли уведомление уведомлением о компьютерной атаке
   * **/
  get isAttack() {
    return this.category === NCIRCC_NOTIFICATION_CATEGORY.ATTACK
  }

  /**
   * Является ли уведомление уведомлением о компьютерной уязвимости
   * **/
  get isVulnerability() {
    return this.category === NCIRCC_NOTIFICATION_CATEGORY.VULNERABILITY
  }

  /**
   * Если уведомление уже отправлялось в НКЦКИ - возвращает дату последнего изменения.
   * **/
  get modified() {
    if (this.submitted) {
      return this.incident.ncircc.modified
    }
    return '-'
  }

  /**
   * Помогает определить, отправлялось ли уведомление в НКЦКИ.
   * **/
  get submitted() {
    return this.incident.submittedToNcircc
  }

  /**
   * Категория уведомления. При создании передается в конструктор класса, при изменении уже содержиться в данных
   * уведомления.
   * **/
  get category() {
    if (this.submitted) {
      return this.incident.ncircc.category
    }
    return this.initialMap.category
  }

  /**
   * Наличие подключения к сети. При создании передается в конструктор класса, при изменении уже содержиться в данных
   * уведомления.
   * **/
  get affectedsystemconnection() {
    if (this.submitted) {
      return this.incident.ncircc.affectedsystemconnection
    }
    return this.initialMap.hasNetwork
  }

  /**
   * Тип инцидента связанный с уведомлением. По умолчанию получает значение из связанного инцидента.
   * **/
  get type() {
    if (this.submitted) {
      return this.incident.ncircc.type
    }
    return this.incident.typeIncident
  }

  /**
   * Наименование компании связанной с уведомлением. По умолчанию получает значение из связанного инцидента.
   * **/
  get company() {
    if (this.submitted) {
      return this.incident.ncircc.company
    }
    return this.incident.organization.name
  }

  /**
   * Наименование компании связанной с уведомлением. По умолчанию получает значение из связанного инцидента.
   * **/
  get ownername() {
    if (this.submitted) {
      return this.incident.ncircc.ownername
    }
    return this.incident.organization.name
  }

  get tlp() {
    if (this.submitted) {
      return this.incident.ncircc.tlp
    }
    return TLP_ITEMS.AMBER
  }

  get detectiontool() {
    if (this.submitted) {
      return this.incident.ncircc.detectiontool
    }

    const sensors = this.incident.sensors
    const types = new Set()
    for (const sensor of sensors) {
      types.add(sensor.typeSensor)
    }

    return Array.from(types)
      .map((item) => ncirccSensorTypes[item])
      .join(', ')
  }

  /**
   * Уникальный идентификатор уведомления.
   * **/
  get uuid() {
    return this.incident.ncircc.uuid
  }

  /**
   * Регистрационный номер уведомления.
   * **/
  get registrationNumber() {
    return this.incident.ncircc.registrationNumber
  }

  /**
   * Текущий статус уведомления
   * **/
  get status() {
    return this.incident.ncircc.status
  }

  /**
   * Время обнаружения. По умолчанию - время фиксации связанного инцидента.
   * **/
  get detecttime() {
    if (this.submitted) {
      return moment(this.incident.ncircc.detecttime).format(this.datetimeFormat)
    }
    return moment(this.incident.registrationDatetime).format(this.datetimeFormat)
  }

  /**
   * Время закрытия. По умолчанию возвращает время закрытия связанного инцидента.
   * **/
  get endtime() {
    if (this.submitted) {
      const endtime = this.incident.ncircc.endtime
      if (!isNil(endtime)) {
        return moment(this.incident.ncircc.endtime).format(this.datetimeFormat)
      }
    } else {
      const closedDatetime = this.incident.closedDatetime
      if (!isNil(closedDatetime)) {
        return moment(closedDatetime).format(this.datetimeFormat)
      }
    }

    return null
  }

  /**
   * Описание уведомления. По умолчанию - описание инцидента.
   * **/
  get eventdescription() {
    if (this.submitted) {
      return this.incident.ncircc.eventdescription
    }
    return this.incident.description
  }

  /**
   * Помогает определить необходимость добавления блока полей влияния в уведомление. Согласно апи этот блок добавляться
   * для уведомлений типа "Комптютерный инцидент", "Компьютерная атака".
   * **/
  get hasImpactBlock() {
    return this.isIncident || this.isAttack
  }

  /**
   * Помогает определить необходимость добавления блока полей "технические сведения об атакованном ресурсе".
   * Согласно апи этот блок добавляться для уведомлений с возможностью подключения к сети.
   * **/
  get needAddObservableInfo() {
    return this.affectedsystemconnection
  }

  /**
   * Помогает определить необходимость добавления блока полей "технические сведения о вредоносной системе".
   * Согласно апи этот блок добавляться для уведомлений "Компьютерный инцидент", "Компьютерная атака"
   * с возможностью подключения к сети.
   * **/
  get needAddIndicatorsInfo() {
    if (!this.affectedsystemconnection) {
      return false
    }

    return this.isIncident || this.isAttack
  }

  /**
   * Помогает определить необходимость добавления блока полей "Технические сведения об уязвимости" в уведомление.
   * Согласно апи этот блок добавляться для уведомлений типа "Компьютерная уязвимость".
   * **/
  get needAddVulnerabilityInfo() {
    return this.isVulnerability
  }

  /**
   * Помогает определить необходимость добавления блока полей "ASN" в уведомление.
   * Согласно апи этот блок добавляться для уведомлений типа "Комптютерный инцидент" c возможностью подключения к сети.
   * **/
  get needAddASInfo() {
    return this.isIncident && this.affectedsystemconnection
  }

  /**
   * Основной метод получения свойств, позволяет обращаться к свойствам объекта и получать обновленные данные (если
   * они есть) не изменяя начальные значения свойств.
   * Если искомое свойство не является свойством, относящимся к уведомлению - работает как обычное получения свойства
   * экземпляра класса.
   * **/
  get(field) {
    if (!NCIRCC_RELATED_FIELDS.includes(field)) {
      return this[field]
    }

    /**
     * Если словарь изменений уже содержит данные об этом свойстве - возвращаем эти данные.
     * **/
    if (!isUndefined(this.changesMap[field])) {
      return this.changesMap[field]
    }

    let value
    if (ARRAY_ITEMS.includes(field)) {
      /**
       * Если свойство списочное (отображается как выпадающий список с возможность выбора нескольких значений
       * в карточке), необходимо сохранить все текущие значения этого поля в объект items класса, для их использования
       * компонентом как списка всех доступных значений.
       * **/
      value = this.incident.ncircc[field] || []
      Vue.set(this.items, field, value)
    } else {
      if (this.constructor.prototype.hasOwnProperty(field)) {
        /**
         * Если у данного класса есть метод получения значения свойства - используем этот метод. Сделано для определения
         * начальных значений некоторых свойств (описание, компания, т.д.)
         * **/
        value = this[field]
      } else {
        /**
         * Иначе берем значение из словаря данных уведомления.
         * **/
        value = this.incident.ncircc[field]
      }
    }

    /**
     * Обязательно используется Vue для добавления реактивности значения.
     * **/
    Vue.set(this.changesMap, field, value)
    return this.changesMap[field]
  }

  /**
   * Основной метод установки значения поля.
   *
   * Если поле не связано с уведомлением работает стандартная локига установки атрибута объекта.
   *
   * **/
  set(field, value) {
    if (!NCIRCC_RELATED_FIELDS.includes(field)) {
      this[field] = value
      return true
    }

    if (isEqual(value, this.initialMap[field])) {
      /**
       * Если новое значения поля не отличается от начального значения (при изменении данных уведомления) - измененное
       * значение удаляется
       * **/
      Vue.delete(this.changesMap, field)
      return true
    }

    if (ARRAY_ITEMS.includes(field)) {
      /**
       * Для списочных значений - добавляем новое значение в конец списка.
       * **/
      if (!Array.isArray(value)) {
        value = [...this.changesMap[field], value]
      }
    }

    /**
     * Обязательно используется Vue для добавления реактивности значения.
     * **/
    Vue.set(this.changesMap, field, value)

    return true
  }

  /**
   * Помогает понять, были ли какие-то изменения в уведомлении.
   * **/
  get hasChanges() {
    for (const key in this.changesMap) {
      if (this.changesMap.hasOwnProperty(key)) {
        const value = this.changesMap[key]
        const initialValue = this.incident.ncircc[key]
        if (!isEqual(value, initialValue)) {
          return true
        }
      }
    }
    return false
  }

  /**
   * Метод получения данных уведомления. Возвращает все текущие данные (с изменениями).
   * @param { Boolean } onlyChanged: Вернуть только изменившиеся данные.
   * **/
  getData(onlyChanged = false) {
    const data = {}
    for (const fieldName of NCIRCC_RELATED_FIELDS) {
      if (onlyChanged) {
        const value = this.changesMap[fieldName]

        if (value === undefined) {
          continue
        }

        const initialValue = this.incident.ncircc[fieldName]
        if (isEqual(value, initialValue)) continue
      }
      let value = this.get(fieldName)

      if (DATETIME_FIELDS.includes(fieldName)) {
        value = moment(value).toISOString()
      }

      data[fieldName] = value
    }

    return data
  }
}

class NcirccManager {
  /**
   * Proxy обертка класса менеджера уведомления.
   * **/
  constructor(incident, initialData) {
    const handler = {
      get(target, name) {
        return target.get(name)
      },
      set(target, name, value) {
        return target.set(name, value)
      },
    }
    const manager = new NcirccManagerInner(incident, initialData)

    return new Proxy(manager, handler)
  }
}

export default NcirccManager
