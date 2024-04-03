// import { RootState } from "../../store";
import { InputOTP } from "antd-input-otp";
// import { theme } from "../../assets/theme";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import { LoginRequest, VerifyRequest } from "../../interface/Request";
import { LoginProps, ValidateErrorEntity } from "../../interface/Login";
import { SubmitEmailProps, SubmitOtpProps } from "../../type/login.type";
import { fetchCurrentUser, login, verifyCode } from "../../services/api/auth";
import {
  handleErrorResponse,
  openToastNotification,
  showError,
} from "../../helpers/globalFunctions";
import {
  Col,
  Row,
  Form,
  Layout,
  Button,
  Typography,
  Input,
} from "antd";
import { ApiError } from "../../services/api/Index";
import { LoaderContext } from "../../context/LoaderContext";
import { GlobalContext } from "../../context/GlobalContext";
import { Storage } from "../../services/storage";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const { t } = useTranslation();
  const BUTTONS: any = t("BUTTONS", { returnObjects: true });
  const DELAY_COUNT:number = +t("DELAY_COUNT");
  const ERRORS: any = t("ERRORS", { returnObjects: true });
  const LABELS: any = t("LABELS", { returnObjects: true });
  const SUCCESS: any = t("SUCCESS", { returnObjects: true });
  const PLACEHOLDERS: any = t("PLACEHOLDERS", { returnObjects: true });


  const [flag, setFlag] = useState<boolean>(false);
  const [delayCounter, setDelayCounter] = useState<number>(0);
  const [canRequestNewCode, setCanRequestNewCode] = useState<boolean>(false);
  const [response, setResponse] = useState<any>({
    session: "",
    user_id: "",
    email: "",
  });
  const { isLoading, showLoader, hideLoader } = useContext(LoaderContext)!;
  const { success, userDetails, setSuccess, clearMessage, setUserDetails } = {} as {
    success: boolean;
    userDetails: any;
    setSuccess: (value: string) => void;
    clearMessage: () => void;
    setUserDetails: (details: any) => void;
  };
  useContext(GlobalContext);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const inputOtpRef = useRef<null | HTMLElement>(null);
  const inputEmailRef = useRef<null | HTMLElement>(null);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setDelayCounter((prevCount) => prevCount - 1);
    }, 1000);

    if (delayCounter === 0) {
      setCanRequestNewCode(true);
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [delayCounter]);

  const handleOnChange = (changedValues: string) => {
    const name = Object.keys(changedValues)?.[0];
    const value = Object.values(changedValues)?.[0];
    console.log(name, value, "name, value");

    form.setFieldValue(name, value);
    setResponse({ ...response, [name]: value });
  };

  const resendCode = async () => {
    const email = form.getFieldValue("email");
    if (!email) {
      showError(ERRORS.EMAIL);
      return false;
    }
    const request: LoginRequest = {
      email,
    };
    showLoader()
    try {
      const response = await login(request);
      if (response?.session && response?.user_id) {
        setResponse((prev: any) => ({
          ...prev,
          session: response?.session,
          user_id: response?.user_id,
        }));
        setCanRequestNewCode(false);
        setDelayCounter(DELAY_COUNT);
      }
    } catch (error) {
      inputEmailRef?.current?.focus();
      const _error = error as ApiError;
      const { errorMessage } = handleErrorResponse(_error);
      openToastNotification(
        errorMessage,
        "notifications toast-notification-error"
      );
    } finally {
      showLoader()
    }
  };

  const getOtp = async (values: SubmitEmailProps) => {
    console.log(values, "values");
    const email = form.getFieldValue("email");
    if (!email) {
      inputEmailRef?.current?.focus();
      showError(ERRORS.EMAIL);
      return false;
    }
    showLoader()
    const request: LoginRequest = {
      email,
    };
    try {
      // const result = await login(request);
      // console.log(result, "result");

      // i want to create a dummy working email authentication, please write the code
      if (values.email) {
        setResponse({
          session: 'session',
          user_id: 'user_id',
          email: values.email,
        });
        setCanRequestNewCode(false);
        setFlag(true);
        setDelayCounter(DELAY_COUNT);
        inputOtpRef?.current?.focus();
      }






      // if (result?.session && result?.user_id) {
      //   setResponse({
      //     session: result?.session,
      //     user_id: result?.user_id,
      //     email: values.email,
      //   });
      //   setCanRequestNewCode(false);
      //   setFlag(true);
      //   setDelayCounter(DELAY_COUNT);
      //   inputOtpRef?.current?.focus();
      // }

    } catch (error) {
      console.log(error, "error");

      inputEmailRef?.current?.focus();
      const _error = error as ApiError;
      const { errorMessage } = handleErrorResponse(_error);
      openToastNotification(
        errorMessage,
        "notifications toast-notification-error"
      );
    } finally {
      hideLoader()
    }
  };

  const getOtpError = (errorInfo: ValidateErrorEntity) => {
    for (const error of errorInfo.errorFields) {
      openToastNotification(
        error.errors[0],
        "notifications toast-notification-error"
      );
      inputEmailRef?.current?.focus();
    }
  };

  const handleValuesChange = (changedValues: string) => {
    const name = Object.keys(changedValues)?.[0];
    const errors = form.getFieldError(name);
    if (errors.length < 1) return;
    form.setFields([{ name, errors: [] }]);
  };

  const handleFinish = async (values: SubmitOtpProps) => {
    navigate("/");
    return
    // const { otp } = values;
    // if (!otp || otp === undefined || otp.includes("")) {
    //   openToastNotification(
    //     ERRORS.OTP_BLANK_ERROR,
    //     "notifications toast-notification-error"
    //   );
    //   return form.setFields([
    //     {
    //       name: "otp",
    //       errors: [ERRORS.OTP_WRONG_TYPE],
    //     },
    //   ]);
    // }

    // showLoader()

    // const request: VerifyRequest = {
    //   session: response?.session || "",
    //   code: otp && otp.toString().replaceAll(",", ""),
    //   user_id: response?.user_id || "",
    // };
    // try {
    //   const response = await verifyCode(request);
    //   if (response.AccessToken && response.RefreshToken) {
    //     Storage.setAccessAndRefreshTokens(
    //       response.AccessToken,
    //       response.RefreshToken
    //     );
    //     const result = await fetchCurrentUser();
    //     if (result) {
    //       setToken(true);
    //       const obj = {
    //         name: result.name,
    //         email: result.email,
    //         image: result.imageRef,
    //       };
    //       setUserDetails(obj);
    //       setSuccess(SUCCESS.LOGIN_SUCCESS);
    //       navigate("/");
    //     }
    //   }
    // } catch (error) {
    //   const _error = error as ApiError;
    //   openToastNotification(
    //     JSON.parse(_error.message)?.msg,
    //     "notifications toast-notification-error"
    //   );
    //   setResponse((prev: any) => ({
    //     ...prev,
    //     session: JSON.parse(_error.message)?.session,
    //   }));
    // } finally {
    //   showLoader()
    // }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Layout
        style={{
          minHeight: "100vh",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Row justify={"center"}>
          <Col
            xs={{ span: 24, offset: 1 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 14, offset: 0 }}
            lg={{ span: 12 }}
            xl={{ span: 9 }}
            xxl={{ span: 7 }}
          >
            <Title level={3} className='text-center'>
              {LABELS.WELCOME}
            </Title>
          </Col>
        </Row>
        <div className='mb-2' />
        <Row justify={"center"}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 14, offset: 0 }}
            md={{ span: 13, offset: 0 }}
            lg={{ span: 12 }}
            xl={{ span: 9 }}
            xxl={{ span: 6 }}
          >
            <Form
              requiredMark={false}
              name='basic'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className='login-form'
              style={{ display: !flag ? "block" : "none" }}
              onFinish={getOtp}
              onFinishFailed={getOtpError}
              autoComplete='off'
              onValuesChange={handleOnChange}
              form={form}
            >
              <Form.Item
                validateTrigger={"getOtp"}
                messageVariables={{ label: LABELS.EMAIL }}
                rules={[{ type: 'email', message:  t("ERRORS.VALID_INPUT", {type:"email"}) }, { required: true, message: ERRORS.EMAIL }]}
                label={
                  <label className='label text-capitalize'>
                    {LABELS.EMAIL}
                  </label>
                }
                name='email'
              >
                <Input
                  className='w-100'
                  type="text"
                  placeholder={PLACEHOLDERS.EMAIL}
                  disabled={isLoading}
                  ref={inputEmailRef as any}
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 24 },
                  md: { span: 24 },
                  lg: { span: 24 },
                }}
                className='w-100'
              >
                <Button type='primary' htmlType='submit' block>
                  {BUTTONS.SEND}
                </Button>
              </Form.Item>
            </Form>

            <Form
              onFinish={handleFinish}
              name='basic'
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className='login-form'
              style={{ display: flag ? "block" : "none" }}
              onValuesChange={handleValuesChange}

            >
              <Row justify={"center"}>
                <Col>
                  <Text strong={true} className='text-heading-fontsize'>
                    {LABELS.VERIFY_EMAIL}
                  </Text>
                </Col>
              </Row>
              <Row justify={"center"}>
                <Col>
                  <Text>{LABELS.FOUR_DIGIT_CODE}</Text>
                </Col>
              </Row>
              <Row justify={"center"}>
                <Col>
                  <Text>{response?.email}</Text>
                </Col>
              </Row>
              <div className='mb-2' />
              <Form.Item name='otp'>
                <InputOTP
                  inputType='numeric'
                  length={4}
                  disabled={isLoading}
                  autoFocus
                />
              </Form.Item>
              <Form.Item>
                <Row>
                  <Col
                    xs={{ span: 24, order: 1 }}
                    sm={{ span: 24, order: 1 }}
                    md={{ span: 10, offset: 4, order: 2 }}
                    lg={{ span: 8, offset: 8, order: 2 }}
                    xl={{
                      span: 6,
                      offset: !canRequestNewCode ? 6 : 10,
                      order: 2,
                    }}
                  >
                    <Button type='primary' htmlType='submit' block>
                      {BUTTONS.SUBMIT}
                    </Button>
                  </Col>
                  <div className='mb-5' />
                  {!canRequestNewCode ? (
                    <Col
                      xs={{ span: 24, order: 2 }}
                      sm={{ span: 24, order: 2 }}
                      md={{ span: 10, offset: 0, order: 1 }}
                      lg={{ span: 8, offset: 0, order: 1 }}
                      xl={{ span: 12, offset: 0, order: 1 }}
                    >
                      <label className='label'>
                        {LABELS.OTP_RESEND_COUNTER.replace(
                          "{counter}",
                          String(delayCounter)
                        )}
                      </label>
                    </Col>
                  ) : (
                    <Col
                      xs={{ span: 24, order: 2 }}
                      sm={{ span: 24, order: 2 }}
                      md={{ span: 10, offset: 0, order: 1 }}
                      lg={{ span: 7, offset: 0, order: 1 }}
                      xl={{ span: 8, offset: 0, order: 1 }}
                    >
                      <Button onClick={resendCode} block>
                        {BUTTONS.RESEND_CODE}
                      </Button>
                    </Col>
                  )}
                </Row>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default Login;