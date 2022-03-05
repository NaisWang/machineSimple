<template>
  <div>
    <OrderFilter ref="orderFilter" :search-machine="searchMachine" :condition-show="conditionShow"
                 @searchMachines="initTableData" @cancelAdvSearch="cancelAdvSearch"
                 @deleteItemByBatch="deleteItemByBatch" @openDeleteItemByBatch="openDeleteItemByBatch"
                 @closeDeleteItemByBatch="closeDeleteItemByBatch" :is-delete-by-batch="isDeleteByBatch"
                 :table-data="tableData"
                 :show-sum-sale-price="true"
                 :pl-table="$refs.plTable"></OrderFilter>
    <u-table
        ref="plTable"
        :data="tableData"
        :height="height"
        :row-height="17"
        showBodyOverflow="title"
        :data-changes-scroll-top=false
        showHeaderOverflow="title"
        use-virtual
        border>
      <u-table-column type="selection" v-if="isDeleteByBatch" width="55"/>
      <u-table-column type="index" width="70" fixed/>
      <u-table-column
          prop="machineNumber"
          label="物品编号"
          width="150">
        <template #default="scope">
          <el-input type="text" v-if="scope.row.newDataRow" ref="focusInput" v-model="scope.row.machineNumber"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.machineNumber"
                    @change="machineNumberChange(scope.row)"></el-input>
          <span v-else>{{ scope.row.machineNumber }}</span>
        </template>
      </u-table-column>
      <u-table-column
          prop="imei"
          label="IMEI号"
          width="150">
      </u-table-column>
      <u-table-column
          prop="brand"
          label="品牌"
          width="80">
      </u-table-column>
      <u-table-column
          prop="model"
          label="型号"
          width="100">
      </u-table-column>
      <u-table-column
          prop="sku"
          label="SKU"
          width="100">
      </u-table-column>
      <u-table-column
          prop="quality"
          label="成色"
          width="60">
      </u-table-column>
      <u-table-column
          prop="conditionDescription"
          label="机况描述"
          width="150">
      </u-table-column>
      <u-table-column
          prop="bidPrice"
          label="中标金额"
          width="70">
      </u-table-column>
      <u-table-column
          prop="saleChannel"
          label="销售渠道"
          width="90">
        <template #default="scope">
          <el-input type="text" v-model="scope.row.saleChannel"
                    @change="itemChange(scope.row, 'saleChannel', scope.$index)"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.saleChannel"
                    v-if="!scope.row.newDataRow"></el-input>
        </template>
      </u-table-column>
      <u-table-column
          prop="date"
          label="销售日期"
          width="130">
      </u-table-column>
      <u-table-column
          prop="salePrice"
          width="70"
          label="销售金额">
        <template #default="scope">
          <el-input type="text" v-model="scope.row.salePrice" @change="itemChange(scope.row)"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.salePrice"
                    v-if="!scope.row.newDataRow"></el-input>
        </template>
      </u-table-column>

      <u-table-column
          fixed="right"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" style="height: 12px;line-height: 0px;" @click="deleteItem([scope.row])"
                     v-if="!scope.row.newDataRow && !isDeleteByBatch">删除
          </el-button>
        </template>
      </u-table-column>
    </u-table>
  </div>
</template>

<script>
import OrderFilter from "./OrderFilter.vue";
import global from "../utils/global";
import * as tripartiteSaleApi from "../api/tripartiteSaleApi";
import {getOrderManagement} from "../api/OrderManagementApi";

export default {
  name: "TripartiteSale",
  components: {OrderFilter},
  data() {
    return {
      conditionShow: {
        "machineNumber": true,
        "imei": true,
        "brand": true,
        "model": true,
        "saleChannel": true,
        "dateScope": true,
      },
      isDeleteByBatch: false,
      height: 0,
      searchMachine: {},
      tableData: [],
      newDataRow: {"newDataRow": true}
    }
  },
  methods: {
    initTableData() {
      tripartiteSaleApi.getTripartiteSale(this.searchMachine).then(resp => {
        if (resp.status === 200) {
          let data = resp.data;
          this.tableData = data.obj
          this.tableData.push(this.newDataRow)
        }
      })
      this.$nextTick(() => {
        this.height = global.innerHeight - this.$refs.orderFilter.$el.offsetHeight - 42
      })
    },
    cancelAdvSearch() {
      this.searchMachine = {}
      this.initTableData();
    },
    machineNumberChange(row) {
      if (row.machineNumber === "") {
        return;
      }
      getOrderManagement({"machineNumber": row.machineNumber}).then(resp => {
        let data = resp.data;
        if (resp.status === 200 && data.obj.length !== 0) {
          let newTableData = data.obj[0]
          newTableData.signDate = global.getNowDay();
          newTableData.signStatus = "已签收"
          tripartiteSaleApi.putTripartiteSale(newTableData).then(resp => {
            if (resp.data.code === 200) {
              this.tableData.splice(-1, 0, JSON.parse(JSON.stringify(newTableData)));
              this.newDataRow.machineNumber = "";
            }
            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.focusInput.focus();
              }, 2)
            })
            this.$refs.plTable.scrollBottom();
          })
        }
      })
    },
    openDeleteItemByBatch() {
      this.$refs.plTable.clearSelection();
      this.isDeleteByBatch = true
    },
    closeDeleteItemByBatch() {
      this.$refs.plTable.clearSelection();
      this.isDeleteByBatch = false
    },
    deleteItemByBatch() {
      this.deleteItem(this.$refs.plTable.getCheckboxRecords());
    },
    deleteItem(rows) {
      let machineNumbers = []
      rows.forEach(item => {
        machineNumbers.push(item.machineNumber)
      })
      global.deleteItem(machineNumbers, tripartiteSaleApi.deleteTripartiteSale, this.$confirm, this.$message, this.initTableData)
    },
    itemChange(row, changeItem, index) {
      if (changeItem === "saleChannel") {
        row.date = global.getNowDay();
        this.$set(this.tableData, index, row)
      }
      tripartiteSaleApi.modifyTripartiteSale({
        "machineNumber": row.machineNumber,
        "saleChannel": row.saleChannel,
        "salePrice": row.salePrice,
        "date": row.date
      })
    }
  }
}
</script>
