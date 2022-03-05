<template>
  <div>
    <Filter></Filter>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="订单明细" name="first">
        <OrderManagement ref="orderManagement"></OrderManagement>
      </el-tab-pane>
      <el-tab-pane label="订单签收" name="second">
        <OrderSign ref="orderSign"></OrderSign>
      </el-tab-pane>
      <el-tab-pane label="订单申诉" name="third">
        <OrderAppeal ref="orderAppeal"></OrderAppeal>
      </el-tab-pane>
      <el-tab-pane label="维修表" name="fourth">
        <Fix ref="fix"></Fix>
      </el-tab-pane>
      <el-tab-pane label="一次销售表" name="fifth">
        <OneSale ref="oneSale"></OneSale>
      </el-tab-pane>
      <el-tab-pane label="售后表" name="six">
        <AfterSale ref="afterSale"></AfterSale>
      </el-tab-pane>
      <el-tab-pane label="三方销售表" name="seven">
        <TripartiteSale ref="tripartiteSale"></TripartiteSale>
      </el-tab-pane>
      <el-tab-pane label="二次销售表" name="eight">
        <TwoSale ref="twoSale"></TwoSale>
      </el-tab-pane>
      <el-tab-pane label="结算表" name="nine">
        <Settlement ref="settlement"></Settlement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OrderManagement from "../components/OrderManagement.vue";
import AfterSale from "../components/AfterSale.vue";
import OneSale from "../components/OneSale.vue";
import OrderAppeal from "../components/OrderAppeal.vue";
import OrderSign from "../components/OrderSign.vue";
import Settlement from "../components/Settlement.vue";
import TripartiteSale from "../components/TripartiteSale.vue";
import TwoSale from "../components/TwoSale.vue";
import Fix from "../components/Fix.vue";
import Filter from "../components/OrderFilter.vue";

export default {
  name: "Main",
  components: {
    Fix,
    OrderManagement,
    AfterSale,
    Filter,
    OneSale,
    OrderAppeal,
    OrderSign,
    Settlement,
    TripartiteSale,
    TwoSale
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
      if (tab.label === "订单明细") {
        this.$refs.orderManagement.initTableData();
      } else if (tab.label === "订单签收") {
        this.$refs.orderSign.initTableData();
      } else if (tab.label === "订单申诉") {
        this.$refs.orderAppeal.initTableData();
      } else if (tab.label === "维修表") {
        this.$refs.fix.initTableData();
      } else if (tab.label === "一次销售表") {
        this.$refs.oneSale.initTableData();
      } else if (tab.label === "二次销售表") {
        this.$refs.twoSale.initTableData();
      } else if (tab.label === "售后表") {
        this.$refs.afterSale.initTableData();
      } else if (tab.label === "结算表") {
        this.$refs.settlement.initTableData();
      } else if (tab.label === "三方销售表") {
        this.$refs.tripartiteSale.initTableData();
      }
    }
  }
}
</script>

<style scoped>

</style>
