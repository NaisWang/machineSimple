<template>
  <div>
    <OrderFilter ref="orderFilter" :search-machine="searchMachine" :condition-show="conditionShow"
                 @searchMachines="initTableData" @cancelAdvSearch="cancelAdvSearch"
                 @deleteItemByBatch="deleteItemByBatch" @openDeleteItemByBatch="openDeleteItemByBatch"
                 @closeDeleteItemByBatch="closeDeleteItemByBatch" :is-delete-by-batch="isDeleteByBatch"
                 :table-data="tableData"
                 :pl-table="$refs.plTable"></OrderFilter>
    <u-table
        ref="plTable"
        :data="tableData"
        :height="height"
        :row-height="17"
        showBodyOverflow="title"
        showHeaderOverflow="title"
        use-virtual
        border>
      <u-table-column type="selection" v-if="isDeleteByBatch" width="55"/>
      <u-table-column type="index" width="70" fixed/>
      <u-table-column
          prop="machineNumber"
          label="物品编码"
          width="150">
        <template #default="scope">
          <el-input type="text" v-if="scope.row.newDataRow" ref="focusInput"
                    v-model="scope.row.machineNumber"
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
          width="110">
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
          prop="purchaseChannel"
          label="采购渠道"
          width="90">
      </u-table-column>
      <u-table-column
          prop="appealProblem"
          label="申诉问题"
          width="180">
        <template #default="scope">
          <el-input type="text" v-model="scope.row.appealProblem" @change="itemChange(scope.row)"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.appealProblem"
                    v-if="!scope.row.newDataRow"></el-input>
        </template>
      </u-table-column>
      <u-table-column
          prop="returnExpressNumber"
          label="退回快递单号"
          width="180">
        <template #default="scope">
          <el-input type="text" v-model="scope.row.returnExpressNumber" @change="itemChange(scope.row)"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.returnExpressNumber"
                    v-if="!scope.row.newDataRow"></el-input>
        </template>
      </u-table-column>
      <u-table-column
          prop="afterSaleGapPrice"
          label="售后补差金额"
          width="120">
        <template #default="scope">
          <el-input type="text" v-model="scope.row.afterSaleGapPrice" @change="itemChange(scope.row)"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.afterSaleGapPrice"
                    v-if="!scope.row.newDataRow"></el-input>
        </template>
      </u-table-column>
      <u-table-column
          prop="afterSaleSignDate"
          label="售后签收日期"
          width="160">
        <template #default="scope">
          <el-date-picker
              v-model="scope.row.afterSaleSignDate"
              @change="itemChange(scope.row)"
              style="width: 130px"
              type="date"
              v-if="!scope.row.newDataRow"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </template>

      </u-table-column>

      <u-table-column
          prop="comment"
          width="150"
          label="备注">
        <template #default="scope">
          <el-input type="text" v-model="scope.row.comment" @change="itemChange(scope.row)"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.comment"
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
import * as orderAppealApi from "../api/OrderAppealApi";
import {getOrderManagement} from "../api/OrderManagementApi";
import global from "../utils/global";

export default {
  name: "OrderAppeal",
  components: {OrderFilter},
  data() {
    return {
      conditionShow: {
        "machineNumber": true,
        "imei": true,
        "brand": true,
        "model": true,
        "purchaseChannel": true,
        "returnExpressNumber": true,
        "afterSaleSignDateScope": true
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
      orderAppealApi.getOrderAppeal(this.searchMachine).then(resp => {
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
        if (data.code === 200 && data.obj.length !== 0) {
          let newTableData = data.obj[0]
          orderAppealApi.putOrderAppeal(newTableData).then(resp => {
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
      global.deleteItem(machineNumbers, orderAppealApi.deleteOrderAppeal, this.$confirm, this.$message, this.initTableData)
    },
    itemChange(row) {
      orderAppealApi.modifyOrderAppeal({
        "machineNumber": row.machineNumber,
        "appealProblem": row.appealProblem,
        "returnExpressNumber": row.returnExpressNumber,
        "afterSaleGapPrice": row.afterSaleGapPrice,
        "afterSaleSignDate": row.afterSaleSignDate,
        "comment": row.comment
      })
    }
  }
}
</script>
