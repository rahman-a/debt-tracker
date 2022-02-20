function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return "since a few seconds";
    else if (minutes < 60) return "since " + Math.round(minutes) + " minutes";
    else if (hours < 24) return "since " + Math.round(hours) + " hours";
    else {
        if(Math.round(days) === 1) {
            return "since " + Math.round(days) + " day"
        }else  {
            return "since " + Math.round(days) + " days"
        }
    }
}

export default msToTime