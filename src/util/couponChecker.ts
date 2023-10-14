import couponService from "@services/coupon-service";
import * as console from "console";
import {offeredPriceCalculator} from "@util/order-helper";
import itemService from "@services/item-service";

const couponChecker = async (couponCode:string, cart:any) => {
    /*  TODO: Search coupon with coupon code.
    *   If found then proceed otherwise
    *   return false and invalidity message
    *   attach discount amount as zero
    **/
    let discount = 0;
    let calculatedPrice = 0;
    const  coupon = await couponService.getSingleByCode(couponCode);
    if(!coupon){
        return {
            applied: false,
            reason: 'Coupon not found with given code.',
            discount: 0
        }
    }
    let today = new Date();
    // @ts-ignore
    let start = new Date(coupon.start_date);
    // @ts-ignore
    let end = new Date(coupon.end_date);
    if(today.getTime() < start.getTime()){
        return {
            applied: false,
            reason: 'You applied too early.',
            discount: 0
        }
    }
    if(today.getTime() > end.getTime()){
        return {
            applied: false,
            reason: 'Coupon code expired.',
            discount: 0
        }
    }
    if (coupon.services?.length) {
        for(let i=0; i<cart.length; i++){
            const product = await itemService.getSingle(cart[i].pid);
            if(product){
                if(coupon.services.includes(product.service._id)){
                    const offeredPrice = offeredPriceCalculator(product);
                    calculatedPrice += (offeredPrice * cart[i].quantity);
                }
            }
        }
    }
    if(coupon.items?.length){
        for(let i=0; i<cart.length; i++){
            if(coupon.items.includes(cart[i].pid)){
                const product = await itemService.getSingle(cart[i].pid);
                if(product){
                    const offeredPrice = offeredPriceCalculator(product);
                    calculatedPrice += (offeredPrice * cart[i].quantity);
                }
            }
        }
    }
    if(calculatedPrice <=0){
        return {
            applied: false,
            reason: 'Coupon is not valid for ordered items.',
            discount: 0
        }
    }

    if(calculatedPrice < parseFloat(<string>coupon.minimum_order_limit)){
        return {
            applied: false,
            reason: 'Order amount is less than minimum order limit.',
            discount: 0
        }
    }
    if(coupon.type === 'percentage'){
        discount = calculatedPrice * (parseFloat(<string>coupon.amount)/100);
    } else {
        discount = parseFloat(<string>coupon.amount);
    }
    if(discount >= parseFloat(<string>coupon.maximum_order_limit)){
        discount = parseFloat(<string>coupon.maximum_order_limit);
    }
    return {
        applied: true,
        reason: `${couponCode} applied`,
        discount: discount.toFixed(2)
    }

}

export default couponChecker;