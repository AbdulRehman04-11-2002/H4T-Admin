import { DatePicker, Col, Row } from 'antd';
import Search from 'antd/es/input/Search';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../components/Select/Index';
const { RangePicker } = DatePicker;

interface PlanningFilterProps {
    setSearch: (value: string) => void;
    setSearchValue: (value: string) => void;
    searchValue: string;
    handleDateChange?: (dates: any, dateStrings: any) => void;
    selectedDateRange?: any;
    selectedDropDownVal?: string | undefined;
    handleDropDown?: (value: string) => void;
    dropDownOptions?: any[];
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PlanningFilters: React.FC<PlanningFilterProps> = ({
    setSearch,
    setSearchValue,
    searchValue,
    selectedDateRange,
    dropDownOptions,
    handleDateChange,
    selectedDropDownVal,
    handleDropDown,
    setPage
}) => {
    const { t } = useTranslation();
    const PLACEHOLDERS: any = t("PLACEHOLDERS", { returnObjects: true });

    const onSearch = (value: string) => {
        setSearch(value);
        setSearchValue(value);
        setPage(1)
    };

    return (
        <Col span={24} style={{ display: "flex", justifyContent: "right" }}>
            <Row gutter={16} align={"stretch"}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} style={{ paddingBottom: "8px" }}>
                    <RangePicker
                        value={selectedDateRange}
                        onChange={handleDateChange}
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} style={{ paddingBottom: "8px" }}>
                    <Dropdown
                        options={dropDownOptions || []}
                        handleDropDown={handleDropDown}
                        selectedValue={selectedDropDownVal}
                        placeholder={PLACEHOLDERS.LOCATION}
                    />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} style={{ paddingBottom: "8px" }}>
                    <Search
                        placeholder={PLACEHOLDERS.SEARCH}
                        onSearch={onSearch}
                        size="middle"
                        allowClear={true}
                        data-testid='search-data'
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                </Col>
            </Row>
        </Col>
    );
};
export default PlanningFilters;