export default {
  BASE_URL: "http://localhost:8081",
  innerHeight: window.innerHeight,
  getNowDay() {
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
        .getDate();
    return year + "-" + month + "-" + day;
  },
  deleteItem(machineNumbers, func, confirm, message, initTableData) {
    confirm('是否确定要删除', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      func(machineNumbers).then(resp => {
        let data = resp.data;
        if (data.code === 200) {
          initTableData()
          message.success("删除成功")
        } else {
          message.error("删除失败")
        }
      })
    }).catch(() => {
      message.success("已取消删除")
    });
  },

  // excel读取2020/04/03 14:01这种时间格式是会将它装换成数字类似于3924.584027778 numb是传过来的整数数字，format是之间间隔的符号
  formatExcelDate(numb, format, _this) {
    let time = null;
    if (isNaN(Number(numb))) {
      if (!isNaN(Date.parse(numb))) {
        time = new Date(numb);
      } else {
        _this.$message.error("该excel中的日期不正确！！！")
        _this.fullscreenLoading = false
        throw '该excel中的日期不正确！！！';
      }
    } else {
      const old = numb - 1;
      const t = Math.round((old - Math.floor(old)) * 24 * 60 * 60);
      time = new Date(1900, 0, old, 0, 0, t)
    }
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
  },
}
