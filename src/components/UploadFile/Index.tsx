import React, { useMemo } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { showError, validateFileType } from "../../helpers/globalFunctions";
import { Button, Form, Upload, UploadFile as AntUploadFile } from "antd";

interface Props {
    name: string;
    label: string;
    fileType: string;
    errorMessage: string;
    fileTypeError: string;
    requiredImage: boolean;
    fileList: AntUploadFile[];
    validateTrigger: string[];
    defaultFileList?: AntUploadFile[];
    setFileList: React.Dispatch<React.SetStateAction<AntUploadFile[]>>;
}

const UploadFile: React.FC<Props> = ({
    name,
    label,
    fileType,
    fileList,
    setFileList,
    defaultFileList,
    errorMessage,
    requiredImage,
    fileTypeError,
    validateTrigger,
}) => {

    const uploadProps = useMemo(
        () => ({
            beforeUpload: (file: AntUploadFile) => {
                const isAllowedType = validateFileType(file, fileType);
                const isAllowedSize = file.size ? file.size <= 50 * 1024 * 1024 : false;

                if (!isAllowedType) {
                    showError(fileTypeError);
                    return false; // Stop the upload process if the file type is not allowed
                }

                if (!isAllowedSize && fileType.includes("video/mp4")) {
                    showError(`(${file.name}) exceeds the maximum file size of 50MB.`);
                    return false; // Stop the upload process if the file size is exceeds
                }
                setFileList([file]);
                return false;
            },
            onRemove: (file: AntUploadFile) => {
                if (fileList.some((item) => item.uid === file.uid)) {
                    setFileList((fileList) =>
                        fileList.filter((item) => item.uid !== file.uid)
                    );
                    return true;
                }
                return false;
            },
        }),
        [fileList, setFileList]
    );

    return (
        <Form.Item
            label={<label className='label'>{label}</label>}
            name={name}
            rules={[{ required: requiredImage, message: errorMessage }]}
            validateTrigger={validateTrigger}
        >
            <Upload
                accept={fileType}
                listType='picture'
                className='w-100'
                maxCount={1}
                {...uploadProps}
                fileList={fileList}
                defaultFileList={defaultFileList}
            >
                <Button icon={<UploadOutlined />} block className='image-upload'>
                    {"Upload"}
                </Button>
            </Upload>
        </Form.Item>
    );
};

export default UploadFile;
