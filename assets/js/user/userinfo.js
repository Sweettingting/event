$(function () {
  let form = layui.form;
  function setForm() {
    axios.get("/my/userinfo").then((res) => {
      //console.log(res);
      form.val("form", {
        id: res.data.data.id,
        username: res.data.data.username,
        nickname: res.data.data.nickname,
        email: res.data.data.email,
      });
    });
    form.verify({
      nickname: function (value, item) {
        if (value.length > 6) {
          return "昵称不能超过6位";
        }
      },
    });
  }
  setForm();
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    axios.post("/my/userinfo", data).then((res) => {
      //console.log(res);
      if (res.data.status !== 0) {
        return layer.msg(res.data.message);
      }
      layer.msg(res.data.message);
      window.parent.getUserInfo();
    });
  });
  $('button[type="reset"]').on("click", function (e) {
    e.preventDefault();
    setForm();
  });
});
