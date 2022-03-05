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
        :data-changes-scroll-top=false
        use-virtual
        border>
      <u-table-column type="selection" v-if="isDeleteByBatch" width="55"/>
      <u-table-column type="index" width="70" fixed/>
      <u-table-column
          prop="pjNumber"
          label="拍机堂条码"
          width="180">
        <template #default="scope">
          <el-input type="text" v-if="scope.row.newDataRow" focusInput v-model="scope.row.pjNumber"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.pjNumber"
                    @change="pjNumberChange(scope.row.pjNumber)"></el-input>
          <span v-else>{{ scope.row.pjNumber }}</span>
        </template>
      </u-table-column>
      <u-table-column
          prop="date"
          label="日期"
          width="130">
      </u-table-column>
      <u-table-column
          prop="originNumber"
          label="原条码"
          width="150">
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
          prop="machineRank"
          label="等级"
          width="80">
      </u-table-column>
      <u-table-column
          prop="purchasePrice"
          label="采购价"
          width="70">
      </u-table-column>
      <u-table-column
          prop="bidPrice"
          label="竞拍价"
          width="70">
      </u-table-column>
      <u-table-column
          prop="bidProfit"
          label="竞拍利润"
          width="70">
      </u-table-column>
      <u-table-column
          prop="comment"
          label="备注"
          width="150">
      </u-table-column>
      <u-table-column
          prop="upShelfPeople"
          label="上架人"
          width="80">
      </u-table-column>
      <u-table-column
          show-overflow-tooltip
          prop="returnReason"
          label="退货理由"
          width="150">
        <template #default="scope">
          <el-input type="text" :title="scope.row.returnReason" v-model="scope.row.returnReason"
                    @keyup.enter.native="$event.target.blur()"
                    @change="itemChange(scope.row)"
                    v-if="!scope.row.newDataRow"></el-input>
        </template>
      </u-table-column>
      <u-table-column
          prop="signDate"
          label="签收日期"
          width="160">
        <template #default="scope">
          <el-date-picker
              v-model="scope.row.signDate"
              style="width: 130px"
              @change="itemChange(scope.row)"
              type="date"
              v-if="!scope.row.newDataRow"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
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
import * as afterSaleApi from "../api/afterSaleApi";
import global from "../utils/global";
import {getOrderManagementByPJNumber} from "../api/OrderManagementApi";
import {getOneSale} from "../api/oneSaleApi";

export default {
  components: {OrderFilter},
  name: "AfterSale",
  data() {
    return {
      conditionShow: {
        "pjNumber": true,
        "imei": true,
        "brand": true,
        "model": true,
        "dateScope": true,
        "signDateScope": true
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
      afterSaleApi.getAfterSale(this.searchMachine).then(resp => {
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
    pjNumberChange(pjNumber) {
      if (pjNumber === "") {
        return;
      }
      getOneSale({"pjNumber": pjNumber}, 3).then(resp => {
        let data = resp.data;
        if (resp.status === 200 && data.obj.length !== 0) {
          let newTableData = data.obj[0]
          afterSaleApi.putAfterSale(newTableData).then(resp => {
            if (resp.data.code === 200) {
              this.tableData.splice(-1, 0, JSON.parse(JSON.stringify(newTableData)));
              this.newDataRow.pjNumber = "";
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
      let pjNumbers = []
      rows.forEach(item => {
        pjNumbers.push(item.pjNumber)
      })
      global.deleteItem(pjNumbers, afterSaleApi.deleteAfterSale, this.$confirm, this.$message, this.initTableData)
    },
    itemChange(row) {
      afterSaleApi.modifyAfterSale({
        "brand": row.brand,
        "pjNumber": row.pjNumber,
        "returnReason": row.returnReason,
        "signDate": row.signDate
      })
    }
  }
}
</script>
