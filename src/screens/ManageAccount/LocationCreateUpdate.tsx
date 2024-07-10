import {
  Switch, Button, Col, Divider, Form, Input, Row, Select, Space, Typography, UploadFile as AntUploadFile, Modal,
} from 'antd';
import { SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { handleErrorResponse, openToastNotification, showError } from '../../helpers/globalFunctions';
import UploadFile from '../../components/UploadFile/Index';
import Table from '../../components/Table/Index';
import { OperatingHours } from '../../components/TableColumns/OperatingHoursTable';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../services/api/Index';
import { createPartnerLocation, getLocation, updatePartnerLocation } from '../../services/api/partnerLocation';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { PartnerLocation } from '../../interface/PartnerLocation';
import Tooltip from '../../components/Tooltip/Index';
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
  const [cityOptions, setCityOptions] = useState<{ label: string, value: number }[]>([]);
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [errors, setErrors] = useState({
    name: "",
    code: "",
    phoneNumber: "",
    city: "",
    postalCode: "",
    longitude: "",
    lattitude: "",
    streetAddress: "",
    customerGuidelines: "",
    status: "",
    docConsFixedFee: "",
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
  let { partnerID, locationID } = params;
  const { ME, setSuccess } = useContext(GlobalContext) as GlobalContextProps;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isAvailableNowSlot, setIsAvailableNowSlot] = useState<boolean>(false);
  const inputNameRef = useRef<null | HTMLElement>(null);
  const inputCodeRef = useRef<null | HTMLElement>(null);
  const inputPhoneNumberRef = useRef<null | HTMLElement>(null);
  const inputCityRef = useRef<null | HTMLElement>(null);
  const inputPostalCodeRef = useRef<null | HTMLElement>(null);
  const inputLongitudeRef = useRef<null | HTMLElement>(null);
  const inputLatitudeRef = useRef<null | HTMLElement>(null);
  const inputStreetAddressRef = useRef<null | HTMLElement>(null);
  const inputCustomerGuidelinesRef = useRef<null | HTMLElement>(null);
  const inputStatusRef = useRef<null | HTMLElement>(null);

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
      case "status":
        return inputStatusRef;
      default:
        return null;
    }
  };

  const getPartnerLocation = async () => {
    showLoader();
    try {
      const response = await getLocation(locationID || "");
      setFormValues(response.data.response)
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
      status: form.getFieldValue('status').toUpperCase(),
      partner_location_timings: JSON.stringify(createPayloadForOperatingHours()),
      partnerId: partnerID,
      file: !isUpdateForm ? fileList[0] : fileList[0]?.thumbUrl ? fileList[0] : {},
      imageUrl: isUpdateForm ? (fileList[0] && fileList[0]?.thumbUrl ? "" : imageUrl) : "",
      isAvailableNow: isAvailableNowSlot
    }
    return request;
  }

  const handleFinish = async () => {
    try {
      showLoader();
      let response: any = {}
      if (!locationID) response = await createPartnerLocation(partnerLocationRequest());
      if (locationID) response = await updatePartnerLocation(locationID, partnerLocationRequest());
      form.resetFields();
      setFileList([]);

      if (locationID) {
        setSuccess(SUCCESS.PARTNER_LOCATION_UPDATED)
      } else {
        setSuccess(SUCCESS.PARTNER_LOCATION_CREATED)
      }
      navigate(`/partner/${partnerID}/manageAccount`);

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
    form.setFieldsValue({
      name: data?.name,
      code: data?.code,
      phoneNumber: data?.phoneNumber,
      city: data?.city.id,
      postalCode: data?.postalCode,
      longitude: data?.longitude,
      lattitude: data?.lattitude,
      streetAddress: data?.streetAddress,
      customerGuidelines: data?.customerGuidelines,
      status: data?.status,
    });
    setIsAvailableNowSlot(data?.isAvailableNow);
    createOperatingHours(data?.partner_location_timings)
    setImageUrl(data?.imageUrl || "");
  }

  const createOperatingHours = (partner_location_timings?: any) => {
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
            status: "ENABLED",
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
      if (item.status === "ENABLED") {
        operatingHoursPayload.push({
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
          breakStart: item.breakStart,
          breakEnd: item.breakEnd,
          status: item.status
        })
      }
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

  const handleOnChange = () => {
    setIsDataChange(true)

  }

  useEffect(() => {
    locationID && getPartnerLocation();
    !locationID && createOperatingHours();
  }, [])

  useEffect(() => {
    let cityOptionsArr: any = []
    ME?.systemLocations && ME?.systemLocations.map((location: any) => {
      if (location.type === "CITY" && location.status === "ENABLED") cityOptionsArr.push({ label: location.name, value: location.id })
    })
    setCityOptions(cityOptionsArr)
  }, [ME])

  const onChangeAvailableNowSlot = (checked: boolean) => {
    setIsAvailableNowSlot(checked);
    setIsDataChange(true);
  };

  return (
    <div className='create-partner-content'>
      {<Form
        onFinish={handleFinish}
        onFinishFailed={submitFailed}
        name='basic'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        form={form}
        autoComplete='off'
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
        </Modal>
        <Row justify={"space-between"} className='mb-2'>
          <Col
            lg={{ span: 12 }}
            md={{ span: 12 }}
            sm={{ span: 23 }}
            xs={{ span: 23 }}
          >
            <Title level={3} className='remove-vertical-margin '>
              {isUpdateForm ? HEADING.UPDATE_PARTNER_LOCATION : HEADING.CREATE_PARTNER_LOCATION}
            </Title>
          </Col>

          <Col
            lg={{ span: 12 }}
            md={{ span: 12 }}
            sm={{ span: 23 }}
            xs={{ span: 23 }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: "100%" }}>
              <Space>
                <Button
                  type='default'
                  htmlType='button'
                  onClick={() => navigate(`/partner/${partnerID}/manageAccount/`)}
                >
                  {LABELS.CANCEL}
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  disabled={(partnerID && (isDataChange ? false : true) || false)}
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
                  name='name'
                  label={
                    <label className='label '>
                      {LABELS.NAME}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.NAME }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Name" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "Name" }) }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Input
                    placeholder={LABELS.NAME}
                    ref={inputNameRef as any}
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
                  validateStatus={errors.code ? "error" : ""}
                  name='code'
                  label={
                    <label className='label '>
                      {LABELS.CODE}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.CODE }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Code" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "Code" }) }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Input
                    placeholder={LABELS.CODE}
                    ref={inputCodeRef as any}
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
                  validateStatus={errors.phoneNumber ? "error" : ""}
                  name='phoneNumber'
                  label={
                    <label className='label '>
                      {LABELS.PHONE_NUMBER}
                    </label>
                  }
                  rules={[{
                    pattern: /^\+?\d{7,17}$/
                    , message: t("ERRORS.VALID_INPUT", { type: "Phone number" })
                  }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Input
                    placeholder={LABELS.PHONE_NUMBER}
                    ref={inputPhoneNumberRef as any}
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
                  validateStatus={errors.city ? "error" : ""}
                  name='city'
                  label={
                    <label className='label '>
                      {LABELS.CITY}
                      <Tooltip title={LABELS.CITY_TOOLTIP} />
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.SEARCH_AND_SELECT_CITY }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Select
                    placeholder={LABELS.SEARCH_AND_SELECT_CITY}
                    ref={inputCityRef as any}
                    autoFocus={false}
                    disabled={false}
                  >
                    {cityOptions.map((city) => (
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
                  name='lattitude'
                  label={
                    <label className='label '>
                      {LABELS.LATITUDE}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.LATITUDE }, { pattern: new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,25}$/), message: t("ERRORS.VALID_INPUT", { type: "Latitude" }) }]}
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
                  name='longitude'
                  label={
                    <label className='label '>
                      {LABELS.LONGITUDE}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.LONGITUDE }, {
                    pattern: new RegExp(/^(-?(?:1[0-7]\d(\.\d{1,25})?|180(\.0{1,25})?)|(-?\d{1,2}(\.\d{1,25})?))$/), message: t("ERRORS.VALID_INPUT", { type: "Longitude" })
                  }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Input
                    placeholder={LABELS.LONGITUDE}
                    ref={inputLongitudeRef as any}
                    autoFocus={false}
                    disabled={false}
                    addonAfter={
                      <span
                        style={{ cursor: 'pointer', margin: '5px' }}
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
                  validateStatus={errors.postalCode ? "error" : ""}
                  name='postalCode'
                  label={
                    <label className='label '>
                      {LABELS.POSTAL_CODE}
                    </label>
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
                  validateStatus={errors.streetAddress ? "error" : ""}
                  name='streetAddress'
                  label={
                    <label className='label '>
                      {LABELS.STREET_ADDRESS}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.STREET_ADDRESS }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Street Address" }) }]}
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
                  name='customerGuidelines'
                  label={
                    <label className='label '>
                      {LABELS.CUSTOM_GUIDELINES}
                      <Tooltip title={LABELS.GUIDELINE_TOOLTIP} />
                    </label>
                  }
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
                <Form.Item name="fileList" label={LABELS.LOCATION_IMAGE} valuePropName="fileList">
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
                  validateStatus={errors.status ? "error" : ""}
                  name='status'
                  label={
                    <label className='label '>
                      {LABELS.STATUS}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.STATUS }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Select
                    placeholder={PLACEHOLDERS.STATUS}
                    ref={inputStatusRef as any}
                    autoFocus={false}
                    disabled={false}
                  >
                    <Option value='enabled'>{LABELS.ENABLED}</Option>
                    <Option value='disabled'>{LABELS.DISABLED}</Option>
                  </Select>
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
            <Divider orientation={"center"} type='vertical' style={{ height: '100%' }} />
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
                <Title level={3} className='remove-vertical-margin '>
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
                  columns={OperatingHours({ handleOperatingHoursChange, onCheckBoxChange, ERRORS })}
                  data={operatingHours || []}
                  totalRecord={operatingHours?.length}
                  scroll={500}
                  pageSize={0}
                  pagination={false}
                  noRecordText={isLoading ? "Loading..." : LABELS.NO_RECORDS_FOUND} currentPage={0} setPage={function (value: SetStateAction<number>): void {
                    throw new Error('Function not implemented.');
                  }} />

                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '12px', gap: "20px" }}>
                  <span>{LABELS.WALK_IN_TXT}</span>
                  <Switch title={isAvailableNowSlot ? LABELS.DISABLE_WALK_IN : LABELS.ENABLE_WALK_IN} checked={isAvailableNowSlot} onChange={onChangeAvailableNowSlot} />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form >}
    </div >
  )
}

export default LocationCreateUpdate