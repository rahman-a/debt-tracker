function msToTime(ms, lang) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) {
        if(lang === 'ar') return 'منذ عدة ثوانى'
        return "since a few seconds";
    } 
    else if (minutes < 60) {
        if(lang === 'ar') return `منذ ${Math.round(minutes)} دقائق`
        return "since " + Math.round(minutes) + " minutes";
    } 
    else if (hours < 24) {
        if(lang === 'ar') return `منذ ${Math.round(hours)} ساعات`
        return "since " + Math.round(hours) + " hours";
    } 
    else  {
        if(lang === 'ar') return `منذ ${Math.round(days)} يوماً`
        return "since " + Math.round(days) + " days"
    } 
}

export default msToTime