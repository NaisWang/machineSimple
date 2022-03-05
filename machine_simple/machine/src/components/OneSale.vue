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
          prop="number"
          label="编号"
          width="150">
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
          width="100">
      </u-table-column>
      <u-table-column
          prop="settlementPrice"
          width="70"
          label="结算价">
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
import * as oneSaleApi from "../api/oneSaleApi";
import global from "../utils/global";
import * as XLSX from "xlsx"

export default {
  name: "OneSale",
  components: {OrderFilter},
  data() {
    return {
      conditionShow: {
        "pjNumber": true,
        "originNumber": true,
        "number": true,
        "dateScope": true,
        "imei": true,
        "model": true,
        "brand": true,
        "machineRank": true,
        "upShelfPeople": true
      },
      isDeleteByBatch: false,
      height: 0,
      searchMachine: {},
      tableData: [],
      purchaseOrderReceiptMachines: [],
      purchaseOrderReceiptField: [{"zh": "编号", "en": "number"}, {"zh": "日期", "en": "date"},
        {"zh": "物品编码", "en": "originNumber"}, {"zh": "IMEI", "en": "imei"}, {
          "zh": "品牌",
          "en": "brand"
        }, {"zh": "机型", "en": "model"}, {"zh": "拍机堂条码", "en": "pjNumber"}, {
          "zh": "等级",
          "en": "machineRank"
        }, {"zh": "采购价", "en": "purchasePrice"}, {"zh": "竟拍价", "en": "bidPrice"}, {
          "zh": "竞拍利润",
          "en": "bidProfit"
        }, {"zh": "备注", "en": "comment"}, {"zh": "上架人", "en": "upShelfPeople"}],
      fileList: [],
      fullscreenLoading: false
    }
  },
  methods: {
    initTableData() {
      oneSaleApi.getOneSale(this.searchMachine, 1).then(resp => {
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
          if (key === 'date') {
            purchaseOrderReceiptMainInfo[key] = global.formatExcelDate(machineExcelInfo[i][ExcelTitleIndexNumber[key]], '-', this);
          } else {
            purchaseOrderReceiptMainInfo[key] = machineExcelInfo[i][ExcelTitleIndexNumber[key]];
          }
        })
        purchaseOrderReceiptMainInfo["times"] = 1
        this.purchaseOrderReceiptMachines.push(purchaseOrderReceiptMainInfo);
      }
      oneSaleApi.putOneSale(this.purchaseOrderReceiptMachines).then(resp => {
        this.initTableData()
      })
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
        console.log(jsonArr);
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
      global.deleteItem(pjNumbers, oneSaleApi.deleteOneSale, this.$confirm, this.$message, this.initTableData)
    },
  }
}
</script>
