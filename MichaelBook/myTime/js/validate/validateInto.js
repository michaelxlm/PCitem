/**
 * Created by xuliming on 2017/11/22.
 */
$().ready(function () {
// 在键盘按下并释放及提交后验证提交表单
    $("#form").validate(
        {
            rules: {
                text: {
                    required: true,
                    maxlength: 5,
                    minlength: 3
                }
            }
        }
    );
    /*加入正则校验*/
    $.validator.addMethod("text",function(value,element,params){
        var checkQQ = /^[1-9][0-9]{4,19}$/;
        return this.optional(element)||(checkQQ.test(value));
    },"*请输入正确的QQ号码！");
    $.validator.addClassRules({//这时class="txt"的类都具备了这个两个验证规则
        txt:{
            required:true,
            rangelength:[2,10]
        }
    })
});