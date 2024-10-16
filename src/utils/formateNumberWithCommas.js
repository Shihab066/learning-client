const formatNumberWithCommas = (number) => {
    if (number) {
        const numberArray = number?.toString().split('').reverse();
        const numberWithCommas = numberArray?.map((n, i) => ((i !== numberArray.length - 1) && (i + 1) % 3 === 0) ? ',' + n : n).reverse().join('');
        return numberWithCommas;
    } else {
        return 0;
    }
};

export default formatNumberWithCommas;