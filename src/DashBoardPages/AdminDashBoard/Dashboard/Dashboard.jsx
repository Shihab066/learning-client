import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GraphIncrease from "../../../components/Icons/GraphIncrease";


const Dashboard = () => {
    const data = [
        {
            name: "1",
            uv: 100,
            pv: 1200,
            amt: 2400,
        },
        {
            name: "2",
            uv: 300,
            pv: 1400,
            amt: 2210,
        },
        {
            name: "3",
            uv: 800,
            pv: 1600,
            amt: 2290,
        },
        {
            name: "4",
            uv: 1000,
            pv: 1800,
            amt: 2000,
        },
        {
            name: "5",
            uv: 1400,
            pv: 2000,
            amt: 2181,
        },
        {
            name: "6",
            uv: 1600,
            pv: 2200,
            amt: 2500,
        },
        {
            name: "7",
            uv: 2200,
            pv: 2400,
            amt: 2100,
        },
        {
            name: "8",
            uv: 2600,
            pv: 2600,
            amt: 2100,
        },
        {
            name: "9",
            uv: 3000,
            pv: 2800,
            amt: 2100,
        },
        {
            name: "10",
            uv: 2400,
            pv: 3000,
            amt: 2100,
        },
        {
            name: "11",
            uv: 3000,
            pv: 3200,
            amt: 2100,
        },
        {
            name: "12",
            uv: 3000,
            pv: 3400,
            amt: 2100,
        },
    ];
    return (
        <div>
            <h2 className="text-lg font-bold border-b pb-2">Dashboard</h2>
            <div className="flex items-start gap-x-6 mt-10 h-full">
                {/* card */}
                <div className="flex flex-col gap-y-5 min-w-fit">
                    {/* life time course sale amount */}
                    <div className="w-fit flex items-center gap-x-6 py-8 px-10 border border-[#E2E8F0] rounded-lg shadow">
                        <div className="text-green-600">
                            <GraphIncrease width={10} />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl">$1K</h3>
                            <p className="text-gray-500">Life time course commision</p>
                        </div>
                    </div>

                    {/* this year course sale amount */}
                    <div className="w-fit flex items-center gap-x-6 py-8 px-10 border border-[#E2E8F0] rounded-lg shadow">
                        <div className="text-green-600">
                            <GraphIncrease width={10} />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl">$800.0</h3>
                            <p className="text-gray-500">Life time course commision</p>
                        </div>
                    </div>

                    {/* this month course sale amount */}
                    <div className="w-fit flex items-center gap-x-6 py-8 px-10 border border-[#E2E8F0] rounded-lg shadow">
                        <div className="text-green-600">
                            <GraphIncrease width={10} />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl">$200.0</h3>
                            <p className="text-gray-500">Life time course commision</p>
                        </div>
                    </div>
                </div>

                {/* chart */}
                <div className="grow h-[406px] border border-[#E2E8F0] rounded-lg p-4 shadow-md">
                    <h3 className="font-medium text-xl mb-4">Life Time Sales</h3>
                    <div className="h-[calc(100%-44px)]">
                        <ResponsiveContainer width="100%">
                            <AreaChart
                                // width={500}
                                // height={400}
                                data={data}
                            // syncId="anyId"
                            // margin={{
                            //     top: 10,
                            //     right: 30,
                            //     left: 0,
                            //     bottom: 0,
                            // }}                                
                            >
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#F2C94C" stopOpacity={0} />
                                        <stop offset="100%" stopColor="#F2C94C" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#27AE60" stopOpacity={0} />
                                        <stop offset="100%" stopColor="#27AE60" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <defs>
                                    <linearGradient id="colorAmt" x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#165DFF" stopOpacity={0} />
                                        <stop offset="100%" stopColor="#165DFF" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                {/* <CartesianGrid strokeDasharray="0 1" /> */}
                                <XAxis dataKey="name" axisLine={{ stroke: '#E2E8F0', strokeWidth: 1 }} tickLine={false} padding={{ left: 20 }} />
                                <YAxis axisLine={false} tickLine={false} tickCount={6} width={50} />
                                <Tooltip />
                                <Area
                                    type="linear"
                                    dataKey="uv"
                                    strokeWidth="2"
                                    stroke="#F2C94C"
                                    fill="url(#colorPv)"
                                    stackId="1"
                                />
                                <Area
                                    type="linear"
                                    dataKey="uv"
                                    stroke="#27AE60"
                                    fill="url(#colorUv)"
                                    strokeWidth="2"
                                    stackId="1"
                                />
                                <Area
                                    type="linear"
                                    dataKey="uv"
                                    stroke="#165DFF"
                                    fill="url(#colorAmt)"
                                    strokeWidth="2"
                                    stackId="1"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;