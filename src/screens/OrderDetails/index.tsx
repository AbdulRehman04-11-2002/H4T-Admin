import OrderInfo from "./OrderInfo";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Table, { ColumnsType } from "antd/es/table";
import { ApiError } from "../../services/api/Index";
import { AmountState } from "../../interface/Order";
import { useContext, useEffect, useState } from "react";
import { getOrderDetail } from "../../services/api/order";
import { Card, Col, List, Row, Space, Tag, Typography } from "antd";
import { LoaderContext, LoaderContextValue } from "../../context/LoaderContext";
import {
  formatToTwoDecimalPlaces,
  handleErrorResponse,
  openToastNotification,
} from "../../helpers/globalFunctions";
import {
  calculateAdditionalCharges,
  getBookingDate,
  getCheckinBookingStatus,
  getOrderStatusColor,
} from "../../helpers/globalFunctions/fetchHandlers";
import {
  NOTIFICATION_STATUS,
  ORDER_BACKEND_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
} from "../../constants/constants";

const { Text } = Typography;

const OrderDetails = () => {
  const { t } = useTranslation();
  const bookingNumber: any = t("BOOKING_NO");
  const LABELS: any = t("LABELS", { returnObjects: true });
  const ORDER: any = t("ORDER", { returnObjects: true });

  const [data, setData] = useState<any>();
  const [orderItems, setOrderItems] = useState<any>([]);
  const [bookingInfo, setBookingInfo] = useState<any>([]);

  const { id } = useParams();
  const { showLoader, hideLoader } = useContext(
    LoaderContext
  ) as LoaderContextValue;

  useEffect(() => {
    id && fetchOrderDetailById(id);
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: `${LABELS.SERVICES}`,
      dataIndex: "name",
      key: "name",
      render: (text) => text,
    },
    {
      title: `${LABELS.AMOUNT} (€)`,
      dataIndex: "productPrice",
      key: "productPrice",
      width: 200,
      render: (text) => <Space>{formatToTwoDecimalPlaces(text)}</Space>,
    },
  ];

  const fetchOrderDetailById = async (id: string) => {
    showLoader();
    try {
      const response = await getOrderDetail(id);
      if (response?.success) {
        setData(response?.data?.order);
        setOrderItems(response?.data?.order?.order_items);
        let totalSubTotal = 0;
        response?.data?.order?.order_items.forEach((order: any) => {
          let subTotal =
            typeof order?.productPrice === "string"
              ? parseFloat(order.productPrice)
              : order?.productPrice || 0;
          if (Array.isArray(order?.other_services)) {
            subTotal += order?.other_services.reduce(
              (acc: any, currentVal: any) => {
                let amountToAdd =
                  typeof currentVal.productPrice === "string"
                    ? parseFloat(currentVal.productPrice)
                    : currentVal.productPrice || 0;
                return acc + amountToAdd;
              },
              0
            );
          }
          totalSubTotal += subTotal;
          totalSubTotal =
            Number(totalSubTotal.toFixed(2)) -
            Number(order?.totalPaidServicesAmount.toFixed(2));
        });

        setBookingInfo([
          {
            id: 0,
            title: ORDER.LOCATION,
            content:
              response?.data?.order.order_items[0]?.partnerLocation?.name,
          },
          {
            id: 2,
            title: ORDER.BOOKING_DATE,
            content:
              response?.data?.order.order_items?.length > 0
                ? getBookingDate(response?.data?.order.order_items[0])
                : "-",
          },
          {
            id: 3,
            title: ORDER.NO_PEOPLE,
            content: response?.data?.order.order_items.length,
          },
          {
            id: 4,
            title: ORDER.PAID,
            content: `€ ${
              response?.data?.order.totalPaidServicesAmount
                ? formatToTwoDecimalPlaces(
                    response?.data?.order.totalPaidServicesAmount
                  )
                : 0
            }`,
          },
          {
            id: 5,
            title: ORDER.ADDITIONAL_CHARGES,
            content: `€ ${totalSubTotal}`,
            bgColor: `${totalSubTotal > 0 ? "#F9C510" : "#E8ECEF"}`,
          },
        ]);
      }
    } catch (error) {
      const _error = error as ApiError;
      const { errorMessage } = handleErrorResponse(_error);
      openToastNotification(NOTIFICATION_STATUS.ERROR, errorMessage);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="create-partner-content ">
      <div
        className="partner-content booking-details"
        style={{ background: "#fff", borderRadius: 10, marginBottom: 20 }}
      >
        <Row align="middle" style={{ marginBottom: "20px" }}>
          <h2 style={{ fontWeight: "bold", marginRight: 10 }}>
            {bookingNumber}: {data?.code}
          </h2>
          {data?.order_items?.length > 0 && (
            <Tag
              style={{ marginLeft: "20px" }}
              color={getOrderStatusColor(
                getCheckinBookingStatus(
                  data.order_items,
                  data?.orderStatus,
                  data?.paymentStatus
                )
              )}
            >
              {getCheckinBookingStatus(
                data.order_items,
                data?.orderStatus,
                data?.paymentStatus
              )}
            </Tag>
          )}
        </Row>
        <Row gutter={[16, 16]}>
          {bookingInfo.length > 0 &&
            bookingInfo.map((item: any, index: number) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                className="booking-columns"
                key={index}
              >
                <Card
                  title={item.title}
                  bordered={false}
                  className="equal-height-card"
                  style={{ background: item?.bgColor }}
                >
                  {item.content}
                </Card>
              </Col>
            ))}
        </Row>
      </div>
      <Row justify="center" gutter={16}>
        {orderItems.length > 0 &&
          orderItems.map((order: any, index: number) => {
            let subTotal = order?.productPrice;
            subTotal += order?.other_services.reduce(
              (acc: any, currentVal: any) => {
                let amountToAdd =
                  typeof currentVal.productPrice === "string"
                    ? parseFloat(currentVal.productPrice)
                    : currentVal.productPrice;
                return acc + amountToAdd;
              },
              0
            );
            const additionalServicesData = [
              {
                label: `${ORDER.SUB_TOTAL}`,
                amount: formatToTwoDecimalPlaces(subTotal),
              },
              {
                label: `${ORDER.PAID_AMOUNT}`,
                amount: order?.totalPaidServicesAmount ?? 0,
              },
              {
                label: `${ORDER.PAYABLE_AMOUNT}`,
                amount: calculateAdditionalCharges(
                  Number(subTotal.toFixed(2)),
                  Number(order?.totalPaidServicesAmount.toFixed(2))
                ),
              },
            ];
            const dataTable = [
              {
                name: order?.productName,
                productPrice: order?.productPrice,
              },
              ...order?.other_services,
            ];
            return (
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={orderItems.length > 1 ? 12 : 24}
                xl={orderItems.length > 1 ? 12 : 24}
                key={index}
                style={{ marginBottom: 20 }}
                className="order-columns"
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <Row align="middle" style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "20px", marginRight: 10 }}>
                      {ORDER.ORDER_NO}: {order?.code}
                    </h3>
                    {order?.status === ORDER_BACKEND_STATUS.NO_SHOW && (
                      <Tag color={ORDER_STATUS_COLORS.ORANGE}>
                        {ORDER_STATUS.NO_SHOW}
                      </Tag>
                    )}
                  </Row>

                  <OrderInfo order={order} />
                  <Table
                    pagination={false}
                    rowClassName={(record) =>
                      record.editable ? "editable-row" : ""
                    }
                    bordered={false}
                    dataSource={[...dataTable]}
                    columns={columns}
                  />
                  <Row justify={"end"} style={{ paddingTop: "16px" }}>
                    <List
                      style={{ width: "200px" }}
                      size="large"
                      dataSource={additionalServicesData}
                      renderItem={(item) => (
                        <List.Item>
                          <Row style={{ display: "contents" }}>
                            <Text>{item.label}</Text>
                            <Text>{item.amount}</Text>
                          </Row>
                        </List.Item>
                      )}
                    />
                  </Row>
                </div>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default OrderDetails;
