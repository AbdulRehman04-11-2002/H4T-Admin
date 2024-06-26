import {
  Button, Checkbox, Col, Form, Input, Row, Select, Space, Typography, UploadFile as AntUploadFile, GetProp,
} from 'antd';
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { handleErrorResponse, openToastNotification, showError } from '../../helpers/globalFunctions';
import UploadFile from '../../components/UploadFile/Index';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../services/api/Index';
import { createPartnerUser, getPartnerUser, updatePartnerUser } from '../../services/api/partnerUser';
import Loader from '../../components/Loader';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import { User, UserPartnerLocation } from '../../interface/PartnerUser';
import { getPartnerLocations } from '../../services/api/partnerLocation';

const { Title } = Typography;
const { Option } = Select;

type cityValType = string | number | boolean;

function UserCreateUpdate({ isUpdateForm }: { isUpdateForm?: boolean }) {
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);
  const [locationOptions, setlocationOptions] = useState<{ label: string; value: string }[]>([
  ])
  const [userRolesOptions, setUserRolesOptions] = useState<{ label: string; value: string }[]>([
  ])
  const [selectedLocations, setselectedLocations] = useState<cityValType[]>([])
  const [imageUrl, setImageUrl] = useState<string>("")
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    uploadLogo: "",
    status: "",
  });
  const [userRoles, setUserRoles] = useState<{ label: string; value: string }[]>([]);
  const [isDataChange, setIsDataChange] = useState(false)
  const { t } = useTranslation();
  const BUTTONS: any = t("BUTTONS", { returnObjects: true });
  const HEADING: any = t("HEADING", { returnObjects: true });
  const ERRORS: any = t("ERRORS", { returnObjects: true });
  const LABELS: any = t("LABELS", { returnObjects: true });
  const PLACEHOLDERS: any = t("PLACEHOLDERS", { returnObjects: true });
  const TABLE_NO_RECORDS_TEXT: any = t("TABLE_NO_RECORDS_TEXT", { returnObjects: true });
  const SUCCESS: any = t("SUCCESS", { returnObjects: true });
  const { isLoading, showLoader, hideLoader } = useContext(LoaderContext) as LoaderContextValue;
  const { ME, setSuccess } = useContext(GlobalContext) as GlobalContextProps;
  let params = useParams();
  const { partnerID, userID } = params;

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const inputNameRef = useRef<null | HTMLElement>(null);
  const inputEmailRef = useRef<null | HTMLElement>(null);
  const inputRoleRef = useRef<null | HTMLElement>(null);
  const inputStatusRef = useRef<null | HTMLElement>(null);

  const locationOnchange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    setselectedLocations(checkedValues)
  };

  const getInputRefByFieldName = (fieldName: string | undefined) => {
    switch (fieldName) {
      case "name":
        return inputNameRef;
      case "email":
        return inputEmailRef;
      case "role":
        return inputRoleRef;
      case "status":
        return inputStatusRef;
      default:
        return null;
    }
  };

  const getPartnerUserDetails = async () => {
    showLoader();
    try {
      const response = await getPartnerUser(userID || "");
      setFormValues(response?.data?.user)

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


  const partnerUserRequest = () => {
    const request = {
      name: form.getFieldValue("name"),
      email: form.getFieldValue("email"),
      roleId: userRoles[0]?.value,
      status: form.getFieldValue("status").toUpperCase(),
      file: !isUpdateForm ? fileList[0] : fileList[0]?.thumbUrl ? fileList[0] : {},
      imageUrl: isUpdateForm ? (fileList[0] && fileList[0]?.thumbUrl ? "" : imageUrl) : "",
      locationIds: JSON.stringify(selectedLocations),
      allowedAllLocations: false,
      partnerId: partnerID
    }
    return request
  }

  const handleFinish = async () => {
    showLoader();
    try {
      let response: any = {}
      if (!userID) response = await createPartnerUser(partnerUserRequest());

      if (userID) response = await updatePartnerUser(userID, partnerUserRequest());

      if (userID) {
        setSuccess(SUCCESS.PARTNER_USER_UPDATED)
      } else {
        setSuccess(SUCCESS.PARTNER_USER_CREATED)
      }
      navigate(`/partner/${partnerID}/manageAccount`);

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

  const setFormValues = (data: User) => {
    form.setFieldsValue({
      name: data.name,
      email: data.email,
      status: data.status,
    })
    setselectedLocations(data?.user_partner_locations?.map((location: UserPartnerLocation) => location?.partner_location?.id) || [])
    setUserRoles(data?.user_roles?.map((role: any) => ({ label: '', value: role?.roleId })) || [])
    data?.imageUrl ? setFileList([{ uid: '-1', name: 'image', status: 'done', url: data?.imageUrl ?? "" }]) : setFileList([])

    setImageUrl(data?.imageUrl || "")
  }

  const handleRoleChange = (value: string[]) => {
    setUserRoles(value.join(',').split(',').map((role) => ({ label: role, value: role })))

  };

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
    userID && getPartnerUserDetails()
    fetchPartnerLocations()
  }, [])

  useEffect(() => {
    ME?.systemRoles && setUserRolesOptions(ME?.systemRoles.map((role: any) => { return { label: role.name, value: role.id } }) || [])
  }, [ME])

  return (
    <div className='create-partner-content'>
      {isLoading ? <Loader /> : <Form
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
              {isUpdateForm ? HEADING.UPDATE_USER : HEADING.CREATE_USER}
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
                  validateStatus={errors.name ? "error" : ""}
                  name='name'
                  label={
                    <label className='label '>
                      {LABELS.NAME}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.NAME }]}
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
                  validateStatus={errors.email ? "error" : ""}
                  name='email'
                  label={
                    <label className='label '>
                      {LABELS.EMAIL}
                    </label>
                  }
                  rules={[{ required: true, message: ERRORS.EMAIL }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Input
                    placeholder={LABELS.EMAIL}
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
                  validateStatus={errors.role ? "error" : ""}
                  name='role'
                  label={
                    <label className='label '>
                      {LABELS.ROLE}
                    </label>
                  }
                  rules={[{ required: userRoles.length ? false : true, message: ERRORS.ROLE }]}
                  validateTrigger={["handleFinish", "handleUpdate"]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    defaultValue={userRoles.map((role) => role.value) || []}
                    optionLabelProp='label'
                    onChange={handleRoleChange}
                    options={userRolesOptions}
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
                <Form.Item name="fileList" label={`${LABELS.UPLOAD_PHOTO} (${LABELS.OPTIONAL})`} valuePropName="fileList">
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

            </Row>

            <Row gutter={8}>
              <Col
                lg={{ span: 24 }}
                md={{ span: 24 }}
                sm={{ span: 23 }}
                xs={{ span: 23 }}
              >
                <Title level={3} className='remove-vertical-margin '>
                  {HEADING.SELECT_USER_LOCATIONS}
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
                  <Checkbox.Group style={{ display: "flex", flexDirection: "column" }} value={selectedLocations} options={locationOptions} onChange={locationOnchange} />
                </Form.Item>
                {!locationOptions.length && <Title level={5} >
                  {TABLE_NO_RECORDS_TEXT.LOCATION_AVAILABLE}
                </Title>}
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
      </Form >}
    </div >
  )
}

export default UserCreateUpdate