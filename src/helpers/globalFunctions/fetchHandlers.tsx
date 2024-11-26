
import { OrderItem } from "../../interface/Order";
import { ORDER_STATUS, ORDER_STATUS_COLORS, ORDER_BACKEND_STATUS, defaultTimezone, PAYMENT_STATUS_COLOR } from "../../constants/constants";
import { formatToTwoDecimalPlaces } from ".";
const moment = require('moment-timezone');


export const formattedDateTime = (date: string, options:any) => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (date) {
        return new Intl.DateTimeFormat(locale,options).format(new Date(date));
    }
    return "-"
};

//---------- PlanningList starts----------//

export const getOrderStatusColor = (status: string | undefined) => {
    switch (status) {
        case ORDER_STATUS.PAYMENT_PENDING:
            return ORDER_STATUS_COLORS.RED;
        case ORDER_STATUS.CONFIRMED:
            return ORDER_STATUS_COLORS.GREEN;
        case ORDER_STATUS.INPROGRESS:
            return ORDER_STATUS_COLORS.BLUE;
        case ORDER_STATUS.INPROGRESS_PROCESS: 
            return ORDER_STATUS_COLORS.BLUE
        case ORDER_STATUS.NO_SHOW:
            return ORDER_STATUS_COLORS.ORANGE;
        default:
            return ORDER_STATUS_COLORS.DARK_GREEN;
    }
};

export const getOrderProcessStatusColor = (status: string | undefined) => {
    switch (status) {
        case ORDER_BACKEND_STATUS.CONFIRMED:
            return ORDER_STATUS_COLORS.GREEN;
        case ORDER_BACKEND_STATUS.IN_PROGRESS:
            return ORDER_STATUS_COLORS.BLUE;
        case ORDER_BACKEND_STATUS.PENDING: 
            return ORDER_STATUS_COLORS.BLUE
        case ORDER_BACKEND_STATUS.NO_SHOW:
            return ORDER_STATUS_COLORS.ORANGE;
        case ORDER_BACKEND_STATUS.COMPLETED:
            return ORDER_STATUS_COLORS.DARK_GREEN;
        case ORDER_BACKEND_STATUS.DRAFT:
            return ORDER_STATUS_COLORS.YELLOW;
        default:
            return ORDER_STATUS_COLORS.DARK_GREEN; 
    }
};

export const getFormattedDateTime = (order: OrderItem) => {
    if (order && order?.serviceDateTime) {
        const timezone = order?.partnerLocation?.timeZone || defaultTimezone;
        const formattedDate = formattedDateTime(order?.serviceDateTime, {
            timeStyle: "short",
            dateStyle: "short"
          });
        return `${formattedDate} (${timezone})`;
    }
}

export const getOrderStatus = (orderItemStatus: string | undefined, orderStatus: string | undefined, paymentStatus: string | undefined) => {
    if (paymentStatus === ORDER_BACKEND_STATUS.PAYMENT_PENDING)
        return ORDER_STATUS[orderStatus as keyof typeof ORDER_STATUS]
    else {
        return ORDER_STATUS[orderItemStatus as keyof typeof ORDER_STATUS]
    }
}

export const checkPaymentStatus = (
    otherServices: Array<{ paymentStatus: string }> | undefined,
    orderStatus: string | undefined
): string => {
    if (!otherServices || otherServices.length === 0) {
      return orderStatus === "CONFIRMED" ? "PAID" : "PENDING";
    } else {
      const allServicesPaid = otherServices.every((service) => service.paymentStatus === "PAID");
      return allServicesPaid ? "PAID" : "PENDING";
    }
};

export const checkPaymentStatusColor = (status: string) => {
    switch (status) {
        case "PENDING":
            return PAYMENT_STATUS_COLOR.PENDING;
        case "PAID":
            return PAYMENT_STATUS_COLOR.PAID;
        default:
            return PAYMENT_STATUS_COLOR.DEFAULT;
    }
}

//---------- PlanningList ends-----------//

//---------- LocationCreateUpdate starts---------------//
export const extractTimeComponents = (totalMinutes: number) => {
    const days = 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { days, hours, minutes };
}
//---------- LocationCreateUpdate ends---------------//

export const getCheckinBookingStatus = (orderItems: OrderItem[], orderStatus: string | undefined, paymentStatus: string | undefined) => {
    const noShowStatuses = orderItems.find(obj => obj?.status === ORDER_BACKEND_STATUS.NO_SHOW);
    if (paymentStatus === ORDER_BACKEND_STATUS.PAYMENT_PENDING)
        return ORDER_STATUS.PAYMENT_PENDING;
    else if (noShowStatuses) {
        return ORDER_STATUS.INPROGRESS;
    }
    else {
        return ORDER_STATUS[orderStatus as keyof typeof ORDER_STATUS]
    }
}


export const calculateAdditionalCharges = (
    total: number,
    totalPaidServicesAmount?: number
) => {
    if (totalPaidServicesAmount) {
        const additionalCharge = Math.abs(total - totalPaidServicesAmount);
        return totalPaidServicesAmount > total
            ? -formatToTwoDecimalPlaces(additionalCharge)
            : formatToTwoDecimalPlaces(additionalCharge);
    }
    return 0;
};

export const getBookingDate = (orderItem: OrderItem) => {
    if (orderItem) {
        const date = orderItem?.serviceDateTime;
        const timezone = orderItem?.partnerLocation?.timeZone;
        const dateTime =
            date && timezone
                ? formattedDateTime(date,{
                    month: 'short', 
                    day: 'numeric', 
                    weekday: 'long',
                    hour: 'numeric', 
                    minute: 'numeric', 
            
                })
                : "-";
        return `${dateTime} (${timezone})`;
    }
};
