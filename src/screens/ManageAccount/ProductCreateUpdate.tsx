import {
  Button, Checkbox, Col, Form, Input, Row, Select, Space, Typography, UploadFile as AntUploadFile,
} from 'antd';
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { handleErrorResponse, openToastNotification, showError } from '../../helpers/globalFunctions';
import UploadFile from '../../components/UploadFile/Index';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import { useTranslation } from 'react-i18next';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import { ApiError } from '../../services/api/Index';
import { createPartnerProduct, getProducts, updatePartnerProduct } from '../../services/api/partnerProduct';
import { PartnerProduct } from '../../interface/PartnerProduct';
import { getPartnerLocations } from '../../services/api/partnerLocation';
import { Storage } from '../../services/storage';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function ProductCreateUpdate({ isUpdateForm }: { isUpdateForm?: boolean }) {
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);
  const [isDataChange, setIsDataChange] = useState(false)
  const [serviceOptions, setServiceOptions] = useState<{ label: string; value: number }[]>([])
  const [selectedServiceType, setselectedServiceType] = useState<number[]>([1])
  const [locationOptions, setlocationOptions] = useState<{ label: string; value: number }[]>([])
  const [selectedLocations, setselectedLocations] = useState<number[]>([])
  const [price, setPrice] = useState<number>()
  const [customerSeesPrice, setCustomerSeesPrice] = useState<number>(Storage.getFixedFee() || 0)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [errors, setErrors] = useState({
    name: "",
    code: "",
    phoneNumber: "",
    city: "",
    postalCode: "",
    status: "",
    price: "",
  });
  const { t } = useTranslation();
  const BUTTONS: any = t("BUTTONS", { returnObjects: true });
  const HEADING: any = t("HEADING", { returnObjects: true });
  const ERRORS: any = t("ERRORS", { returnObjects: true });
  const LABELS: any = t("LABELS", { returnObjects: true });
  const PLACEHOLDERS: any = t("PLACEHOLDERS", { returnObjects: true });
  const TABLE_NO_RECORDS_TEXT: any = t("TABLE_NO_RECORDS_TEXT", { returnObjects: true });
  const SUCCESS: any = t("SUCCESS", { returnObjects: true });
  const { ME, setSuccess } = useContext(GlobalContext) as GlobalContextProps;
  const { showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
  let params = useParams();
  const { partnerID, productID } = params;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const inputNameRef = useRef<null | HTMLElement>(null);
  const inputStatusRef = useRef<null | HTMLElement>(null);
  const inputCodeRef = useRef<null | HTMLElement>(null);
  const inputPriceRef = useRef<null | HTMLElement>(null);
  const inputDescriptionRef = useRef<null | HTMLElement>(null);
  const inputCustomerGuidelinesRef = useRef<null | HTMLElement>(null);
  const inputSlotDurationRef = useRef<null | HTMLElement>(null);


  const serviceTypeOnChange = (checkedValues: number[]) => {
    setIsDataChange(true)
    setselectedServiceType(checkedValues)
  };

  const cityOnchange = (checkedValues: number[]) => {
    setselectedLocations(checkedValues)
    setIsDataChange(true)
  };

  const getInputRefByFieldName = (fieldName: string | undefined) => {
    switch (fieldName) {
      case "name":
        return inputNameRef;
      case "code":
        return inputCodeRef;
      case "price":
        return inputPriceRef;
      case "description":
        return inputDescriptionRef;
      case "customerGuidelines":
        return inputCustomerGuidelinesRef;
      case "status":
        return inputStatusRef;
      default:
        return null;
    }
  };


  const getPartnerProductsDetails = async () => {
    showLoader();
    try {
      const response = await getProducts(productID || "");
      setFormValues(response?.data?.partnerProduct)

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

  const fetchPartnerLocations = async () => {
    showLoader();
    try {
      const response = await getPartnerLocations(1, 100, "", "ALL", partnerID || "");
      console.log('response', response);
      setlocationOptions(response?.data?.response?.results.map((location: any) => { return { label: `${location?.name} (${location?.city?.name})`, value: location.id } }) || [])

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

  const createPartnerProductRequest = () => {
    const request = {
      name: form.getFieldValue("name"),
      code: form.getFieldValue("code"),
      price: form.getFieldValue("price"),
      description: form.getFieldValue("description"),
      guidelines: form.getFieldValue("customerGuidelines"),
      status: form.getFieldValue("status").toUpperCase(),
      partnerServiceId: selectedServiceType[0],
      file: !isUpdateForm ? fileList[0] : fileList[0]?.thumbUrl ? fileList[0] : {},
      imageUrl: isUpdateForm ? (fileList[0] && fileList[0]?.thumbUrl ? "" : imageUrl) : "",
      locationIds: JSON.stringify(selectedLocations),
      slotDuration: form.getFieldValue("slotDuration"),
      allowAllLocations: false,
      partnerId: partnerID,
    }
    return request;
  }

  const handleFinish = async () => {
    showLoader();
    try {
      let response: any = {}
      if (!productID) response = await createPartnerProduct(createPartnerProductRequest());
      if (productID) response = await updatePartnerProduct(productID, createPartnerProductRequest());

      if (productID) {
        setSuccess(SUCCESS.PARTNER_PRODUCT_UPDATED)
      } else {
        setSuccess(SUCCESS.PARTNER_PRODUCT_CREATED)
      }
      navigate(`/partner/${partnerID}/manageaccount`);
      form.resetFields();
      setFileList([]);

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

  const setFormValues = (data: PartnerProduct) => {
    form.setFieldsValue({
      name: data?.name,
      code: data?.code,
      price: data?.price,
      description: data?.description,
      customerGuidelines: data?.guidelines,
      status: data?.status,
      slotDuration: data?.slotDuration
    });
    // setselectedServiceType([data?.partner_service.service.id])
    setselectedServiceType([data.partner_service.id])
    setselectedLocations(data?.partner_product_locations?.map((location: any) => location?.partner_location?.id) || [])
    setImageUrl(data?.imageUrl || "")
    data?.imageUrl ? setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: data?.imageUrl || "" }]) : setFileList([])
    setPrice(data?.price)
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

  const handleUpdate = () => {
    console.log('handleUpdate')
  }

  const handleOnChange = () => {
    setIsDataChange(true)
  }

  useEffect(() => {
    ME?.systemServices && setServiceOptions(ME?.systemServices.map((service: any) => { return { label: service.name, value: service.id } }) || [])
    productID && getPartnerProductsDetails()
    fetchPartnerLocations()
  }, [])

  return (
    <div className='create-partner-content'>
      <Form
        onFinish={handleFinish}
        onFinishFailed={submitFailed}
        name='basic'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        form={form}
        autoComplete='off'
        onValuesChange={handleOnChange}
      >
        <Row justify={"space-between"} className='mb-2'>
          <Col
            lg={{ span: 12 }}
            md={{ span: 12 }}
            sm={{ span: 23 }}
            xs={{ span: 23 }}
          >
            <Title level={3} className='remove-vertical-margin '>
              {isUpdateForm ? HEADING.UPDATE_PARTNER_PRODUCT : HEADING.CREATE_PARTNER_PRODUCT}
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
                  onClick={() => navigate("/")}
                >
                  {LABELS.CANCEL}
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  disabled={(productID && (isDataChange ? false : true) || false)}
                >
                  {isUpdateForm ? BUTTONS.UPDATE : BUTTONS.SAVE}
                </Button>
              </Space>
            </div>
          </Col>

        </Row>
        <Row gutter={16}>

          <Col
            lg={{ span: 16 }}
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
                  label={
                    <label className='label '>
                      {LABELS.SERVICE_TYPE}
                    </label>
                  }
                >
                  <Checkbox.Group className='d-none' style={{ display: "flex", flexDirection: "column" }} value={selectedServiceType} options={serviceOptions} onChange={serviceTypeOnChange} />
                  <label className='label '>
                    {"Doctor Counsultation"}
                  </label>
                </Form.Item>
              </Col>

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
                  rules={[{ required: true, message: ERRORS.NAME }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Name" }) }, { max: 36, message: t("ERRORS.MAX_LENGTH_50", { type: "Name" }) }]}
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
                <div style={{ position: "relative" }}>

                  <Form.Item name="fileList" label="File Upload" valuePropName="fileList">
                    <UploadFile
                      setFileList={setFileList}
                      fileListArr={fileList}
                      fileType={"image/png"}
                      fileTypeError={ERRORS?.IMAGE_FILE_TYPE}
                      requiredImage={false}
                      errorMessage={ERRORS.UPLOAD_LOGO}
                      validateTrigger={["handleSave", "handleUpdate"]}
                      label={LABELS.UPLOAD_LOGO}
                      name={"image"}
                      setImageUrl={setImageUrl}
                    />
                  </Form.Item>
                  <Text style={{ fontSize: 11, color: "#1677ff", position: "absolute", bottom: 10 }} >{LABELS.EXPEXTED_DIMENSIONS_LXW}</Text>
                </div>
              </Col>

              <Col
                lg={{ span: 12 }}
                md={{ span: 12 }}
                sm={{ span: 23 }}
                xs={{ span: 23 }}
              >
                <div style={{ position: "relative" }}>
                  <Form.Item
                    validateStatus={errors.price ? "error" : ""}
                    name='price'
                    label={
                      <label className='label '>
                        {LABELS.PRICE}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.PRICE }, { pattern: new RegExp(/^[0-9]+$/), message: t("ERRORS.VALID_INPUT", { type: "Price" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.PRICE}
                      ref={inputPriceRef as any}
                      autoFocus={false}
                      disabled={false}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      value={price}
                    />
                  </Form.Item>
                  <Text style={{ fontSize: 11, color: "#1677ff", position: "absolute", bottom: -20 }} >{`${LABELS.CUSTOMER_SEES} : ${(price || 0) + customerSeesPrice}`}</Text>

                </div>

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
                  name='description'
                  label={
                    <label className='label '>
                      {LABELS.DESCRIPTION}
                    </label>
                  }
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <TextArea
                    placeholder={LABELS.DESCRIPTION}
                    ref={inputDescriptionRef as any}
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
                  name='customerGuidelines'
                  label={
                    <label className='label '>
                      {LABELS.CUSTOM_GUIDELINES}
                    </label>
                  }
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <TextArea
                    placeholder={LABELS.CUSTOM_GUIDELINES}
                    ref={inputCustomerGuidelinesRef as any}
                    autoFocus={false}
                    disabled={false}
                    rows={5}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col
                lg={{ span: 24 }}
                md={{ span: 24 }}
                sm={{ span: 23 }}
                xs={{ span: 23 }}
              >
                <Title level={3} className='remove-vertical-margin '>
                  {HEADING.SELECT_LOCATIONS}
                </Title>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col
                lg={{ span: 12 }}
                md={{ span: 12 }}
                sm={{ span: 23 }}
                xs={{ span: 23 }}
              >
                <Form.Item name="selectLoction" valuePropName="selectLoction" noStyle>
                  <Checkbox.Group style={{ display: "flex", flexDirection: "column" }} value={selectedLocations} options={locationOptions} onChange={cityOnchange} />
                </Form.Item>
                {!locationOptions.length && <Title level={5} >
                  {TABLE_NO_RECORDS_TEXT.LOCATION_AVAILABLE}
                </Title>}
              </Col>

              <Col
                lg={{ span: 12 }}
                md={{ span: 12 }}
                sm={{ span: 23 }}
                xs={{ span: 23 }}
              >
                <Form.Item
                  validateStatus={errors.status ? "error" : ""}
                  name='slotDuration'
                  label={
                    <label className='label '>
                      {LABELS.SLOT_DURATION}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.SLOT_DURATION }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Select
                    placeholder={LABELS.SLOT_DURATION}
                    ref={inputSlotDurationRef as any}
                    autoFocus={false}
                    disabled={false}
                  >
                    <Option value='15'>15</Option>
                    <Option value='30'>30</Option>
                    <Option value='45'>45</Option>
                    <Option value='60'>60</Option>
                  </Select>
                </Form.Item>
              </Col>


            </Row>





          </Col>

          {/* create a horizental divider according to defined row and col structure,  */}



          <Col
            lg={{ span: 8 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
          </Col>
        </Row>
      </Form >
    </div >
  )
}

export default ProductCreateUpdate