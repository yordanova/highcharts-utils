const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
const toNumber = x => parseFloat(x);

const uniqueFilter = (item, idx, self) => self.indexOf(item) === idx;
        
const fixFloat = (x) => Number.parseFloat(x.toFixed(2));

const reduceToSum = (a, b) => (a + b);

function average () {
    const sum = Array.from(arguments)
        .reduce(reduceToSum, 0);
    return (sum / arguments.length) || 0;
}

const sortByPeriod = (a, b) => {
    const parse = (s) => {
        var [month, year] = s.split(' '); 
        return { 
            month, 
            year: parseInt(year) 
        };
    }   
    var x = parse(a);
    var y = parse(b);
    if (x.year !== y.year) {
        return x.year - y.year;
    } else {
        return MONTHS.indexOf(x.month) - MONTHS.indexOf(y.month);
    };
}

const sortByParam  = (param, a, b) => a[param] > b[param] ? 1: -1;

const Utils = {
    toNumber: toNumber,
    uniqueFilter: uniqueFilter,
    fixFloat: fixFloat,
    sortByPeriod: sortByPeriod,
    average: average
}