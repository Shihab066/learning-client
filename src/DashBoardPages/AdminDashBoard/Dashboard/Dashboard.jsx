import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphIncrease from "../../../components/Icons/GraphIncrease";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import formatNumber from "../../../utils/FormateNumber";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [axiosSecure] = useAxiosSecure();
    const { data: totalSalesData = {}, isLoading } = useQuery({
        queryKey: ['total_sales_data'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/admin/getTotalSalesData');
            return res.data;
        }
    });

    const [salesData, setSalesData] = useState(totalSalesData);

    const { totalSales = {}, totalSalesCount, totalSalesChartData, totalSalesAmountChartData } = salesData;

    const { totalSalesAmount, thisYearSalesAmount, thisMonthSalesAmount } = totalSales;

    useEffect(() => {
        setSalesData(totalSalesData);
    }, [totalSalesData])  

    // state to manage sales chart
    const [showYearlySalesStats, setShowYearlySalesStats] = useState(false);
    const [salesChartData, setSalesChartData] = useState([]);
    const totalSalesYears = totalSalesChartData?.map(data => data.year).reverse();
    const [currentSalesYear, setCurrentSalesYear] = useState('default');

    // state to manage sales amount chart
    const [showYearlySalesAmountStats, setShowYearlySalesAmountStats] = useState(true);
    const [salesAmountChartData, setSalesAmountChartData] = useState([]);
    const totalSalesAmountYears = totalSalesAmountChartData?.map(data => data.year).reverse();
    const [currentSalesAmountYear, setCurrentSalesAmountYear] = useState('default');

    // chart color
    const color = ['#F2C94C', '#27AE60', '#165DFF', '#10b981', '#8b5cf6', '#fda4af'];
    const [randomColor, setRandomColor] = useState(color[0]);
    const [randomColor2, setRandomColor2] = useState(color[0]);

    // effect for sales chart data
    useEffect(() => {
        if (showYearlySalesStats) {
            const chartData = totalSalesChartData?.map(data => ({
                name: data.year,
                unit: data.yearlySales
            }));

            setSalesChartData(chartData);
            setRandomColor(color[Math.floor(Math.random() * color.length)]);
        }
        else {
            const monthlyChart = [];

            for (let i = 0; i < 12; i++) {
                const currentMonthData = {
                    name: `${i + 1}`
                }
                totalSalesChartData?.forEach(({ year, monthlySales }) => currentMonthData[year] = formatNumber({ num: monthlySales[i], showFraction: false }));
                monthlyChart.push(currentMonthData);
            }
            setSalesChartData(monthlyChart);
        }

    }, [totalSalesChartData, showYearlySalesStats]);

    // effect for sales amount chart data
    useEffect(() => {
        if (showYearlySalesAmountStats) {
            const chartData = totalSalesAmountChartData?.map(data => ({
                name: data.year,
                $: data.yearlySalesAmount
            }));

            setSalesAmountChartData(chartData);
            setRandomColor2(color[Math.floor(Math.random() * color.length)]);
        }
        else {
            const monthlyChart = [];

            for (let i = 0; i < 12; i++) {
                const currentMonthData = {
                    name: `${i + 1}`
                }
                totalSalesAmountChartData?.forEach(({ year, monthlySalesAmount }) => currentMonthData[`${year + '$'}`] = formatNumber({ num: monthlySalesAmount[i], showFraction: true }));
                monthlyChart.push(currentMonthData);
            }
            setSalesAmountChartData(monthlyChart);
        }

    }, [totalSalesAmountChartData, showYearlySalesAmountStats]);

    // format card number with specifc suffix
    const lifeTimeSalesAmount = formatNumber({ num: totalSalesAmount });
    const currentYearsSalesAmount = formatNumber({ num: thisYearSalesAmount });
    const currentMonthSalesAmount = formatNumber({ num: thisMonthSalesAmount });

    return (
        <div className="mt-6 xl:mt-0 select-none">
            <h2 className="text-lg font-bold border-b pb-2">Dashboard</h2>
            <div className="flex flex-col lg:flex-row items-start gap-6 mt-10 h-full">
                {/* card */}
                <div className="flex flex-row lg:flex-col gap-y-5 min-w-fit">
                    {/* life time course sale amount */}
                    <div className="w-full flex items-center gap-x-6 py-8 px-10 border border-[#E2E8F0] rounded-lg shadow">
                        <div className="text-green-600">
                            <GraphIncrease width={10} />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl uppercase">${lifeTimeSalesAmount}</h3>
                            <p className="text-gray-500">Life time course commision</p>
                        </div>
                    </div>

                    {/* this year course sale amount */}
                    <div className="w-full flex items-center gap-x-6 py-8 px-10 border border-[#E2E8F0] rounded-lg shadow">
                        <div className="text-green-600">
                            <GraphIncrease width={10} />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl uppercase">${currentYearsSalesAmount}</h3>
                            <p className="text-gray-500">This year course commision</p>
                        </div>
                    </div>

                    {/* this month course sale amount */}
                    <div className="w-full flex items-center gap-x-6 py-8 px-10 border border-[#E2E8F0] rounded-lg shadow">
                        <div className="text-green-600">
                            <GraphIncrease width={10} />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl uppercase">${currentMonthSalesAmount}</h3>
                            <p className="text-gray-500">Monthly Sales</p>
                        </div>
                    </div>
                </div>

                {/* total sales count chart */}
                <div className="grow w-full h-[406px] border border-[#E2E8F0] rounded-lg p-4 shadow bg-ro">
                    <div className="mb-4 flex justify-between items-center">
                        <h3 className="font-medium text-xl">Life Time Sales: <span className="text-violet-400">{totalSalesCount}</span></h3>

                        <div className="flex items-center gap-x-6">
                            <div onClick={() => setShowYearlySalesStats(true)} className={`flex items-center gap-x-2 cursor-pointer ${showYearlySalesStats ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}>
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="text-sm">
                                    Yearly
                                </div>
                            </div>

                            <div onClick={() => setShowYearlySalesStats(false)} className={`flex items-center gap-x-2 cursor-pointer ${showYearlySalesStats ? 'opacity-60 hover:opacity-90' : 'opacity-100'}`}>
                                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                                <div className="text-sm">
                                    Monthly
                                </div>
                                {
                                    !showYearlySalesStats &&
                                    <select onChange={(e) => setCurrentSalesYear(e.target.value)} value={currentSalesYear} className={`select select-bordered select-xs rounded-sm w-16 ml-1 pr-[20px!important] focus:outline-none bg-[calc(100%-10px)calc(1px+50%),calc(100%-6px)calc(1px+50%)]`}>
                                        <option value='default'>All</option>
                                        {
                                            totalSalesYears?.map((year, index) =>
                                                <option key={index} value={year}>{year}</option>
                                            )
                                        }
                                    </select>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="h-[calc(100%-44px)]">
                        <ResponsiveContainer width="100%">
                            <AreaChart
                                key={currentSalesYear + 'sales'}
                                data={salesChartData}
                            >
                                {/* <CartesianGrid strokeDasharray="0 1" /> */}
                                <XAxis dataKey="name" axisLine={{ stroke: '#E2E8F0', strokeWidth: 1 }} tickLine={false} padding={{ left: 20 }} />
                                <YAxis axisLine={false} tickLine={false} tickCount={6} width={50} />
                                <Tooltip />
                                {
                                    !showYearlySalesStats
                                        ?
                                        currentSalesYear === 'default'
                                            ?
                                            <>
                                                {
                                                    totalSalesChartData?.map((data, index) => {
                                                        if (index !== totalSalesChartData.length) {
                                                            return (
                                                                <React.Fragment key={index}>
                                                                    <Area
                                                                        type="linear"
                                                                        dataKey={data.year}
                                                                        stroke={color[index]}
                                                                        fill={`url(#monthlyColor${index})`}
                                                                        strokeWidth="2"
                                                                        stackId="1"
                                                                        className="hover:cursor-pointer"
                                                                        onClick={() => setCurrentSalesYear(data.year)}
                                                                    />
                                                                    <defs>
                                                                        <linearGradient id={`monthlyColor${index}`} x1="0" y1="1" x2="0" y2="0">
                                                                            <stop offset="0%" stopColor={color[index]} stopOpacity={0} />
                                                                            <stop offset="100%" stopColor={color[index]} stopOpacity={1} />
                                                                        </linearGradient>
                                                                    </defs>
                                                                </React.Fragment>
                                                            )
                                                        }
                                                    })
                                                }
                                            </>
                                            :
                                            <>
                                                <Area
                                                    type="linear"
                                                    dataKey={currentSalesYear}
                                                    stroke={color[totalSalesChartData.findIndex(obj => obj.year === currentSalesYear)]}
                                                    fill={`url(#monthlyColor)`}
                                                    strokeWidth="2"
                                                    stackId="1"
                                                    className="hover:cursor-pointer"
                                                />
                                                <defs>
                                                    <linearGradient id={`monthlyColor`} x1="0" y1="1" x2="0" y2="0">
                                                        <stop offset="0%" stopColor={color[totalSalesChartData.findIndex(obj => obj.year === currentSalesYear)]} stopOpacity={0} />
                                                        <stop offset="100%" stopColor={color[totalSalesChartData.findIndex(obj => obj.year === currentSalesYear)]} stopOpacity={1} />
                                                    </linearGradient>
                                                </defs>
                                            </>
                                        :
                                        <>
                                            <Area
                                                type="linear"
                                                dataKey="unit"
                                                stroke={randomColor}
                                                fill={`url(#monthlyColor)`}
                                                strokeWidth="2"
                                                stackId="1"
                                                className="hover:cursor-pointer"
                                            />
                                            <defs>
                                                <linearGradient id={`monthlyColor`} x1="0" y1="1" x2="0" y2="0">
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
            </div>

            {/* total sales amount chart*/}
            <div className="w-full h-[406px] border border-[#E2E8F0] rounded-lg p-4 mt-10">
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-medium text-xl">Life Time Sales Amount $: <span className="text-yellow-500 uppercase">{lifeTimeSalesAmount}</span></h3>

                    <div className="flex items-center gap-x-6">
                        <div onClick={() => setShowYearlySalesAmountStats(true)} className={`flex items-center gap-x-2 cursor-pointer ${showYearlySalesAmountStats ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="text-sm">
                                Yearly
                            </div>
                        </div>

                        <div onClick={() => setShowYearlySalesAmountStats(false)} className={`flex items-center gap-x-2 cursor-pointer ${showYearlySalesAmountStats ? 'opacity-60 hover:opacity-90' : 'opacity-100'}`}>
                            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                            <div className="text-sm">
                                Monthly
                            </div>
                            {
                                !showYearlySalesAmountStats &&
                                <select onChange={(e) => setCurrentSalesAmountYear(e.target.value)} value={currentSalesAmountYear} className={`select select-bordered select-xs rounded-sm w-16 ml-1 pr-[20px!important] focus:outline-none bg-[calc(100%-10px)calc(1px+50%),calc(100%-6px)calc(1px+50%)]`}>
                                    <option value='default'>All</option>
                                    {
                                        totalSalesAmountYears?.map((year, index) =>
                                            <option key={index} value={year}>{year}</option>
                                        )
                                    }
                                </select>
                            }
                        </div>
                    </div>
                </div>
                <div className="h-[calc(100%-44px)]">
                    <ResponsiveContainer width="100%">
                        <AreaChart
                            key={currentSalesAmountYear + 'amount'}
                            data={salesAmountChartData}
                        >
                            {/* <CartesianGrid strokeDasharray="0 1" /> */}
                            <XAxis dataKey="name" axisLine={{ stroke: '#E2E8F0', strokeWidth: 1 }} tickLine={false} padding={{ left: 20 }} />
                            <YAxis axisLine={false} tickLine={false} tickCount={6} width={50} />
                            <Tooltip />
                            {
                                !showYearlySalesAmountStats
                                    ?
                                    currentSalesAmountYear === 'default'
                                        ?
                                        <>
                                            {
                                                totalSalesAmountChartData?.map((data, index) => {
                                                    if (index !== totalSalesAmountChartData.length) {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <Area
                                                                    type="linear"
                                                                    dataKey={data.year + '$'}
                                                                    stroke={color[index]}
                                                                    fill={`url(#YearlyColor${index})`}
                                                                    strokeWidth="2"
                                                                    stackId="1"
                                                                    className="hover:cursor-pointer"
                                                                    onClick={() => setCurrentSalesAmountYear(data.year)}
                                                                />
                                                                <defs>
                                                                    <linearGradient id={`YearlyColor${index}`} x1="0" y1="1" x2="0" y2="0">
                                                                        <stop offset="0%" stopColor={color[index]} stopOpacity={0} />
                                                                        <stop offset="100%" stopColor={color[index]} stopOpacity={1} />
                                                                    </linearGradient>
                                                                </defs>
                                                            </React.Fragment>
                                                        )
                                                    }
                                                })
                                            }
                                        </>
                                        :
                                        <>
                                            <Area
                                                type="linear"
                                                dataKey={currentSalesAmountYear + '$'}
                                                stroke={color[totalSalesChartData.findIndex(obj => obj.year === currentSalesAmountYear)]}
                                                fill={`url(#yearlyColor)`}
                                                strokeWidth="2"
                                                stackId="1"
                                                className="hover:cursor-pointer"
                                            />
                                            <defs>
                                                <linearGradient id={`yearlyColor`} x1="0" y1="1" x2="0" y2="0">
                                                    <stop offset="0%" stopColor={color[totalSalesChartData.findIndex(obj => obj.year === currentSalesAmountYear)]} stopOpacity={0} />
                                                    <stop offset="100%" stopColor={color[totalSalesChartData.findIndex(obj => obj.year === currentSalesAmountYear)]} stopOpacity={1} />
                                                </linearGradient>
                                            </defs>
                                        </>
                                    :
                                    <>
                                        <Area
                                            type="linear"
                                            dataKey="$"
                                            stroke={randomColor2}
                                            fill={`url(#yearlyColor)`}
                                            strokeWidth="2"
                                            stackId="1"
                                            className="hover:cursor-pointer"
                                        />
                                        <defs>
                                            <linearGradient id={`yearlyColor`} x1="0" y1="1" x2="0" y2="0">
                                                <stop offset="0%" stopColor={randomColor2} stopOpacity={0} />
                                                <stop offset="100%" stopColor={randomColor2} stopOpacity={1} />
                                            </linearGradient>
                                        </defs>
                                    </>
                            }

                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;