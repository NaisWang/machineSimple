<template>
  <div>

    <div v-loading.fullscreen.lock="fullscreenLoading"
         element-loading-text="正在上传中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
    </div>

    <OrderFilter ref="orderFilter" :search-machine="searchMachine" :condition-show="conditionShow"
                 @searchMachines="initTableData" @cancelAdvSearch="cancelAdvSearch"
                 @deleteItemByBatch="deleteItemByBatch" @openDeleteItemByBatch="openDeleteItemByBatch"
                 @closeDeleteItemByBatch="closeDeleteItemByBatch" :is-delete-by-batch="isDeleteByBatch"
                 :file-list="fileList" @handleChange="handleChange" @handleRemove="handleRemove" :need-up-load="true"
                 :table-data="tableData"
                 :show-sum-settlement-price="true"
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
          width="150">
      </u-table-column>
      <u-table-column
          prop="machineRank"
          label="等级"
          width="70">
      </u-table-column>
      <u-table-column
          prop="machineStatus"
          label="物品状态"
          width="80">
      </u-table-column>
      <u-table-column
          prop="basePrice"
          label="底价"
          width="70">
      </u-table-column>
      <u-table-column
          prop="makePrice"
          label="定价"
          width="70">
      </u-table-column>
      <u-table-column
          prop="settlementPrice"
          label="结算价"
          width="70">
      </u-table-column>
      <u-table-column
          prop="settlementDate"
          label="结算时间"
          width="130">
      </u-table-column>
      <u-table-column
          prop="imei"
          label="IMEI"
          width="150">
      </u-table-column>
      <u-table-column
          prop="serviceCharge"
          label="服务费"
          width="70">
      </u-table-column>
      <u-table-column
          prop="factSettlementPrice"
          label="实际结算金额"
          width="70">
      </u-table-column>
      <u-table-column
          prop="createDate"
          width="130"
          label="创建时间">
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
import * as XLSX from "xlsx"
import * as settlementApi from "../api/settlementApi";
import OrderFilter from "./OrderFilter.vue";
import global from "../utils/global";

export default {
  components: {OrderFilter},
  name: "Settlement",
  data() {
    return {
      conditionShow: {
        "pjNumber": true,
        "machineRank": true,
        "machineStatus": true,
        "settlementDateScope": true,
        "imei": true,
        "createDateScope": true
      },
      isDeleteByBatch: false,
      height: 0,
      searchMachine: {},
      tableData: [],
      purchaseOrderReceiptMachines: [],
      purchaseOrderReceiptField: [{"zh": "物品编号", "en": "pjNumber"}, {"zh": "等级", "en": "machineRank"},
        {"zh": "物品状态", "en": "machineStatus"}, {"zh": "底价", "en": "makePrice"}, {
          "zh": "结算价",
          "en": "settlementPrice"
        }, {"zh": "结算时间", "en": "settlementDate"}, {"zh": "IMEI", "en": "imei"}, {
          "zh": "服务费",
          "en": "serviceCharge"
        }, {"zh": "实际结算金额", "en": "factSettlementPrice"}, {"zh": "创建时间", "en": "createDate"}
      ],
      fileList: [],
      fullscreenLoading: false
    }
  },
  methods: {
    initTableData() {
      settlementApi.getSettlement(this.searchMachine).then(resp => {
        let data = resp.data;
        if (data["code"] === 200) {
          this.tableData = data.obj;
        }
        this.fullscreenLoading = false
      })
      this.$nextTick(() => {
        this.height = global.innerHeight - this.$refs.orderFilter.$el.offsetHeight - 42
      })
    },
    cancelAdvSearch() {
      this.searchMachine = {}
      this.initTableData();
    },
    handleChange(file, fileList) {
      this.fullscreenLoading = true
      this.fileList = [fileList[fileList.length - 1]]
      this.readWorkbookFromLocalFile(file)
      this.handleRemove()
    },
    handleRemove() {
      this.fileList = [];
      this.purchaseOrderReceiptMachines = []
    },
    addPurchaseOrderReceiptMachinesByExcel(machineExcelInfo, ExcelTitleIndexNumber) {
      for (let i = 1; i < machineExcelInfo.length; i++) {
        if (machineExcelInfo[i].length === 0) {
          continue;
        }
        let purchaseOrderReceiptMainInfo = {};
        Object.keys(ExcelTitleIndexNumber).forEach(key => {
          if (key === 'bidDate') {
            purchaseOrderReceiptMainInfo[key] = global.formatExcelDate(machineExcelInfo[i][ExcelTitleIndexNumber[key]], '-', this);
          } else {
            purchaseOrderReceiptMainInfo[key] = machineExcelInfo[i][ExcelTitleIndexNumber[key]];
          }
        })
        this.purchaseOrderReceiptMachines.push(purchaseOrderReceiptMainInfo)
      }
      settlementApi.putSettlement(this.purchaseOrderReceiptMachines).then(resp => {
        this.initTableData()
      });
    },
    getMachineExcelTitleIndex(machineExcelTitleRow, ExcelTitleIndexNumber) {
      this.purchaseOrderReceiptField.forEach(item => {
        let index = -1;
        machineExcelTitleRow.forEach((item1, i) => {
          if (item1.toLowerCase() === item['zh'].toLowerCase()) {
            index = i
            return
          }
        })
        if (index === -1) {
          this.$message.error("该文件中缺少" + item['zh'] + "列")
          this.fullscreenLoading = false
          throw "该文件中缺少" + item['zh'] + "列"
        }
        ExcelTitleIndexNumber[item['en']] = index
      })
    },
    readWorkbookFromLocalFile(file) {
      let _this = this;
      let f = file.raw;
      let reader = new FileReader();
      reader.onload = function (e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {
          type: 'binary'
        });
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header: 1});
        let ExcelTitleIndexNumber = {}
        if (jsonArr.length === 0) {
          _this.$message.error("该表为空")
          _this.fullscreenLoading = false
          throw "该表为空"
        }
        _this.getMachineExcelTitleIndex(jsonArr[0], ExcelTitleIndexNumber)
        _this.addPurchaseOrderReceiptMachinesByExcel(jsonArr, ExcelTitleIndexNumber)
      };
      reader.readAsBinaryString(f);
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
      global.deleteItem(pjNumbers, settlementApi.deleteSettlement, this.$confirm, this.$message, this.initTableData)
    }
  }
}
</script>
