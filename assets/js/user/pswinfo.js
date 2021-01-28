$(function () {
  let form = layui.form;
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    newPsw: function (value) {
      let oldPsw = $("[name=oldPwd]").val();
      if (oldPsw === value) {
        return "新旧密码不能相同";
      }
    },
    resPsw: function (value) {
      let newPsw = $("[name=newPwd]").val();
      if (newPsw !== value) {
        return "两次输入密码不一致";
      }
    },
  });
  $("#form").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    console.log(data);
    axios.post("/my/updatepwd", data).then((res) => {
      console.log(res);
      if (res.data.status !== 0) {
        return layer.msg(res.data.message);
      }
      layer.msg("更新密码成功");
      $("#form")[0].reset();
      localStorage.removeItem("token");
      window.parent.location.href = "/home/login.html";
    });
  });
});
