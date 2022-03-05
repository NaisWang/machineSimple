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
        :data-changes-scroll-top=false
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
          prop="bidPrice"
          label="中标金额"
          width="70">
      </u-table-column>
      <u-table-column
          prop="bidDate"
          label="中标日期"
          width="130">
      </u-table-column>
      <u-table-column
          prop="signDate"
          label="签收时间"
          width="130">
      </u-table-column>
      <u-table-column
          prop="signStatus"
          label="签收状态"
          width="90">
        <template #default="scope">
          <el-select v-model="scope.row.signStatus" size="mini" placeholder="购入渠道"
                     @change="itemChange(scope.row)" v-if="!scope.row.newDataRow">
            <el-option
                v-for="id in ['未签收', '已签收', '已退款']"
                :label="id"
                :value="id"
                :key="id">
            </el-option>
          </el-select>
        </template>

      </u-table-column>
      <el-table-column
          prop="comment"
          width="150"
          label="备注">
        <template #default="scope">
          <el-input type="text" v-model="scope.row.comment" @change="itemChange(scope.row)"
                    @keyup.enter.native="$event.target.blur()"
                    :title="scope.row.comment"
                    v-if="!scope.row.newDataRow"></el-input>
        </template>
      </el-table-column>
      <u-table-column
          fixed="right"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" style="height: 12px;line-height: 0px;" @click="deleteItem([scope.row])"
                     v-if="(!scope.row.newDataRow) && !isDeleteByBatch">删除
          </el-button>
        </template>
      </u-table-column>
    </u-table>
  </div>
</template>

<script>
import {getOrderManagement} from "../api/OrderManagementApi";
import * as orderSignApi from "../api/OrderSign";
import global from "../utils/global";
import OrderFilter from "./OrderFilter.vue";

export default {
  name: "OrderSign",
  components: {OrderFilter},
  data() {
    return {
      conditionShow: {
        "machineNumber": true,
        "imei": true,
        "brand": true,
        "model": true,
        "signStatus": true,
        "bidDateScope": true,
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
      orderSignApi.getOrderSign(this.searchMachine).then(resp => {
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
          newTableData.signDate = global.getNowDay();
          newTableData.signStatus = "已签收"
          orderSignApi.putOrderSign(newTableData).then(resp => {
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
      global.deleteItem(machineNumbers, orderSignApi.deleteOrderSign, this.$confirm, this.$message, this.initTableData)
    },
    itemChange(row) {
      orderSignApi.modifyOrderSign({
        "machineNumber": row.machineNumber,
        "signStatus": row.signStatus,
        "comment": row.comment
      })
    }
  }
}
</script>
