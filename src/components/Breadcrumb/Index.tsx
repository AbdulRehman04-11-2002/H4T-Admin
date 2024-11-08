import React, { useContext } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';
interface BreadcrumbItem {
    title: string;
    path?: string;
}

const DynamicBreadcrumb: React.FC = () => {
    const location = useLocation();
    const pathSnippets = location?.pathname?.split('/').filter((i) => i);
    const capitaize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const { t } = useTranslation();
    const MENULABEL: any = t("MENULABEL", { returnObjects: true });
    const { showLoader } = useContext(LoaderContext) as LoaderContextValue;

    const getBreadcrumbItems = (): BreadcrumbItem[] => {
        const breadcrumbItems: BreadcrumbItem[] = [];
        const manageAccountIndex = pathSnippets?.indexOf("manageAccount");

        if (manageAccountIndex !== -1) {
            const path = `/${pathSnippets.slice(0, manageAccountIndex + 1).join('/')}`;
            breadcrumbItems.push({
                title: `${MENULABEL.PARTNER} - ${capitaize(pathSnippets[manageAccountIndex])}`,
                path,
            });
        } else if (!pathSnippets?.includes('partner')) {
            breadcrumbItems.push({ title: MENULABEL.PARTNER, path: '/' });
        }

        pathSnippets?.forEach((snippet: string, index: number) => {
            if (!isNaN(Number(snippet)) || (index <= manageAccountIndex)) return;

            const path = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            const title = capitaize(snippet);

            breadcrumbItems.push({ title, path });
        });

        return breadcrumbItems;
    };

    const breadcrumbItems = getBreadcrumbItems();

    return (
        <Breadcrumb 
            style={{ backgroundColor: "#fafafa", padding: "10px 20px", margin: 0 }}
            items={breadcrumbItems.map((item, index) => ({
                key: index,
                title: breadcrumbItems.length > 1 && index === breadcrumbItems.length - 1 ? (
                    <span style={{ color: "#00000073" }}>{item.title}</span>
                ) : (
                    index < 2 ? (
                        breadcrumbItems.length > 1 && item.title === MENULABEL.PARTNER_MANAGE_ACCOUNT ? (
                            <Link onClick={showLoader} to={"/" || ''} style={{ color: "#183A59" }}>{item.title}</Link>
                        ) : (
                            breadcrumbItems.length > 1 ? (
                                <Link onClick={showLoader} to={item.path || ''} style={{ color: "#183A59" }}>{item.title}</Link>
                            ) : (
                                <span style={{ color: "#183A59" }}>{item.title}</span>
                            )
                        )
                    ) : (
                        <span style={{ color: "#00000073" }}>{item.title}</span>
                    )
                )
            }))}
        />
    );
};

export default DynamicBreadcrumb;