let form = layui.form;
getArtCate();
function getArtCate() {
  axios.get("/my/article/cates").then((res) => {
    console.log(res); //获取类别的数据
    let htmlStr = template("trtpl", res.data);
    $("tbody").html(htmlStr);
  });
}
let index;
$("#addBtn").click(function () {
  index = layer.open({
    type: 1,
    title: "添加分类信息",
    content: $("#addtpl").html(),
    area: "500px",
  });
});
$("body").on("submit", "#addForm", function (e) {
  e.preventDefault();
  let data = $(this).serialize();
  console.log(data);
  axios.post("/my/article/addcates", data).then((res) => {
    console.log(res);
    if (res.data.status !== 0) {
      return layer.msg("新增文章分类失败");
    }
    layer.msg("新增文章分类成功");
    layer.close(index);
    getArtCate();
  });
});
let editIndex;
$("body").on("click", ".editBtn", function () {
  let id = $(this).attr("data-id");
  console.log(id);
  axios.get("/my/article/cates/" + id).then((res) => {
    console.log(res);
    form.val("editForm", res.data.data);
  });
  editIndex = layer.open({
    type: 1,
    title: "编辑分类信息",
    content: $("#edittpl").html(),
    area: "500px",
  });
});
$("body").on("submit", "#editForm", function (e) {
  e.preventDefault();
  let data = $(this).serialize();
  console.log(data); //获取编辑的数据
  axios.post("/my/article/updatecate", data).then((res) => {
    console.log(res);
    if (res.data.status !== 0) {
      return layer.msg("更新失败失败");
    }
    layer.msg("更新分类数据成功");
    layer.close(editIndex);
    getArtCate(); //发送ajax请求
  });
});
$("tbody").on("click", ".delBtn", function () {
  let id = $(this).attr("data-id");
  layer.confirm("确定删除?", { icon: 3, title: "提示" }, function () {
    axios.get("/my/article/deletecate/" + id).then((res) => {
      console.log(res);
      if (res.data.status !== 0) {
        // 删除失败
        return layer.msg("删除文章分类失败");
      }

      layer.msg("删除文章分类成功");

      layer.close(index);

      // 发送ajax请求
      getArtCate();
    });
  });
});
