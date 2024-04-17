import React from 'react';
import { Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Link } = Typography;

interface PrivacyPolicyProps {
    // You can add any additional props here
}

const TermsOfUse: React.FC<PrivacyPolicyProps> = () => {
    const { t } = useTranslation();
    const privacyPolicy: any = t('privacyPolicy', { returnObjects: true });

    return (
        <div className='terms-of-use'>
            <Title level={2}>{privacyPolicy.title}</Title>
            <Paragraph>{privacyPolicy.introText}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.purpose.title}</Title>
            <Paragraph>{privacyPolicy.purpose.text}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.userConduct.title}</Title>
            <Paragraph>{privacyPolicy.userConduct.text1}</Paragraph>
            <Paragraph>{privacyPolicy.userConduct.text2}</Paragraph>
            <ul>
                {privacyPolicy.userConduct.items.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <Divider />

            <Title level={3}>{privacyPolicy.contentGuidelines.title}</Title>
            <Paragraph>{privacyPolicy.contentGuidelines.text}</Paragraph>
            <ul>
                {privacyPolicy.contentGuidelines.items.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <Divider />

            <Title level={3}>{privacyPolicy.prohibitedItems.title}</Title>
            <Paragraph>{privacyPolicy.prohibitedItems.text}</Paragraph>
            <ul>
                {privacyPolicy.prohibitedItems.items.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <Divider />

            <Title level={3}>{privacyPolicy.privacyAndData.title}</Title>
            <Paragraph>
                {privacyPolicy.privacyAndData.text}
                <Link href={privacyPolicy.privacyAndData.link} target="_blank" rel="noopener noreferrer">
                    {privacyPolicy.privacyAndData.link}
                </Link>
            </Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.intellectualProperty.title}</Title>
            <Paragraph>{privacyPolicy.intellectualProperty.text1}</Paragraph>
            <Paragraph>{privacyPolicy.intellectualProperty.text2}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.userAccounts.title}</Title>
            <Paragraph>{privacyPolicy.userAccounts.text1}</Paragraph>
            <Paragraph>{privacyPolicy.userAccounts.text2}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.terminationOfAccounts.title}</Title>
            <Paragraph>{privacyPolicy.terminationOfAccounts.text}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.disputeResolution.title}</Title>
            <Paragraph>{privacyPolicy.disputeResolution.text}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.reportingViolations.title}</Title>
            <Paragraph>{privacyPolicy.reportingViolations.text}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.liabilityDisclaimer.title}</Title>
            <Paragraph>{privacyPolicy.liabilityDisclaimer.text}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.governingLaw.title}</Title>
            <Paragraph>{privacyPolicy.governingLaw.text}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.updatesToAgreement.title}</Title>
            <Paragraph>{privacyPolicy.updatesToAgreement.text}</Paragraph>

            <Divider />

            <Title level={3}>{privacyPolicy.contactInformation.title}</Title>
            <Paragraph>
                {privacyPolicy.contactInformation.text}
                <Link href={`mailto:${privacyPolicy.contactInformation.email}`}>
                    {privacyPolicy.contactInformation.email}
                </Link>
            </Paragraph>

            <Divider />

            <Paragraph>{privacyPolicy.acceptance.text}</Paragraph>
        </div>
    );
};

export default TermsOfUse;