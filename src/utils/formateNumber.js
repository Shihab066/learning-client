const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    if (typeof num !== "bigint") num = BigInt(parseInt(num)); // Convert to BigInt if needed

    const thresholds = [
        { value: 1_000_000_000_000n, suffix: "t" },
        { value: 1_000_000_000n, suffix: "b" },
        { value: 1_000_000n, suffix: "m" },
        { value: 1_000n, suffix: "k" }
    ];

    for (const { value, suffix } of thresholds) {       
        if (num >= value) {
            const integerPart = num / value;
            const fractionalPart = num % value;

            const fractionalStr = (fractionalPart / 100n).toString().slice(0, 1);

            return `${integerPart}${fractionalStr !== "0" ? `.${fractionalStr}` : ''}${suffix}`; // Keep 1 decimal place
        }
    }

    return parseFloat(num).toFixed(1).toString(); // Return plain number if below 1k
};

export default formatNumber;

// // Example usage:
// const result = {
//     totalSalesAmount: 1234567890,
//     thisYearSalesAmount: 987654321,
//     thisMonthSalesAmount: 1099
// };

// console.log({
//     totalSalesAmount: formatNumber(result.totalSalesAmount),
//     thisYearSalesAmount: formatNumber(result.thisYearSalesAmount),
//     thisMonthSalesAmount: formatNumber(result.thisMonthSalesAmount)
// });
