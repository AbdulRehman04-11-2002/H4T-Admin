import {
  Button, Checkbox, Col, Form, Input, Row, Select, Space, Typography, UploadFile as AntUploadFile, GetProp,
  List,
} from 'antd';
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { handleErrorResponse, openToastNotification, showError } from '../../helpers/globalFunctions';
import UploadFile from '../../components/UploadFile/Index';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../services/api/Index';
import { ROLEIDS, ROLES } from '../../constants/constants'
import { createPartnerUser, getPartnerUser, updatePartnerUser } from '../../services/api/partnerUser';
import Loader from '../../components/Loader';
import { GlobalContext, GlobalContextProps } from '../../context/GlobalContext';
import { User, UserPartnerLocation } from '../../interface/PartnerUser';
import { getPartnerLocations } from '../../services/api/partnerLocation';
import { emailValidate } from '../../utils/globalFunctions';

const { Title } = Typography;
const { Option } = Select;

type cityValType = string | number | boolean;

function UserCreateUpdate({ isUpdateForm }: { isUpdateForm?: boolean }) {
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);
  const [locationOptions, setlocationOptions] = useState<{ label: string; value: string }[]>([
  ])
  const [notificationOptions, setNotificationOptions] = useState<{ label: string; value: string }[]>([
  ])
  const [selectAllNotifications, setSelectAllNotifications] = useState(false);
  const [selectedNotifications, setselectedNotifications] = useState<cityValType[] >([])
  const [userRolesOptions, setUserRolesOptions] = useState<{ label: string; value: number }[]>([]);
  const [selectAllLocations, setSelectAllLocations] = useState(false);
  const [selectedLocations, setselectedLocations] = useState<cityValType[]>([])
  const [partnerUserDetail, setPartnerUserDetail] = useState<User>()
  const [allowAllLocations, setAllowAllLocations] = useState(false);
  const [role, setRole] = useState<number>();
  const [imageUrl, setImageUrl] = useState<string>("")
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    uploadLogo: "",
    status: "",
  });
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
  const { partnerID, userID, partnerName } = params;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const inputNameRef = useRef<null | HTMLElement>(null);
  const inputEmailRef = useRef<null | HTMLElement>(null);
  const inputRoleRef = useRef<null | HTMLElement>(null);
  const inputStatusRef = useRef<null | HTMLElement>(null);

  useEffect(() => {
    userID && getPartnerUserDetails()
    fetchPartnerLocations()
  }, [])

  useEffect(() => {
    ME?.systemRoles &&
      setUserRolesOptions(
        ME?.systemRoles.map((role: any) => ({
          label: getRoleLabelById(role),
          value: role.id,
        })) || []
      );
  }, [ME])

  useEffect(() => {
    // Update the "all" checkbox status based on the individual checkboxes
    if(role===ROLEIDS.CLINIC_ADMIN){
      setselectedLocations(locationOptions.map((location:any)=>location.value))
      setNotificationOptions(locationOptions.map((location: any) => ({
          label: location.label, 
          value: location.value
      })) || []);
  }    
  else{
      const filteredNotifications = locationOptions.filter((location: any) => 
          selectedLocations.includes(location.value)
      );
      const notification = selectedNotifications.filter((val:cityValType)=>selectedLocations.includes(val))

      setselectedNotifications(notification)
      // Set the filtered notifications to notificationOptions state
      setNotificationOptions(filteredNotifications.map((location: any) => ({
          label: location.label, 
          value: location.value
      })) || []);

  }
    setSelectAllLocations(selectedLocations.length === locationOptions.length);

  }, [JSON.stringify(selectedLocations), locationOptions,role]);

  useEffect(()=>{
    setSelectAllNotifications(selectedNotifications.length === notificationOptions.length)
},[selectedNotifications, notificationOptions, role])

  const getRoleLabelById = (roleObj: any) => {
    const role = ROLES.find(role => role.id === roleObj.id);
    return role ? t(`LABELS.${role.label}`) : roleObj.name;
  };

  const locationOnchange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    setselectedLocations(checkedValues)
  };

  const notificationOnchange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
    setselectedNotifications(checkedValues)
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
      const partnerUserDetail = response?.data?.user;
      setAllowAllLocations(response?.data?.allowAllLocations);
      setFormValues(partnerUserDetail)
      setPartnerUserDetail(partnerUserDetail);

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
      roleId: form.getFieldValue("role"),
      status: form.getFieldValue("status").toUpperCase(),
      file: !isUpdateForm ? fileList[0] : fileList[0]?.thumbUrl ? fileList[0] : {},
      imageUrl: isUpdateForm ? (fileList[0] && fileList[0]?.thumbUrl ? "" : imageUrl) : "",
      locationIds: allowAllLocations ? [] : JSON.stringify(selectedLocations),
      partnerConfirmationOptOutLocationIds:JSON.stringify(selectedNotifications),
      partnerId: partnerID,
      allowAllLocations: allowAllLocations
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
      navigate(`/partner/${partnerID}/manageAccount/${partnerName}`);

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
      role: data?.user_roles[0].roleId
    })
    setRole(data?.user_roles[0].roleId);
    setselectedLocations(data?.user_partner_locations?.map((location: UserPartnerLocation) => location?.partner_location?.id) || [])
    data?.imageUrl ? setFileList([{ uid: '-1', name: 'image', status: 'done', url: data?.imageUrl ?? "" }]) : setFileList([])
    setselectedNotifications(data?.user_preferences?.partnerConfirmationOptOutLocationIds || []);
    setImageUrl(data?.imageUrl || "")
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

  const handleSelectAllLocations = (e: { target: { checked: boolean } }) => {
    const { checked } = e.target;
    const allLocationIds = locationOptions?.map((location: any) => location?.value);
    setselectedLocations(checked ? allLocationIds : []);
    setSelectAllLocations(checked);
    setIsDataChange(true)
  };

  const handleSelectAllNotifications = (e: { target: { checked: boolean } }) => {
    const { checked } = e.target;
    const allNotificationIds = notificationOptions?.map((location: any) => location?.value);
    setselectedNotifications(checked ? allNotificationIds : []);
    setSelectAllNotifications(checked);
    setIsDataChange(true)
  };

  const handleAllowAllLocations = (e: { target: { checked: boolean } }) => {
    const { checked } = e.target;
    setAllowAllLocations(checked);
    setselectedLocations(partnerUserDetail?.user_partner_locations?.map((location: UserPartnerLocation) => location?.partner_location?.id) || [])
    setIsDataChange(true)
  }

  const handleRoleChange = (value: number) => {
    setRole(value);
  };

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
        onValuesChange={(changedValues, allValues) => {
          const name = Object.keys(changedValues)?.[0];
          const value = changedValues[name]; 
          if (changedValues.role) {
            handleRoleChange(changedValues.role);
          }
          if (name === "email" && value) {
            form.setFieldValue(name, value.toLowerCase().trim());
          }
          setIsDataChange(true);
        }}
      >
        <Row>
                    <Col
                    lg={{ span: 8 }}
                    md={{ span: 8 }}
                    sm={{ span: 8 }}
                    xs={{ span: 8 }}
                    >
                    <Row className='mb-2'>
                        <Col
                            lg={{ span: 20 }}
                            md={{ span: 20 }}
                            sm={{ span: 20 }}
                            xs={{ span: 20 }}
                        >
                            <Title level={3} className='remove-vertical-margin '>
                                {isUpdateForm ? HEADING.UPDATE_USER : HEADING.CREATE_USER}
                            </Title>
                        </Col>

                        </Row>
                        <Row gutter={8}>
                                <Col
                                    lg={{ span: 20 }}
                                    md={{ span: 20 }}
                                    sm={{ span: 20 }}
                                    xs={{ span: 20 }}
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
                                    lg={{ span: 20 }}
                                    md={{ span: 20 }}
                                    sm={{ span: 20 }}
                                    xs={{ span: 20 }}
                                >
                                    <Form.Item
                                        validateStatus={errors.email ? "error" : ""}
                                        name='email'
                                        label={
                                            <label className='label '>
                                                {LABELS.EMAIL}
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
                                            placeholder={LABELS.EMAIL}
                                            ref={inputEmailRef as any}
                                            autoFocus={false}
                                            disabled={isUpdateForm ? true : false}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Row gutter={8}>

                                <Col
                                    lg={{ span: 20 }}
                                    md={{ span: 20 }}
                                    sm={{ span: 20 }}
                                    xs={{ span: 20 }}
                                >
                                    <Form.Item
                                        validateStatus={errors.role ? "error" : ""}
                                        name='role'
                                        label={
                                            <label className='label '>
                                                {LABELS.ROLE}
                                            </label>
                                        }
                                        rules={[{ required: true, message: ERRORS.ROLE }]}
                                        validateTrigger={["handleFinish", "handleUpdate"]}
                                    >
                                        <Select
                                            placeholder={PLACEHOLDERS.ROLE}
                                            ref={inputRoleRef as any}
                                            autoFocus={false}
                                            disabled={false}
                                        >
                                            {userRolesOptions.map(role => (
                                                <Option key={role.value} value={role.value} label={role.label}>
                                                    {role.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                            </Row>


                            <Row gutter={8}>

                                <Col
                                    lg={{ span: 20 }}
                                    md={{ span: 20 }}
                                    sm={{ span: 20 }}
                                    xs={{ span: 20 }}
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
                                    lg={{ span: 20 }}
                                    md={{ span: 20 }}
                                    sm={{ span: 20 }}
                                    xs={{ span: 20 }}
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
                    <Col
                    lg={{ span: 8 }}
                    md={{ span: 8 }}
                    sm={{ span: 8 }}
                    xs={{ span: 8 }}
                    >

                 <Row>
                 <Col
                            lg={{ span: 24 }}
                            md={{ span: 24 }}
                            sm={{ span: 24 }}
                            xs={{ span: 24 }}
                        >
                             <Title level={4} style={{marginTop:'18%'}}>
                                        {HEADING.SELECT_USER_LOCATIONS}
                                    </Title>
                      </Col>   
                           
                 </Row>

                    <Row>

                    <Col
                            lg={{ span: 24 }}
                            md={{ span: 24 }}
                            sm={{ span: 24 }}
                            xs={{ span: 24 }}
                        >
                            {role === ROLEIDS.CLINIC_ADMIN ? (
                                        <Title level={5} style={{margin:0,}}>
                                            {LABELS.ALL_LOCATIONS_ACCESS}
                                        </Title>
                                    ) : (
                                        <List
                                            header={
                                                <>
                                                    <Checkbox
                                                        onChange={handleAllowAllLocations}
                                                        checked={allowAllLocations}
                                                    >
                                                        {LABELS.ALLOW_ALL_LOCATIONS}
                                                    </Checkbox>
                                                    {allowAllLocations &&
                                                        <Title  level={5}>
                                                            {LABELS.ALL_LOCATIONS_ACCESS}
                                                        </Title>
                                                    }
                                                </>
                                            }
                                            locale={{ emptyText: <></> }}
                                            bordered={false}
                                        >
                                            {!allowAllLocations && (
                                                <>
                                                    <List.Item>
                                                        <Form.Item name="selectLoction" valuePropName="selectLoction" noStyle>
                                                            <div style={{display:'flex', flexDirection:'column'}}>
                                                        <Checkbox
                                                            onChange={handleSelectAllLocations}
                                                            checked={selectAllLocations}
                                                        >
                                                            {LABELS.SELECT_ALL}
                                                        </Checkbox>
                                                            <Checkbox.Group style={{ display: "flex", flexDirection: "column" }} value={selectedLocations} options={locationOptions} onChange={locationOnchange} />
                                                            </div>
                                                        </Form.Item>
                                                    </List.Item>
                                                </>
                                            )}
                                        </List>
                                    )}
                                    {!locationOptions.length && <Title level={5} >
                                        {TABLE_NO_RECORDS_TEXT.LOCATION_AVAILABLE}
                                    </Title>}
                           
                        </Col>
                    </Row>

                    <Row>
                        {selectedLocations.length>0 &&  <Col
                        lg={{ span: 24 }}
                        md={{ span: 24 }}
                        sm={{ span: 24 }}
                        xs={{ span: 24 }}
                        >
                        <Title level={4} >
                                        {HEADING.SELECT_NOTIFICATION_SETTINGS}
                        </Title>

                        <Title level={5} style={{marginBottom:0}} className=' '>
                                        {LABELS.NOTIFICATION_SETTINGS}
                        </Title>
                        <Title style={{marginTop:0}} level={5} className=' '>
                                        {LABELS.SELECT_NOTIFICATION}
                        </Title>
                        <Form.Item name="selectLoction" valuePropName="selectLoction" noStyle>
                            <div style={{display:'flex', flexDirection:'column'}}>
                            <Checkbox
                                onChange={handleSelectAllNotifications}
                                checked={selectAllNotifications}
                            >
                                {LABELS.SELECT_ALL}
                                </Checkbox>
                                <Checkbox.Group style={{ display: "flex", flexDirection: "column" }} value={selectedNotifications} options={notificationOptions} onChange={notificationOnchange} />
                                </div>
                        </Form.Item>
                        </Col>}
                       
                    </Row>
                </Col>

                <Col
                            lg={{ span: 8 }}
                            md={{ span: 8 }}
                            sm={{ span: 8 }}
                            xs={{ span: 8 }}
                        >
                              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: "13%" }}>
                                
                                <Space>
                                    <Button
                                        type='default'
                                        htmlType='button'
                                        onClick={() => navigate(`/manage-account/users`)}
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
      </Form >}
    </div >
  )
}

export default UserCreateUpdate