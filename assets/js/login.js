$(function () {
  $("#gotoregi").click(function () {
    $(".regiBox").show();
    $(".loginBox").hide();
  });
  $("#gotologin").click(function () {
    $(".regiBox").hide();
    $(".loginBox").show();
  });
  //表示从layui中获取到form相关功能,否则下面form无法使用
  let form = layui.form;
  //各种基于事件的操作，下面会有进一步介绍
  //密码校验
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //要求再次确认密码和密码框内容相同
    repass: function (value) {
      //获取的密码框一定是注册form表单中的密码框
      let pwd = $(".regiBox [name=password]").val();
      console.log(pwd);
      console.log(value);
      if (value != pwd) {
        return "两次密码不一致";
      }
    },
  });
  //注册ajax
  $(".regiBox form").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    console.log(data);
    axios.post("/api/reguser", data).then((res) => {
      //console.log(res);
      if (res.data.status !== 0) {
        return layer.msg(res.data.message);
      }
      layer.msg("注册成功,请登录");
      $("#gotologin").click();
    });
  });
  $(".loginBox form").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    console.log(data);
    axios.post("/api/login", data).then((res) => {
      console.log(res);
      if (res.data.status !== 0) {
        return layer.msg(res.data.message);
      }
      localStorage.setItem("token", res.data.token);
      layer.msg("登录成功,即将跳转去后台首页", function () {
        location.href = "/home/index.html";
      });
    });
  });
});
