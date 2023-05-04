<template>
  <v-data-table :headers="headerItems" id="resizableTable" v-on="$listeners" v-bind="$attrs" :class="tableClass">
    <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
  </v-data-table>
</template>

<script>
  import { fromStorage, toStorage } from '@/store/utils'
  import { isNil } from 'lodash'
  import Vue from 'vue'

  class ResizableTable {
    constructor(table, storageKey) {
      this.table = table
      this.storageKey = storageKey
      this.columns = []
      this.columnsWidth = {}

      this.loadColumnWidthValues()
    }

    getWidth(column) {
      if (this.columnsWidth.hasOwnProperty(column)) {
        return this.columnsWidth[column]
      }

      return null
    }

    loadColumnWidthValues() {
      const values = fromStorage(this.storageKey)
      const parsedValues = JSON.parse(values)

      if (!isNil(parsedValues)) {
        this.columnsWidth = parsedValues
      }
    }

    storeColumnWidthValues() {
      const stringifiedValues = JSON.stringify(this.columnsWidth)
      toStorage(this.storageKey, stringifiedValues)
    }

    makeResizable() {
      const rows = this.table.getElementsByTagName('tr')
      const header = rows[0]

      if (header.children) {
        this.columns = header.children
        for (const column of this.columns) {
          this._addColResizer(column)
        }
      }
    }

    _addColResizer(column) {
      const oldResizer = column.querySelector('.resizer')
      if (oldResizer) oldResizer.remove()

      const div = this._createResizer()
      column.appendChild(div)
      column.style.position = 'relative'
      this._setListeners(div)
    }

    _createResizer() {
      const resizer = document.createElement('div')
      resizer.classList.add('resizer')
      return resizer
    }

    _setListeners(element) {
      let pageX
      let curCol, curColWidth
      const self = this

      element.addEventListener('click', (event) => event.stopPropagation())

      element.addEventListener('mousedown', function (event) {
        curCol = event.target.parentElement
        pageX = event.pageX

        const padding = ResizableTable.paddingDiff(curCol)

        curColWidth = curCol.offsetWidth - padding
      })

      document.addEventListener('mousemove', function (event) {
        if (curCol) {
          const diffX = event.pageX - pageX
          const curColNewWidth = curColWidth + diffX + 'px'

          curCol.style.width = curColNewWidth
          curCol.style.minWidth = curColNewWidth
        }
      })

      document.addEventListener('mouseup', function () {
        self.saveColumnsWidth()

        pageX = undefined
        curCol = undefined
        curColWidth = undefined
      })
    }

    saveColumnsWidth() {
      for (const column of this.columns) {
        const valueIndicator = column.querySelector('[title="valueIndicator"]')
        const columnName = valueIndicator.id
        this.columnsWidth[columnName] = column.style.width
      }
    }

    static paddingDiff(column) {
      if (this.getStyleVal(column, 'box-sizing') === 'border-box') {
        return 0
      }

      const padLeft = this.getStyleVal(column, 'padding-left')
      const padRight = this.getStyleVal(column, 'padding-right')
      return parseInt(padLeft) + parseInt(padRight)
    }

    static getStyleVal(element, property) {
      return window.getComputedStyle(element, null).getPropertyValue(property)
    }
  }

  export default {
    name: 'ResizableTable',

    props: {
      headers: {
        type: Array,
        required: true,
      },
      tableClass: {
        type: String,
        required: false,
        default: '',
      },
      storageKey: {
        type: String,
        required: true,
      },
    },

    data: () => ({
      resizeHandler: null,
    }),

    computed: {
      headerItems() {
        return this.headers.map((header) => {
          if (!isNil(this.resizeHandler)) {
            const columnWidth = this.resizeHandler.getWidth(header.value)
            if (!isNil(columnWidth)) {
              header.width = columnWidth
            }
          }
          return header
        })
      },
    },

    methods: {
      storeColumnWidths() {
        this.resizeHandler && this.resizeHandler.storeColumnWidthValues()
      },

      initResizeHandler() {
        const table = document.getElementById('resizableTable')
        if (this.resizeHandler) {
          this.resizeHandler.table = table
        } else {
          this.resizeHandler = new ResizableTable(table, this.storageKey)
        }

        this.resizeHandler.makeResizable()
      },
    },

    mounted() {
      this.initResizeHandler()
    },

    watch: {
      headerItems() {
        Vue.nextTick(() => {
          this.initResizeHandler()
        })
      },
    },

    created() {
      window.addEventListener('unload', this.storeColumnWidths)
    },

    beforeDestroy() {
      this.storeColumnWidths()
    },
  }
</script>
<style lang="scss">
  .row-pointer {
    tr:hover {
      cursor: pointer;
    }
  }

  .custom-table-content {
    .custom-table-top {
      height: 10%;
    }

    .v-data-table__wrapper {
      height: 83%;
      overflow: auto !important;
    }

    .v-data-footer {
      height: 7%;
    }

    #resizableTable {
      th:not(:last-child) {
        border-right: 1px solid #ffffff1f;
      }
    }
  }

  .v-data-table-header {
    th {
      white-space: nowrap;
    }
  }

  .resizer {
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    position: absolute;
    cursor: col-resize;
    user-select: none;
  }
</style>
