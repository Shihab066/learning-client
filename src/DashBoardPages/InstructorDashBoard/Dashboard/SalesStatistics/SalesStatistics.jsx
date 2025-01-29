import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphIncrease from "../../../../components/Icons/GraphIncrease";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import formatNumber from "../../../../utils/formateNumber";
import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import SalesStatisticsSkeleton from "./SalesStatisticsSkeleton";

const SalesStatistics = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { data: totalSalesData = {}, isLoading } = useQuery({
        queryKey: ['instructor_total_sales_data'],
        enabled: !!user,
        queryFn: async () => {
            const response = await axiosSecure.get(`/dashboard/instructor/getTotalSalesData/${user.uid}`);
            return response.data;
        }
    });

    const [salesData, setSalesData] = useState({});

    const { totalSales = {}, totalSalesCount, totalSalesChartData, totalSalesAmountChartData } = salesData;
    const { totalSalesAmount, thisYearSalesAmount, thisMonthSalesAmount } = totalSales;

    useEffect(() => {
        setSalesData(totalSalesData);
    }, [isLoading]);

    // States to manage the display of different chart types
    const [showYearlySalesStats, setShowYearlySalesStats] = useState(false);
    const [showYearlySalesAmountStats, setShowYearlySalesAmountStats] = useState(true);

    // State to hold sales data for the charts
    const [salesChartData, setSalesChartData] = useState([]);
    const [salesAmountChartData, setSalesAmountChartData] = useState([]);

    // State to manage the current selected year
    const [currentSalesYear, setCurrentSalesYear] = useState('default');
    const [currentSalesAmountYear, setCurrentSalesAmountYear] = useState('default');

    // Prepare yearly data for charts
    const totalSalesYears = totalSalesChartData?.map((data) => data.year).reverse();
    const totalSalesAmountYears = totalSalesAmountChartData?.map((data) => data.year).reverse();

    // Chart color palette
    const colorPalette = ['#F2C94C', '#27AE60', '#165DFF', '#10b981', '#8b5cf6', '#fda4af'];
    const [salesChartColor, setSalesChartColor] = useState(colorPalette[0]);
    const [salesAmountChartColor, setSalesAmountChartColor] = useState(colorPalette[0]);

    // Process data for sales chart
    useEffect(() => {
        if (showYearlySalesStats) {
            const chartData = totalSalesChartData?.map((data) => ({
                name: data.year,
                unit: data.yearlySales,
            }));
            setSalesChartData(chartData);
            setSalesChartColor(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
        } else {
            const monthlyChartData = totalSalesChartData?.reduce((acc, { year, monthlySales }) => {
                monthlySales.forEach((sales, index) => {
                    const month = `${index + 1}`;
                    acc[month] = acc[month] || { name: month };
                    acc[month][year] = formatNumber({ num: sales, showFraction: false });
                });
                return acc;
            }, []);

            if (!monthlyChartData) return;
            setSalesChartData(Object.values(monthlyChartData));
        }
    }, [totalSalesChartData, showYearlySalesStats]);

    // Process data for sales amount chart
    useEffect(() => {
        if (showYearlySalesAmountStats) {
            const chartData = totalSalesAmountChartData?.map((data) => ({
                name: data.year,
                $: data.yearlySalesAmount,
            }));
            setSalesAmountChartData(chartData);
            setSalesAmountChartColor(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
        } else {
            const monthlyChartData = totalSalesAmountChartData?.reduce((acc, { year, monthlySalesAmount }) => {
                monthlySalesAmount.forEach((amount, index) => {
                    const month = `${index + 1}`;
                    acc[month] = acc[month] || { name: month };
                    acc[month][`${year}$`] = formatNumber({ num: amount, showFraction: true });
                });
                return acc;
            }, []);

            if (!monthlyChartData) return;
            setSalesAmountChartData(Object.values(monthlyChartData));
        }
    }, [totalSalesAmountChartData, showYearlySalesAmountStats]);

    // Format numbers for display
    const formattedLifeTimeSalesAmount = formatNumber({ num: totalSalesAmount });
    const formattedCurrentYearSalesAmount = formatNumber({ num: thisYearSalesAmount });
    const formattedCurrentMonthSalesAmount = formatNumber({ num: thisMonthSalesAmount });
    const formattedLifeTimeSalesCount = formatNumber({ num: totalSalesCount, showFraction: false });

    if (isLoading) {
        return (
            <SalesStatisticsSkeleton />
        )
    } else {
        return (
            <>
                <div className="mt-6 xl:mt-0 select-none">
                    <h2 className="text-lg font-bold border-b pb-2">Dashboard</h2>
                    <div className="flex flex-col lg:flex-row items-start gap-6 mt-6 md:mt-8 h-full">
                        {/* Card Section */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col gap-x-4 gap-y-5 w-full lg:w-fit lg:min-w-[330px]">
                            {/* Life Time Sales Amount */}
                            <SalesCard
                                title="Life Time Sales"
                                amount={formattedLifeTimeSalesAmount}
                                iconColor="text-green-600"
                                graphComponent={<GraphIncrease width={10} />}
                            />
                            {/* This Year Sales Amount */}
                            <SalesCard
                                title="This Year Sales"
                                amount={formattedCurrentYearSalesAmount}
                                iconColor="text-green-600"
                                graphComponent={<GraphIncrease width={10} />}
                            />
                            {/* This Month Sales Amount */}
                            <SalesCard
                                title="Monthly Sales"
                                amount={formattedCurrentMonthSalesAmount}
                                iconColor="text-green-600"
                                graphComponent={<GraphIncrease width={10} />}
                                customClass="sm:col-span-2 md:col-span-1"
                            />
                        </div>

                        {/* Total Sales Count Chart */}
                        <SalesChart
                            title="Life Time Sales"
                            salesCount={formattedLifeTimeSalesCount}
                            salesCountColor='text-violet-400'
                            totalChartData={totalSalesChartData}
                            chartData={salesChartData}
                            currentYear={currentSalesYear}
                            setCurrentYear={setCurrentSalesYear}
                            showStats={showYearlySalesStats}
                            setShowStats={setShowYearlySalesStats}
                            totalYears={totalSalesYears}
                            chartKey="sales"
                            colorPalette={colorPalette}
                            randomColor={salesChartColor}
                            yearlyDataKey="unit"
                            monthlyDataKey=""
                            YAxisWidth={totalSalesCount?.split('.')[0].length}
                        />
                    </div>

                    {/* Total Sales Amount Chart */}
                    <div className="mt-10">
                        <SalesChart
                            title="Total Sales Amount $"
                            salesCount={formattedLifeTimeSalesAmount}
                            salesCountColor='text-yellow-500'
                            totalChartData={totalSalesAmountChartData}
                            chartData={salesAmountChartData}
                            currentYear={currentSalesAmountYear}
                            setCurrentYear={setCurrentSalesAmountYear}
                            showStats={showYearlySalesAmountStats}
                            setShowStats={setShowYearlySalesAmountStats}
                            totalYears={totalSalesAmountYears}
                            chartKey="amount"
                            colorPalette={colorPalette}
                            randomColor={salesAmountChartColor}
                            yearlyDataKey="$"
                            monthlyDataKey="$"
                            YAxisWidth={totalSalesAmount?.split('.')[0].length}
                        />
                    </div>
                </div>
            </>
        )
    }

};

const SalesCard = ({ title, amount, iconColor, graphComponent, customClass = "" }) => (
    <div className={`w-full flex items-center gap-x-6 py-6 lg:py-8 px-6 lg:px-10 border border-[#E2E8F0] rounded-lg shadow ${customClass}`}>
        <div className={iconColor}>
            {graphComponent}
        </div>
        <div>
            <h3 className="font-bold text-2xl uppercase">${amount}</h3>
            <p className="text-gray-500">{title}</p>
        </div>
    </div>
);

const SalesChart = ({
    title,
    salesCount,
    salesCountColor,
    totalChartData,
    chartData,
    currentYear,
    setCurrentYear,
    showStats,
    setShowStats,
    totalYears,
    chartKey,
    colorPalette,
    randomColor,
    yearlyDataKey,
    monthlyDataKey,
    YAxisWidth
}) => (
    <div className="grow w-full h-[406px] border border-[#E2E8F0] rounded-lg p-4 shadow bg-ro">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-2">
            <h3 className="font-medium text-xl">{title}: <span className={`${salesCountColor}`}>{salesCount}</span></h3>
            <div className="flex items-center gap-x-6">
                <div onClick={() => setShowStats(true)} className={`flex items-center gap-x-2 cursor-pointer ${showStats ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">Yearly</div>
                </div>
                <div onClick={() => setShowStats(false)} className={`flex items-center gap-x-2 cursor-pointer ${showStats ? 'opacity-60 hover:opacity-90' : 'opacity-100'}`}>
                    <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                    <div className="text-sm">Monthly</div>
                    {!showStats && (
                        <select
                            onChange={(e) => setCurrentYear(e.target.value)}
                            value={currentYear}
                            className="select select-bordered select-xs rounded-sm w-16 ml-1 pr-[20px!important] focus:outline-none bg-[calc(100%-10px)calc(1px+50%),calc(100%-6px)calc(1px+50%)]"
                        >
                            <option value="default">All</option>
                            {totalYears?.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
        <div className="h-[calc(100%-76px)] sm:h-[calc(100%-44px)]">
            <ResponsiveContainer width="100%">
                <AreaChart key={currentYear + chartKey} data={chartData}>
                    <XAxis dataKey="name" axisLine={{ stroke: '#E2E8F0', strokeWidth: 1 }} tickLine={false} padding={{ left: 20 }} />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} tickCount={6} width={YAxisWidth * 12} />
                    <Tooltip />
                    {!showStats
                        ? currentYear === 'default'
                            ? totalChartData?.map((data, index) => {
                                if (index !== totalChartData.length - 1) {
                                    return (
                                        <React.Fragment key={index}>
                                            <Area
                                                type="linear"
                                                dataKey={data.year + monthlyDataKey}
                                                stroke={colorPalette[index]}
                                                fill={`url(#${chartKey}chartColor${index})`}
                                                strokeWidth="2"
                                                stackId="1"
                                                className="hover:cursor-pointer"
                                                onClick={() => setCurrentYear(data.year)}
                                            />
                                            <defs>
                                                <linearGradient id={`${chartKey}chartColor${index}`} x1="0" y1="1" x2="0" y2="0">
                                                    <stop offset="0%" stopColor={colorPalette[index]} stopOpacity={0} />
                                                    <stop offset="100%" stopColor={colorPalette[index]} stopOpacity={1} />
                                                </linearGradient>
                                            </defs>
                                        </React.Fragment>
                                    )
                                }
                            })
                            : <>
                                <Area
                                    type="linear"
                                    dataKey={currentYear + monthlyDataKey}
                                    stroke={colorPalette[totalChartData.findIndex(obj => obj.year === currentYear)]}
                                    fill={`url(#${chartKey}chartColor)`}
                                    strokeWidth="2"
                                    stackId="1"
                                    className="hover:cursor-pointer"
                                />
                                <defs>
                                    <linearGradient id={`${chartKey}chartColor`} x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor={colorPalette[totalChartData.findIndex(obj => obj.year === currentYear)]} stopOpacity={0} />
                                        <stop offset="100%" stopColor={colorPalette[totalChartData.findIndex(obj => obj.year === currentYear)]} stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                            </>
                        : <>
                            <Area
                                type="linear"
                                dataKey={yearlyDataKey}
                                stroke={randomColor}
                                fill={`url(#${chartKey}chartColor)`}
                                strokeWidth="2"
                                stackId="1"
                                className="hover:cursor-pointer"
                            />
                            <defs>
                                <linearGradient id={`${chartKey}chartColor`} x1="0" y1="1" x2="0" y2="0">
                                    <stop offset="0%" stopColor={randomColor} stopOpacity={0} />
                                    <stop offset="100%" stopColor={randomColor} stopOpacity={1} />
                                </linearGradient>
                            </defs>
                        </>
                    }
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default SalesStatistics;