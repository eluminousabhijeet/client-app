export default {
    formatCurrency: function(num){
        return '₹' + Number(parseFloat(num, 2)).toLocaleString();
    }
}