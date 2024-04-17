import React, { useContext } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoaderContext, LoaderContextValue } from '../../context/LoaderContext';

const { Item } = Breadcrumb;

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

        if (!pathSnippets?.includes('partner') && !pathSnippets?.includes('Partner')) {
            breadcrumbItems.push({ title: MENULABEL.PARTNER, path: '/' });
        }

        pathSnippets?.forEach((snippet: string, index: number) => {
            if (!isNaN(Number(snippet))) return;

            const path = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            const title =
                snippet === 'transmission-managment'
                    ? 'Manage transmission'
                    : capitaize(snippet);

            breadcrumbItems.push({ title, path });
        });

        return breadcrumbItems;
    };

    const breadcrumbItems = getBreadcrumbItems();

    return (
        <Breadcrumb style={{ backgroundColor: "#fafafa", padding: "10px 20px", margin: 0 }} items={breadcrumbItems.map((item, index) => {
            return ({
                key: index,
                title: index === breadcrumbItems.length - 1 ? (
                    item.title
                ) : (
                    <Link onClick={showLoader} to={item.path || ''}>{item.title}</Link>
                )
            })
        })} />
    );
};

export default DynamicBreadcrumb;