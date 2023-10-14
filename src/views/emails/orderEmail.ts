export default (data: any) => {
    let trs = '';
    const cart = JSON.parse(data.cart);
    cart.map((item: any, index: number) => {
        trs += `<tr style="background-color: rgba(255,255,255,0.2);color: #100f0f;">
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;text-align: left;">${item.product.name}</td>
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;">£ ${parseFloat(item.price).toFixed(2)}</td>
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;">${item.quantity}</td>
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;">£ ${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}</td>
            </tr>`;
    });
    let updated: string = '';
    if (data.adjustmentProducts.length) {
        updated = `<div style="margin-top: 20px;"><strong>Note:</strong> You order above product(s) but the actual items we received is different. So, we decided
                    to update your order with actual items. We both parties have confirmed it over phone.</div>
                <table style="width: 100%;
                    border-collapse: collapse;
                    overflow: hidden; margin-top: 20px;
                    ">
                    <thead style="border-bottom: #d6d0d0 1px solid; color: #a09c9c; ">
                    <tr
                            style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
                        <th style="height: 40px;width: calc(100% - 260px);text-align: left;">Item</th>
                        <th style="height: 40px;width: 100px;">Price</th>
                        <th style="height: 40px;width: 60px;">QTY</th>
                        <th style="height: 40px;width: 100px;">Subtotal</th>
                    </tr>
                    </thead>
                    <tbody style="text-align: center">`;
        data.adjustmentProducts.map((item: any, index: number) => {
            updated += `<tr style="background-color: rgba(255,255,255,0.2);color: #100f0f;">
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;text-align: left;">${item.name}</td>
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;">£ ${item.price.toFixed(2)}</td>
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;">${item.quantity}</td>
                <td style="height: 40px; border-bottom: 1px solid #e7e0e0;">£ ${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}</td>
            </tr>`
        });
        updated += '</tbody></table>';
    }
    return `
  <!DOCTYPE html>
<html lang="en">
<body>
<table cellpadding="0" cellspacing="0" align="center" width="650"
       style="border: 8px solid rgb(163, 220, 255); margin: 100px auto; padding-left: 20px;padding-right: 20px; padding-top: 40px; padding-bottom: 40px; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
    <tr class="top_rw">
        <td>
            <div>
                <div>
                    <span>
                            <img src="https://beta.nearestlaundry.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.625c975b.png&w=256&q=75" alt="" srcset="" style="height: 70px; width: 140px;">
                        </span>
                    <span
                            style=" font-size: 28px; background-color: rgb(90, 192, 255); color: #f9f9f9; padding-right: 10px; padding-left: 10px; text-align: center;float: right;">
                            #${data.customID}
                        </span>
                </div>
                <div style="">
                    <div style="float: left;">
                        <span>
                            <span>Order No : ${data.customID ?? data._id}</span> <br>
                            <span>Invoice No : ${data.invoiceNumber ?? data._id}</span> <br>
                            <span>Order Date : <span>${new Date(data.createdAt).toDateString()}</span></span>
                        </span>
                    </div>
                    <!-- address -->
                    <div style="float: right;">
                        <span>${data.email}</span><br>
                        <span>${data.streetAddress}</span>
                    </div>
                </div>
                <div style="width: 100%;clear: both;padding-top: 40px;">
                    <strong>Dear ${data.name},</strong> <br> You ordered bellow item(s) with us.
                </div>
                <!-- table -->
                <table style="width: 100%;
                    border-collapse: collapse;
                    overflow: hidden; margin-top: 40px;
                    ">
                    <thead style="border-bottom: #d6d0d0 1px solid; color: #a09c9c; ">
                    <tr
                            style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
                        <th style="height: 40px;width: calc(100% - 260px);text-align: left;">Item</th>
                        <th style="height: 40px;width: 100px;">Price</th>
                        <th style="height: 40px;width: 60px;">QTY</th>
                        <th style="height: 40px;width: 100px;">Subtotal</th>
                    </tr>
                    </thead>
                    <tbody style="text-align: center">
                    ${trs}
                    </tbody>
                </table>
                ${updated}
                <table style="width: 50%;
                    border-collapse: collapse;
                    overflow: hidden; margin-top: 40px;
                    float: right;
                    margin-bottom: 20px;
                    ">
                    <thead style="border-bottom: #d6d0d0 1px solid; color: #a09c9c; ">
                    <tr style="
                            background-color: rgba(255,255,255,0.2);
                            color: #100f0f; border-top: 1px solid #d0d4d6;">
                        <td colspan="3" style="height: 40px; font-weight: 600; color: #5d5b5b;">Grand Total</td>
                        <td style="height: 40px; font-weight: 600; color: #5d5b5b;">£ ${parseFloat(<string>data.subTotal)}</td>
                    </tr>
                    <tr style="
                            background-color: rgba(255,255,255,0.2);
                            color: #100f0f; border-top: 1px solid #d0d4d6;">
                        <td colspan="3" style="height: 40px; font-weight: 600; color: #5d5b5b;">Coupon Discount</td>
                        <td style="height: 40px; font-weight: 600; color: #5d5b5b;">£ ${parseFloat(<string>data.couponDiscount)}</td>
                    </tr>
                    <tr style="
                            background-color: rgba(255,255,255,0.2);
                            color: #100f0f; border-top: 1px solid #d0d4d6;">
                        <td colspan="3" style="height: 40px; font-weight: 600; color: #5d5b5b;">Total Discount (Offer + Coupon)</td>
                        <td style="height: 40px; font-weight: 600; color: #5d5b5b;">£ ${parseFloat(<string>data.discount)}</td>
                    </tr>
                    <tr style="
                            background-color: rgba(255,255,255,0.2);
                            color: #100f0f; border-top: 1px solid #d0d4d6;">
                        <td colspan="3" style="height: 40px; font-weight: 600; color: #5d5b5b;">Total</td>
                        <td style="height: 40px; font-weight: 600; color: #5d5b5b;">£ ${parseFloat(<string>data.total)}</td>
                    </tr>
                    </thead>
                </table>
                <!-- thanks message -->
                <div style="margin-bottom: 20px; font-size: 13px; color: #a09c9c; clear: both;">
                    Thank you for choosing Nearest Laundry for your laundry needs! We appreciate your business
                    and trust in our services. <br>
                    We assure you that your items are in good hands, and we will take the utmost care in
                    handling and cleaning them. Our dedicated team is committed to delivering high-quality
                    service, ensuring your satisfaction.
                    <br>Best regards, 
                    <br> Nearest Laundry Team
                </div>
                <!-- contact -->
                <div style="text-align: center; margin-top: 40px; font-size: 13px; color: rgb(48, 178, 243);">
                    <span><a href="tel:+447534801503">+44 7534 801503</a></span> | <span>support@nearestlaundry.co.uk</span> |
                    <span>nearestlaundry.co.uk</span>
                </div>
            </div>
        </td>
    </tr>


</table>
</div>

</body>
</html>
  `
}