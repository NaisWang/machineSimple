<template>
  <div :style="'height='+ innerHeight * 0.1" class="orderFilter">
    <div style="font-size: 11px;">
      <div style="width: 150px; margin-right: 10px; display: inline-block"
           v-if="conditionShow.machineNumber">
        <span :style="searchMachine.machineNumber?'color: deepskyblue':''"> 物品编码：</span>
        <el-input v-model="searchMachine.machineNumber"
                  size="mini"
                  placeholder="物品编号"
                  clearable></el-input>
      </div>
      <div style="width: 150px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.originNumber">
        <span :style="searchMachine.originNumber?'color: deepskyblue':''"> 原条码：</span>
        <el-input v-model="searchMachine.originNumber"
                  size="mini"
                  placeholder="原条码"
                  clearable></el-input>
      </div>
      <div style="width: 150px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.pjNumber">
        <span :style="searchMachine.pjNumber?'color: deepskyblue':''"> 拍机堂条码：</span>
        <el-input v-model="searchMachine.pjNumber"
                  size="mini"
                  placeholder="拍机堂条码"
                  clearable></el-input>
      </div>
      <div style="width: 150px; margin-right: 10px;display: inline-block" v-if="conditionShow.imei">
        <span :style="searchMachine.imei?'color: deepskyblue':''">IMEI号：</span>
        <el-input v-model="searchMachine.imei"
                  size="mini"
                  placeholder="IMEI"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.number">
        <span :style="searchMachine.number?'color: deepskyblue':''">编号：</span>
        <el-input v-model="searchMachine.number"
                  size="mini"
                  placeholder="编号"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.brand">
        <span :style="searchMachine.brand?'color: deepskyblue':''">品牌：</span>
        <el-input v-model="searchMachine.brand"
                  size="mini"
                  placeholder="品牌"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.model">
        <span :style="searchMachine.model?'color: deepskyblue':''">型号：</span>
        <el-input v-model="searchMachine.model"
                  size="mini"
                  placeholder="型号"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.purchaseChannel">
        <span :style="searchMachine.purchaseChannel?'color: deepskyblue':''">采购渠道：</span>
        <el-input v-model="searchMachine.purchaseChannel"
                  size="mini"
                  placeholder="采购渠道"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.saleChannel">
        <span :style="searchMachine.saleChannel?'color: deepskyblue':''">销售渠道：</span>
        <el-input v-model="searchMachine.saleChannel"
                  size="mini"
                  placeholder="销售渠道"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.machineRank">
        <span :style="searchMachine.machineRank?'color: deepskyblue':''">等级：</span>
        <el-input v-model="searchMachine.machineRank"
                  size="mini"
                  placeholder="等级"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.upShelfPeople">
        <span :style="searchMachine.upShelfPeople?'color: deepskyblue':''">上架人：</span>
        <el-input v-model="searchMachine.upShelfPeople"
                  size="mini"
                  placeholder="上架人"
                  clearable></el-input>
      </div>
      <div style="width: 150px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.oneSalePJNumber">
        <span :style="searchMachine.oneSalePJNumber?'color: deepskyblue':''">一销拍机堂条码：</span>
        <el-input v-model="searchMachine.oneSalePJNumber"
                  size="mini"
                  placeholder="一销拍机堂条码"
                  clearable></el-input>
      </div>
      <div style="width: 150px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.twoSalePJNumber">
        <span :style="searchMachine.twoSalePJNumber?'color: deepskyblue':''">二销拍机堂条码：</span>
        <el-input v-model="searchMachine.twoSalePJNumber"
                  size="mini"
                  placeholder="二销拍机堂条码"
                  clearable></el-input>
      </div>
      <div style="width: 110px; margin-right: 10px;display: inline-block"
           v-if="conditionShow.signStatus">
        <span :style="searchMachine.signStatus?'color: deepskyblue':''">签收状态：</span>
        <el-select style="display: block" clearable v-model="searchMachine.signStatus" size="mini" placeholder="签收状态">
          <el-option
              v-for="id in ['未签收','已签收', '已退款']"
              :label="id"
              :value="id"
              :key="id">
          </el-option>
        </el-select>
      </div>
      <div style="margin-right: 10px;display: inline-block;"
           v-if="conditionShow.bidDateScope">
        <span :style="searchMachine.bidDateScope?'color: deepskyblue':''">中标日期：</span>
        <el-date-picker
            style="display: block"
            v-model="searchMachine.bidDateScope"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="margin-right: 10px;display: inline-block"
           v-if="conditionShow.dateScope">
        <span :style="searchMachine.dateScope?'color: deepskyblue':''">日期：</span>
        <el-date-picker
            style="display: block"
            v-model="searchMachine.dateScope"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="margin-right: 10px;display: inline-block" v-if="conditionShow.signDateScope">
        <span :style="searchMachine.signDateScope?'color: deepskyblue':''">签收时间：</span>
        <el-date-picker
            style="display: block"
            v-model="searchMachine.signDateScope"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="margin-right: 10px;display: inline-block"
           v-if="conditionShow.afterSaleSignDateScope">
        <span :style="searchMachine.afterSaleSignDateScope?'color: deepskyblue':''">售后签收日期：</span>
        <el-date-picker
            style="display: block"
            v-model="searchMachine.afterSaleSignDateScope"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="margin-right: 10px;display: inline-block" v-if="conditionShow.outStockDateScope">
        <span :style="searchMachine.outStockDateScope?'color: deepskyblue':''">出库日期：</span>
        <el-date-picker
            style="display: block"
            v-model="searchMachine.outStockDateScope"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="margin-right: 10px;display: inline-block"
           v-if="conditionShow.enterStockDateScope">
        <span :style="searchMachine.enterStockDateScope?'color: deepskyblue':''">入库日期：</span>
        <el-date-picker
            style="display: block"
            v-model="searchMachine.enterStockDateScope"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="margin-right: 10px;display: inline-block"
           v-if="conditionShow.settlementDateScope">
        <span :style="searchMachine.settlementDateScope?'color: deepskyblue':''">结算日期：</span>
        <el-date-picker
            v-model="searchMachine.settlementDateScope"
            style="display: block"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div style="margin-right: 10px;display: inline-block"
           v-if="conditionShow.createDateScope">
        <span :style="searchMachine.createDateScope?'color: deepskyblue':''">创建日期：</span>
        <el-date-picker
            style="display: block"
            v-model="searchMachine.createDateScope"
            type="daterange"
            size="mini"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <div style="display: inline-block">
      <el-button size="mini" @click="cancelAdvSearch" :disabled="isDeleteByBatch">取消搜索</el-button>
      <el-button size="mini" icon="el-icon-search" type="primary" @click="searchMachines" :disabled="isDeleteByBatch">
        搜索
      </el-button>
      <el-button size="mini" @click="pagingScrollTopLeft(0)" :disabled="isDeleteByBatch">滚动到顶部</el-button>
      <el-button @click="scrollBottom" :disabled="isDeleteByBatch">滚动到底部位置</el-button>
      <div v-if="!notDeleteByBatch" style="display: inline-block">
        <el-button @click="openDeleteItemByBatch" v-if="!isDeleteByBatch">批量删除</el-button>
        <div style="display: inline-block" v-else>
          <el-button @click="deleteItemByBatch">确定批量删除</el-button>
          <el-button @click="closeDeleteItemByBatch">取消批量删除</el-button>
        </div>
      </div>
      <el-upload
          v-if="needUpLoad"
          style="display: inline-block"
          class="upload-demo"
          ref="upload"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :show-file-list=false
          :file-list="fileList"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          action=""
          :auto-upload=false>
        <el-button size="mini" type="success">点击上传</el-button>
      </el-upload>
      <span style="font-size: 12px">机器数量: {{ tableData.length - (needUpLoad ? 0 : 1) }}</span>
      <span style="font-size: 12px" v-if="showSumProfit"> 总利润: {{ getSumProfit() }}</span>
      <span style="font-size: 12px" v-if="showSumSettlementPrice"> 总结算金额: {{ getSumSettlementPrice() }}</span>
      <span style="font-size: 12px" v-if="showSumSalePrice"> 总销售金额: {{ getSumSalePrice() }}</span>
    </div>
  </div>

