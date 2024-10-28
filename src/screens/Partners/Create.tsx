import {
  Button, Checkbox, Col, Divider, Form, Input, Row, Select, Space, Typography, UploadFile as AntUploadFile, Flex,
} from 'antd';
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { handleErrorResponse, openToastNotification, showError, getCountryCodeByIp } from '../../helpers/globalFunctions';
import UploadFile from '../../components/UploadFile/Index';
import { useTranslation } from 'react-i18next';
import { createPartner, getPartner, updatePartner } from '../../services/api/partner';
import { Partner } from '../../interface/Partner';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import Loader from '../../components/Loader';
import { ApiError } from '../../services/api/Index';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { emailValidate } from '../../utils/globalFunctions';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Service {
  id: number;
  name: string;
  fee: number;
  feeType: 'FIXED_FEE';
  checked: boolean;
}

function PartnerCreateUpdate({ isUpdateForm }: { isUpdateForm?: boolean }) {
  const { t } = useTranslation();
  const BUTTONS: any = t("BUTTONS", { returnObjects: true });
  const HEADING: any = t("HEADING", { returnObjects: true });
  const ERRORS: any = t("ERRORS", { returnObjects: true });
  const LABELS: any = t("LABELS", { returnObjects: true });
  const PLACEHOLDERS: any = t("PLACEHOLDERS", { returnObjects: true });
  const SUCCESS: any = t("SUCCESS", { returnObjects: true });
  const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
  const { setSuccess, ME } = useContext(GlobalContext) as GlobalContextProps;
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string }[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);
  const [isAdminAccount, setIsAdminAccount] = useState(false)
  const [isDataChange, setIsDataChange] = useState(false)
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Doctor Consultation', fee: 0, feeType: 'FIXED_FEE', checked: true },
  ]);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({
    name: "",
    businessId: "",
    licenseNumber: "",
    status: "",
    uploadLogo: "",
    contractNumber: "",
    searchAndSelectCity: "",
    streetAddress: "",
    postalCode: "",
    emailAddress: "",
    phoneNumber: "",
    contactPerson: "",
    fixedFee: "",
  });

  const params = useParams();
  const partnerID = params.partnerID || "";

  const inputNameRef = useRef<null | HTMLElement>(null);
  const inputBusinessIdRef = useRef<null | HTMLElement>(null);
  const inputLicenseNumberRef = useRef<null | HTMLElement>(null);
  const inputStatusRef = useRef<null | HTMLElement>(null);
  const inputContractNumberRef = useRef<null | HTMLElement>(null);
  const inputSearchAndSelectCityRef = useRef<null | HTMLElement>(null);
  const inputStreetAddressRef = useRef<null | HTMLElement>(null);
  const inputPostalCodeRef = useRef<null | HTMLElement>(null);
  const inputEmailAddressRef = useRef<null | HTMLElement>(null);
  const inputPhoneNumberRef = useRef<null | HTMLElement>(null);
  const inputContactPersonRef = useRef<null | HTMLElement>(null);
  const inputBankNameRef = useRef<null | HTMLElement>(null);
  const inputAccountHolderRef = useRef<null | HTMLElement>(null);
  const inputAccountNumberRef = useRef<null | HTMLElement>(null);
  const inputdocConsFixedFeeRef = useRef<null | HTMLElement>(null);

  const getInputRefByFieldName = (fieldName: string | undefined) => {
    switch (fieldName) {
      case "name":
        return inputNameRef;
      case "businessId":
        return inputBusinessIdRef;
      case "licenseNumber":
        return inputLicenseNumberRef;
      case "status":
        return inputStatusRef;
      case "contractNumber":
        return inputContractNumberRef;
      case "searchAndSelectCity":
        return inputSearchAndSelectCityRef;
      case "streetAddress":
        return inputStreetAddressRef;
      case "postalCode":
        return inputPostalCodeRef;
      case "emailAddress":
        return inputEmailAddressRef;
      case "phoneNumber":
        return inputPhoneNumberRef;
      case "contactPerson":
        return inputContactPersonRef;
      case "bankName":
        return inputBankNameRef;
      case "accountHolder":
        return inputAccountHolderRef;
      case "accountNumber":
        return inputAccountNumberRef;
      case "fixedFee":
        return inputdocConsFixedFeeRef;
      default:
        return null;
    }
  };

  const partnerRequest = () => {
    const request = {
      name: form.getFieldValue('name'),
      businessId: form.getFieldValue('businessId'),
      licenseNumber: form.getFieldValue('licenseNumber'),
      status: form.getFieldValue('status'),
      file: !isUpdateForm ? fileList[0] : fileList[0]?.thumbUrl ? fileList[0] : {},
      imageUrl: isUpdateForm ? (fileList[0] && fileList[0]?.thumbUrl ? "" : imageUrl) : "",
      contractNumber: form.getFieldValue('contractNumber'),
      registeredCityId: form.getFieldValue('searchAndSelectCity'),
      currencyId: 1,
      registeredStreetAddress: form.getFieldValue('streetAddress'),
      registeredPostalCode: form.getFieldValue('postalCode'),
      emailAddress: form.getFieldValue('emailAddress'),
      phoneNumber: form.getFieldValue('phoneNumber'),
      contactPerson: form.getFieldValue('contactPerson'),
      createAdminAccount: isAdminAccount,
      bankDetails: JSON.stringify([{ name: form.getFieldValue('bankName'), accountNumber: form.getFieldValue('accountNumber'), accountHolderName: form.getFieldValue('accountHolderName'), status: "ENABLED" }]),
      services: JSON.stringify(createServicepayload()),
    }

    return request;
  }

  const handleFinish = async () => {
    showLoader();
    if (createServicepayload().length === 0) {
      openToastNotification(
        ERRORS.SELECT_ATLEAST_ONE,
        "notifications toast-notification-error"
      );
      hideLoader();
      return;
    }
    try {
      let response: any = {}
      if (!partnerID) response = await createPartner(partnerRequest());

      if (partnerID) response = await updatePartner(partnerID, partnerRequest());
      form.resetFields();
      setFileList([]);

      if (partnerID) {
        getPartnerDetail()
        openToastNotification(
          "Partner updated successfully",
          "notifications toast-notification-success"
        );
      } else {
        setSuccess(SUCCESS.PARTNER_CREATED);
        navigate(-1);
      }

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

  const getPartnerDetail = async (services?: Service[]) => {
    try {
      showLoader();
      const response = await getPartner(partnerID);
      setFormValues(response?.data?.partner, services);
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

  const setFormValues = (currentPartner: Partner, services?: Service[]) => {
    form.setFieldsValue({
      name: currentPartner?.name,
      businessId: currentPartner?.businessId,
      licenseNumber: currentPartner?.licenseNumber,
      status: currentPartner?.status,
      contractNumber: currentPartner?.contractNumber,
      searchAndSelectCity: currentPartner?.registeredCity?.id,
      streetAddress: currentPartner?.registeredStreetAddress,
      postalCode: currentPartner?.registeredPostalCode,
      emailAddress: currentPartner?.emailAddress,
      phoneNumber: currentPartner?.phoneNumber || '',
      contactPerson: currentPartner?.contactPerson,
      bankName: currentPartner?.bankDetails?.[0]?.name,
      accountNumber: currentPartner?.bankDetails?.[0]?.accountNumber,
      accountHolderName: currentPartner?.bankDetails?.[0]?.accountHolderName,
      ...currentPartner?.services?.reduce((acc: any, service: any) => {
        acc[service.service.name] = service.feeValue;
        return acc;
      }, {})
    })

    services && setServices(services.map((service) => {
      const serviceFee = currentPartner?.services?.find((partnerService) => partnerService.service.id == service.id);
      return {
        ...service,
        checked: serviceFee ? true : false,
        fee: serviceFee?.feeValue || 0,
      }
    }))

    currentPartner?.imageUrl ? setFileList([{ uid: '-1', name: 'image', status: 'done', url: currentPartner?.imageUrl }]) : setFileList([]);
    setImageUrl(currentPartner?.imageUrl || '');
  }

  const submitFailed = (errorInfo: any) => {
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
  }

  const handleOnChange = (changedValues: string) => {
    const name = Object.keys(changedValues)?.[0];
    const value = Object.values(changedValues)?.[0];
    if(name === "emailAddress") {
      form.setFieldValue(name, value.toLowerCase().trim());
    }
    setIsDataChange(true)
  }

  const createServicepayload = () => {
    return services
      .filter((service) => service.checked)
      .map(({ id, fee, feeType }) => ({
        serviceId: id,
        feeValue: fee,
        feeType,
        status: 'ENABLED',
      }));
  };

  const handleCheckboxChange = (serviceId: number) => {
    const updatedServices = services.map((service) =>
      service.id === serviceId ? { ...service, checked: !service.checked } : service
    );
    setServices(updatedServices);
    setIsDataChange(true)

  };

  const handleInputChange = (serviceId: number, fee: number) => {
    const updatedServices = services.map((service) =>
      service.id === serviceId ? { ...service, fee } : service
    );
    setServices(updatedServices);
    setIsDataChange(true)
  };

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
    let cityOptionsArr: any = []
    ME?.systemLocations && ME?.systemLocations.map((location: any) => {
      if (location.type === "CITY" && location.status === "ENABLED") cityOptionsArr.push({ label: location.name, value: location.id })
    })
    setCityOptions(cityOptionsArr)
    const services = ME?.systemServices && ME.systemServices.map((service: any) => { return { id: service.id, name: service.name, fee: 0, feeType: 'FIXED_FEE', checked: false } }) || []

    partnerID ? getPartnerDetail(services) : setServices(services)
  }, [ME])

  useEffect(() => {
    getCountryCode();
  }, []);

  return (
    <div className={isUpdateForm ? 'update-partner-content' : 'create-partner-content'}>
      {isLoading ? <Loader /> :
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
                {isUpdateForm ? HEADING.UPDATE_PARTNER : HEADING.CREATE_PARTNER}
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
              lg={{ span: 15 }}
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
                    {HEADING.BASIC_DETAILS}
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
                    validateStatus={errors.businessId ? "error" : ""}
                    name='businessId'
                    label={
                      <label className='label '>
                        {LABELS.BUSINESS_ID}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.BUSINESS_ID, }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Business ID" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "Business ID" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.BUSINESS_ID}
                      ref={inputBusinessIdRef as any}
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
                    validateStatus={errors.licenseNumber ? "error" : ""}
                    name='licenseNumber'
                    label={
                      <label className='label '>
                        {LABELS.LICENSE_NUMBER}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.LICENSE_NUMBER }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "License number" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "License number" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.LICENSE_NUMBER}
                      ref={inputLicenseNumberRef as any}
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
                      <Option value={LABELS.ENABLED.toUpperCase()}>{LABELS.ENABLED}</Option>
                      <Option value={LABELS.DISABLED.toUpperCase()}>{LABELS.DISABLED}</Option>
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
                  <Form.Item name="fileList" label={`${LABELS.COMPANY_LOGO} (${LABELS.OPTIONAL})`} valuePropName="fileList">
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
                </Col>

                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <Form.Item
                    validateStatus={errors.contractNumber ? "error" : ""}
                    name='contractNumber'
                    label={
                      <label className='label '>
                        {LABELS.CONTRACT_NUMBER}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.CONTRACT_NUMBER }, { max: 16, message: t("ERRORS.MAX_LENGTH_16", { type: "Contact number" }) }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Contact number" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.CONTRACT_NUMBER}
                      ref={inputContractNumberRef as any}
                      autoFocus={false}
                      disabled={false}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify={"space-between"} className='mb-2'>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                >
                  <Title level={3} className='remove-vertical-margin '>
                    {HEADING.REGISTERED_ADDRESS}
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
                  {/* create a select with some defined cities */}
                  <Form.Item
                    validateStatus={errors.searchAndSelectCity ? "error" : ""}
                    name='searchAndSelectCity'
                    label={
                      <label className='label '>
                        {LABELS.CITY}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.SEARCH_AND_SELECT_CITY }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Select
                      placeholder={LABELS.SEARCH_AND_SELECT_CITY}
                      ref={inputSearchAndSelectCityRef as any}
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
                  lg={{ span: 24 }}
                  md={{ span: 24 }}
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
                    rules={[{ message: ERRORS.STREET_ADDRESS }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Street address" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <TextArea
                      placeholder={LABELS.STREET_ADDRESS}
                      ref={inputStreetAddressRef as any}
                      autoFocus={false}
                      disabled={false}
                      rows={4}
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

              <Row justify={"space-between"} className='mb-2'>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                >
                  <Title level={3} className='remove-vertical-margin '>
                    {HEADING.CONTACT_DETAILS}
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
                  <Form.Item
                    validateStatus={errors.contactPerson ? "error" : ""}
                    name='contactPerson'
                    label={
                      <label className='label '>
                        {LABELS.CONTACT_PERSON}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.CONTACT_PERSON }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Contact person" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "Contact person" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.CONTACT_PERSON}
                      ref={inputContactPersonRef as any}
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
                    validateStatus={errors.emailAddress ? "error" : ""}
                    name='emailAddress'
                    label={
                      <label className='label '>
                        {LABELS.EMAIL_ADDRESS}
                      </label>
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
                      ref={inputEmailAddressRef as any}
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
                    rules={[{ required: true, message: ERRORS.PHONE_NUMBER }, {
                      pattern: /^\+?\d{7,17}$/, message: t("ERRORS.VALID_INPUT", { type: "Phone number" })
                    }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <PhoneInput
                      country={countryCode || 'fr'}
                      value={phone}
                      onChange={(value: string, country: any, e: any, formattedValue: string) => {
                        if (/^\+?\d{7,17}$/.test(value)) {
                          setPhone(phone);
                        } else {
                          setPhone(phone);
                        }
                      }}
                      disableSearchIcon={true}
                      inputStyle={{ height: 32, width: "100%", border: "1px solid #d9d9d9", fontSize: 14 }}
                      containerClass="custom-phone-input"
                      enableSearch={true}
                      countryCodeEditable={false}
                      inputProps={{ ref: inputPhoneNumberRef }}
                    />
                  </Form.Item>
                </Col>
                {!isUpdateForm && <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >

                  <Form.Item
                    label={
                      <label className='label '>
                        {""}
                      </label>
                    } >
                    <Checkbox checked={isAdminAccount} onChange={(e: { target: { checked: boolean } }) => setIsAdminAccount(e.target.checked)}>
                      {LABELS.CREATE_ADMIN_ACCOUNT}
                    </Checkbox>
                  </Form.Item>

                </Col>}
              </Row>
              <Row justify={"space-between"} className='mb-2'>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                >
                  <Title level={3} className='remove-vertical-margin '>
                    {HEADING.BANK_DETAILS}
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
                  <Form.Item
                    validateStatus={errors.contactPerson ? "error" : ""}
                    name='bankName'
                    label={
                      <label className='label '>
                        {LABELS.BANK_NAME}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.BANK_NAME }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Bank name" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "Bank name" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.BANK_NAME}
                      ref={inputBankNameRef as any}
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
                    validateStatus={errors.contactPerson ? "error" : ""}
                    name='accountHolderName'
                    label={
                      <label className='label '>
                        {LABELS.ACCOUNT_HOLDER_NAME}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.ACCOUNT_HOLDER_NAME }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Account holder name" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "Account holder name" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.ACCOUNT_HOLDER_NAME}
                      ref={inputAccountHolderRef as any}
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
                    validateStatus={errors.contactPerson ? "error" : ""}
                    name='accountNumber'
                    label={
                      <label className='label '>
                        {LABELS.ACCOUNT_NUMBER}
                      </label>
                    }
                    rules={[{ required: true, message: ERRORS.ACCOUNT_NUMBER }, { min: 3, message: t("ERRORS.MIN_LENGTH_3", { type: "Account number" }) }, { max: 50, message: t("ERRORS.MAX_LENGTH_50", { type: "Account number" }) }]}
                    validateTrigger={["handleFinish", "handleUpdate"]}
                  >
                    <Input
                      placeholder={LABELS.ACCOUNT_NUMBER}
                      ref={inputAccountNumberRef as any}
                      autoFocus={false}
                      disabled={false}
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
              <Divider orientation={"center"} type='vertical' style={{ height: '100%' }} />
            </Col>



            <Col
              lg={{ span: 8 }}
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
                    {HEADING.CONFIGURATIONS}
                  </Title>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col
                  lg={{ span: 24 }}
                  md={{ span: 12 }}
                  sm={{ span: 23 }}
                  xs={{ span: 23 }}
                >
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                    {services.map((service, index) => (
                      <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Form.Item>
                          <Checkbox className='' checked={service.checked} onChange={() => handleCheckboxChange(service.id)}>
                            {service.name}
                          </Checkbox>
                        </Form.Item>
                        <Form.Item
                          validateStatus={errors.fixedFee ? "error" : ""}
                          name={service.name}
                          rules={[{ required: service.checked, message: ERRORS.FIXED_FEE }]}
                          validateTrigger={["handleFinish", "handleUpdate"]}>
                          <Input
                            placeholder={PLACEHOLDERS.ENTER_FEE + (service.checked ? " *" : "")}
                            value={service.fee}
                            onChange={(e) => handleInputChange(service.id, Number(e.target.value))}
                            disabled={!service.checked}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <label className='label '>
                      {"Currency: Euro"}
                    </label>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form >}
    </div >
  )
}

export default PartnerCreateUpdate