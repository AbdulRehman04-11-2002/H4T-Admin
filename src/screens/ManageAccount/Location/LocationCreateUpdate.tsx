import {
  Switch, Button, Col, Divider, Form, Input, Row, Select, Space, Typography, UploadFile as AntUploadFile, Modal, Image, QRCode as QRImage
} from 'antd';
import { SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { handleErrorResponse, openToastNotification, showError, getCountryCodeByIp } from '../../../helpers/globalFunctions';
import { extractTimeComponents } from '../../../helpers/globalFunctions/fetchHandlers'
import UploadFile from '../../../components/UploadFile/Index';
import Table from '../../../components/Table/Index';
import { OperatingHours } from '../../../components/TableColumns/OperatingHoursTable';
import { LoaderContext, LoaderContextValue } from '../../../context/LoaderContext';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../../services/api/Index';
import { createPartnerLocation, getLocation, updatePartnerLocation } from '../../../services/api/partnerLocation';
import { GlobalContext, GlobalContextProps } from '../../../context/GlobalContext';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { PartnerLocation } from '../../../interface/PartnerLocation';
import Tooltip from '../../../components/Tooltip/Index';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import DaysInput from './DaysInput';
import HoursDropdown from './HoursDropdown';
import MinutesDropdown from './MinutesDropdown';
import { emailValidate } from '../../../utils/globalFunctions';
import { customerURL, NOTIFICATION_STATUS } from '../../../constants/constants';
import QRCode from 'qrcode';
import { pdf } from '@react-pdf/renderer';
import { MyDocument } from './MyDocument';
const { Text } = Typography;
type operatingHoursType = {
  day: string;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  index: number;
  status: string;
  [key: string]: string | number | boolean;
}

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function LocationCreateUpdate({ isUpdateForm }: { isUpdateForm?: boolean }) {
  const [isDataChange, setIsDataChange] = useState(false)
  const [generalCountries, setgeneralCountries] = useState<{label:string, value:number }[]>([]);
  const [generalCities , setgeneralCities ] = useState<{label:string, value:number }[]>([]);
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);
  const [walkInUrl, setWalkInUrl] = useState('')
  const [imageUrl, setImageUrl] = useState<string>("");
  const [errors, setErrors] = useState({
    name: "",
    code: "",
    phoneNumber: "",
    country: "",
    city: "",
    postalCode: "",
    longitude: "",
    lattitude: "",
    streetAddress: "",
    customerGuidelines: "",
    walkInGuidelines: "",
    status: "",
    docConsFixedFee: "",
    email: ""
  });

  const [operatingHours, setOperatingHours] = useState<operatingHoursType[]>([
  ])
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const BUTTONS: any = t("BUTTONS", { returnObjects: true });
  const ERRORS: any = t("ERRORS", { returnObjects: true });
  const HEADING: any = t("HEADING", { returnObjects: true });
  const LABELS: any = t("LABELS", { returnObjects: true });
  const PLACEHOLDERS: any = t("PLACEHOLDERS", { returnObjects: true });
  const LONGITUDE_LATITUDE: any = t("LONGITUDE_LATITUDE", { returnObjects: true });
  const SUCCESS: any = t("SUCCESS", { returnObjects: true });

  const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
  let params = useParams();
  let { partnerID, locationID, partnerName } = params;
  const { ME, setSuccess } = useContext(GlobalContext) as GlobalContextProps;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [showWalkinError, setShowWalkinError] = useState<boolean>(false);
  const [showMBNError, setShowMBNError] = useState<boolean>(false);
  const [isAvailableNowSlot, setIsAvailableNowSlot] = useState<boolean>(false);
  const [isBookingNoticeEnabled, setIsBookingNotice] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const inputNameRef = useRef<null | HTMLElement>(null);
  const inputCodeRef = useRef<null | HTMLElement>(null);
  const inputPhoneNumberRef = useRef<null | HTMLElement>(null);
  const inputCountryRef = useRef<null | HTMLElement>(null);
  const inputCityRef = useRef<null | HTMLElement>(null);
  const inputPostalCodeRef = useRef<null | HTMLElement>(null);
  const inputLongitudeRef = useRef<null | HTMLElement>(null);
  const inputLatitudeRef = useRef<null | HTMLElement>(null);
  const inputStreetAddressRef = useRef<null | HTMLElement>(null);
  const inputCustomerGuidelinesRef = useRef<null | HTMLElement>(null);
  const inputWalkInGuidelinesRef = useRef<null | HTMLElement>(null);
  const inputStatusRef = useRef<null | HTMLElement>(null);
  const inputEmailRef = useRef<null | HTMLElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const handleOperatingHoursChange = (timeString: string | string[], index: number, dayName: string) => {
    const updatedOperatingHours = [...operatingHours];
    updatedOperatingHours[index][dayName] = Array.isArray(timeString) ? timeString[0] : timeString;
    setOperatingHours(updatedOperatingHours);
    setIsDataChange(true)
  }

  const getInputRefByFieldName = (fieldName: string | undefined) => {
    switch (fieldName) {
      case "name":
        return inputNameRef;
      case "code":
        return inputCodeRef;
      case "phoneNumber":
        return inputPhoneNumberRef;
      case "country":
        return inputCountryRef;
      case "city":
        return inputCityRef;
      case "postalCode":
        return inputPostalCodeRef;
      case "longitude":
        return inputLongitudeRef;
      case "lattitude":
        return inputLatitudeRef;
      case "streetAddress":
        return inputStreetAddressRef;
      case "customerGuidelines":
        return inputCustomerGuidelinesRef;
      case "walkInGuidelines":
        return inputWalkInGuidelinesRef
      case "status":
        return inputStatusRef;
      case "email":
        return inputEmailRef;
      default:
        return null;
    }
  };

  const getPartnerLocation = async () => {
    showLoader();
    try {
      const response = await getLocation(locationID || "");
      getCities(response.data.response.city.location)
      setFormValues(response.data.response)
      setWalkInUrl(response.data.response.walkInUrl)
      generateQRCode()
    } catch (error) {
      const _error = error as ApiError;
      const { errorMessage } = handleErrorResponse(_error);
      openToastNotification(
        errorMessage,
        "notifications toast-notification-error"
      );
      console.log("error", _error);
    } finally {
      hideLoader();
    }

  }

  const partnerLocationRequest = () => {
    const request = {
      name: form.getFieldValue('name'),
      code: form.getFieldValue('code'),
      phoneNumber: form.getFieldValue('phoneNumber'),
      cityId: form.getFieldValue('city'),
      postalCode: form.getFieldValue('postalCode'),
      longitude: form.getFieldValue('longitude'),
      lattitude: form.getFieldValue('lattitude'),
      streetAddress: form.getFieldValue('streetAddress'),
      customerGuidelines: form.getFieldValue('customerGuidelines'),
      walkInGuidelines: form.getFieldValue('walkInGuidelines'),
      status: form.getFieldValue('status').toUpperCase(),
      partner_location_timings: JSON.stringify(createPayloadForOperatingHours()),
      partnerId: partnerID,
      file: !isUpdateForm ? fileList[0] : fileList[0]?.thumbUrl ? fileList[0] : {},
      imageUrl: isUpdateForm ? (fileList[0] && fileList[0]?.thumbUrl ? "" : imageUrl) : "",
      isAvailableNow: isAvailableNowSlot,
      emailAddress: form.getFieldValue("email"),
      isBookingNoticeEnabled: isBookingNoticeEnabled,
      bookingNoticeMinutes: calculateBookingNoticeMinutes(),
    }

    if (isBookingNoticeEnabled && !request.bookingNoticeMinutes) { return false; }
    return request;
  }

  const handleFinish = async () => {
    try {
      showLoader();
      let response: any = {}
      const partnerPayload = partnerLocationRequest();
      if (!partnerPayload) { return; }
      if (!locationID) response = await createPartnerLocation(partnerPayload);
      if (locationID) response = await updatePartnerLocation(locationID, partnerPayload);
      form.resetFields();
      setFileList([]);

      if (locationID) {
        setSuccess(SUCCESS.PARTNER_LOCATION_UPDATED)
      } else {
        setSuccess(SUCCESS.PARTNER_LOCATION_CREATED)
      }
      navigate(`/partner/${partnerID}/manageAccount/${partnerName}`);

    } catch (error) {
      const _error = error as ApiError;
      const { errorMessage } = handleErrorResponse(_error);
      openToastNotification(
        errorMessage,
        "notifications toast-notification-error"
      );
      console.log("error", _error);
    } finally {
      hideLoader();
    }
  }

  const setFormValues = (data: PartnerLocation) => {
    data?.imageUrl ? setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: data?.imageUrl || "" }]) : setFileList([]);
    const { days, hours, minutes } = extractTimeComponents(data?.bookingNoticeMinutes);
    form.setFieldsValue({
      name: data?.name,
      code: data?.code,
      phoneNumber: data?.phoneNumber || '',
      country: data?.city.location,
      city: data?.city.id,
      postalCode: data?.postalCode,
      longitude: data?.longitude,
      lattitude: data?.lattitude,
      streetAddress: data?.streetAddress,
      customerGuidelines: data?.customerGuidelines,
      walkInGuidelines: data?.walkInGuidelines,
      status: data?.status,
      email: data?.emailAddress,
      days: days,
      hours: hours,
      minutes: minutes
    });
    setIsAvailableNowSlot(data?.isAvailableNow);
    setIsBookingNotice(data?.isBookingNoticeEnabled);
    createOperatingHours(data?.partner_location_timings)
    setImageUrl(data?.imageUrl || "");
  }

  const createOperatingHours = (partner_location_timings?: any) => {
    generateQRCode()
    const operatingHours: operatingHoursType[] = [];
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    days.forEach((day, index) => {
      if (!locationID) {
        operatingHours.push({
          day: day,
          startTime: "",
          endTime: "",
          breakStart: "",
          breakEnd: "",
          status: "DISABLED",
          index: index
        })
      } else {
        const dayIndex = partner_location_timings?.findIndex((item: any) => item?.day === day);
        if (dayIndex === -1) {
          operatingHours.push({
            day: day,
            startTime: "",
            endTime: "",
            breakStart: "",
            breakEnd: "",
            status: "DISABLED",
            index: index
          })
        } else {
          operatingHours.push({
            day: partner_location_timings[dayIndex].day,
            startTime: partner_location_timings[dayIndex].startTime,
            endTime: partner_location_timings[dayIndex].endTime,
            breakStart: partner_location_timings[dayIndex].breakStart,
            breakEnd: partner_location_timings[dayIndex].breakEnd,
            status: partner_location_timings[dayIndex].status,
            index: index
          })
        }
      }
    })
    setOperatingHours(operatingHours);
  }

  const createPayloadForOperatingHours = () => {
    let operatingHoursPayload: any = [];
    operatingHours.forEach((item) => {
      //if (item.status === "ENABLED") {
      operatingHoursPayload.push({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        breakStart: item.breakStart,
        breakEnd: item.breakEnd,
        status: item.status
      })
      //}
    })
    return operatingHoursPayload;
  }

  const submitFailed = (errorInfo: any) => {
    console.log('submitFailed')
    const errorFields = errorInfo.errorFields;
    let firstErrorFieldName = "";
    for (const error of errorFields) {
      console.log('error', error);

      const fieldName = error?.name[0].toString() || "";
      if (!firstErrorFieldName) {
        firstErrorFieldName = fieldName;
        const inputRef = getInputRefByFieldName(firstErrorFieldName);
        showError(error.errors[0]);
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const onCheckBoxChange = (e: any, Day: string, index: number) => {
    setOperatingHours((prev) => {
      const updatedOperatingHours = [...prev];
      updatedOperatingHours[index].status = e.target.checked === true ? "ENABLED" : "DISABLED";
      return updatedOperatingHours;
    })
    setIsDataChange(true)
  }

  const handleUpdate = () => {
    console.log('handleUpdate')
  }


  const handleIconClick = () => {
    setModalVisible(true);
  };

  const handleOnChange = (changedValues: string) => {
    const name = Object.keys(changedValues)?.[0];
    const value = Object.values(changedValues)?.[0];
    if (name === 'country'){
      getCities(Number(value))
      form.setFieldValue('city', undefined);
    }
    if(name === "email") {
      form.setFieldValue(name, value.toLowerCase().trim());
    }
    setIsDataChange(true)
  }

  const getCountryCode = async () => {
    try {
      const countryCode = await getCountryCodeByIp();
      if (countryCode) {
        setCountryCode(countryCode.toLowerCase());
      }
    } catch (error) {
      console.error('Error fetching country code:', error);
    }
  };

  
  useEffect(() => {
    !locationID && createOperatingHours();
    if(ME?.user){
      locationID && getPartnerLocation();
      getCountryCode();
    }
   
  }, [])

  useEffect(() => {
    let CountryOptionsArr: any = []
    ME?.systemLocations && ME?.systemLocations.map((location: any) => {
      if (location.type === "COUNTRY" && location.status === "ENABLED") CountryOptionsArr.push({ label: location.name, value: location.id })
    })
    setgeneralCountries(CountryOptionsArr)
  }, [ME])

  const getCities = (value:number) => {
    let CityOptionsArr: any = []
    ME?.systemLocations && ME?.systemLocations.map((location: any) => {
      if (location.type === "CITY" && location.status === "ENABLED" && location.location === value) 
        CityOptionsArr.push({ label: location.name, value: location.id })
    
    })
    setgeneralCities(CityOptionsArr)
  }

  const onChangeAvailableNowSlot = (checked: boolean) => {
    if (isBookingNoticeEnabled && checked) {
      showError(LABELS.BOOKING_NOTICE_ALERT);
      setShowWalkinError(true);
    }
    else {
      setIsAvailableNowSlot(checked);
      setIsDataChange(true);
      setShowWalkinError(false);
    }
  };

  const onChangeBookingNotice = (checked: boolean) => {
    if (isAvailableNowSlot && checked) {
      showError(LABELS.BOOKING_NOTICE_WALKIN_ALERT);
      setShowMBNError(true);
    }
    else {
      setIsBookingNotice(checked);
      setIsDataChange(true);
      setShowMBNError(false);
    }
  };

  const calculateBookingNoticeMinutes = () => {
    let days = 0;
    let hours = form.getFieldValue('hours');
    let minutes = form.getFieldValue('minutes');
    const bookingNoticeMinutes = ((days || 0) * 1440) + ((hours || 0) * 60) + (minutes || 0);

    if (isBookingNoticeEnabled && bookingNoticeMinutes === 0) {
      submitFailed(
        {
          errorFields: [{
            name: ['hours'], // replace with the actual field name
            errors: [ERRORS.MINIMUM_BOOKING_NOTICE_ZERO_ERROR], // replace with the actual error message
          }],
        },
      );
      return false;
    }

    return bookingNoticeMinutes;
  }

  const generateQRCode = async () => {
    try {
      const url = `${customerURL}/walk-in/${walkInUrl}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        scale: 100
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };
  const handleDownloadPdf = async () => {
    
    const blob = await pdf(<MyDocument clinicName={form.getFieldValue('code')} streetAddress={form.getFieldValue('streetAddress')} walkinInstructions={form.getFieldValue('walkInGuidelines')} qrCodeUrl={qrCodeUrl}/>).toBlob();
    const url = URL.createObjectURL(blob);
    console.log('blob', blob)
    console.log('url', url)
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'example.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const downloadImage = () => {
    const imageUrl = qrCodeUrl; // Replace with your image URL
    const fileName = "Walkin-QrCode.jpg"; // Desired file name
  
    const img = document.createElement("img"); // Use document.createElement
    img.crossOrigin = "anonymous"; // Handle cross-origin issues
    img.src = imageUrl;
  
    img.onload = () => {
      // Create a canvas for resizing
      const canvas = document.createElement("canvas");
      canvas.width = 1028;
      canvas.height = 1028;
      const ctx = canvas.getContext("2d");
  
      // Draw the resized image on the canvas
      ctx?.drawImage(img, 0, 0, 1028, 1028);
  
      // Create a temporary download link
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = fileName;
  
      // Trigger the download
      link.click();
    };
  
    img.onerror = () => {
      console.error("Failed to load the image.");
    };
  };

  const handleCopyQRCode = async () => {
    try {
      // Create an image element
      const img = document.createElement("img");
      img.src = qrCodeUrl; // QR code image URL
      
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Set the canvas size to match the image size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);
  
          // Try to copy the canvas image to the clipboard
          canvas.toBlob((blob) => {
            // Check if the blob is not null
            if (blob) {
              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item]);
              openToastNotification(
                "QR Image has been copied",
                NOTIFICATION_STATUS.SUCCESS
                
              );
            } else {
              console.error("Failed to create Blob from canvas.");
            }
          }, 'image/png');
        }
      };
  
      img.onerror = () => {
        console.error("Failed to load the image.");
      };
    } catch (err) {
      console.error("Error during copying QR code:", err);
    }
  };

  return (
    <div className="create-partner-content">
      {
        <Form
          onFinish={handleFinish}
          onFinishFailed={submitFailed}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          form={form}
          autoComplete="off"
          onValuesChange={handleOnChange}
        >
          <Modal
            title={LONGITUDE_LATITUDE.title}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            >
          <p>
            {LONGITUDE_LATITUDE.text}
          </p>
          <ol>
            <li>{LONGITUDE_LATITUDE?.list[0]}<a href="https://www.latlong.net/convert-address-to-lat-long.html">https://www.latlong.net/convert-address-to-lat-long.html</a>.</li>
            <li>{LONGITUDE_LATITUDE?.list[1]}</li>
            <li>{LONGITUDE_LATITUDE?.list[2]}</li>
          </ol>
          <p>
            <strong>{LONGITUDE_LATITUDE?.note}</strong> {LONGITUDE_LATITUDE?.note_text}
          </p>
        </Modal>
          <Row justify={"space-between"} className="mb-2">
            <Col
              lg={{ span: 12 }}
              md={{ span: 12 }}
              sm={{ span: 23 }}
              xs={{ span: 23 }}
            >
              <Title level={3} className="remove-vertical-margin ">
                {isUpdateForm
                  ? HEADING.UPDATE_PARTNER_LOCATION
                  : HEADING.CREATE_PARTNER_LOCATION}
              </Title>
            </Col>

            <Col
              lg={{ span: 12 }}
              md={{ span: 12 }}
              sm={{ span: 23 }}
              xs={{ span: 23 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Space>
                  <Button
                    type="default"
                    htmlType="button"
                    onClick={() =>
                      navigate(`/partner/${partnerID}/manageAccount/${partnerName}`)
                    }
                  >
                    {LABELS.CANCEL}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      (partnerID && (isDataChange ? false : true)) || false
                    }
                  >
                    {isUpdateForm ? BUTTONS.UPDATE : BUTTONS.SAVE}
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col
              lg={{ span: 13 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Row gutter={8}>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.name ? "error" : ""}
                    name="name"
                    label={<label className="label ">{LABELS.NAME}</label>}
                    rules={[
                      { required: true, message: ERRORS.NAME },
                      {
                        min: 3,
                        message: t("ERRORS.MIN_LENGTH_3", { type: "Name" }),
                      },
                      {
                        max: 50,
                        message: t("ERRORS.MAX_LENGTH_50", { type: "Name" }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.NAME}
                      ref={inputNameRef as any}
                      autoFocus={false}
                      disabled={false}
                      maxLength={50}
                      showCount
                    />
                  </Form.Item>
                </Col>

                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.code ? "error" : ""}
                    name="code"
                    label={<label className="label ">{LABELS.CODE}</label>}
                    rules={[
                      { required: true, message: ERRORS.CODE },
                      {
                        min: 3,
                        message: t("ERRORS.MIN_LENGTH_3", { type: "Code" }),
                      },
                      {
                        max: 50,
                        message: t("ERRORS.MAX_LENGTH_50", { type: "Code" }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.CODE}
                      ref={inputCodeRef as any}
                      autoFocus={false}
                      disabled={false}
                      maxLength={50}
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.phoneNumber ? "error" : ""}
                    name="phoneNumber"
                    label={
                      <label className="label ">{LABELS.PHONE_NUMBER}</label>
                    }
                    rules={[
                      {
                        pattern: /^\+?\d{7,17}$/,
                        message: t("ERRORS.VALID_INPUT", {
                          type: "Phone number",
                        }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <PhoneInput
                      country={countryCode || "fr"}
                      value={phone}
                      onChange={(
                        value: string,
                        country: any,
                        e: any,
                        formattedValue: string
                      ) => {
                        if (/^\+?\d{7,17}$/.test(value)) {
                          setPhone(phone);
                        } else {
                          setPhone(phone);
                        }
                      }}
                      disableSearchIcon={true}
                      inputStyle={{
                        height: 32,
                        width: "100%",
                        border: "1px solid #d9d9d9",
                        fontSize: 14,
                      }}
                      containerClass="custom-phone-input"
                      enableSearch={true}
                      countryCodeEditable={false}
                      inputProps={{ ref: inputPhoneNumberRef }}
                    />
                  </Form.Item>
                </Col>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.email ? "error" : ""}
                    name="email"
                    label={
                      <label className="label">{LABELS.EMAIL_ADDRESS}</label>
                    }
                    rules={[
                      {
                        required: true,
                        message: ERRORS.EMAIL_REQUIRED,
                      },
                      {
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.resolve();
                          }
                          const validationError = emailValidate(value);
                          if (validationError) {
                            return Promise.reject(new Error(validationError));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.EMAIL_ADDRESS}
                      ref={inputEmailRef as any}
                      autoFocus={false}
                      disabled={false}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.country ? "error" : ""}
                    name="country"
                    label={
                      <label className="label ">
                        {LABELS.COUNTRY}
                        <Tooltip title={LABELS.COUNTRY_TOOLTIP} />
                      </label>
                    }
                    rules={[
                      {
                        required: true,
                        message: ERRORS.SEARCH_AND_SELECT_COUNTRY,
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Select
                      placeholder={LABELS.SEARCH_AND_SELECT_COUNTRY}
                      ref={inputCountryRef as any}
                      autoFocus={false}
                      disabled={false}
                    >
                      {generalCountries.map((country) => (
                        <Option key={country.value} value={country.value}>
                          {country.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                 <Form.Item
                    validateStatus={errors.city ? "error" : ""}
                    name="city"
                    label={
                      <label className="label ">
                        {LABELS.CITY}
                        <Tooltip title={LABELS.CITY_TOOLTIP} />
                      </label>
                    }
                    rules={[
                      {
                        required: true,
                        message: ERRORS.SEARCH_AND_SELECT_CITY,
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Select
                      placeholder={LABELS.SEARCH_AND_SELECT_CITY}
                      ref={inputCityRef as any}
                      autoFocus={false}
                      disabled={!generalCities.length}
                    >
                      {generalCities.map((city) => (
                        <Option key={city.value} value={city.value}>
                          {city.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.lattitude ? "error" : ""}
                    name="lattitude"
                    label={<label className="label ">{LABELS.LATITUDE}</label>}
                    rules={[
                      { required: true, message: ERRORS.LATITUDE },
                      {
                        pattern: new RegExp(
                          /^-?([1-8]?\d(\.\d{1,6})?|90(\.0{1,6})?)$/
                        ),
                        message: t("ERRORS.VALID_LATITUDE", {
                          type: "Latitude",
                        }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.LATITUDE}
                      ref={inputLatitudeRef as any}
                      autoFocus={false}
                      disabled={false}
                    />
                  </Form.Item>
                </Col>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.longitude ? "error" : ""}
                    name="longitude"
                    label={<label className="label ">{LABELS.LONGITUDE}</label>}
                    rules={[
                      { required: true, message: ERRORS.LONGITUDE },
                      {
                        pattern: new RegExp(
                          /^-?((1[0-7]\d(\.\d{1,6})?)|180(\.0{1,6})?|([1-9]?\d(\.\d{1,6})?))$/
                        ),
                        message: t("ERRORS.VALID_LONGITUDE", {
                          type: "Longitude",
                        }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.LONGITUDE}
                      ref={inputLongitudeRef as any}
                      autoFocus={false}
                      disabled={false}
                      addonAfter={
                        <span
                          style={{ cursor: "pointer", margin: "5px" }}
                          onClick={handleIconClick}
                        >
                          <ExclamationCircleOutlined />
                        </span>
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.streetAddress ? "error" : ""}
                    name="streetAddress"
                    label={
                      <label className="label ">{LABELS.STREET_ADDRESS}</label>
                    }
                    rules={[
                      { required: true, message: ERRORS.STREET_ADDRESS },
                      {
                        min: 3,
                        message: t("ERRORS.MIN_LENGTH_3", {
                          type: "Street Address",
                        }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <TextArea
                      placeholder={LABELS.STREET_ADDRESS}
                      ref={inputStreetAddressRef as any}
                      autoFocus={false}
                      disabled={false}
                      rows={5}
                    />
                  </Form.Item>
                </Col>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.customerGuidelines ? "error" : ""}
                    name="customerGuidelines"
                    label={
                      <label className="label ">
                        {LABELS.CUSTOM_GUIDELINES}
                        <Tooltip title={LABELS.GUIDELINE_TOOLTIP} />
                      </label>
                    }
                    rules={[
                      {
                        min: 3,
                        message: t("ERRORS.MIN_LENGTH_3", {
                          type: "Arrival Instructions",
                        }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <TextArea
                      placeholder={LABELS.CUSTOM_GUIDELINES}
                      ref={inputStreetAddressRef as any}
                      autoFocus={false}
                      disabled={false}
                      rows={5}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.status ? "error" : ""}
                    name="status"
                    label={<label className="label ">{LABELS.STATUS}</label>}
                    rules={[{ required: true, message: ERRORS.STATUS }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Select
                      placeholder={PLACEHOLDERS.STATUS}
                      ref={inputStatusRef as any}
                      autoFocus={false}
                      disabled={false}
                    >
                      <Option value="enabled">{LABELS.ENABLED}</Option>
                      <Option value="disabled">{LABELS.DISABLED}</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                  validateStatus={errors.postalCode ? "error" : ""}
                  name="postalCode"
                  label={
                  <label className="label ">{LABELS.POSTAL_CODE}</label>
                  }
                  validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                  <Input
                  placeholder={LABELS.POSTAL_CODE}
                  ref={inputPostalCodeRef as any}
                  autoFocus={false}
                  disabled={false}
                  />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col
                lg={{ span: 12 }}
                md={{ span: 12 }}
                sm={{ span: 23 }}
                xs={{ span: 23 }}
                >
                 <Form.Item
                    name="fileList"
                    label={LABELS.LOCATION_IMAGE}
                    valuePropName="fileList"
                  >
                    <UploadFile
                      setFileList={setFileList}
                      fileType={"image/png"}
                      fileTypeError={ERRORS?.IMAGE_FILE_TYPE}
                      requiredImage={false}
                      errorMessage={ERRORS.UPLOAD_LOGO}
                      validateTrigger={["handleSave", "handleUpdate"]}
                      label={LABELS.UPLOAD_LOGO}
                      name={"image"}
                      fileListArr={fileList}
                      setImageUrl={setImageUrl}
                    />
                  </Form.Item>
                
                </Col>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.walkInGuidelines ? "error" : ""}
                    name="walkInGuidelines"
                    label={
                      <label className="label ">
                        {LABELS.WALK_IN_GUIDELINES}
                        <Tooltip title={LABELS.GUIDELINE_TOOLTIP} />
                      </label>
                    }
                    rules={[
                      {
                        min: 3,
                        message: t("ERRORS.MIN_LENGTH_3", {
                          type: "WalkIn Instructions",
                        }),
                      },
                    ]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <TextArea
                      placeholder={LABELS.WALK_IN_GUIDELINES}
                      ref={inputWalkInGuidelinesRef as any}
                      autoFocus={false}
                      disabled={false}
                      rows={5}
                      maxLength={600}
                      showCount
                    />
                  </Form.Item>
                </Col>

              </Row>
            </Col>

            {/* create a horizental divider according to defined row and col structure,  */}
            <Col
              lg={{ span: 1 }}
              md={{ span: 0 }}
              sm={{ span: 0 }}
              xs={{ span: 0 }}
            >
              <Divider
                orientation={"center"}
                type="vertical"
                style={{ height: "100%" }}
              />
            </Col>

            <Col
              lg={{ span: 10 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Row gutter={8}>
                <Col
                  lg={{ span: 24 }}
                  md={{ span: 24 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Title level={3} className="remove-vertical-margin ">
                    {HEADING.OPERATING_HOURS}
                    <Tooltip title={HEADING.OPERATING_HOURS_TOOLTIP} />
                  </Title>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col
                  lg={{ span: 24 }}
                  md={{ span: 24 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  {/* create a table which has 5 columns, day, start time, end time, break slot, break end, use antd table, use ant.table */}
                  <Table
                    columns={OperatingHours({
                      handleOperatingHoursChange,
                      onCheckBoxChange,
                      ERRORS,
                    })}
                    data={operatingHours || []}
                    totalRecord={operatingHours?.length}
                    scroll={500}
                    pageSize={0}
                    pagination={false}
                    noRecordText={
                      isLoading ? "Loading..." : LABELS.NO_RECORDS_FOUND
                    }
                    currentPage={0}
                    setPage={function (value: SetStateAction<number>): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </Col>
              </Row>
              <Divider
                orientation={"center"}
                style={{ margin: "4px 0", borderColor: "#f5f5f5" }}
              />

              <div style={{ background: "white" }}>
                <Row gutter={8}>
                  <Col
                    lg={{ span: 24 }}
                    md={{ span: 24 }}
                    sm={{ span: 23 }}
                    xs={{ span: 23 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "14px 14px 10px 14px",
                        gap: "20px",
                        background: "white",
                      }}
                    >
                      <span>{LABELS.WALK_IN_TXT}</span>
                      <Switch
                        title={
                          isAvailableNowSlot
                            ? LABELS.DISABLE_WALK_IN
                            : LABELS.ENABLE_WALK_IN
                        }
                        checked={isAvailableNowSlot}
                        onChange={onChangeAvailableNowSlot}
                      />
                    </div>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "red",
                        padding: "0px 0px 5px 14px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showWalkinError ? LABELS.BOOKING_NOTICE_ALERT : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#1677ff",
                        padding: "0px 0px 25px 14px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {LABELS.BOOKING_NOTICE_WALKIN_DESC}
                    </Text>
                    {isAvailableNowSlot && qrCodeUrl && <div style={{display:'flex', justifyItems:'center', alignItems:'center', flexDirection:'column', backgroundColor:'#F6F6F6', paddingTop:20, paddingBottom:20,marginLeft:10, marginRight:10, borderRadius:10, marginBottom:20}}>
               <span id='qr-container'> {walkInUrl && <Image src={qrCodeUrl} height={200} width={200}/>} </span>
                {walkInUrl ? <div style={{display:'flex', gap:10, alignItems:'center', marginTop:10}}>
                <Button onClick={downloadImage} style={{backgroundColor:'#183A59', color:'white', marginTop:5, marginBottom:5}}>Download JPG</Button>
                <Button onClick={handleDownloadPdf} style={{backgroundColor:'#183A59', color:'white', marginTop:5, marginBottom:5}}>Download PDF</Button>
                <Button onClick={handleCopyQRCode} style={{backgroundColor:'#183A59', color:'white', marginTop:5, marginBottom:5}}>Copy QR Image</Button>
                </div> : <p style={{textAlign:'center', marginTop:10}}>QR image will be available for download only after the location is created.</p>}
               
                </div>}
                  </Col>
                </Row>
                <div style={{ padding: "0 30px", width: "100%" }}>
                  <Divider
                    style={{
                      borderColor: "#f5f5f5",
                      width: "50%",
                      margin: "0 auto",
                    }}
                  />
                </div>

                <Row gutter={8}>
                  <Col
                    lg={{ span: 12 }}
                    md={{ span: 12 }}
                    sm={{ span: 23 }}
                    xs={{ span: 23 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        gap: "20px",
                      }}
                    >
                      <span>{LABELS.BOOKING_NOTICE}</span>
                      <Switch
                        title={
                          isBookingNoticeEnabled
                            ? LABELS.DISABLE_MIN_BOOKING_NOTICE
                            : LABELS.ENABLE_MIN_BOOKING_NOTICE
                        }
                        checked={isBookingNoticeEnabled}
                        onChange={onChangeBookingNotice}
                      />
                    </div>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "red",
                        padding: "0px 0px 5px 14px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showMBNError ? LABELS.BOOKING_NOTICE_WALKIN_ALERT : ""}
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: "#1677ff",
                        padding: "0px 14px 35px 14px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {LABELS.BOOKING_NOTICE_DESC}
                    </Text>
                  </Col>
                  <Col
                    lg={{ span: 12 }}
                    md={{ span: 12 }}
                    sm={{ span: 23 }}
                    xs={{ span: 23 }}
                  >
                    <Row
                      gutter={[10, 10]}
                      style={{
                        display: "flex",
                        marginRight: "5px",
                        justifyContent: "flex-end",
                      }}
                    >
                      {/* <Col
                      lg={{ span: 5 }}
                      md={{ span: 5 }}
                      sm={{ span: 6 }}
                      xs={{ span: 20 }}
                    >
                      <Form.Item
                        name='days'
                        label={
                          <label className='label '>
                            {LABELS.DAYS}
                          </label>
                        }
                        validateTrigger={["handleFinish", "handleUpdate"]}
                      >
                        <DaysInput
                          disabled={!isBookingNoticeEnabled}
                          onChange={(val: number) => {
                            setIsDataChange(true);
                          }
                          }
                        />
                      </Form.Item>
                    </Col> */}
                      <Col
                        lg={{ span: 10 }}
                        md={{ span: 10 }}
                        sm={{ span: 10 }}
                        xs={{ span: 14 }}
                      >
                        <Form.Item
                          name="hours"
                          label={
                            <label className="label ">{LABELS.HOURS}</label>
                          }
                          validateTrigger={["handleFinish", "handleUpdate"]}
                        >
                          <HoursDropdown
                            disabled={!isBookingNoticeEnabled}
                            onChange={(val: number) => {
                              setIsDataChange(true);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        lg={{ span: 10 }}
                        md={{ span: 10 }}
                        sm={{ span: 10 }}
                        xs={{ span: 14 }}
                      >
                        <Form.Item
                          name="minutes"
                          label={
                            <label className="label ">{LABELS.MINUTES}</label>
                          }
                          validateTrigger={["handleFinish", "handleUpdate"]}
                        >
                          <MinutesDropdown
                            disabled={!isBookingNoticeEnabled}
                            onChange={(val: number) => {
                              setIsDataChange(true);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
      }
    </div>
  );
}

export default LocationCreateUpdate



 