</template>

<script>
import global from "../utils/global";

export default {
  name: "Filter",
  data() {
    return {}
  },
  props: ['searchMachine', 'conditionShow', 'plTable', 'isDeleteByBatch', 'fileList', 'needUpLoad', 'notDeleteByBatch', 'tableData', 'showSumProfit', 'showSumSettlementPrice', 'showSumSalePrice'],
  methods: {
    data() {
      return {
        innerHeight: global.innerHeight,
      }
    },
    getSumProfit() {
      let sumProfit = 0;
      this.tableData.forEach(item => {
        sumProfit += item.profit
      })
      return sumProfit.toFixed(2)
    },
    getSumSettlementPrice() {
      let sumSettlementPrice = 0;
      this.tableData.forEach(item => {
        sumSettlementPrice += item.factSettlementPrice
      })
      return sumSettlementPrice.toFixed(2)
    },
    getSumSalePrice() {
      console.log(this.tableData)
      let sumSalePrice = 0;
      this.tableData.forEach(item => {
        if (item.salePrice) {
          sumSalePrice += item.salePrice
        }
      })
      return sumSalePrice.toFixed(2)
    },
    handleRemove() {
      this.$emit('handleRemove')
    },
    handleChange(file, fileList) {
      this.$emit('handleChange', file, fileList)
    },
    openDeleteItemByBatch() {
      this.$emit('openDeleteItemByBatch')
    },
    closeDeleteItemByBatch() {
      this.$emit('closeDeleteItemByBatch')
    },
    deleteItemByBatch() {
      this.$emit('deleteItemByBatch')
    },
    searchMachines() {
      this.$emit('searchMachines');
    },
    cancelAdvSearch() {
      this.$emit('cancelAdvSearch');
    },
    scrollBottom() {
      this.plTable.scrollBottom()
    },
    pagingScrollTopLeft(val) {
      this.plTable.pagingScrollTopLeft(val, 0)
    },
  }

}
</script>

<style scoped>

.orderFilter >>> .el-input--mini .el-input__inner {
  height: 20px !important;
  line-height: 20px !important;
}

.orderFilter >>> .el-range-editor--mini.el-input__inner {
  height: 20px !important;
}

.orderFilter >>> .el-range-editor--mini .el-range-separator {
  line-height: 15px !important;
  font-size: 7px !important;
}

.orderFilter >>> .el-range-editor--mini .el-range__icon {
  display: none;
}

.orderFilter >>> .el-range-editor--mini .el-range__icon {
  line-height: 13px !important;
  margin-right: 9px !important;
}

.orderFilter >>> .el-date-editor .el-range__close-icon {
  font-size: 10px !important;
  width: 4px !important;
}

.orderFilter >>> .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
  width: 350px;
  width: 176px !important;
}

.orderFilter >>> .el-input__inner {
  padding-left: 0 !important;
}


.orderFilter >>> .el-button--mini, .el-button--mini.is-round {
  padding: 2px 15px !important;
}
</style>
