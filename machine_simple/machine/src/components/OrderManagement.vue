<template>
  <div>
    <div v-loading.fullscreen.lock="fullscreenLoading"
         element-loading-text="正在上传中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
    </div>

    <OrderFilter ref="orderFilter" :search-machine="searchMachine" :condition-show="conditionShow"
                 @searchMachines="initTableData" @cancelAdvSearch="cancelAdvSearch"
                 :file-list="fileList" @handleChange="handleChange" @handleRemove="handleRemove" :need-up-load="true"
                 :not-delete-by-batch="true"
                 :show-sum-profit="true"
                 :table-data="tableData"
                 :pl-table="$refs.plTable"></OrderFilter>
    <u-table
        class="u-table"
        ref="plTable"
        :data="tableData"
        :height="height"
        :row-height="17"
        showBodyOverflow="title"
        showHeaderOverflow="title"
        use-virtual
        border>
      <u-table-column type="index" width="70" fixed/>
      <u-table-column
          prop="machineNumber"
          label="物品编码"
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
          prop="purchaseChannel"
          label="采购渠道"
          width="90">
      </u-table-column>
      <u-table-column
          prop="bidDate"
          label="中标日期"
          width="130">
      </u-table-column>
      <u-table-column
          prop="signStatus"
          label="签收状态"
          width="70">
      </u-table-column>
      <u-table-column
          prop="appealGapPrice"
          label="申诉补差金额"
          width="70">
      </u-table-column>
      <u-table-column
          prop="fixPrice"
          label="维修费"
          width="70">
      </u-table-column>
      <u-table-column
          prop="oneSalePJNumber"
          label="一销拍机堂条码"
          width="150">
      </u-table-column>
      <u-table-column
          prop="oneSaleSettlementPrice"
          label="一售结算价"
          width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.saleMethod === 'oneSale'" style="color: red">{{
              scope.row.oneSaleSettlementPrice
            }}</span>
          <span v-else>{{ scope.row.oneSaleSettlementPrice }}</span>
        </template>
      </u-table-column>
      <u-table-column
          prop="twoSalePJNumber"
          label="二销拍机堂条码"
          width="150">
      </u-table-column>
      <u-table-column
          prop="twoSaleSettlementPrice"
          label="二售结算价"
          width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.saleMethod === 'twoSale'" style="color: red">{{
              scope.row.twoSaleSettlementPrice
            }}</span>
          <span v-else>{{ scope.row.twoSaleSettlementPrice }}</span>
        </template>
      </u-table-column>
      <u-table-column
          prop="tripartiteSaleSettlementPrice"
          label="三方销售结算价"
          width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.saleMethod === 'tripartiteSale'"
                style="color: red">{{ scope.row.tripartiteSaleSettlementPrice }}</span>
          <span v-else>{{ scope.row.tripartiteSaleSettlementPrice }}</span>
        </template>
      </u-table-column>
      <u-table-column
          prop="profit"
          width="70"
          label="利润">
      </u-table-column>
      <u-table-column
          fixed="right"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" style="height: 12px;line-height: 0px;" @click="deleteItem(scope.row)"
                     v-if="!scope.row.newDataRow">删除
          </el-button>
        </template>
      </u-table-column>

    </u-table>
  </div>
</template>

<script>
import * as XLSX from "xlsx"
import * as orderManagementApi from "../api/OrderManagementApi";
import OrderFilter from "./OrderFilter.vue";
import global from "../utils/global";

export default {
  name: "OrderManager",
  components: {OrderFilter},
  data() {
    return {
      conditionShow: {
        "machineNumber": true,
        "imei": true,
        "brand": true,
        "model": true,
        "purchaseChannel": true,
        "signStatus": true,
        "oneSalePJNumber": true,
        "twoSalePJNumber": true,
        "bidDateScope": true
      },
      searchMachine: {},
      tableData: [],
      purchaseOrderReceiptMachines: [],
      purchaseOrderReceiptField: [{"zh": "物品编码", "en": "machineNumber"}, {"zh": "IMEI", "en": "imei"},
        {"zh": "品牌", "en": "brand"}, {"zh": "机型", "en": "model"}, {
          "zh": "SKU",
          "en": "sku"
        }, {"zh": "成色", "en": "quality"}, {"zh": "中标金额", "en": "bidPrice"}
        , {"zh": "机况描述", "en": "conditionDescription"}, {"zh": "订单创建时间", "en": "bidDate"}, {
          "zh": "场次编号",
          "en": "purchaseChannel"
        }],
      height: 0,
      fileList: [],
      fullscreenLoading: false
    }
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    initTableData() {
      orderManagementApi.getOrderManagement(this.searchMachine).then(resp => {
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
      this.handleRemove()
      this.fullscreenLoading = true
      this.fileList = [fileList[fileList.length - 1]]
      this.readWorkbookFromLocalFile(file)
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
        purchaseOrderReceiptMainInfo["signStatus"] = "未签收"
        this.purchaseOrderReceiptMachines.push(purchaseOrderReceiptMainInfo);
      }
      orderManagementApi.putOrderManagement(this.purchaseOrderReceiptMachines).then(resp => {
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
          throw "该文件中缺少" + item['zh'] + "列";
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
          throw '该表为空';
        }
        _this.getMachineExcelTitleIndex(jsonArr[0], ExcelTitleIndexNumber)
        _this.addPurchaseOrderReceiptMachinesByExcel(jsonArr, ExcelTitleIndexNumber)
      };
      reader.readAsBinaryString(f);
    },
    deleteItem(row) {
      this.$prompt('请输入: 密码-' + row.machineNumber, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        if (value === "12345678-" + row.machineNumber) {
          orderManagementApi.deleteOrderManagement(row.machineNumber).then(resp => {
            let data = resp.data;
            if (data.code === 200) {
              this.initTableData()
              this.$message.success("删除成功")
            } else {
              this.$message.error("删除失败")
            }
          })
        } else {
          this.$message.error("密码错误！！！")
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
      //global.deleteItem(row.machineNumber, orderManagementApi.deleteOrderManagement, this.$confirm, this.$message, this.initTableData)
    },
  }
}
</script>