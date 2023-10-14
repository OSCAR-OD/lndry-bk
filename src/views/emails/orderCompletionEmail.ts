export default (order: any) => {
    return  `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
        .table-order{
            border-collapse: collapse;
            width: 100%;
        }
        .table-order tr th, .table-order tr td{
            padding: 8px;
            text-align: left;
            padding-left: 40px;
            border: 1px solid #dddddd;
        }
        .table-order tr:nth-child(even) {
            background-color: #dddddd;
        }
    </style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
<!--100% body table-->
<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
    <tr>
        <td>
            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="height:80px;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="text-align:center;">
                        <a href="https://nearestlaundry.com" title="logo" target="_blank">
                            <img width="60" src="https://nearestlaundry.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.625c975b.png&w=96&q=75" title="logo" alt="logo">
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td>
                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding:0 35px;">
                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Order Created</h1>
                                    <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                    <p align="left" style="color:#455056; font-size:15px;line-height:24px; margin:0;">Dear PK, </p>
                                    <p align="left" style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                        A customer named ${order.name} has just made an Order with ID ${order.customID}.
                                        <br>
                                    Total Amount in the order is ${order.total}.<br>
                                    Please visit the order and modify it if needed. <a href='https://admin.nearestlaundry.com/orders/edit/${order._id}'>Click Here</a>
                                    <div align="left" style="color:#455056; font-size:15px;line-height:24px; margin:0;" >
                                        <p>Best regards, </p>
                                        <p> Nearest Laundry Backend System </p>
                                    </div>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                <tr>
                    <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="text-align:center;">
                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <a href="https://nearestlaundry.com">www.nearestlaundry.com</a></p>
                    </td>
                </tr>
                <tr>
                    <td style="height:80px;">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<!--/100% body table-->
</body>

</html>
`
}