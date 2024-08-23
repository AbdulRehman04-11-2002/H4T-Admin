
import { OrderItem } from "../../interface/Order";
import { ORDER_STATUS, ORDER_STATUS_COLORS, ORDER_BACKEND_STATUS, defaultTimezone } from "../../constants/constants";
const moment = require('moment-timezone');


export const formattedDateTime = (date: string, timezone: string, format: string) => {
    if (date && timezone && format) {
        return moment(date).tz(timezone).format(format)
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
        case ORDER_STATUS.NO_SHOW:
            return ORDER_STATUS_COLORS.ORANGE;
        default:
            return ORDER_STATUS_COLORS.DARK_GREEN;
    }
};

export const getFormattedDateTime = (order: OrderItem) => {
    if (order && order?.serviceDateTime) {
        const timezone = order?.partnerLocation?.timeZone || defaultTimezone;
        const formattedDate = formattedDateTime(order?.serviceDateTime, timezone, "DD/MM/YYYY HH:mm");
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
//---------- PlanningList ends-----------//

//---------- LocationCreateUpdate starts---------------//
export const extractTimeComponents = (totalMinutes: number) => {
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    return { days, hours, minutes };
}
//---------- LocationCreateUpdate ends---------------//
