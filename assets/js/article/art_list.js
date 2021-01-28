$(function () {
  let form = layui.form;
  let laypage = layui.laypage;
  const query = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "",
  };
  const padZero = (n) => (n < 10 ? "0" + n : n);
  template.defaults.imports.formatTime = function (time) {
    let d = new Date(time);

    let y = d.getFullYear();
    let m = padZero(d.getMonth() + 1);
    let day = padZero(d.getDate());

    let hours = padZero(d.getHours());
    let min = padZero(d.getMinutes());
    let s = padZero(d.getSeconds());

    return `${y}/${m}/${day} ${hours}:${min}:${s}`;
  };
  getList();
  function getList() {
    axios
      .get("/my/article/list", {
        params: query,
      })
      .then((res) => {
        console.log(res); //获取数据
        let htmlStr = template("trtpl", res.data);
        $("#tb").html(htmlStr);
        renderPage(res.data.total);
      });
  }
  function renderPage(total) {
    console.log(total);
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      curr: query.pagenum,
      limit: query.pagesize,
      limits: [1, 2, 3, 4, 5],
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      // jump 回调函数的触发时机
      // 第一种情况. laypage.render 初始化渲染分页的时候就会触发一次  first 为 true
      // 第二种情况. 点击分页切换的时候，也会触发 first 为 undefined
      // 点击分页，需要加载对应分页的数据
      // 1. 修改query对象的pagenum页码值为当前页
      // 2. 发送ajax请求获取到数据
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        //console.log(obj.curr);
        //console.log(obj.limit);
        query.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据
        query.pagesize = obj.limit; //每页显示的页数
        //首次不执行
        if (!first) {
          getList();
        }
      },
    });
  }
  //获取分类数据
  axios.get("/my/article/cates").then((res) => {
    console.log(res);
    res.data.data.forEach(function (item) {
      $(`<option value="${item.Id}">${item.name}</option>`).appendTo(
        $("#cateSelect")
      );
    });
    form.render();
  });
  //实现筛选功能
  $("#form").on("sumbit", function (e) {
    e.preventDefault();
    query.cate_id = $("cateSelect").val();
    query.state = $("stateSelect").val();
    query.pagenum = 1;
    getList();
  });
  $("#tb").on("click", ".delBtn", function () {
    let id = $(this).attr("data-id");
    layer.confirm("确定删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      if ($(".delBtn").length === 1) {
        // if (query.pagenum === 1) {
        //   query.pagenum = 1;
        // } else {
        //   query.pagenum = query.pagenum - 1;
        // }
        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;
      }
      axios.get("/my/article/delete/" + id).then((res) => {
        console.log(res);
        if (res.data.status !== 0) {
          return layer.msg("删除文章失败");
        }
        layer.msg("删除文章成功");
        getList();
      });
      layer.close(index);
    });
  });
  $("#tb").on("click", ".editBtn", function () {
    let id = $(this).attr("data-id");
    localStorage.setItem("id", id);
    location.href = "/article/art_edit.html";
    // console.log(id);
    // axios.get("/my/article/" + id).then((res) => {
    //   console.log(res);
  });
});
